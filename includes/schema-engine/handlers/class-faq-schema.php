<?php

/**
 * FAQ Schema Handler - Built-in FAQ Schema Detection and Generation
 *
 * @package PDM_Accelerate
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class PDM_FAQ_Schema
{

    private $settings;

    public function __construct()
    {
        $this->settings = get_option('pdm_settings', array());
        add_action('save_post', array($this, 'generate_schema'), 10, 1);
        add_action('wp_head', array($this, 'inject_faq_schema_script'));

        // Also trigger when settings are updated
        add_action('update_option_pdm_settings', array($this, 'on_settings_update'), 10, 2);

        // Add admin notices for FAQ schema actions
        add_action('admin_notices', array($this, 'show_admin_notices'));
    }

    /**
     * Check if schema should be generated for this post
     */
    public function should_generate_for_post($post)
    {
        if (empty($this->settings['auto_faq_schema'])) {
            return false;
        }

        return in_array($post->post_type, array('post', 'page')) && $post->post_status === 'publish';
    }

    /**
     * Generate FAQ schema for a post
     */
    public function generate_schema($post_id)
    {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        $post = get_post($post_id);
        if (!$this->should_generate_for_post($post)) {
            return;
        }

        // Check if there's already a manual FAQ schema (don't overwrite manual ones)
        // First check the new approach (meta-based)
        $existing_faq_questions = get_post_meta($post_id, '_pdm_faq_questions', true);
        $existing_auto_generated = get_post_meta($post_id, '_pdm_faq_auto_generated', true);

        // Then check old RankMath schemas
        $existing_schemas = get_post_meta($post_id, 'rank_math_schema_FAQPage', true);
        if (!empty($existing_schemas)) {
            // RankMath can store multiple schemas as an array
            if (is_array($existing_schemas) && !isset($existing_schemas['@type'])) {
                // Multiple schemas - check for manual ones and clean up auto ones
                $has_manual = false;
                $has_auto = false;
                foreach ($existing_schemas as $key => $schema) {
                    $is_auto = $this->is_auto_generated_schema($schema);
                    if ($is_auto) {
                        $has_auto = true;
                    } else {
                        $has_manual = true;
                    }
                }

                if ($has_manual) {
                    // Manual schema exists - remove auto-generated ones and stop generating
                    if ($has_auto) {
                        $this->remove_auto_schemas_only($post_id);
                        error_log("DEBUG FAQ: Removed auto-generated schemas - manual schema takes precedence for post $post_id");
                    }
                    error_log("DEBUG FAQ: Manual schema detected - stopping auto-generation for post $post_id");
                    return;
                }
            } else {
                // Single schema
                $is_auto = $this->is_auto_generated_schema($existing_schemas);
                error_log("DEBUG FAQ: Post $post_id has single schema. Is auto-generated: " . ($is_auto ? 'YES' : 'NO'));
                if (!$is_auto) {
                    error_log("DEBUG FAQ: Manual schema detected - stopping auto-generation for post $post_id");
                    return;
                }
            }
        }

        // Extract FAQs from post content
        $faqs = $this->extract_faqs_from_post($post_id);

        if (empty($faqs)) {
            // Remove any existing auto-generated FAQ schema if no FAQs found
            if (!empty($existing_faq_questions) && $existing_auto_generated) {
                $this->remove_faq_schema($post_id);
            } elseif (!empty($existing_schemas) && $this->is_auto_generated_schema($existing_schemas)) {
                $this->remove_faq_schema($post_id);
            }
            return;
        }

        // Generate the schema
        $schema_data = $this->generate_faq_schema($faqs, $post_id);

        // Store in RankMath
        $this->save_to_rankmath($post_id, $schema_data);
    }

    /**
     * Extract FAQs from post content
     */
    private function extract_faqs_from_post($post_id)
    {
        $post = get_post($post_id);
        if (!$post) {
            return array();
        }

        // Set up proper WordPress context for rendering blocks
        global $post;
        $original_post = $post;
        $post = get_post($post_id);
        setup_postdata($post);

        // Get the content with blocks properly rendered
        $content = get_the_content();
        $content = apply_filters('the_content', $content);

        // Reset post data
        wp_reset_postdata();
        $post = $original_post;

        // Extract FAQ data using XPath
        $faqs = $this->extract_faq_data_from_content($content);

        return $faqs;
    }

    /**
     * Extract FAQ data from HTML content using XPath
     */
    private function extract_faq_data_from_content($content)
    {
        if (empty($content)) {
            return array();
        }

        // Load HTML into DOMDocument
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML('<?xml encoding="UTF-8">' . $content);
        libxml_clear_errors();

        // Remove the XML encoding wrapper
        foreach ($dom->childNodes as $item) {
            if ($item->nodeType == XML_PI_NODE) {
                $dom->removeChild($item);
            }
        }
        $dom->encoding = 'UTF-8';

        // Create XPath object
        $xpath = new DOMXPath($dom);

        // Look for PDM accordion blocks with the specific classes
        $question_nodes = $xpath->query("//*[@class and contains(@class, 'accord-title')]");
        $faqs = array();

        if ($question_nodes->length > 0) {
            foreach ($question_nodes as $index => $question_node) {
                $question = trim($question_node->textContent);

                if (!empty($question)) {
                    // Find corresponding answer panel - look for the next sibling with accord-panel class
                    $current_element = $question_node;
                    $answer_node = null;

                    // Traverse siblings to find the matching answer panel
                    $sibling = $current_element->nextSibling;
                    while ($sibling) {
                        if ($sibling->nodeType === XML_ELEMENT_NODE) {
                            $class_attr = $sibling->getAttribute('class');
                            if ($class_attr && strpos($class_attr, 'accord-panel') !== false) {
                                $answer_node = $sibling;
                                break;
                            }
                        }
                        $sibling = $sibling->nextSibling;
                    }

                    if ($answer_node) {
                        $answer = trim(strip_tags($answer_node->textContent));
                        if (!empty($answer)) {
                            $faqs[] = array(
                                'question' => $question,
                                'answer' => $answer
                            );
                        }
                    }
                }
            }
        }

        return $faqs;
    }

    /**
     * Generate FAQ Schema.org structured data
     * Store basic schema for RankMath interface but use filter for output
     */
    private function generate_faq_schema($faqs, $post_id)
    {
        // Convert FAQs to mainEntity format
        $main_entity = array();
        foreach ($faqs as $faq) {
            $main_entity[] = array(
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => $faq['answer']
                )
            );
        }

        // Store FAQ data for the filter to use
        update_post_meta($post_id, '_pdm_faq_questions', $main_entity);
        update_post_meta($post_id, '_pdm_faq_auto_generated', true);

        // Also create a basic FAQPage schema for RankMath's interface
        $schema = array(
            'metadata' => array(
                'title' => 'FAQ Schema (Auto-Generated)',
                'isPrimary' => true,
                'type' => 'faq',
                'shortcode' => uniqid('s-'),
                'pdm_auto_generated' => true  // Unique marker for our auto-generated schemas
            ),
            '@type' => 'FAQPage',
            '@id' => get_permalink($post_id) . '#faqpage',
            'name' => get_the_title($post_id),
            'mainEntity' => $main_entity
        );

        return $schema;
    }

    /**
     * Save FAQ schema to RankMath
     */
    private function save_to_rankmath($post_id, $schema_data)
    {
        if (!$schema_data) {
            error_log("DEBUG FAQ Save: No schema data for post $post_id");
            return false;
        }

        error_log("DEBUG FAQ Save: Attempting to save schema for post $post_id");

        // Get existing schemas to preserve manual ones
        $existing_schemas = get_post_meta($post_id, 'rank_math_schema_FAQPage', true);

        if (!empty($existing_schemas) && is_array($existing_schemas) && !isset($existing_schemas['@type'])) {
            // Multiple schemas exist - remove only our auto-generated ones, keep manual ones
            foreach ($existing_schemas as $key => $schema) {
                if ($this->is_auto_generated_schema($schema)) {
                    unset($existing_schemas[$key]);
                }
            }
            // Add our new auto-generated schema
            $existing_schemas['pdm-auto-' . uniqid()] = $schema_data;
            $result = update_post_meta($post_id, 'rank_math_schema_FAQPage', $existing_schemas);
            error_log("DEBUG FAQ Save: Multiple schemas - update result: " . ($result ? 'SUCCESS' : 'FAILED'));
        } else {
            // Single schema or no existing schemas
            $result = update_post_meta($post_id, 'rank_math_schema_FAQPage', $schema_data);
            error_log("DEBUG FAQ Save: Single schema - update result: " . ($result ? 'SUCCESS' : 'FAILED'));
        }

        // Verify it was saved
        $saved_schema = get_post_meta($post_id, 'rank_math_schema_FAQPage', true);
        error_log("DEBUG FAQ Save: Verification - schema exists: " . (!empty($saved_schema) ? 'YES' : 'NO'));

        return true;
    }

    /**
     * Remove only auto-generated FAQ schemas, preserve manual ones
     */
    private function remove_auto_schemas_only($post_id)
    {
        // Clean up the new meta-based approach
        delete_post_meta($post_id, '_pdm_faq_questions');
        delete_post_meta($post_id, '_pdm_faq_auto_generated');

        // Also clean up old RankMath FAQ schemas
        $existing_schemas = get_post_meta($post_id, 'rank_math_schema_FAQPage', true);

        if (!empty($existing_schemas) && is_array($existing_schemas) && !isset($existing_schemas['@type'])) {
            // Multiple schemas - remove only auto-generated ones
            foreach ($existing_schemas as $key => $schema) {
                if ($this->is_auto_generated_schema($schema)) {
                    unset($existing_schemas[$key]);
                }
            }

            if (!empty($existing_schemas)) {
                // Keep manual schemas
                update_post_meta($post_id, 'rank_math_schema_FAQPage', $existing_schemas);
            } else {
                // No schemas left
                delete_post_meta($post_id, 'rank_math_schema_FAQPage');
            }
        }
    }

    /**
     * Remove FAQ schema from RankMath
     */
    private function remove_faq_schema($post_id)
    {
        // Clean up the new meta-based approach
        delete_post_meta($post_id, '_pdm_faq_questions');
        delete_post_meta($post_id, '_pdm_faq_auto_generated');

        // Also clean up any old RankMath FAQ schemas that were auto-generated
        $existing_schemas = get_post_meta($post_id, 'rank_math_schema_FAQPage', true);

        if (!empty($existing_schemas) && is_array($existing_schemas) && !isset($existing_schemas['@type'])) {
            // Multiple schemas - remove only auto-generated ones
            $has_manual = false;
            foreach ($existing_schemas as $key => $schema) {
                if ($this->is_auto_generated_schema($schema)) {
                    unset($existing_schemas[$key]);
                } else {
                    $has_manual = true;
                }
            }

            if ($has_manual) {
                // Keep manual schemas
                update_post_meta($post_id, 'rank_math_schema_FAQPage', $existing_schemas);
            } else {
                // No manual schemas left, delete the meta
                delete_post_meta($post_id, 'rank_math_schema_FAQPage');
            }
        } else {
            // Single schema - check if it's auto-generated before deleting
            if ($this->is_auto_generated_schema($existing_schemas)) {
                delete_post_meta($post_id, 'rank_math_schema_FAQPage');
            }
        }

        error_log("DEBUG FAQ Remove: Cleaned up FAQ schemas for post $post_id");
    }

    /**
     * Inject FAQ schema script in head if enabled
     */
    public function inject_faq_schema_script()
    {
        if (!is_singular() || empty($this->settings['auto_faq_schema'])) {
            return;
        }

        global $post;
        if (!$post) {
            return;
        }

        // Get FAQ schema from RankMath
        $faq_schema = get_post_meta($post->ID, 'rank_math_schema_FAQPage', true);
        if (empty($faq_schema) || empty($faq_schema['mainEntity'])) {
            return;
        }

        echo '<script type="application/ld+json">' . wp_json_encode($faq_schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
    }

    /**
     * Handle settings update
     */
    public function on_settings_update($old_value, $new_value)
    {
        // If FAQ schema was just enabled, generate for all eligible posts
        if (empty($old_value['auto_faq_schema']) && !empty($new_value['auto_faq_schema'])) {
            $this->generate_for_all_posts();
        }

        // If FAQ schema was just disabled, clean up auto-generated schemas
        if (!empty($old_value['auto_faq_schema']) && empty($new_value['auto_faq_schema'])) {
            $this->cleanup_auto_generated_schemas();
        }
    }

    /**
     * Generate FAQ schemas for all eligible posts
     */
    private function generate_for_all_posts()
    {
        // Refresh settings to ensure we have the latest values
        $this->settings = get_option('pdm_settings', array());

        $posts = get_posts(array(
            'post_type' => array('post', 'page'),
            'post_status' => 'publish',
            'numberposts' => -1
        ));

        $generated_count = 0;
        foreach ($posts as $post) {
            $faqs = $this->extract_faqs_from_post($post->ID);

            if (!empty($faqs)) {
                // Check if manual schema exists first
                $existing_schemas = get_post_meta($post->ID, 'rank_math_schema_FAQPage', true);
                $has_manual = false;

                if (!empty($existing_schemas)) {
                    if (is_array($existing_schemas) && !isset($existing_schemas['@type'])) {
                        // Multiple schemas
                        foreach ($existing_schemas as $schema) {
                            if (!$this->is_auto_generated_schema($schema)) {
                                $has_manual = true;
                                break;
                            }
                        }
                    } else {
                        // Single schema
                        $has_manual = !$this->is_auto_generated_schema($existing_schemas);
                    }
                }

                if (!$has_manual) {
                    $this->generate_schema($post->ID);
                    $generated_count++;
                }
            }
        }

        // Set transient to show admin notice
        set_transient('pdm_faq_bulk_generated', $generated_count, 30);
    }

    /**
     * Check if a schema is auto-generated by our system
     */
    private function is_auto_generated_schema($schema)
    {
        // ONLY check our unique marker - don't use title as fallback
        // Manual schemas won't have this marker even if they have similar titles
        return isset($schema['metadata']['pdm_auto_generated']) && $schema['metadata']['pdm_auto_generated'] === true;
    }

    /**
     * Clean up all auto-generated FAQ schemas
     */
    private function cleanup_auto_generated_schemas()
    {
        $posts = get_posts(array(
            'post_type' => array('post', 'page'),
            'post_status' => 'any',
            'numberposts' => -1,
            'meta_query' => array(
                array(
                    'key' => 'rank_math_schema_FAQPage',
                    'compare' => 'EXISTS'
                )
            )
        ));

        $cleaned_count = 0;
        foreach ($posts as $post) {
            $schema = get_post_meta($post->ID, 'rank_math_schema_FAQPage', true);
            if ($this->is_auto_generated_schema($schema)) {
                delete_post_meta($post->ID, 'rank_math_schema_FAQPage');
                $cleaned_count++;
            }
        }

        if ($cleaned_count > 0) {
            set_transient('pdm_faq_schema_cleanup', $cleaned_count, 30);
        }
    }

    /**
     * Show admin notices
     */
    public function show_admin_notices()
    {
        // Show notice after cleanup
        if (get_transient('pdm_faq_schema_cleanup')) {
            $count = get_transient('pdm_faq_schema_cleanup');
            delete_transient('pdm_faq_schema_cleanup');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('Auto-generated FAQ schemas removed from %d posts.', $count) . '</p></div>';
        }

        // Show notice after bulk generation
        if (get_transient('pdm_faq_bulk_generated')) {
            $count = get_transient('pdm_faq_bulk_generated');
            delete_transient('pdm_faq_bulk_generated');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('FAQ schemas automatically generated for %d pages with FAQ content!', $count) . '</p></div>';
        }
    }

    /**
     * Extract content until a closing tag
     */
    private function extract_content_until_closing_tag($html, $start_pos, $tag)
    {
        $open_tag = '<' . $tag;
        $close_tag = '</' . $tag . '>';

        $depth = 1;
        $pos = $start_pos;
        $length = strlen($html);

        while ($pos < $length && $depth > 0) {
            $open_pos = strpos($html, $open_tag, $pos);
            $close_pos = strpos($html, $close_tag, $pos);

            if ($close_pos === false) {
                break;
            }

            if ($open_pos !== false && $open_pos < $close_pos) {
                $depth++;
                $pos = $open_pos + strlen($open_tag);
            } else {
                $depth--;
                if ($depth === 0) {
                    return substr($html, $start_pos, $close_pos - $start_pos);
                }
                $pos = $close_pos + strlen($close_tag);
            }
        }

        return '';
    }
}

/**
 * Filter RankMath's JSON-LD output to add FAQ data to WebPage schema
 * This avoids duplicate FAQPage and integrates FAQ into existing WebPage
 */
function pdm_faq_modify_json_ld($data, $jsonld)
{
    if (empty($data) || !is_array($data)) {
        return $data;
    }

    // Only modify on single posts/pages that have FAQ data
    if (!is_singular()) {
        return $data;
    }

    $post_id = get_queried_object_id();
    $faq_questions = get_post_meta($post_id, '_pdm_faq_questions', true);
    $is_auto_generated = get_post_meta($post_id, '_pdm_faq_auto_generated', true);

    // Only proceed if we have auto-generated FAQ questions
    if (empty($faq_questions) || !$is_auto_generated) {
        return $data;
    }

    $webpage_found = false;
    $faqpage_keys_to_remove = array();

    // First pass: Find WebPage and note FAQPage schemas to remove
    foreach ($data as $key => $schema) {
        if (isset($schema['@type'])) {
            if ($schema['@type'] === 'WebPage') {
                // Add FAQPage to the @type array
                $data[$key]['@type'] = array('WebPage', 'FAQPage');
                // Add the FAQ questions as mainEntity
                $data[$key]['mainEntity'] = $faq_questions;
                $webpage_found = true;
            } elseif ($schema['@type'] === 'FAQPage' && isset($schema['@id']) && strpos($schema['@id'], '#faqpage') !== false) {
                // Mark auto-generated FAQPage schemas for removal
                $faqpage_keys_to_remove[] = $key;
            }
        }
    }

    // Second pass: Remove duplicate FAQPage schemas
    foreach ($faqpage_keys_to_remove as $key) {
        unset($data[$key]);
    }

    // If no WebPage was found but we have FAQ data, keep the FAQPage but don't duplicate
    if (!$webpage_found && !empty($faqpage_keys_to_remove)) {
        // Re-add the first FAQPage if no WebPage exists
        $data[] = array(
            '@type' => array('WebPage', 'FAQPage'),
            '@id' => get_permalink($post_id) . '#webpage',
            'url' => get_permalink($post_id),
            'name' => get_the_title($post_id),
            'mainEntity' => $faq_questions
        );
    }

    return $data;
}
add_filter('rank_math/json_ld', 'pdm_faq_modify_json_ld', 99, 2);

/**
 * Clean up malformed schemas when FAQ option changes
 * This runs when the FAQ option is enabled/disabled to fix any JavaScript errors
 */
function pdm_cleanup_schemas_on_option_change($old_value, $new_value, $option)
{
    if ($option !== 'pdm_settings') {
        return;
    }

    // Check if FAQ option was toggled
    $old_faq = isset($old_value['auto_faq_schema']) ? $old_value['auto_faq_schema'] : false;
    $new_faq = isset($new_value['auto_faq_schema']) ? $new_value['auto_faq_schema'] : false;

    // If FAQ option was enabled (including when first enabled), run cleanup
    if ($new_faq && (!$old_faq || $old_faq !== $new_faq)) {
        // Load the schema manager and run cleanup
        if (class_exists('PDM_Schema_Manager')) {
            $fixed_count = PDM_Schema_Manager::cleanup_malformed_schemas();
            if ($fixed_count > 0) {
                error_log("PDM Schema Cleanup: Fixed $fixed_count malformed schemas after FAQ option toggle");
            }
        }
    }
}
add_action('updated_option', 'pdm_cleanup_schemas_on_option_change', 10, 3);

/**
 * Clean up malformed schemas that might be causing JavaScript errors
 * This runs on admin_init to fix any existing bad schemas (lightweight version)
 */
function pdm_cleanup_malformed_schemas()
{
    // Only run in admin and not on every page load
    if (!is_admin() || wp_doing_ajax()) {
        return;
    }

    // Run this cleanup only once per day to avoid performance issues
    if (get_transient('pdm_schema_cleanup_done')) {
        return;
    }

    // Only run cleanup if FAQ is enabled
    $options = get_option('pdm_settings');
    if (empty($options['auto_faq_schema'])) {
        return;
    }

    // Load the schema manager and run cleanup
    if (class_exists('PDM_Schema_Manager')) {
        $fixed_count = PDM_Schema_Manager::cleanup_malformed_schemas();
        if ($fixed_count > 0) {
            error_log("PDM Schema Cleanup: Fixed $fixed_count malformed schemas during admin_init");
        }
    }

    // Set transient to avoid running this again for 24 hours
    set_transient('pdm_schema_cleanup_done', true, DAY_IN_SECONDS);
}
add_action('admin_init', 'pdm_cleanup_malformed_schemas');

// Initialize the FAQ handler
new PDM_FAQ_Schema();
