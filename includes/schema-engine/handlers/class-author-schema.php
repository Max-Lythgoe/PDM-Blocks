<?php

/**
 * Author Schema Handler - Built-in E-E-A-T Schema Generation
 *
 * @package PDM_Accelerate
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class PDM_Author_Schema
{

    private $settings;

    public function __construct()
    {
        $this->settings = get_option('pdm_settings', array());
        add_action('publish_post', array($this, 'generate_schema'), 10, 1);
        add_action('save_post', array($this, 'generate_schema'), 10, 1);
        add_action('admin_notices', array($this, 'show_admin_notices'));

        // Hook to generate schemas when settings are saved
        add_action('update_option_pdm_settings', array($this, 'handle_settings_update'), 10, 2);
    }

    /**
     * Check if schema should be generated for this post
     */
    public function should_generate_for_post($post)
    {
        if (empty($this->settings['enable_rankmath_schema'])) {
            return false;
        }

        return $post->post_type === 'post' && $post->post_status === 'publish';
    }

    /**
     * Generate author schema for a post
     */
    public function generate_schema($post_id)
    {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            return;
        }

        $post = get_post($post_id);
        if ($post->post_type !== 'post') {
            return;
        }

        // Check if Author E-E-A-T schema is enabled
        if (empty($this->settings['enable_rankmath_schema'])) {
            // If disabled, clean up any auto-generated schemas
            $existing_schema = get_post_meta($post_id, 'rank_math_schema_Person', true);
            if (!empty($existing_schema) && $this->is_auto_generated_schema($existing_schema)) {
                delete_post_meta($post_id, 'rank_math_schema_Person');
            }
            return;
        }

        if (!$this->should_generate_for_post($post)) {
            return;
        }

        // Check if manual schema exists (don't overwrite manual schemas)
        $existing_schemas = get_post_meta($post_id, 'rank_math_schema_Person', true);
        if (!empty($existing_schemas)) {
            // First, check if this looks like a RankMath schema structure
            if (is_array($existing_schemas)) {
                // Check if it has the @type key (single schema) or is an array of schemas
                if (isset($existing_schemas['@type'])) {
                    // Single schema - check if it's manual (no pdm_auto_generated marker)
                    if (!$this->is_auto_generated_schema($existing_schemas)) {
                        return; // Manual schema detected, don't overwrite
                    }
                } elseif (isset($existing_schemas[0]) && is_array($existing_schemas[0])) {
                    // Multiple schemas - check if any are manual
                    foreach ($existing_schemas as $schema) {
                        if (is_array($schema) && !$this->is_auto_generated_schema($schema)) {
                            return; // Manual schema detected, don't overwrite
                        }
                    }
                } elseif (isset($existing_schemas['metadata'])) {
                    // Single schema with metadata wrapper - check if it's manual
                    if (!$this->is_auto_generated_schema($existing_schemas)) {
                        return; // Manual schema detected, don't overwrite
                    }
                } else {
                    // Unknown structure - assume it's manual to be safe
                    return;
                }
            }
        }

        $author_id = $post->post_author;
        $author_data = get_userdata($author_id);

        if (!$author_data) {
            return;
        }

        // Get author details from user meta (E-E-A-T fields)
        $author_name = get_user_meta($author_id, 'display_name', true) ?: $author_data->display_name;
        $author_bio = get_user_meta($author_id, 'author_description', true) ?: get_user_meta($author_id, 'description', true);
        $author_url = get_user_meta($author_id, 'author_website', true) ?: $author_data->user_url;

        // Get custom profile image or fallback to Gravatar
        $profile_image_id = get_user_meta($author_id, 'author_profile_image', true);
        $author_image = $profile_image_id ? wp_get_attachment_image_url($profile_image_id, 'medium') : get_avatar_url($author_id, array('size' => 150));

        // Build Person schema with metadata wrapper - completely replace any existing
        $schema_data = array(
            'metadata' => array(
                'title' => 'Auto-Generated Author',
                'type' => 'template',
                'isPrimary' => true,
                'shortcode' => uniqid('s-'),
                'pdm_auto_generated' => true // Mark as auto-generated
            ),
            '@type' => 'Person',
            'name' => $author_name,
            'description' => $author_bio,
            'url' => $author_url,
            'image' => array(
                '@type' => 'ImageObject',
                'url' => $author_image,
                'width' => 150,
                'height' => 150
            )
        );

        // Add social profiles if available
        $social_profiles = array();
        $twitter_url = get_user_meta($author_id, 'author_twitter', true);
        if (!empty($twitter_url)) {
            $social_profiles[] = $twitter_url;
        }
        $linkedin_url = get_user_meta($author_id, 'author_linkedin', true);
        if (!empty($linkedin_url)) {
            $social_profiles[] = $linkedin_url;
        }
        $facebook_url = get_user_meta($author_id, 'author_facebook', true);
        if (!empty($facebook_url)) {
            $social_profiles[] = $facebook_url;
        }

        if (!empty($social_profiles)) {
            $schema_data['sameAs'] = $social_profiles;
        }

        // Add job title and education if available
        $job_title = get_user_meta($author_id, 'author_jobtitle', true);
        if (!empty($job_title)) {
            $schema_data['jobTitle'] = $job_title;
        }

        $alumni_of = get_user_meta($author_id, 'author_alumniof', true);
        if (!empty($alumni_of)) {
            $schema_data['alumniOf'] = array(
                '@type' => 'Organization',
                'name' => $alumni_of
            );
        }

        // Add expertise areas (knowsAbout) from E-E-A-T fields
        $knows_about = array();
        for ($i = 1; $i <= 5; $i++) {
            $knowledge_area = get_user_meta($author_id, 'author_knowsabout_' . $i, true);
            if (!empty($knowledge_area)) {
                $knows_about[] = $knowledge_area;
            }
        }

        if (!empty($knows_about)) {
            $schema_data['knowsAbout'] = $knows_about;
        }

        // Store schema in RankMath (as PHP array, with metadata wrapper)
        update_post_meta($post_id, 'rank_math_schema_Person', $schema_data);

        return true;
    }

    /**
     * Check if a schema is auto-generated by our system
     */
    private function is_auto_generated_schema($schema)
    {
        // Add debug logging
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Author Schema Detection - Checking schema: ' . print_r($schema, true));
        }

        if (!is_array($schema)) {
            return false;
        }

        // Primary check: Look for our unique marker
        if (isset($schema['metadata']['pdm_auto_generated']) && $schema['metadata']['pdm_auto_generated'] === true) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Author Schema Detection - Found pdm_auto_generated marker: AUTO-GENERATED');
            }
            return true;
        }

        // Secondary check: Look for our auto-generated title pattern
        if (isset($schema['metadata']['title']) && strpos($schema['metadata']['title'], 'Auto-Generated') !== false) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Author Schema Detection - Found Auto-Generated in metadata title: AUTO-GENERATED');
            }
            return true;
        }

        // Fallback checks for different RankMath storage formats
        if (isset($schema['name']) && strpos($schema['name'], 'Auto-Generated') !== false) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Author Schema Detection - Found Auto-Generated in name: AUTO-GENERATED');
            }
            return true;
        }

        if (isset($schema['title']) && strpos($schema['title'], 'Auto-Generated') !== false) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('Author Schema Detection - Found Auto-Generated in title: AUTO-GENERATED');
            }
            return true;
        }

        // No auto-generated markers found - assume manual
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('Author Schema Detection - No auto-generated markers found: MANUAL');
        }
        return false;
    }

    /**
     * Handle settings update - generate for all posts when enabled
     */
    public function handle_settings_update($old_value, $new_value)
    {
        // Check if Author schema was just enabled
        $was_enabled = !empty($old_value['enable_rankmath_schema']);
        $is_enabled = !empty($new_value['enable_rankmath_schema']);

        if (!$was_enabled && $is_enabled) {
            $this->generate_for_all_posts();
        } elseif ($was_enabled && !$is_enabled) {
            $this->cleanup_all_auto_generated();
        }
    }

    /**
     * Generate Author schemas for all eligible posts
     */
    private function generate_for_all_posts()
    {
        // Refresh settings to ensure we have the latest values
        $this->settings = get_option('pdm_settings', array());

        $posts = get_posts(array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'numberposts' => -1
        ));

        $generated_count = 0;
        foreach ($posts as $post) {
            if ($this->should_generate_for_post($post)) {
                // Check if manual schema exists first
                $existing_schemas = get_post_meta($post->ID, 'rank_math_schema_Person', true);
                $has_manual = false;

                if (!empty($existing_schemas) && is_array($existing_schemas)) {
                    // Check if it has the @type key (single schema) or is an array of schemas
                    if (isset($existing_schemas['@type'])) {
                        // Single schema - check if it's manual
                        $has_manual = !$this->is_auto_generated_schema($existing_schemas);
                    } elseif (isset($existing_schemas[0]) && is_array($existing_schemas[0])) {
                        // Multiple schemas - check if any are manual
                        foreach ($existing_schemas as $schema) {
                            if (is_array($schema) && !$this->is_auto_generated_schema($schema)) {
                                $has_manual = true;
                                break;
                            }
                        }
                    } elseif (isset($existing_schemas['metadata'])) {
                        // Single schema with metadata wrapper - check if it's manual
                        $has_manual = !$this->is_auto_generated_schema($existing_schemas);
                    } else {
                        // Unknown structure - assume it's manual to be safe
                        $has_manual = true;
                    }
                }

                if (!$has_manual) {
                    $this->generate_schema($post->ID);
                    $generated_count++;
                }
            }
        }

        // Set transient to show admin notice
        set_transient('pdm_author_bulk_generated', $generated_count, 30);
    }

    /**
     * Clean up all auto-generated Author schemas
     */
    private function cleanup_all_auto_generated()
    {
        $posts = get_posts(array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'numberposts' => -1
        ));

        $cleaned_count = 0;
        foreach ($posts as $post) {
            $existing_schema = get_post_meta($post->ID, 'rank_math_schema_Person', true);
            if (!empty($existing_schema) && $this->is_auto_generated_schema($existing_schema)) {
                delete_post_meta($post->ID, 'rank_math_schema_Person');
                $cleaned_count++;
            }
        }

        // Set transient to show admin notice
        set_transient('pdm_author_bulk_cleaned', $cleaned_count, 30);
    }

    /**
     * Show admin notices for bulk generation results
     */
    public function show_admin_notices()
    {
        $count = get_transient('pdm_author_bulk_generated');
        if ($count !== false) {
            delete_transient('pdm_author_bulk_generated');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('Author schemas automatically generated for %d blog posts!', $count) . '</p></div>';
        }

        $cleaned_count = get_transient('pdm_author_bulk_cleaned');
        if ($cleaned_count !== false) {
            delete_transient('pdm_author_bulk_cleaned');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('Author schemas removed from %d blog posts!', $cleaned_count) . '</p></div>';
        }
    }
}
