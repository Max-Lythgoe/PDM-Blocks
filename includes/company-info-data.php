<?php

/**
 * Company info data layer.
 *
 * Data getters, the Service Areas post type/taxonomies and the rewrite flush
 * must be available on every request (front end, REST, cron). The admin UI that
 * edits this data lives in company-info-settings.php and is only loaded in an
 * admin context.
 *
 * @package PDM_Blocks
 */

if (! defined('ABSPATH')) {
    exit;
}

function pdm_blocks_get_allowed_map_iframe_html()
{
    return array(
        'iframe' => array(
            'src'             => true,
            'width'           => true,
            'height'          => true,
            'frameborder'     => true,
            'style'           => true,
            'allowfullscreen' => true,
            'loading'         => true,
        ),
    );
}

function pdm_blocks_normalize_phone_number($phone)
{
    $phone = sanitize_text_field($phone);
    $digits = preg_replace('/\D+/', '', $phone);

    if (strlen($digits) === 11 && strpos($digits, '1') === 0) {
        $digits = substr($digits, 1);
    }

    if (strlen($digits) === 10) {
        return substr($digits, 0, 3) . '-' . substr($digits, 3, 3) . '-' . substr($digits, 6, 4);
    }

    return $phone;
}

function pdm_blocks_find_dynamic_legal_page($slug)
{
    $page = get_page_by_path($slug, OBJECT, 'page');

    if ($page instanceof WP_Post) {
        return $page;
    }

    return null;
}

// get options 
function pdm_blocks_get_company_info($key, $default = '')
{
    $options = get_option('pdm_blocks_company_info', array());

    if (isset($options[$key]) && ! empty($options[$key])) {
        $value = $options[$key];

        if (strpos($key, '_link') !== false) {
            return esc_url($value);
        } elseif ($key === 'company_email') {
            return sanitize_email($value);
        } elseif ($key === 'company_map_iframe') {
            return $value;
        }

        return esc_html($value);
    }

    return $default;
}

// get locations 
function pdm_blocks_get_company_locations()
{
    $options = get_option('pdm_blocks_company_info', array());
    if (isset($options['company_locations']) && is_array($options['company_locations'])) {
        return $options['company_locations'];
    }
    return array();
}

if (!function_exists('accelerate_get_company_locations')) {
    function accelerate_get_company_locations()
    {
        return pdm_blocks_get_company_locations();
    }
}

if (!function_exists('accelerate_get_company_info')) {
    function accelerate_get_company_info($key, $default = '')
    {
        return pdm_blocks_get_company_info($key, $default);
    }
}

// render locations reference
function pdm_blocks_display_company_locations()
{
    $locations = pdm_blocks_get_company_locations();
    if (empty($locations)) {
        return;
    }

    echo '<div class="pdm-blocks-company-locations">';
    foreach ($locations as $loc) {
        $address = isset($loc['address']) ? wp_kses_post(nl2br(esc_html($loc['address']))) : '';
        $phone_raw = isset($loc['phone']) ? esc_html($loc['phone']) : '';
        $phone_digits = $phone_raw ? preg_replace('/[^0-9+]/', '', $phone_raw) : '';
        $email = isset($loc['email']) ? sanitize_email($loc['email']) : '';
        $map = isset($loc['map']) ? $loc['map'] : '';

        echo '<div class="pdm-blocks-location">';
        if ($address) {
            echo '<div class="pdm-blocks-location-address">' . $address . '</div>';
        }
        if ($phone_raw && $phone_digits) {
            echo '<div class="pdm-blocks-location-phone"><a href="tel:' . esc_attr($phone_digits) . '">' . $phone_raw . '</a></div>';
        } elseif ($phone_raw) {
            echo '<div class="pdm-blocks-location-phone">' . $phone_raw . '</div>';
        }
        if ($email) {
            echo '<div class="pdm-blocks-location-email"><a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a></div>';
        }
        if ($map) {
            echo '<div class="pdm-blocks-location-map">' . $map . '</div>';
        }
        echo '</div>';
    }
    echo '</div>';
}

// service areas post type / taxonomies

// register post type 
function pdm_blocks_register_service_areas_post_type()
{
    $options = get_option('pdm_blocks_company_info');
    $enabled = isset($options['enable_service_areas']) && $options['enable_service_areas'];

    if (!$enabled) {
        return;
    }

    $icon_svg = 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="white" d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 403.4 320 592 320 592C320 592 128 403.4 128 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>');

    register_post_type('service-areas', [
        'label' => 'Service Areas',
        'labels' => [
            'name' => 'Service Areas',
            'singular_name' => 'Service Area',
            'add_new' => 'Add New Service Area',
            'add_new_item' => 'Add New Service Area',
            'edit_item' => 'Edit Service Area',
            'new_item' => 'New Service Area',
            'view_item' => 'View Service Area',
            'search_items' => 'Search Service Areas',
            'not_found' => 'No Service Areas found',
            'not_found_in_trash' => 'No Service Areas found in trash',
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'has_archive' => true,
        'menu_icon' => $icon_svg,
        'menu_position' => 20,
        'template_lock' => false,
    ]);
}
add_action('init', 'pdm_blocks_register_service_areas_post_type');

// register cities 
function pdm_blocks_register_cities_taxonomy()
{
    $options = get_option('pdm_blocks_company_info');
    $enabled = isset($options['enable_service_areas']) && $options['enable_service_areas'];

    if (!$enabled) {
        return;
    }

    if (taxonomy_exists('city')) {
        register_taxonomy_for_object_type('city', 'service-areas');
        return;
    }

    $labels = [
        'name' => 'Cities',
        'singular_name' => 'City',
        'search_items' => 'Search Cities',
        'all_items' => 'All Cities',
        'edit_item' => 'Edit City',
        'update_item' => 'Update City',
        'add_new_item' => 'Add New City',
        'new_item_name' => 'New City Name',
        'menu_name' => 'Cities',
    ];

    $args = [
        'hierarchical' => false,
        'labels' => $labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'update_count_callback' => '_update_post_term_count',
        'query_var' => true,
        'rewrite' => ['slug' => 'city'],
        'show_in_rest' => true,
    ];

    register_taxonomy('city', ['recent-projects', 'service-areas'], $args);
}
add_action('init', 'pdm_blocks_register_cities_taxonomy');

// register counties 
function pdm_blocks_register_counties_taxonomy()
{
    $options = get_option('pdm_blocks_company_info');
    $enabled = isset($options['enable_service_areas']) && $options['enable_service_areas'];

    if (!$enabled) {
        return;
    }

    $labels = [
        'name' => 'County',
        'singular_name' => 'County',
        'search_items' => 'Search County',
        'all_items' => 'All County',
        'parent_item' => 'Parent County',
        'parent_item_colon' => 'Parent County:',
        'edit_item' => 'Edit County',
        'update_item' => 'Update County',
        'add_new_item' => 'Add New County',
        'new_item_name' => 'New County Name',
        'menu_name' => 'County',
    ];

    $args = [
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => ['slug' => 'county'],
        'show_in_rest' => true,
        'meta_box_cb' => 'pdm_blocks_county_radio_meta_box',
    ];

    register_taxonomy('county', ['service-areas'], $args);
}
add_action('init', 'pdm_blocks_register_counties_taxonomy');

// flush rewrite rules for links 
function pdm_blocks_flush_rewrite_on_save($old_value, $new_value)
{
    $old_enabled = isset($old_value['enable_service_areas']) && $old_value['enable_service_areas'];
    $new_enabled = isset($new_value['enable_service_areas']) && $new_value['enable_service_areas'];

    if ($old_enabled !== $new_enabled) {
        if ($new_enabled) {
            pdm_blocks_register_service_areas_post_type();
            pdm_blocks_register_cities_taxonomy();
            pdm_blocks_register_counties_taxonomy();
        }
        flush_rewrite_rules();
    }
}
add_action('update_option_pdm_blocks_company_info', 'pdm_blocks_flush_rewrite_on_save', 10, 2);
