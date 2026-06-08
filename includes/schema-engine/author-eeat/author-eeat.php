<?php

/**
 * Author E-E-A-T Feature - PDM Blocks Plugin version
 *
 * Enhances author profiles with E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
 * information including custom fields, schema markup, and author box display.
 *
 * This feature can be enabled/disabled via PDM Settings > Author E-E-A-T tab.
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin-scoped path constants for this module.
define('PDM_AUTHOR_EEAT_DIR', plugin_dir_path(__FILE__));
define('PDM_AUTHOR_EEAT_URL', plugin_dir_url(__FILE__));

/**
 * Check if Author E-E-A-T feature is enabled.
 */
function pdm_is_author_eeat_enabled()
{
    $options = get_option('pdm_settings', array());
    return !empty($options['enable_author_eeat']);
}

/**
 * Initialize Author E-E-A-T Feature.
 */
function pdm_author_eeat_init()
{
    // Always load admin fields (so users can configure them).
    require_once PDM_AUTHOR_EEAT_DIR . 'admin/user-fields.php';
    require_once PDM_AUTHOR_EEAT_DIR . 'admin/admin-fields.php';
    require_once PDM_AUTHOR_EEAT_DIR . 'admin/settings-tab.php';

    // Always load frontend display (for shortcode registration).
    require_once PDM_AUTHOR_EEAT_DIR . 'frontend/frontend-display.php';

    // Only enqueue styles if enabled.
    if (pdm_is_author_eeat_enabled()) {
        add_action('wp_enqueue_scripts', 'pdm_author_eeat_conditional_enqueue');
    }
}
add_action('init', 'pdm_author_eeat_init');

/**
 * Conditionally enqueue Author E-E-A-T styles.
 * Only loads on single posts (post type 'post') and author archive pages.
 */
function pdm_author_eeat_conditional_enqueue()
{
    if (!is_singular('post') && !is_author()) {
        return;
    }

    wp_enqueue_style(
        'pdm-author-eeat',
        PDM_AUTHOR_EEAT_URL . 'assets/author-eeat.css',
        array(),
        filemtime(PDM_AUTHOR_EEAT_DIR . 'assets/author-eeat.css')
    );
}
