<?php

require_once __DIR__ . '/templates/dynamic-legal-page-templates.php';

// COMPANY INFO SETTINGS PAGE
function pdm_blocks_add_company_info_menu_page()
{
    $icon_svg = 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="white" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 128C512 92.7 483.3 64 448 64L192 64zM304 416L336 416C353.7 416 368 430.3 368 448L368 528L272 528L272 448C272 430.3 286.3 416 304 416zM224 176C224 167.2 231.2 160 240 160L272 160C280.8 160 288 167.2 288 176L288 208C288 216.8 280.8 224 272 224L240 224C231.2 224 224 216.8 224 208L224 176zM368 160L400 160C408.8 160 416 167.2 416 176L416 208C416 216.8 408.8 224 400 224L368 224C359.2 224 352 216.8 352 208L352 176C352 167.2 359.2 160 368 160zM224 304C224 295.2 231.2 288 240 288L272 288C280.8 288 288 295.2 288 304L288 336C288 344.8 280.8 352 272 352L240 352C231.2 352 224 344.8 224 336L224 304zM368 288L400 288C408.8 288 416 295.2 416 304L416 336C416 344.8 408.8 352 400 352L368 352C359.2 352 352 344.8 352 336L352 304C352 295.2 359.2 288 368 288z"/></svg>');

    add_menu_page(
        'Company Info',
        'Company Info',
        'manage_options',
        'pdm-blocks-company-info',
        'pdm_blocks_company_info_page_content',
        $icon_svg,
        3
    );
}
add_action('admin_menu', 'pdm_blocks_add_company_info_menu_page');


// settings / fields
function pdm_blocks_company_info_settings_init()
{
    register_setting(
        'pdm_blocks_company_info_group',
        'pdm_blocks_company_info',
        'pdm_blocks_company_info_sanitize'
    );

    // general info 
    add_settings_section(
        'pdm_blocks_general_info_section',
        'General Contact Information',
        'pdm_blocks_general_info_section_callback',
        'pdm-blocks-company-info'
    );

    // repeater locations 
    add_settings_field(
        'company_locations',
        'Company Locations',
        'pdm_blocks_locations_input_callback',
        'pdm-blocks-company-info',
        'pdm_blocks_general_info_section',
        array('id' => 'company_locations', 'label' => 'Add one or more company locations (address, phone, email, map embed).')
    );

    // service areas toggle 
    add_settings_section(
        'pdm_blocks_service_areas_section',
        'Service Areas',
        'pdm_blocks_service_areas_section_callback',
        'pdm-blocks-company-info'
    );

    add_settings_field(
        'enable_service_areas',
        'Enable Service Areas',
        'pdm_blocks_checkbox_input_callback',
        'pdm-blocks-company-info',
        'pdm_blocks_service_areas_section',
        array('id' => 'enable_service_areas', 'label' => 'Enable a custom post type for Service Areas with Cities and Counties taxonomies.')
    );
}
add_action('admin_init', 'pdm_blocks_company_info_settings_init');


// settings page content
function pdm_blocks_company_info_page_content()
{
    if (! current_user_can('manage_options')) {
        return;
    }

    $options = get_option('pdm_blocks_company_info', array());
    $legal_page_definitions = pdm_blocks_get_dynamic_legal_page_definitions();
    $enable_privacy_policy_page      = ! empty($options['enable_privacy_policy_page']);
    $enable_terms_page               = ! empty($options['enable_terms_page']);
    $enable_accessibility_page       = ! empty($options['enable_accessibility_page']);
    $enable_anti_discrimination_page = ! empty($options['enable_anti_discrimination_page']);
    $enable_healthcare_disclaimer_page = ! empty($options['enable_healthcare_disclaimer_page']);
    $enable_hipaa_page               = ! empty($options['enable_hipaa_page']);
    $company_state = isset($options['company_state']) ? sanitize_text_field($options['company_state']) : '';

    $footer_pages = array(
        'enable_privacy_policy_page'        => array('definition_key' => 'privacy_policy',             'enabled' => $enable_privacy_policy_page,       'label' => 'Enable Privacy Policy Page'),
        'enable_terms_page'                 => array('definition_key' => 'terms_page',                 'enabled' => $enable_terms_page,                'label' => 'Enable Terms Page'),
        'enable_accessibility_page'         => array('definition_key' => 'accessibility_page',         'enabled' => $enable_accessibility_page,        'label' => 'Enable Accessibility Statement Page'),
        'enable_anti_discrimination_page'   => array('definition_key' => 'anti_discrimination_page',   'enabled' => $enable_anti_discrimination_page,  'label' => 'Enable Anti-Discrimination Disclaimer Page'),
        'enable_healthcare_disclaimer_page' => array('definition_key' => 'healthcare_disclaimer_page', 'enabled' => $enable_healthcare_disclaimer_page, 'label' => 'Enable Healthcare Disclaimer Page'),
        'enable_hipaa_page'                 => array('definition_key' => 'hipaa_page',                 'enabled' => $enable_hipaa_page,                'label' => 'Enable HIPAA Privacy Policy Page'),
    );
    foreach ($footer_pages as $key => $fp) {
        $found_page = pdm_blocks_find_dynamic_legal_page($legal_page_definitions[$fp['definition_key']]['slug']);
        $footer_pages[$key]['url'] = $found_page instanceof WP_Post ? get_permalink($found_page) : '';
    }
?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('pdm_blocks_company_info_group');

            echo '<div class="pdm-blocks-settings-section">';
            echo '<h2>General Contact Information</h2>';
            pdm_blocks_general_info_section_callback();
            echo '<div class="pdm-blocks-settings-field">';
            echo '<label for="pdm-blocks-locations-wrap"><strong>Company Locations</strong></label>';
            pdm_blocks_locations_input_callback(array(
                'id' => 'company_locations',
                'label' => 'Add one or more company locations (address, phone, email, map embed).',
            ));
            echo '</div>';
            echo '</div>';

            echo '<div class="pdm-blocks-settings-section" style="margin-top: 32px;">';
            echo '<h2>Service Areas</h2>';
            echo '<div class="pdm-blocks-settings-field" style="display: flex; align-items: flex-start; gap: 10px;">';
            pdm_blocks_checkbox_input_callback(array(
                'id' => 'enable_service_areas',
                'label' => '',
            ));
            echo '<div>';
            echo '<label for="enable_service_areas"><strong>Enable Service Areas</strong></label>';
            echo '<p class="description">Enable a custom post type for Service Areas with Cities and Counties taxonomies.</p>';
            echo '</div>';
            echo '</div>';
            echo '</div>';

            echo '<div class="pdm-blocks-settings-section" style="margin-top: 32px; max-width: 800px;">';
            echo '<h2>Legal Pages</h2>';

            $first_field = true;
            foreach ($footer_pages as $key => $fp) {
                $margin = $first_field ? '16px' : '12px';
                $first_field = false;
                echo '<div class="pdm-blocks-settings-field" style="margin-top: ' . $margin . ';">';
                echo '<label style="display: flex; align-items: flex-start; gap: 10px;">';
                echo '<input type="checkbox" id="' . esc_attr($key) . '" name="pdm_blocks_company_info[' . esc_attr($key) . ']" value="1" ' . checked($fp['enabled'], true, false) . '>';
                echo '<span><strong>' . esc_html($fp['label']) . '</strong></span>';
                echo '</label>';
                if ($fp['enabled'] && ! empty($fp['url'])) {
                    $page_title = $legal_page_definitions[$fp['definition_key']]['title'];
                    echo '<p style="margin: 8px 0 0 28px;"><a href="' . esc_url($fp['url']) . '" target="_blank" rel="noopener noreferrer">View ' . esc_html($page_title) . ' Page</a></p>';
                }
                echo '</div>';
            }

            echo '<div id="pdm-blocks-company-state-wrap" class="pdm-blocks-settings-field" style="margin-top: 16px;">';
            echo '<label for="company_state"><strong>Company State</strong></label><br>';
            echo '<input type="text" id="company_state" name="pdm_blocks_company_info[company_state]" value="' . esc_attr($company_state) . '" class="regular-text" placeholder="UT" style="max-width: 240px;">';
            echo '</div>';

            echo '</div>';

            submit_button('Save Company Info');
            ?>
        </form>
    </div>
    <script>
        jQuery(function($) {
            var legalPageToggles = $('#enable_privacy_policy_page, #enable_terms_page, #enable_accessibility_page, #enable_anti_discrimination_page, #enable_healthcare_disclaimer_page, #enable_hipaa_page');
            var stateWrap = $('#pdm-blocks-company-state-wrap');

            function toggleCompanyStateField() {
                var shouldShow = legalPageToggles.is(':checked');
                stateWrap.toggle(shouldShow);
            }

            legalPageToggles.on('change', toggleCompanyStateField);
            toggleCompanyStateField();
        });
    </script>
<?php
}


function pdm_blocks_general_info_section_callback()
{
    echo '<p>Enter your primary contact information and location details.</p>';
}

function pdm_blocks_service_areas_section_callback() {}

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

function pdm_blocks_get_admin_field_icon($icon)
{
    $icons = array(
        'location_name' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 1.5em; height: 1.5em; display: block;"><path fill="currentColor" d="M541.9 139.5C546.4 127.7 543.6 114.3 534.7 105.4C525.8 96.5 512.4 93.6 500.6 98.2L84.6 258.2C71.9 263 63.7 275.2 64 288.7C64.3 302.2 73.1 314.1 85.9 318.3L262.7 377.2L321.6 554C325.9 566.8 337.7 575.6 351.2 575.9C364.7 576.2 376.9 568 381.8 555.4L541.8 139.4z"/></svg>',
        'address' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 1.5em; height: 1.5em; display: block;"><path fill="currentColor" d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/></svg>',
        'phone' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 1.5em; height: 1.5em; display: block;"><path fill="currentColor" d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z"/></svg>',
        'email' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 1.5em; height: 1.5em; display: block;"><path fill="currentColor" d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/></svg>',
        'map' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 1.5em; height: 1.5em; display: block;"><path fill="currentColor" d="M576 112C576 100.9 570.3 90.6 560.8 84.8C551.3 79 539.6 78.4 529.7 83.4L413.5 141.5L234.1 81.6C226 78.9 217.3 79.5 209.7 83.3L81.7 147.3C70.8 152.8 64 163.9 64 176L64 528C64 539.1 69.7 549.4 79.2 555.2C88.7 561 100.4 561.6 110.3 556.6L226.4 498.5L405.8 558.3C413.9 561 422.6 560.4 430.2 556.6L558.2 492.6C569 487.2 575.9 476.1 575.9 464L575.9 112zM256 440.9L256 156.4L384 199.1L384 483.6L256 440.9z"/></svg>',
        'hours' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" style="width: 1.5em; height: 1.5em; display: block;"><path fill="currentColor" d="M320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>',
    );

    if (! isset($icons[$icon])) {
        return '';
    }

    return '<span aria-hidden="true" style="display: inline-flex; width: 1.5em; height: 1.5em; align-items: center; justify-content: center; flex-shrink: 0;">' . $icons[$icon] . '</span>';
}
function pdm_blocks_find_dynamic_legal_page($slug)
{
    $page = get_page_by_path($slug, OBJECT, 'page');

    if ($page instanceof WP_Post) {
        return $page;
    }

    return null;
}

function pdm_blocks_upsert_dynamic_legal_page($page_type, $definition)
{
    $existing_page = pdm_blocks_find_dynamic_legal_page($definition['slug']);

    $post_data = array(
        'post_type' => 'page',
        'post_title' => $definition['title'],
        'post_name' => $definition['slug'],
        'post_content' => $definition['content'],
        'post_status' => 'publish',
    );

    if ($existing_page instanceof WP_Post) {
        $post_data['ID'] = $existing_page->ID;
        $page_id = wp_update_post($post_data, true);
    } else {
        $page_id = wp_insert_post($post_data, true);
    }

    if (is_wp_error($page_id) || ! $page_id) {
        return 0;
    }

    update_post_meta($page_id, '_pdm_blocks_dynamic_legal_page', $page_type);

    return (int) $page_id;
}

function pdm_blocks_disable_dynamic_legal_page($page_type, $slug)
{
    $page = pdm_blocks_find_dynamic_legal_page($slug);

    if (! ($page instanceof WP_Post)) {
        return;
    }

    if (get_post_meta($page->ID, '_pdm_blocks_dynamic_legal_page', true) !== $page_type) {
        return;
    }

    wp_update_post(array(
        'ID' => $page->ID,
        'post_status' => 'draft',
    ));
}

function pdm_blocks_sync_dynamic_legal_pages($old_value, $new_value)
{
    $definitions = pdm_blocks_get_dynamic_legal_page_definitions();

    // Page type key → option key that enables it.
    $page_option_map = array(
        'privacy_policy'            => 'enable_privacy_policy_page',
        'terms_page'                => 'enable_terms_page',
        'accessibility_page'        => 'enable_accessibility_page',
        'anti_discrimination_page'  => 'enable_anti_discrimination_page',
        'healthcare_disclaimer_page' => 'enable_healthcare_disclaimer_page',
        'hipaa_page'                => 'enable_hipaa_page',
    );

    foreach ($page_option_map as $page_type => $option_key) {
        $enabled = ! empty($new_value[$option_key]);
        $definition = $definitions[$page_type];

        if ($enabled) {
            $page_id = pdm_blocks_upsert_dynamic_legal_page($page_type, $definition);
            // Set WordPress privacy page option for the privacy policy page.
            if ($page_type === 'privacy_policy' && $page_id) {
                update_option('wp_page_for_privacy_policy', $page_id);
            }
        } else {
            // Clear the WordPress privacy page option if it points to this page.
            if ($page_type === 'privacy_policy') {
                $privacy_page = pdm_blocks_find_dynamic_legal_page($definition['slug']);
                if ($privacy_page instanceof WP_Post && (int) get_option('wp_page_for_privacy_policy') === (int) $privacy_page->ID) {
                    update_option('wp_page_for_privacy_policy', 0);
                }
            }
            pdm_blocks_disable_dynamic_legal_page($page_type, $definition['slug']);
        }
    }
}

// default field
function pdm_blocks_text_input_callback($args)
{
    $options = get_option('pdm_blocks_company_info');
    $value = isset($options[$args['id']]) ? sanitize_text_field($options[$args['id']]) : '';

    $name_attr = 'pdm_blocks_company_info[' . esc_attr($args['id']) . ']';

    echo '<input type="text" id="' . esc_attr($args['id']) . '" name="' . $name_attr . '" value="' . esc_attr($value) . '" class="regular-text">';
    if (! empty($args['label'])) {
        echo '<p class="description">' . esc_html($args['label']) . '</p>';
    }
}

// default textarea for map 
function pdm_blocks_textarea_input_callback($args)
{
    $options = get_option('pdm_blocks_company_info');
    // Note: We don't sanitize here, as it will be done in the sanitize callback.
    $value = isset($options[$args['id']]) ? $options[$args['id']] : '';

    $name_attr = 'pdm_blocks_company_info[' . esc_attr($args['id']) . ']';

    // For display in the admin, we use esc_textarea for security
    echo '<textarea id="' . esc_attr($args['id']) . '" name="' . $name_attr . '" rows="5" cols="50" class="large-text">' . esc_textarea($value) . '</textarea>';
    if (! empty($args['label'])) {
        echo '<p class="description">' . esc_html($args['label']) . '</p>';
    }
}

// default checkbox
function pdm_blocks_checkbox_input_callback($args)
{
    $options = get_option('pdm_blocks_company_info');
    $checked = isset($options[$args['id']]) && $options[$args['id']] ? 'checked' : '';

    $name_attr = 'pdm_blocks_company_info[' . esc_attr($args['id']) . ']';

    echo '<input type="checkbox" id="' . esc_attr($args['id']) . '" name="' . $name_attr . '" value="1" ' . $checked . '>';
    if (! empty($args['label'])) {
        echo '<p class="description">' . esc_html($args['label']) . '</p>';
    }
}


// sanitize options on save
function pdm_blocks_company_info_sanitize($input)
{
    $sanitized_input = array();

    $sanitized_input['enable_service_areas']             = ! empty($input['enable_service_areas']) ? 1 : 0;
    $sanitized_input['enable_privacy_policy_page']       = ! empty($input['enable_privacy_policy_page']) ? 1 : 0;
    $sanitized_input['enable_terms_page']                = ! empty($input['enable_terms_page']) ? 1 : 0;
    $sanitized_input['enable_accessibility_page']        = ! empty($input['enable_accessibility_page']) ? 1 : 0;
    $sanitized_input['enable_anti_discrimination_page']  = ! empty($input['enable_anti_discrimination_page']) ? 1 : 0;
    $sanitized_input['enable_healthcare_disclaimer_page'] = ! empty($input['enable_healthcare_disclaimer_page']) ? 1 : 0;
    $sanitized_input['enable_hipaa_page']                = ! empty($input['enable_hipaa_page']) ? 1 : 0;
    $sanitized_input['company_state'] = isset($input['company_state']) ? sanitize_text_field($input['company_state']) : '';

    if (isset($input['company_locations']) && is_array($input['company_locations'])) {
        $sanitized_input['company_locations'] = array();
        foreach ($input['company_locations'] as $loc) {
            if (! is_array($loc)) {
                continue;
            }
            $san = array();
            $san['name']    = isset($loc['name']) ? sanitize_text_field($loc['name']) : '';
            $san['address'] = isset($loc['address']) ? sanitize_textarea_field($loc['address']) : '';
            $san['phone']   = isset($loc['phone']) ? pdm_blocks_normalize_phone_number($loc['phone']) : '';
            $san['email']   = isset($loc['email']) ? sanitize_email($loc['email']) : '';

            if (isset($loc['hours']) && is_array($loc['hours'])) {
                $san['hours'] = array();
                foreach ($loc['hours'] as $hour_row) {
                    if (is_array($hour_row) && (!empty($hour_row['label']) || !empty($hour_row['hours']))) {
                        $san['hours'][] = array(
                            'label' => isset($hour_row['label']) ? sanitize_text_field($hour_row['label']) : '',
                            'hours' => isset($hour_row['hours']) ? sanitize_text_field($hour_row['hours']) : ''
                        );
                    }
                }
            } else {
                $san['hours'] = array();
            }

            // allow iframe stuff
            if (isset($loc['map'])) {
                $san['map'] = wp_kses($loc['map'], pdm_blocks_get_allowed_map_iframe_html());
            } else {
                $san['map'] = '';
            }
            $sanitized_input['company_locations'][] = $san;
        }
    }

    // require one row
    if (! isset($sanitized_input['company_locations']) || ! is_array($sanitized_input['company_locations']) || empty($sanitized_input['company_locations'])) {
        $sanitized_input['company_locations'] = array(
            array(
                'name'    => '',
                'address' => '',
                'phone'   => '',
                'email'   => '',
                'map'     => '',
                'hours'   => array(),
            ),
        );
    }

    return $sanitized_input;
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

// repeater input 
function pdm_blocks_locations_input_callback($args)
{
    $options = get_option('pdm_blocks_company_info');
    $locations = isset($options['company_locations']) && is_array($options['company_locations']) ? $options['company_locations'] : array();

    $index = 0;

    echo '<div id="pdm-blocks-locations-wrap" style="max-width: 800px;">';
    if (empty($locations)) {
        $locations[] = array('address' => '', 'phone' => '', 'email' => '', 'map' => '', 'hours' => array());
    }

    foreach ($locations as $i => $loc) {
        $addr = isset($loc['address']) ? esc_textarea($loc['address']) : '';
        $phone = isset($loc['phone']) ? esc_attr($loc['phone']) : '';
        $email = isset($loc['email']) ? esc_attr($loc['email']) : '';
        $map = isset($loc['map']) ? $loc['map'] : '';
        $map_preview = $map ? wp_kses($map, pdm_blocks_get_allowed_map_iframe_html()) : '';

        $hours = isset($loc['hours']) && is_array($loc['hours']) ? $loc['hours'] : array();
        $days = array('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

        $name = isset($loc['name']) ? esc_attr($loc['name']) : '';
        $location_display = $name ? $name : 'Location ' . ($i + 1);

        echo '<div class="pdm-blocks-location-row" data-index="' . esc_attr($i) . '" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; background: #f9f9f9;">';
        echo '<h3 style="position: sticky; top: 32px; z-index: 5; margin: -15px -15px 16px; padding: 12px 15px; background: var(--wp-admin-theme-color, #2271b1); color: #fff; border-bottom: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);">' . esc_html($location_display) . '</h3>';
        echo '<div class="pdm-blocks-location-core-fields" style="display: grid; gap: 12px; margin-bottom: 20px;">';
        echo '<div><label><span style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 6px;">' . pdm_blocks_get_admin_field_icon('location_name') . '<span>Location Name (optional):</span></span><br><input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][name]" value="' . $name . '" class="regular-text" placeholder="Location ' . ($i + 1) . '" style="width: 100%; max-width: none;" /></label></div>';
        echo '<div><label><span style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 6px;">' . pdm_blocks_get_admin_field_icon('address') . '<span>Address:</span></span><br><textarea name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][address]" rows="3" cols="50" style="width: 100%; max-width: none;">' . $addr . '</textarea></label></div>';
        echo '<div><label><span style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 6px;">' . pdm_blocks_get_admin_field_icon('phone') . '<span>Phone:</span></span><br><input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][phone]" value="' . $phone . '" class="regular-text" style="width: 100%; max-width: none;" /></label></div>';
        echo '<div><label><span style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 6px;">' . pdm_blocks_get_admin_field_icon('email') . '<span>Email:</span></span><br><input type="email" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][email]" value="' . $email . '" class="regular-text" style="width: 100%; max-width: none;" /></label></div>';
        echo '<div>';
        echo '<label><span style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 6px;">' . pdm_blocks_get_admin_field_icon('map') . '<span>Map Embed (iframe):</span></span></label>';
        echo '<div class="pdm-blocks-map-row" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch;">';
        echo '<div style="flex: 1 1 320px; min-width: 280px;">';
        echo '<textarea class="pdm-blocks-map-input" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][map]" rows="6" cols="50" style="width: 100%; max-width: none;">' . esc_textarea($map) . '</textarea>';
        echo '</div>';
        echo '<div style="flex: 1 1 320px; min-width: 280px; display: flex;">';
        echo '<div class="pdm-blocks-map-preview" style="border: 1px solid #ccd0d4; background: #fff; min-height: 180px; padding: 8px; box-sizing: border-box; width: 100%; display: flex;">';
        if ($map_preview) {
            echo $map_preview;
        } else {
            echo '<p class="description" style="margin: 0; align-self: center;">Paste an iframe to preview the map here.</p>';
        }
        echo '</div>';
        echo '</div>';
        echo '</div>';
        echo '</div>';
        echo '</div>';

        echo '<h4 style="margin-top: 20px; display: inline-flex; align-items: center; gap: 8px;">' . pdm_blocks_get_admin_field_icon('hours') . '<span>Business Hours</span></h4>';
        echo '<p class="description">Add custom hour rows (e.g., "M-F", "Sat-Sun", or specific days). Enter hours in any format you like. <button type="button" class="button-link pdm-autopopulate-hours" data-location-index="' . esc_attr($i) . '">Autopopulate</button></p>';
        echo '<div class="pdm-hours-repeater" data-location-index="' . esc_attr($i) . '" style="margin-bottom: 15px;">';

        if (empty($hours)) {
            $hours = array(array('label' => '', 'hours' => ''));
        }

        foreach ($hours as $h_index => $hour_row) {
            $hour_label = isset($hour_row['label']) ? esc_attr($hour_row['label']) : '';
            $hour_hours = isset($hour_row['hours']) ? esc_attr($hour_row['hours']) : '';

            echo '<div class="pdm-hour-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">';
            echo '<input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][hours][' . esc_attr($h_index) . '][label]" value="' . $hour_label . '" class="regular-text" placeholder="M-F" style="flex: 0 0 150px;" />';
            echo '<input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][hours][' . esc_attr($h_index) . '][hours]" value="' . $hour_hours . '" class="regular-text" placeholder="9:00 AM - 5:00 PM" style="flex: 1;" />';
            echo '<button type="button" class="button pdm-remove-hour-row" style="color: #b32d2e; border-color: #d63638;">Remove</button>';
            echo '</div>';
        }

        echo '</div>';
        echo '<p><button type="button" class="button pdm-add-hour-row" data-location-index="' . esc_attr($i) . '">Add Hours Row</button></p>';

        echo '<p><button type="button" class="button pdm-blocks-remove-location" style="color: #b32d2e; border-color: #d63638;">Remove Location</button></p>';
        echo '</div>';
    }
?>
    </div>
    <p><button type="button" class="button" id="pdm-blocks-add-location">Add Location</button></p>
    <script>
        jQuery(document).ready(function($) {
            var wrap = $('#pdm-blocks-locations-wrap');
            var addBtn = $('#pdm-blocks-add-location');
            if (!wrap.length || !addBtn.length) return;

            function getMapPreviewPlaceholder() {
                return '<p class="description" style="margin: 0;">Paste an iframe to preview the map here.</p>';
            }

            function updateMapPreview(row) {
                var mapInput = row.find('.pdm-blocks-map-input').first();
                var mapPreview = row.find('.pdm-blocks-map-preview').first();

                if (!mapInput.length || !mapPreview.length) {
                    return;
                }

                var mapValue = $.trim(mapInput.val());
                mapPreview.html(mapValue ? mapValue : getMapPreviewPlaceholder());

                var iframe = mapPreview.find('iframe').first();
                if (iframe.length) {
                    iframe.attr('width', '100%');
                    iframe.attr('height', '100%');
                    iframe.css({
                        width: '100%',
                        height: '100%',
                        minHeight: '180px',
                        display: 'block',
                        border: '0'
                    });
                }
            }

            function getDefaultHoursRowsHtml(locationIndex) {
                var defaultHours = [{
                        label: 'Monday',
                        hours: '9:00 AM - 5:00 PM'
                    },
                    {
                        label: 'Tuesday',
                        hours: '9:00 AM - 5:00 PM'
                    },
                    {
                        label: 'Wednesday',
                        hours: '9:00 AM - 5:00 PM'
                    },
                    {
                        label: 'Thursday',
                        hours: '9:00 AM - 5:00 PM'
                    },
                    {
                        label: 'Friday',
                        hours: '9:00 AM - 5:00 PM'
                    },
                    {
                        label: 'Saturday',
                        hours: 'Closed'
                    },
                    {
                        label: 'Sunday',
                        hours: 'Closed'
                    }
                ];

                return $.map(defaultHours, function(hourRow, rowIndex) {
                    return '<div class="pdm-hour-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">' +
                        '<input type="text" name="pdm_blocks_company_info[company_locations][' + locationIndex + '][hours][' + rowIndex + '][label]" value="' + hourRow.label + '" class="regular-text" placeholder="M-F" style="flex: 0 0 150px;" />' +
                        '<input type="text" name="pdm_blocks_company_info[company_locations][' + locationIndex + '][hours][' + rowIndex + '][hours]" value="' + hourRow.hours + '" class="regular-text" placeholder="9:00 AM - 5:00 PM" style="flex: 1;" />' +
                        '<button type="button" class="button pdm-remove-hour-row" style="color: #b32d2e; border-color: #d63638;">Remove</button>' +
                        '</div>';
                }).join('');
            }

            // number locations
            function renumberLocations() {
                wrap.find('.pdm-blocks-location-row').each(function(index) {
                    var row = $(this);
                    var oldIndex = row.data('index');

                    row.attr('data-index', index);

                    // update name
                    var nameInput = row.find('input[name*="[name]"]').first();
                    var customName = nameInput.val();
                    var heading = row.find('h3').first();
                    if (customName) {
                        heading.text(customName);
                    } else {
                        heading.text('Location ' + (index + 1));
                    }

                    row.find('textarea, input').each(function() {
                        var el = $(this);
                        var name = el.attr('name');
                        if (name) {
                            el.attr('name', name.replace(/\[company_locations\]\[\d+\]/, '[company_locations][' + index + ']'));
                        }
                    });

                    var hoursRepeater = row.find('.pdm-hours-repeater');
                    if (hoursRepeater.length) {
                        hoursRepeater.attr('data-location-index', index);
                    }

                    var addHourBtn = row.find('.pdm-add-hour-row');
                    if (addHourBtn.length) {
                        addHourBtn.attr('data-location-index', index);
                    }

                    var autopopulateBtn = row.find('.pdm-autopopulate-hours');
                    if (autopopulateBtn.length) {
                        autopopulateBtn.attr('data-location-index', index);
                    }

                    updateMapPreview(row);
                });
            }

            wrap.on('input change', '.pdm-blocks-map-input', function() {
                updateMapPreview($(this).closest('.pdm-blocks-location-row'));
            });

            wrap.on('click', '.pdm-blocks-remove-location', function(e) {
                e.preventDefault();
                var rows = wrap.find('.pdm-blocks-location-row');
                if (rows.length <= 1) {
                    alert('At least one location is required.');
                    return;
                }
                $(this).closest('.pdm-blocks-location-row').remove();
                renumberLocations();
            });

            // Add hour row button
            wrap.on('click', '.pdm-add-hour-row', function(e) {
                e.preventDefault();
                var btn = $(this);
                var locationIndex = btn.data('location-index');
                var repeater = btn.parent().prev('.pdm-hours-repeater');
                var hourRows = repeater.find('.pdm-hour-row');
                var newIndex = hourRows.length;

                var newRow = $('<div class="pdm-hour-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;"></div>');
                newRow.html(
                    '<input type="text" name="pdm_blocks_company_info[company_locations][' + locationIndex + '][hours][' + newIndex + '][label]" value="" class="regular-text" placeholder="M-F" style="flex: 0 0 150px;" />' +
                    '<input type="text" name="pdm_blocks_company_info[company_locations][' + locationIndex + '][hours][' + newIndex + '][hours]" value="" class="regular-text" placeholder="9:00 AM - 5:00 PM" style="flex: 1;" />' +
                    '<button type="button" class="button pdm-remove-hour-row" style="color: #b32d2e; border-color: #d63638;">Remove</button>'
                );

                repeater.append(newRow);
            });

            wrap.on('click', '.pdm-autopopulate-hours', function(e) {
                e.preventDefault();
                var btn = $(this);
                var locationIndex = btn.data('location-index');
                var row = btn.closest('.pdm-blocks-location-row');
                var repeater = row.find('.pdm-hours-repeater').first();

                if (!repeater.length) {
                    return;
                }

                repeater.html(getDefaultHoursRowsHtml(locationIndex));
            });

            // Remove hour row button
            wrap.on('click', '.pdm-remove-hour-row', function(e) {
                e.preventDefault();
                var row = $(this).closest('.pdm-hour-row');
                var repeater = row.parent();
                var rows = repeater.find('.pdm-hour-row');

                if (rows.length <= 1) {
                    alert('At least one hour row is required.');
                    return;
                }

                row.remove();
            });

            // Add location button
            addBtn.on('click', function(e) {
                e.preventDefault();
                var rows = wrap.find('.pdm-blocks-location-row');
                var index = rows.length;

                var template = rows.first().clone();

                template.find('textarea, input').each(function() {
                    var el = $(this);
                    var name = el.attr('name');
                    if (name) {
                        el.attr('name', name.replace(/\[company_locations\]\[\d+\]/, '[company_locations][' + index + ']'));
                    }
                    if (el.is('textarea')) {
                        el.val('');
                    } else if (el.attr('type') !== 'button') {
                        el.val('');
                    }
                });

                var hoursRepeater = template.find('.pdm-hours-repeater');
                if (hoursRepeater.length) {
                    hoursRepeater.attr('data-location-index', index);
                    hoursRepeater.html(
                        '<div class="pdm-hour-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">' +
                        '<input type="text" name="pdm_blocks_company_info[company_locations][' + index + '][hours][0][label]" value="" class="regular-text" placeholder="M-F" style="flex: 0 0 150px;" />' +
                        '<input type="text" name="pdm_blocks_company_info[company_locations][' + index + '][hours][0][hours]" value="" class="regular-text" placeholder="9:00 AM - 5:00 PM" style="flex: 1;" />' +
                        '<button type="button" class="button pdm-remove-hour-row" style="color: #b32d2e; border-color: #d63638;">Remove</button>' +
                        '</div>'
                    );
                }

                // Update add hour button
                var addHourBtn = template.find('.pdm-add-hour-row');
                if (addHourBtn.length) {
                    addHourBtn.attr('data-location-index', index);
                }

                var autopopulateBtn = template.find('.pdm-autopopulate-hours');
                if (autopopulateBtn.length) {
                    autopopulateBtn.attr('data-location-index', index);
                }

                // Update the location name heading
                var heading = template.find('h3');
                if (heading.length) {
                    heading.text('Location ' + (index + 1));
                }

                template.find('.pdm-blocks-map-preview').html(getMapPreviewPlaceholder());

                wrap.append(template);
                renumberLocations();
            });

            wrap.find('.pdm-blocks-location-row').each(function() {
                updateMapPreview($(this));
            });
        });
    </script>
<?php
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

// metabox 
function pdm_blocks_county_radio_meta_box($post, $box)
{
    $taxonomy = $box['args']['taxonomy'];
    $terms = get_terms([
        'taxonomy' => $taxonomy,
        'hide_empty' => false,
    ]);

    $current = wp_get_object_terms($post->ID, $taxonomy, ['fields' => 'ids']);
    $current_id = !empty($current) ? $current[0] : 0;

    echo '<div id="taxonomy-' . esc_attr($taxonomy) . '" class="categorydiv">';
    echo '<input type="hidden" name="tax_input[' . esc_attr($taxonomy) . '][]" value="0" />';
    echo '<ul>';
    echo '<li><label><input type="radio" name="tax_input[' . esc_attr($taxonomy) . '][]" value="" ' . checked($current_id, 0, false) . '> None</label></li>';

    foreach ($terms as $term) {
        echo '<li><label>';
        echo '<input type="radio" name="tax_input[' . esc_attr($taxonomy) . '][]" value="' . esc_attr($term->term_id) . '" ' . checked($current_id, $term->term_id, false) . '> ';
        echo esc_html($term->name);
        echo '</label></li>';
    }

    echo '</ul>';
    echo '</div>';
}

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
add_action('update_option_pdm_blocks_company_info', 'pdm_blocks_sync_dynamic_legal_pages', 20, 2);
