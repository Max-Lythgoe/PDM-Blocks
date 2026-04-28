<?php

/**
 * Plugin Name:       PDM Blocks
 * Description:       A collection of essential PDM blocks.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.3.6
 * Author:            Performance Driven Marketing
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       pdm-blocks
 *
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

// Plugin Update Checker
require_once plugin_dir_path(__FILE__) . 'plugin-update-checker-5.6/plugin-update-checker-5.6/load-v5p6.php';
$pdm_blocks_update_checker = YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
    'https://github.com/Max-Lythgoe/PDM-Blocks/',
    __FILE__,
    'pdm-blocks'
);

// company info settings
require_once plugin_dir_path(__FILE__) . 'includes/company-info-settings.php';

// WordPress Abilities API integration for company info
require_once plugin_dir_path(__FILE__) . 'includes/company-info-abilities.php';

// paragraph company info extension
require_once plugin_dir_path(__FILE__) . 'includes/paragraph-company-info-extension.php';

// menu item image field
require_once plugin_dir_path(__FILE__) . 'includes/menu-item-image.php';

// tabs block helpers
require_once plugin_dir_path(__FILE__) . 'helpers.php';

add_action('init', 'pdm_blocks_register_blocks');
function pdm_blocks_register_blocks()
{
    $block_directories = glob(plugin_dir_path(__FILE__) . "build/*", GLOB_ONLYDIR);

    foreach ($block_directories as $block) {
        $index_php = $block . '/index.php';
        if (file_exists($index_php)) {
            require_once $index_php;
        } else {
            register_block_type($block);
        }
    }
}

// comapny data for blocks and shortcodes
add_action('enqueue_block_editor_assets', 'pdm_blocks_localize_company_data');
function pdm_blocks_localize_company_data()
{
    if (function_exists('pdm_blocks_get_company_locations')) {
        $locations = pdm_blocks_get_company_locations();

        wp_add_inline_script(
            'wp-block-editor',
            'window.pdmCompanyData = {
                locations: ' . json_encode($locations) . '
            };
            wp.domReady(function() {
                if (wp.data && wp.data.dispatch) {
                    wp.data.dispatch("core/block-editor").updateSettings({
                        companyData: window.pdmCompanyData
                    });
                }
            });',
            'after'
        );
    }
}

// remove default blocks we're replacing
function pdm_disallowed_block_types($allowed_blocks, $editor_context)
{
    $blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
    unset($blocks['core/columns'], $blocks['core/accordion'], $blocks['core/gallery'], $blocks['core/media-text'], $blocks['core/tabs']);
    return array_keys($blocks);
}
add_filter('allowed_block_types_all', 'pdm_disallowed_block_types', 10, 2);

// remove only youtube embed variation
add_action('enqueue_block_editor_assets', 'pdm_blocks_unregister_embed_variations');
function pdm_blocks_unregister_embed_variations()
{
    wp_add_inline_script(
        'wp-block-editor',
        'wp.domReady(function() {
            setTimeout(function() {
                if (wp.blocks && wp.blocks.unregisterBlockVariation) {
                    wp.blocks.unregisterBlockVariation("core/embed", "youtube");
                }
            }, 100);
        });',
        'after'
    );
}



// add pdm blocks category to top
function custom_block_category($categories, $post)
{
    return array_merge(
        array(
            array(
                'slug' => 'pdm-blocks',
                'title' => 'PDM Blocks',
            ),
        ),
        $categories
    );
}
add_filter('block_categories_all', 'custom_block_category', 10, 2);

// custom block styles 

function accelerate_block_styles()
{
    register_block_style(
        'core/heading',
        array(
            'name'         => 'line-after-title',
            'label'        => __('Line After Title', 'accelerate'),
            'inline_style' => "
				.is-style-line-after-title {
                    position: relative;
                }

                .is-style-line-after-title.is-highlighted::after {
                    position: relative!important;
                }

                .is-style-line-after-title.is-highlighted {
                    outline: 2px solid var(--wp-admin-theme-color)!important;
                }

                .is-style-line-after-title::after {
                    content: ' ';
                    display:block;
                    max-width: 300px;
                    width: 100%;
                    height: 5px;
                    background: var(--main);
                    border-radius: calc(var(--radius) / 3);
                    margin-top: 10px;
                }
                
                .has-text-align-center.is-style-line-after-title::after {
                    margin-inline: auto;
                }
                    
                .has-text-align-right.is-style-line-after-title::after {
                    margin-left: auto;
                }",
        )
    );
    register_block_style(
        'pdm/tabs',
        array(
            'name'  => 'pointing-tabs',
            'label' => __('Pointing Tabs', 'pdm-blocks'),
        )
    );
}

add_action('init', 'accelerate_block_styles');

// tabs editor assets
add_action('enqueue_block_editor_assets', 'pdm_tabs_enqueue_editor_assets');
function pdm_tabs_enqueue_editor_assets()
{
    wp_localize_script(
        'pdm-tabs-editor-script',
        'PdmTabsData',
        array(
            'assetsUrl' => plugin_dir_url(__FILE__) . 'assets',
        )
    );
}


// Allow SVG
add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {

    global $wp_version;
    if ($wp_version !== '4.7.1') {
        return $data;
    }

    $filetype = wp_check_filetype($filename, $mimes);

    return [
        'ext'             => $filetype['ext'],
        'type'            => $filetype['type'],
        'proper_filename' => $data['proper_filename']
    ];
}, 10, 4);

function cc_mime_types($mimes)
{
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

function fix_svg()
{
    echo '<style type="text/css">
        .attachment-266x266, .thumbnail img {
             width: 100% !important;
             height: auto !important;
        }
        </style>';
}
add_action('admin_head', 'fix_svg');

// Prevent WordPress from trying to create image sizes for SVGs
add_filter('wp_generate_attachment_metadata', function ($metadata, $attachment_id) {
    $mime = get_post_mime_type($attachment_id);
    if ($mime === 'image/svg+xml') {
        // Return empty array to skip image processing for SVGs
        return $metadata;
    }
    return $metadata;
}, 10, 2);

// Skip intermediate image sizes for SVGs
add_filter('intermediate_image_sizes_advanced', function ($sizes, $metadata) {
    $mime = get_post_mime_type();
    if ($mime === 'image/svg+xml') {
        return array();
    }
    return $sizes;
}, 10, 2);

// Enable classic menus support for the menu block
add_action('after_setup_theme', 'pdm_blocks_classic_menu_support');
function pdm_blocks_classic_menu_support()
{
    // Register menu locations if they don't exist
    if (!has_nav_menu('primary')) {
        register_nav_menus(array(
            'primary' => __('Primary Menu', 'pdm-blocks'),
        ));
    }

    // Ensure classic menus are enabled
    add_theme_support('menus');
}

/**
 * Replace featured image placeholders in rendered block content
 */
function pdm_blocks_render_featured_image($block_content, $block)
{
    // Only process if the block has the featured image placeholder
    if (strpos($block_content, 'data-use-featured-image="true"') === false) {
        return $block_content;
    }

    // Get the current post's featured image
    $post_id = get_the_ID();
    if (!$post_id) {
        return $block_content;
    }

    $featured_image_id = get_post_thumbnail_id($post_id);
    if (!$featured_image_id) {
        return $block_content;
    }

    $image_data = wp_get_attachment_image_src($featured_image_id, 'full');
    if (!$image_data) {
        return $block_content;
    }

    $image_url = $image_data[0];
    $alt = get_post_meta($featured_image_id, '_wp_attachment_image_alt', true);

    // Extract data attributes using regex
    preg_match('/data-opacity="([^"]*)"/', $block_content, $opacity_match);
    preg_match('/data-mix-blend-mode="([^"]*)"/', $block_content, $blend_match);
    preg_match('/data-image-fit="([^"]*)"/', $block_content, $fit_match);
    preg_match('/data-focal-x="([^"]*)"/', $block_content, $focal_x_match);
    preg_match('/data-focal-y="([^"]*)"/', $block_content, $focal_y_match);

    $opacity = isset($opacity_match[1]) ? floatval($opacity_match[1]) : 50;
    $mix_blend_mode = isset($blend_match[1]) ? esc_attr($blend_match[1]) : 'normal';
    $image_fit = isset($fit_match[1]) ? esc_attr($fit_match[1]) : 'cover';
    $focal_x = isset($focal_x_match[1]) ? floatval($focal_x_match[1]) : 50;
    $focal_y = isset($focal_y_match[1]) ? floatval($focal_y_match[1]) : 50;

    $object_position = $focal_x . '% ' . $focal_y . '%';
    $opacity_value = $opacity / 100;

    // Build the replacement HTML
    $replacement = sprintf(
        '<div class="section-background"><img src="%s" alt="%s" class="wp-image-%d" style="object-fit: %s; object-position: %s; opacity: %s; mix-blend-mode: %s;"/></div>',
        esc_url($image_url),
        esc_attr($alt),
        $featured_image_id,
        $image_fit,
        $object_position,
        $opacity_value,
        $mix_blend_mode
    );

    // Replace the entire section-background div
    $block_content = preg_replace(
        '/<div class="section-background"[^>]*data-use-featured-image="true"[^>]*>.*?<\/div>/s',
        $replacement,
        $block_content
    );

    // Add has-bg-image class to the outer div if not already present
    if (strpos($block_content, 'has-bg-image') === false) {
        $block_content = preg_replace(
            '/class="([^"]*)"/',
            'class="$1 has-bg-image"',
            $block_content,
            1
        );
    }

    return $block_content;
}
add_filter('render_block', 'pdm_blocks_render_featured_image', 10, 2);

// Remove core block patterns
add_action('init', function () {
    remove_theme_support('core-block-patterns');
}, 9);

// remove classic styles
add_filter('wp_enqueue_scripts', function () {
    wp_dequeue_style('classic-theme-styles');
}, 20);
