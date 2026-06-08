<?php

/**
 * Article Schema Handler - Built-in Article Schema Generation
 *
 * @package PDM_Accelerate
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class PDM_Article_Schema
{

    private $settings;

    public function __construct()
    {
        $this->settings = get_option('pdm_settings', array());
        add_action('publish_post', array($this, 'generate_schema'), 10, 1);
        add_action('publish_page', array($this, 'generate_schema'), 10, 1);
        add_action('save_post', array($this, 'generate_schema'), 10, 1);
        add_action('admin_notices', array($this, 'show_admin_notices'));

        // Hook to generate schemas when settings are saved
        add_action('update_option_pdm_settings', array($this, 'handle_settings_update'), 10, 2);
    }

    /**
     * Handle settings update - generate for all posts when enabled
     */
    public function handle_settings_update($old_value, $new_value)
    {
        // Check if Article schema was just enabled
        $was_enabled = !empty($old_value['enable_article_schema']);
        $is_enabled = !empty($new_value['enable_article_schema']);

        if (!$was_enabled && $is_enabled) {
            $this->generate_for_all_posts();
        } elseif ($was_enabled && !$is_enabled) {
            $this->cleanup_all_auto_generated();
        }
    }

    /**
     * Check if schema should be generated for this post
     */
    public function should_generate_for_post($post)
    {
        if (empty($this->settings['enable_article_schema'])) {
            return false;
        }

        $selected_post_types = !empty($this->settings['article_post_types']) ? $this->settings['article_post_types'] : array('post');

        return in_array($post->post_type, $selected_post_types) && $post->post_status === 'publish';
    }

    /**
     * Generate article schema for a post
     */
    public function generate_schema($post_id)
    {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        $post = get_post($post_id);

        // Check if Article schema is enabled
        if (empty($this->settings['enable_article_schema'])) {
            // If disabled, clean up any auto-generated schemas for this post type
            $existing_article = get_post_meta($post_id, 'rank_math_schema_Article', true);
            $existing_blogposting = get_post_meta($post_id, 'rank_math_schema_BlogPosting', true);

            if (!empty($existing_article) && $this->is_auto_generated_schema($existing_article)) {
                delete_post_meta($post_id, 'rank_math_schema_Article');
            }
            if (!empty($existing_blogposting) && $this->is_auto_generated_schema($existing_blogposting)) {
                delete_post_meta($post_id, 'rank_math_schema_BlogPosting');
            }
            return;
        }

        if (!$this->should_generate_for_post($post)) {
            return;
        }

        // Check if manual schema exists (don't overwrite manual schemas)
        // Check for both Article and BlogPosting schemas since either could be manually added
        $existing_article_schemas = get_post_meta($post_id, 'rank_math_schema_Article', true);
        $existing_blogposting_schemas = get_post_meta($post_id, 'rank_math_schema_BlogPosting', true);

        // Check if there are any manual Article or BlogPosting schemas
        $has_manual_article = !empty($existing_article_schemas) && !$this->is_auto_generated_schema($existing_article_schemas);
        $has_manual_blogposting = !empty($existing_blogposting_schemas) && !$this->is_auto_generated_schema($existing_blogposting_schemas);

        if ($has_manual_article || $has_manual_blogposting) {
            return; // Manual schema of Article or BlogPosting type detected, don't overwrite
        }

        // Get article details
        $title = get_the_title($post_id);
        $content = get_post_field('post_content', $post_id);
        $excerpt = get_the_excerpt($post_id) ?: wp_trim_words(strip_tags($content), 25);
        $permalink = get_permalink($post_id);
        $date_published = get_the_date('c', $post_id);
        $date_modified = get_the_modified_date('c', $post_id);

        // Get featured image
        $featured_image = get_the_post_thumbnail_url($post_id, 'full');
        if (!$featured_image) {
            $featured_image = !empty($this->settings['article_default_image']) ? $this->settings['article_default_image'] : '';
        }

        // Get author info
        $author_id = $post->post_author;
        $author_name = !empty($this->settings['author_name']) ? $this->settings['author_name'] : get_the_author_meta('display_name', $author_id);

        // Get post type and determine schema title and type
        $post_type = $post->post_type;
        $schema_title = ($post_type === 'post') ? 'Auto-Generated Blog Post' : 'Auto-Generated Article';
        $schema_type = ($post_type === 'post') ? 'BlogPosting' : 'Article';

        // Build Article schema
        $article_schema = array(
            '@type' => $schema_type,
            'headline' => $title,
            'description' => $excerpt,
            'url' => $permalink,
            'datePublished' => $date_published,
            'dateModified' => $date_modified,
            'author' => array(
                '@type' => 'Person',
                'name' => $author_name
            )
        );

        // Add articleSection based on post type
        if ($post_type === 'post') {
            // For blog posts, use category or default section
            $categories = get_the_category($post_id);
            if (!empty($categories)) {
                $article_schema['articleSection'] = $categories[0]->name;
            } else {
                $article_schema['articleSection'] = !empty($this->settings['article_default_section']) ? $this->settings['article_default_section'] : 'Blog';
            }
        }

        // Add image if available
        if ($featured_image) {
            $article_schema['image'] = array(
                '@type' => 'ImageObject',
                'url' => $featured_image
            );
        }

        // Add publisher info
        if (!empty($this->settings['article_publisher_name'])) {
            $publisher = array(
                '@type' => !empty($this->settings['article_publisher_type']) ? $this->settings['article_publisher_type'] : 'Organization',
                'name' => $this->settings['article_publisher_name']
            );

            if (!empty($this->settings['article_publisher_logo'])) {
                $publisher['logo'] = array(
                    '@type' => 'ImageObject',
                    'url' => $this->settings['article_publisher_logo']
                );
            }

            $article_schema['publisher'] = $publisher;
        }

        // Build schema in RankMath format
        $schema_data = array(
            'metadata' => array(
                'title' => $schema_title,
                'type' => 'template',
                'isPrimary' => true,
                'shortcode' => uniqid('s-'),
                'pdm_auto_generated' => true // Mark as auto-generated
            )
        );

        // Merge with article schema
        $schema_data = array_merge($schema_data, $article_schema);

        // Store schema in RankMath using the appropriate meta key based on schema type
        $meta_key = ($schema_type === 'BlogPosting') ? 'rank_math_schema_BlogPosting' : 'rank_math_schema_Article';
        update_post_meta($post_id, $meta_key, $schema_data);

        return true;
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
     * Generate Article schemas for all eligible posts
     */
    private function generate_for_all_posts()
    {
        // Refresh settings to ensure we have the latest values
        $this->settings = get_option('pdm_settings', array());

        // Get post types from settings
        $post_types = !empty($this->settings['article_post_types'])
            ? array_map('trim', explode("\n", $this->settings['article_post_types']))
            : array('post');

        $posts = get_posts(array(
            'post_type' => $post_types,
            'post_status' => 'publish',
            'numberposts' => -1
        ));

        $generated_count = 0;
        foreach ($posts as $post) {
            if ($this->should_generate_for_post($post)) {
                // Check if manual schema exists first (check both Article and BlogPosting)
                $existing_article_schemas = get_post_meta($post->ID, 'rank_math_schema_Article', true);
                $existing_blogposting_schemas = get_post_meta($post->ID, 'rank_math_schema_BlogPosting', true);
                $has_manual = false;

                // Check Article schemas
                if (!empty($existing_article_schemas)) {
                    if (is_array($existing_article_schemas) && !isset($existing_article_schemas['@type'])) {
                        // Multiple schemas
                        foreach ($existing_article_schemas as $schema) {
                            if (!$this->is_auto_generated_schema($schema)) {
                                $has_manual = true;
                                break;
                            }
                        }
                    } else {
                        // Single schema
                        $has_manual = !$this->is_auto_generated_schema($existing_article_schemas);
                    }
                }

                // Check BlogPosting schemas if no manual Article schema found
                if (!$has_manual && !empty($existing_blogposting_schemas)) {
                    if (is_array($existing_blogposting_schemas) && !isset($existing_blogposting_schemas['@type'])) {
                        // Multiple schemas
                        foreach ($existing_blogposting_schemas as $schema) {
                            if (!$this->is_auto_generated_schema($schema)) {
                                $has_manual = true;
                                break;
                            }
                        }
                    } else {
                        // Single schema
                        $has_manual = !$this->is_auto_generated_schema($existing_blogposting_schemas);
                    }
                }

                if (!$has_manual) {
                    $this->generate_schema($post->ID);
                    $generated_count++;
                }
            }
        }

        // Set transient to show admin notice
        set_transient('pdm_article_bulk_generated', $generated_count, 30);
    }

    /**
     * Clean up all auto-generated Article schemas
     */
    private function cleanup_all_auto_generated()
    {
        // Get post types from settings
        $post_types = !empty($this->settings['article_post_types'])
            ? array_map('trim', explode("\n", $this->settings['article_post_types']))
            : array('post');

        $posts = get_posts(array(
            'post_type' => $post_types,
            'post_status' => 'publish',
            'numberposts' => -1
        ));

        $cleaned_count = 0;
        foreach ($posts as $post) {
            // Clean up both Article and BlogPosting schemas
            $existing_article = get_post_meta($post->ID, 'rank_math_schema_Article', true);
            $existing_blogposting = get_post_meta($post->ID, 'rank_math_schema_BlogPosting', true);

            if (!empty($existing_article) && $this->is_auto_generated_schema($existing_article)) {
                delete_post_meta($post->ID, 'rank_math_schema_Article');
                $cleaned_count++;
            }
            if (!empty($existing_blogposting) && $this->is_auto_generated_schema($existing_blogposting)) {
                delete_post_meta($post->ID, 'rank_math_schema_BlogPosting');
                $cleaned_count++;
            }
        }

        // Set transient to show admin notice
        set_transient('pdm_article_bulk_cleaned', $cleaned_count, 30);
    }

    /**
     * Show admin notices for bulk generation results
     */
    public function show_admin_notices()
    {
        $count = get_transient('pdm_article_bulk_generated');
        if ($count !== false) {
            delete_transient('pdm_article_bulk_generated');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('Article schemas automatically generated for %d posts/pages!', $count) . '</p></div>';
        }

        $cleaned_count = get_transient('pdm_article_bulk_cleaned');
        if ($cleaned_count !== false) {
            delete_transient('pdm_article_bulk_cleaned');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('Article schemas removed from %d posts/pages!', $cleaned_count) . '</p></div>';
        }
    }
}
