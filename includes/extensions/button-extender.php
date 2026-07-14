<?php

/**
 * Button Phone Extender
 * Adds company phone link/text toggles and multi-location selection to the core/button block.
 *
 * When the PDM Accelerate theme is also active, this plugin version takes priority.
 *
 * @package PDM_Blocks
 */

defined('ABSPATH') || exit;

/**
 * 1. Unhook the theme's version (if active) so plugin takes priority.
 */
add_action('init', function () {
    if (function_exists('accelerate_enqueue_button_extender_script')) {
        remove_action('enqueue_block_editor_assets', 'accelerate_enqueue_button_extender_script');
    }
    if (function_exists('accelerate_modify_block_args')) {
        remove_filter('register_block_type_args', 'accelerate_modify_block_args', 10);
    }
    if (function_exists('accelerate_render_company_phone_button')) {
        remove_filter('render_block_core/button', 'accelerate_render_company_phone_button', 10);
    }
}, 1);

/**
 * 2. Enqueue the JavaScript file for extending the block in the editor.
 */
function pdm_blocks_enqueue_button_extender_script()
{
    if (!is_admin() && !is_singular()) {
        return;
    }

    // Deregister theme's version (if already registered)
    wp_deregister_script('accelerate-button-extender');

    $asset_file = plugin_dir_path(__FILE__) . '../../build/button-extender.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'accelerate-button-extender',
        plugin_dir_url(__FILE__) . '../../build/button-extender.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );

    // Build locations array (same variable name as theme)
    $locations = array();
    if (function_exists('pdm_blocks_get_company_locations')) {
        $raw_locations = pdm_blocks_get_company_locations();
        if (!empty($raw_locations) && is_array($raw_locations)) {
            foreach ($raw_locations as $i => $loc) {
                $phone_raw = isset($loc['phone']) ? $loc['phone'] : '';
                $phone_digits = $phone_raw ? preg_replace('/[^0-9+]/', '', $phone_raw) : '';

                $label = '';
                if (!empty($loc['name'])) {
                    $label = $loc['name'];
                } elseif (!empty($loc['address'])) {
                    $label = wp_trim_words(preg_replace('/\s+/', ' ', strip_tags($loc['address'])), 6, '');
                }
                if (empty($label)) {
                    $label = 'Location ' . ($i + 1);
                }

                $locations[] = array(
                    'index'     => (int) $i,
                    'phone'     => $phone_raw,
                    'phoneLink' => $phone_digits ? 'tel:' . $phone_digits : '',
                    'label'     => $label,
                );
            }
        }
    }

    wp_localize_script('accelerate-button-extender', 'accelerateButtonData', array(
        'locations' => $locations,
    ));
}
add_action('enqueue_block_editor_assets', 'pdm_blocks_enqueue_button_extender_script', 20);

/**
 * 3. Use register_block_type_args filter to add attributes to core/button block.
 */
add_filter('register_block_type_args', 'pdm_blocks_modify_button_args', 10, 2);
function pdm_blocks_modify_button_args($args, $block_type)
{
    if ('core/button' === $block_type) {
        $args['attributes']['accelerateIsPhoneLink'] = array(
            'type'    => 'boolean',
            'default' => false,
        );
        $args['attributes']['accelerateIsPhoneText'] = array(
            'type'    => 'boolean',
            'default' => false,
        );
        $args['attributes']['acceleratePhoneLocation'] = array(
            'type'    => 'number',
            'default' => 0,
        );
    }
    return $args;
}

/**
 * 4. Enhance the render callback for the core/button block on frontend.
 */
add_filter('render_block_core/button', 'pdm_blocks_render_company_phone_button', 10, 2);
function pdm_blocks_render_company_phone_button($block_content, $block)
{
    $attrs = $block['attrs'];
    $is_phone_link = $attrs['accelerateIsPhoneLink'] ?? false;
    $is_phone_text = $attrs['accelerateIsPhoneText'] ?? false;
    $selected_index = isset($attrs['acceleratePhoneLocation']) ? intval($attrs['acceleratePhoneLocation']) : 0;

    // Check if call conversion is enabled
    $call_conversion_enabled = false;
    if (function_exists('pdm_is_call_tracking_enabled') && pdm_is_call_tracking_enabled()) {
        $call_conversion_enabled = isset($attrs['enableCallConversion'])
            ? (bool) $attrs['enableCallConversion']
            : (function_exists('pdm_is_call_tracking_automatic') ? pdm_is_call_tracking_automatic() : false);
    }

    // Determine the selected phone/text
    $locations = function_exists('pdm_blocks_get_company_locations') ? pdm_blocks_get_company_locations() : array();
    $phone_link = '';
    $phone_text = '';

    if (!empty($locations) && is_array($locations)) {
        if (isset($locations[$selected_index]) && !empty($locations[$selected_index]['phone'])) {
            $raw = $locations[$selected_index]['phone'];
            $phone_text = sanitize_text_field($raw);
            $digits = preg_replace('/[^0-9+]/', '', $raw);
            if ($digits) {
                $phone_link = 'tel:' . $digits;
            }
        } elseif (isset($locations[0]['phone'])) {
            $raw = $locations[0]['phone'];
            $phone_text = sanitize_text_field($raw);
            $digits = preg_replace('/[^0-9+]/', '', $raw);
            if ($digits) {
                $phone_link = 'tel:' . $digits;
            }
        }
    }

    if ($is_phone_link || $is_phone_text) {
        $link = $is_phone_link ? esc_url($phone_link) : ($attrs['href'] ?? '#');

        if (!empty($block_content)) {
            libxml_use_internal_errors(true);
            $dom = new DOMDocument();
            $dom->loadHTML('<?xml encoding="utf-8"?>' . $block_content);
            libxml_clear_errors();
            $xpath = new DOMXPath($dom);
            $a = $xpath->query('//a[contains(@class, "wp-block-button__link")]')->item(0);

            if ($a) {
                if ($a instanceof DOMElement) {
                    $a->setAttribute('href', $link);

                    if ($call_conversion_enabled && $is_phone_link && !empty($phone_link)) {
                        $onclick = "return gtag_report_conversion('" . esc_js($phone_link) . "');";
                        $a->setAttribute('onclick', $onclick);
                    }
                }

                if ($is_phone_text) {
                    $replaced = false;
                    foreach (iterator_to_array($a->childNodes) as $child) {
                        if ($child->nodeType === XML_TEXT_NODE && trim($child->nodeValue) !== '') {
                            $child->nodeValue = sanitize_text_field($phone_text);
                            $replaced = true;
                            break;
                        }
                    }
                    if (!$replaced) {
                        $a->appendChild($dom->createTextNode(sanitize_text_field($phone_text)));
                    }
                }

                $div = $xpath->query('//div[contains(@class, "wp-block-button")]')->item(0);
                if ($div) {
                    $block_content = $dom->saveHTML($div);
                } else {
                    $block_content = $dom->saveHTML($a);
                }
            } else {
                $text = $is_phone_text ? esc_html($phone_text) : strip_tags($block_content);
                $onclick_attr = ($call_conversion_enabled && $is_phone_link && !empty($phone_link))
                    ? ' onclick="return gtag_report_conversion(\'' . esc_js($phone_link) . '\');"'
                    : '';
                $block_content = '<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="' . $link . '"' . $onclick_attr . '>' . $text . '</a></div>';
            }
        }
    }

    return $block_content;
}
