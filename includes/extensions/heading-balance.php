<?php

/**
 * Heading Balance Extension
 * Adds text-wrap: balance toggle to core/heading blocks.
 *
 * When the PDM Accelerate theme is also active, this plugin version takes priority.
 *
 * @package PDM_Blocks
 */

defined('ABSPATH') || exit;

/**
 * Unhook the theme's version (if active) so plugin takes priority.
 */
add_action('init', function () {
    if (function_exists('accelerate_heading_balance_script')) {
        remove_action('enqueue_block_editor_assets', 'accelerate_heading_balance_script');
    }
    if (function_exists('accelerate_heading_balance_styles')) {
        remove_action('wp_enqueue_scripts', 'accelerate_heading_balance_styles');
        remove_action('enqueue_block_editor_assets', 'accelerate_heading_balance_styles');
    }
}, 1);

/**
 * Enqueue the editor script for heading balance.
 */
add_action('enqueue_block_editor_assets', 'pdm_blocks_heading_balance_script', 20);
function pdm_blocks_heading_balance_script()
{
    // Deregister theme's version (if already registered)
    wp_deregister_script('accelerate-heading-balance');

    $asset_file = plugin_dir_path(__FILE__) . '../../build/heading-balance.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'accelerate-heading-balance',
        plugin_dir_url(__FILE__) . '../../build/heading-balance.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
}

/**
 * Add CSS for text-balance on frontend and editor.
 */
add_action('wp_enqueue_scripts', 'pdm_blocks_heading_balance_styles', 20);
add_action('enqueue_block_editor_assets', 'pdm_blocks_heading_balance_styles', 20);
function pdm_blocks_heading_balance_styles()
{
    wp_add_inline_style('wp-block-library', '
        .has-text-balance {
            text-wrap: balance;
        }
    ');
}
