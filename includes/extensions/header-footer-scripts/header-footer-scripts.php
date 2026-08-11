<?php

/**
 * Custom Code - Header and Footer Scripts
 * 
 * Allows adding custom scripts to header and footer globally and per-page.
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define constants (plugin paths instead of theme paths)
define('PDM_HFS_PATH', plugin_dir_path(__FILE__));
define('PDM_HFS_URL', plugin_dir_url(__FILE__));

// Include required files
require_once PDM_HFS_PATH . 'includes/settings-page.php';
require_once PDM_HFS_PATH . 'includes/frontend-output.php';
require_once PDM_HFS_PATH . 'includes/meta-box.php';
require_once PDM_HFS_PATH . 'includes/snippet-manager.php';
require_once PDM_HFS_PATH . 'includes/snippets-tab.php';

/**
 * Unhook theme's version (if active) so plugin takes priority.
 */
add_action('init', function () {
    if (function_exists('hfs_add_settings_page')) {
        remove_action('admin_menu', 'hfs_add_settings_page');
    }
    if (function_exists('hfs_enqueue_admin_assets')) {
        remove_action('admin_enqueue_scripts', 'hfs_enqueue_admin_assets');
    }
    if (function_exists('hfs_enqueue_editor_assets')) {
        remove_action('enqueue_block_editor_assets', 'hfs_enqueue_editor_assets');
    }
    if (function_exists('hfs_output_header_scripts')) {
        remove_action('wp_head', 'hfs_output_header_scripts', 999);
    }
    if (function_exists('hfs_output_footer_scripts')) {
        remove_action('wp_footer', 'hfs_output_footer_scripts', 999);
    }
    if (function_exists('hfs_add_meta_boxes')) {
        remove_action('add_meta_boxes', 'hfs_add_meta_boxes');
    }
    if (function_exists('hfs_save_meta_box_data')) {
        remove_action('save_post', 'hfs_save_meta_box_data');
    }
}, 1);

// Initialize the module (priority 20 so unhooking runs first)
add_action('admin_menu', 'pdm_hfs_add_settings_page', 20);
add_action('admin_enqueue_scripts', 'pdm_hfs_enqueue_admin_assets', 20);
add_action('wp_head', 'pdm_hfs_output_header_scripts', 999);
add_action('wp_footer', 'pdm_hfs_output_footer_scripts', 999);
add_action('add_meta_boxes', 'pdm_hfs_add_meta_boxes', 20);
add_action('save_post', 'pdm_hfs_save_meta_box_data', 20);
add_action('after_setup_theme', 'pdm_hfs_execute_active_snippets', 1);

/**
 * AJAX handler for importing snippets.
 */
add_action('wp_ajax_pdm_hfs_import_snippets', 'pdm_hfs_ajax_import_snippets');

function pdm_hfs_ajax_import_snippets()
{
    check_ajax_referer('pdm_hfs_import_snippets', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'You do not have permission to import snippets.'));
    }

    $snippets_json = isset($_POST['snippets']) ? wp_unslash($_POST['snippets']) : '';
    $snippets = json_decode($snippets_json, true);

    if (!is_array($snippets) || empty($snippets)) {
        wp_send_json_error(array('message' => 'No valid snippets provided.'));
    }

    $imported = 0;
    foreach ($snippets as $snippet) {
        if (empty($snippet['name']) || empty($snippet['code'])) {
            continue;
        }

        $name = sanitize_text_field($snippet['name']);
        $code = $snippet['code']; // Raw PHP — will be eval'd, intentionally not sanitized as HTML
        $description = isset($snippet['description']) ? sanitize_text_field($snippet['description']) : '';
        $category = isset($snippet['category']) ? sanitize_text_field($snippet['category']) : 'General';

        $new_id = pdm_hfs_save_snippet('', $name, $code, $description, $category);
        if ($new_id) {
            // Auto-activate imported snippet
            pdm_hfs_toggle_snippet($new_id);
            $imported++;
        }
    }

    wp_send_json_success(array(
        'count' => $imported,
        'message' => sprintf('Successfully imported %d snippet(s).', $imported)
    ));
}

/**
 * AJAX handler for dismissing the "snippets disabled" admin notice.
 * Deletes the stored error so the notice won't reappear on page load.
 */
add_action('wp_ajax_pdm_hfs_dismiss_snippet_error', 'pdm_hfs_ajax_dismiss_snippet_error');

function pdm_hfs_ajax_dismiss_snippet_error()
{
    check_ajax_referer('pdm_hfs_dismiss_snippet_error', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error();
    }

    delete_option('hfs_snippet_errors');
    wp_send_json_success();
}

/**
 * Enqueue admin assets
 */
function pdm_hfs_enqueue_admin_assets($hook)
{
    if ('toplevel_page_custom-code' === $hook) {
        wp_enqueue_code_editor(array('type' => 'text/x-php'));
        wp_enqueue_script('wp-theme-plugin-editor');
        wp_enqueue_style('wp-codemirror');

        wp_enqueue_style(
            'pdm-hfs-admin-styles',
            PDM_HFS_URL . 'assets/admin-styles.css',
            array('wp-codemirror'),
            '1.0.0'
        );

        wp_enqueue_script(
            'pdm-hfs-admin-scripts',
            PDM_HFS_URL . 'assets/admin-scripts.js',
            array('jquery', 'wp-theme-plugin-editor', 'wp-codemirror'),
            '1.0.0',
            true
        );

        wp_localize_script('pdm-hfs-admin-scripts', 'hfsAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'importNonce' => wp_create_nonce('pdm_hfs_import_snippets'),
            'exportNonce' => wp_create_nonce('pdm_hfs_export_snippets')
        ));
    }

    if (in_array($hook, array('post.php', 'post-new.php'))) {
        wp_enqueue_style(
            'pdm-hfs-admin-styles',
            PDM_HFS_URL . 'assets/admin-styles.css',
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'pdm-hfs-admin-scripts',
            PDM_HFS_URL . 'assets/admin-scripts.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }
}
