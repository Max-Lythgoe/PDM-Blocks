<?php

/**
 * Schema Engine Loader for PDM Blocks Plugin
 *
 * Loads the PDM Settings admin page and schema engine (FAQ, Article, Author E-E-A-T,
 * Service Area schemas) when the PDM Accelerate theme is NOT active.
 *
 * If the pdm-accelerate theme is active, it already provides this functionality and
 * this loader will do nothing to avoid duplication.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Maybe load the schema engine.
 *
 * Runs on `after_setup_theme` (priority 20) so the active theme's functions.php
 * has already been parsed. We bail out if the theme already registered the
 * PDM Settings page (function existence is the reliable signal).
 */
add_action('after_setup_theme', 'pdm_blocks_maybe_load_schema_engine', 20);

function pdm_blocks_maybe_load_schema_engine()
{
    // If the PDM Accelerate theme is active it already provides all of this.
    $theme = wp_get_theme();
    if (
        $theme->get_stylesheet() === 'pdm-accelerate' ||
        $theme->get_template()   === 'pdm-accelerate'
    ) {
        return;
    }

    // Belt-and-suspenders: if the settings page function is already defined
    // (e.g. a child theme re-uses the same code), skip as well.
    if (function_exists('pdm_add_settings_menu_page')) {
        return;
    }

    $base = plugin_dir_path(__FILE__);

    // 1. PDM Settings admin page (registers all settings / sections / fields).
    require_once $base . 'pdm-settings.php';

    // 2. Schema handlers.
    require_once $base . 'handlers/class-faq-schema.php';
    require_once $base . 'handlers/class-author-schema.php';
    require_once $base . 'handlers/class-article-schema.php';
    require_once $base . 'handlers/class-service-area-schema.php';

    // 3. Schema manager (auto-discovers and instantiates all handlers above).
    require_once $base . 'class-schema-manager.php';
    new PDM_Schema_Manager();

    // 4. Author E-E-A-T module (user fields, admin UI, shortcodes, front-end).
    require_once $base . 'author-eeat/author-eeat.php';
}
