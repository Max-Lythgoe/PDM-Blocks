<?php

/**
 * Add Author E-E-A-T Settings Tab to PDM Settings
 * 
 * Extends the PDM Settings page with an Author E-E-A-T tab.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add Author E-E-A-T section and fields
 */
function pdm_author_eeat_settings_init()
{
    // --- SECTION: Author E-E-A-T Settings ---
    add_settings_section(
        'pdm_author_eeat_section',
        'Author E-E-A-T Settings',
        'pdm_author_eeat_section_callback',
        'pdm-settings'
    );

    // Enable Author E-E-A-T Toggle
    add_settings_field(
        'enable_author_eeat',
        'Enable Author E-E-A-T',
        'pdm_checkbox_input_callback',
        'pdm-settings',
        'pdm_author_eeat_section',
        array(
            'id' => 'enable_author_eeat',
            'label' => 'Enable author E-E-A-T features (schema markup, author boxes, etc.)'
        )
    );

    // Display Author Box Toggle
    add_settings_field(
        'author_box_enabled',
        'Display Author Box',
        'pdm_checkbox_input_callback',
        'pdm-settings',
        'pdm_author_eeat_section',
        array(
            'id' => 'author_box_enabled',
            'label' => 'Automatically display author box on blog posts',
            'depends_on' => 'enable_author_eeat'
        )
    );

    // Author Box Position
    add_settings_field(
        'author_box_position',
        'Author Box Position',
        'pdm_select_input_callback',
        'pdm-settings',
        'pdm_author_eeat_section',
        array(
            'id' => 'author_box_position',
            'label' => 'Where to display the author box',
            'options' => array(
                'before_content' => 'Before Content',
                'after_content' => 'After Content',
                'manual' => 'Manual (use shortcode)',
            ),
            'default' => 'after_content',
            'depends_on' => 'author_box_enabled'
        )
    );

    // Automatic Schema Generation
    add_settings_field(
        'enable_rankmath_schema',
        'Automatic Schema Generation',
        'pdm_checkbox_input_callback',
        'pdm-settings',
        'pdm_author_eeat_section',
        array(
            'id' => 'enable_rankmath_schema',
            'label' => 'Automatically generate and inject Person schema with E-E-A-T data for search engines',
            'depends_on' => 'enable_author_eeat'
        )
    );

    // Author Box Display Style
    add_settings_field(
        'author_box_style',
        'Author Box Style',
        'pdm_select_input_callback',
        'pdm-settings',
        'pdm_author_eeat_section',
        array(
            'id' => 'author_box_style',
            'label' => 'Display style for author information',
            'options' => array(
                'regular' => 'Regular Author Box',
                'tooltip' => 'Hover Tooltip Only',
            ),
            'default' => 'regular',
            'depends_on' => 'author_box_enabled'
        )
    );
}
add_action('admin_init', 'pdm_author_eeat_settings_init', 15);

/**
 * Section callback for Author E-E-A-T
 */
function pdm_author_eeat_section_callback()
{
    echo '<p>Configure E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) features for author profiles.</p>';
    echo '<p><strong>Note:</strong> After enabling, edit user profiles to add E-E-A-T information.</p>';
}
