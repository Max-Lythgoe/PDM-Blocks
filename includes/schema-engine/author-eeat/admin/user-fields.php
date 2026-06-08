<?php

/**
 * Register Custom User Meta Fields for Author E-E-A-T
 * 
 * Defines all custom user meta fields needed for E-E-A-T implementation.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get all Author E-E-A-T field definitions
 */
function pdm_get_author_eeat_fields()
{
    return array(
        'author_profile_image' => array(
            'label' => 'Custom Profile Image',
            'type' => 'image',
            'description' => 'Upload a custom profile image. If not set, Gravatar will be used.',
        ),
        'author_description' => array(
            'label' => 'Author Bio (Extended)',
            'type' => 'wysiwyg',
            'description' => 'Extended author biography for E-E-A-T. This will be displayed on author archive pages and in author boxes.',
        ),
        'author_knowsabout_1' => array(
            'label' => 'KnowsAbout #1',
            'type' => 'text',
            'description' => 'Topic/Entity (must have a Wikipedia page). Example: Search Engine Optimization https://en.wikipedia.org/wiki/Search_engine_optimization',
        ),
        'author_knowsabout_2' => array(
            'label' => 'KnowsAbout #2',
            'type' => 'text',
            'description' => 'Topic/Entity (must have a Wikipedia page)',
        ),
        'author_knowsabout_3' => array(
            'label' => 'KnowsAbout #3',
            'type' => 'text',
            'description' => 'Topic/Entity (must have a Wikipedia page)',
        ),
        'author_knowsabout_4' => array(
            'label' => 'KnowsAbout #4',
            'type' => 'text',
            'description' => 'Topic/Entity (must have a Wikipedia page)',
        ),
        'author_knowsabout_5' => array(
            'label' => 'KnowsAbout #5',
            'type' => 'text',
            'description' => 'Topic/Entity (must have a Wikipedia page)',
        ),
        'author_jobtitle' => array(
            'label' => 'Job Title',
            'type' => 'text',
            'description' => 'Current professional title (must match expertise). Example: Search Engine Optimization Expert',
        ),
        'author_alumniof' => array(
            'label' => 'Alumni Of',
            'type' => 'text',
            'description' => 'Educational institution or certification. Example: University of Chicago',
        ),
        'author_linkedin' => array(
            'label' => 'LinkedIn Profile URL',
            'type' => 'url',
            'description' => 'Full LinkedIn profile URL',
        ),
        'author_facebook' => array(
            'label' => 'Facebook Profile URL',
            'type' => 'url',
            'description' => 'Full Facebook profile URL',
        ),
        'author_twitter' => array(
            'label' => 'Twitter/X Profile URL',
            'type' => 'url',
            'description' => 'Full Twitter/X profile URL',
        ),
        'author_website' => array(
            'label' => 'Personal Website URL',
            'type' => 'url',
            'description' => 'Author\'s personal website or portfolio',
        ),
    );
}

/**
 * Save custom user meta fields
 */
function pdm_save_author_eeat_fields($user_id)
{
    // Check permissions
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }

    $fields = pdm_get_author_eeat_fields();

    foreach ($fields as $field_key => $field_data) {
        if (isset($_POST[$field_key])) {
            $value = $_POST[$field_key];

            // Sanitize based on field type
            switch ($field_data['type']) {
                case 'wysiwyg':
                    $value = wp_kses_post($value);
                    break;
                case 'url':
                    $value = esc_url_raw($value);
                    break;
                case 'image':
                    $value = absint($value); // Image ID
                    break;
                case 'text':
                default:
                    $value = sanitize_text_field($value);
                    break;
            }

            update_user_meta($user_id, $field_key, $value);
        }
    }
}
add_action('personal_options_update', 'pdm_save_author_eeat_fields');
add_action('edit_user_profile_update', 'pdm_save_author_eeat_fields');
