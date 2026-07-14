<?php

/**
 * Company Info Paragraph Extension
 * Adds a Rich Text Format toolbar button to insert company info shortcodes into
 * paragraph, list item, and other rich text blocks at the cursor position.
 *
 * When the PDM Accelerate theme is also active, this plugin version takes priority.
 *
 * @package PDM_Blocks
 */

defined('ABSPATH') || exit;

/**
 * Enqueue the editor script for the company info extension.
 * Runs at a later priority (20) so it can unhook the theme's version first.
 */
function pdm_blocks_enqueue_company_info_extension()
{
    // Deregister theme's version (if already registered) so plugin takes priority
    wp_deregister_script('accelerate-company-info-extension');

    $asset_file = plugin_dir_path(__FILE__) . '../../build/company-info-extension.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    // Use same handle as theme so plugin replaces theme's version
    wp_enqueue_script(
        'accelerate-company-info-extension',
        plugin_dir_url(__FILE__) . '../../build/company-info-extension.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );

    // Localize company location data
    $locations = array();
    if (function_exists('pdm_blocks_get_company_locations')) {
        $raw_locations = pdm_blocks_get_company_locations();

        foreach ($raw_locations as $index => $location) {
            $locations[] = array(
                'name'    => isset($location['name']) ? $location['name'] : 'Location ' . ($index + 1),
                'phone'   => isset($location['phone']) ? $location['phone'] : '',
                'email'   => isset($location['email']) ? $location['email'] : '',
                'address' => isset($location['address']) ? $location['address'] : '',
            );
        }
    }

    wp_localize_script(
        'accelerate-company-info-extension',
        'accelerateCompanyLocations',
        $locations
    );
}
add_action('enqueue_block_editor_assets', 'pdm_blocks_enqueue_company_info_extension', 20);
