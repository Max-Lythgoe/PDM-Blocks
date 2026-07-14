<?php

/**
 * Button Icon Extension
 * Adds rich text icon insertion functionality to core button blocks.
 *
 * When the PDM Accelerate theme is also active, this plugin version takes priority.
 *
 * @package PDM_Blocks
 */

defined('ABSPATH') || exit;

/**
 * Unhook & override the theme's button icon extension class.
 * We instantiate AFTER init so we can remove the theme's hooks first.
 */
add_action('init', function () {
    // The theme registers Accelerate_Button_Icon_Extension via its constructor hooks.
    // We unhook those and replace them with our own.
    global $wp_filter;

    // Check if the theme class exists and remove its registration
    if (class_exists('Accelerate_Button_Icon_Extension')) {
        // Remove theme's enqueue action
        $theme_removed = remove_action('enqueue_block_editor_assets', array('Accelerate_Button_Icon_Extension', 'enqueue_block_editor_assets'));
        // Also try object-based removal
        foreach ($wp_filter['enqueue_block_editor_assets']->callbacks ?? array() as $priority => $hooks) {
            foreach ($hooks as $id => $hook) {
                if (is_array($hook['function']) && is_object($hook['function'][0]) && $hook['function'][0] instanceof Accelerate_Button_Icon_Extension) {
                    unset($wp_filter['enqueue_block_editor_assets']->callbacks[$priority][$id]);
                }
            }
        }
        foreach ($wp_filter['wp_enqueue_scripts']->callbacks ?? array() as $priority => $hooks) {
            foreach ($hooks as $id => $hook) {
                if (is_array($hook['function']) && $hook['function'][1] === 'enqueue_frontend_assets') {
                    unset($wp_filter['wp_enqueue_scripts']->callbacks[$priority][$id]);
                }
            }
        }
    }
}, 1);

/**
 * Enqueue the editor script for button icon extension.
 */
add_action('enqueue_block_editor_assets', 'pdm_blocks_button_icon_editor_assets', 20);
function pdm_blocks_button_icon_editor_assets()
{
    // Deregister theme's version (if already registered)
    wp_deregister_script('accelerate-button-icon-extension');

    $asset_file = plugin_dir_path(__FILE__) . '../../build/button-icon-extension.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'accelerate-button-icon-extension',
        plugin_dir_url(__FILE__) . '../../build/button-icon-extension.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
}

/**
 * Enqueue frontend CSS for icon display.
 */
add_action('wp_enqueue_scripts', 'pdm_blocks_button_icon_frontend_styles', 20);
function pdm_blocks_button_icon_frontend_styles()
{
    wp_add_inline_style('wp-block-library', '
        /* Icon styling - Frontend */
        .wp-rich-text-accelerate-icon {
            display: inline-block !important;
            line-height: 1 !important;
        }
        
        .wp-rich-text-accelerate-icon svg {
            display: inline-block !important;
            height: 1em !important;
            overflow: visible !important;
            width: auto !important;
            fill: currentColor;
            box-sizing: content-box !important;
        }
        
        /* Editor-specific styles */
        .editor-styles-wrapper .wp-rich-text-accelerate-icon,
        .block-editor .wp-rich-text-accelerate-icon {
            vertical-align: -0.125em !important;
            cursor: pointer;
        }
        
        .editor-styles-wrapper .wp-rich-text-accelerate-icon svg,
        .block-editor .wp-rich-text-accelerate-icon svg {
            vertical-align: -0.125em !important;
        }
        
        /* Button context specific */
        .wp-block-button__link .wp-rich-text-accelerate-icon {
            line-height: inherit !important;
        }
        
        .wp-block-button__link .wp-rich-text-accelerate-icon svg {
            height: 1em !important;
            width: auto !important;
            fill: currentColor;
        }
    ');
}
