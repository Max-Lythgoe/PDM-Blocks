<?php

/**
 * Schema Engine Loader for PDM Blocks Plugin
 *
 * Loads the PDM Settings admin page and schema engine (FAQ, Article, Author E-E-A-T,
 * Service Area schemas).
 *
 * Only skips if the PDM Accelerate theme (< 1.5.4) still has these built in.
 * From 1.5.4 onward the theme delegates to this plugin.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Load the schema engine.
 *
 * Runs on `after_setup_theme` (priority 20) so any theme-side hooks can be
 * unregistered first if needed.
 */
add_action('after_setup_theme', 'pdm_blocks_maybe_load_schema_engine', 20);

function pdm_blocks_maybe_load_schema_engine()
{
    // If pdm-accelerate theme < 1.5.4 is active, it still has these built in.
    $theme = wp_get_theme();
    $is_pdm_theme = $theme->get_stylesheet() === 'pdm-accelerate' || $theme->get_template() === 'pdm-accelerate';
    if ($is_pdm_theme && version_compare($theme->get('Version'), '1.5.4', '<')) {
        return;
    }

    // Belt-and-suspenders: if the settings page function is already defined
    // (e.g. a child theme re-uses the same code), skip as well.
    if (function_exists('pdm_add_settings_menu_page')) {
        return;
    }

    $base = plugin_dir_path(__FILE__);

    // 1. Schema handlers (front-end schema output + save_post generation).
    require_once $base . 'handlers/class-faq-schema.php';
    require_once $base . 'handlers/class-author-schema.php';
    require_once $base . 'handlers/class-article-schema.php';
    require_once $base . 'handlers/class-service-area-schema.php';

    // 2. Schema manager (auto-discovers and instantiates all handlers above).
    require_once $base . 'class-schema-manager.php';
    new PDM_Schema_Manager();

    // 3. Author E-E-A-T module (shortcodes + front-end display; admin UI is
    //    loaded conditionally inside author-eeat.php).
    require_once $base . 'author-eeat/author-eeat.php';

    // 4. PDM Settings admin page (menus, settings fields and AJAX handlers).
    //    Admin-only: it registers no front-end hooks.
    if (pdm_blocks_is_admin_context()) {
        require_once $base . 'pdm-settings.php';
    }
}
