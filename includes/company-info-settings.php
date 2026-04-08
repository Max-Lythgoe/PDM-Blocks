<?php

/**
 * Register a custom 'Company Info' settings page and all its fields for PDM Blocks.
 *
 * This file is included in the pdm-blocks plugin.
 */

// 1. Add the custom settings menu item as a top-level menu
function pdm_blocks_add_company_info_menu_page()
{
    $icon_svg = 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="white" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 128C512 92.7 483.3 64 448 64L192 64zM304 416L336 416C353.7 416 368 430.3 368 448L368 528L272 528L272 448C272 430.3 286.3 416 304 416zM224 176C224 167.2 231.2 160 240 160L272 160C280.8 160 288 167.2 288 176L288 208C288 216.8 280.8 224 272 224L240 224C231.2 224 224 216.8 224 208L224 176zM368 160L400 160C408.8 160 416 167.2 416 176L416 208C416 216.8 408.8 224 400 224L368 224C359.2 224 352 216.8 352 208L352 176C352 167.2 359.2 160 368 160zM224 304C224 295.2 231.2 288 240 288L272 288C280.8 288 288 295.2 288 304L288 336C288 344.8 280.8 352 272 352L240 352C231.2 352 224 344.8 224 336L224 304zM368 288L400 288C408.8 288 416 295.2 416 304L416 336C416 344.8 408.8 352 400 352L368 352C359.2 352 352 344.8 352 336L352 304C352 295.2 359.2 288 368 288z"/></svg>');

    add_menu_page(
        'Company Info',                    // Page title
        'Company Info',                    // Menu title
        'manage_options',                  // Capability required to see the page
        'pdm-blocks-company-info',         // Menu slug (unique ID)
        'pdm_blocks_company_info_page_content', // Callback function to display the page content
        $icon_svg,                         // Icon (SVG as data URI)
        3                                  // Position (3 = right after Dashboard)
    );
}
add_action('admin_menu', 'pdm_blocks_add_company_info_menu_page');


// 2. Register all settings, sections, and fields
function pdm_blocks_company_info_settings_init()
{
    // Register the setting group (which saves all options as a single array)
    register_setting(
        'pdm_blocks_company_info_group', // Option group (matches settings_fields() in the form)
        'pdm_blocks_company_info',       // Option name (the key in wp_options)
        'pdm_blocks_company_info_sanitize' // Sanitize callback function
    );

    // --- SECTION 1: General Info ---
    add_settings_section(
        'pdm_blocks_general_info_section', // Section ID
        'General Contact Information',    // Section Title
        'pdm_blocks_general_info_section_callback', // Callback to display section intro text
        'pdm-blocks-company-info'         // Page slug (unique ID)
    );

    // Single field for repeatable locations (address, phone, email, map)
    add_settings_field(
        'company_locations',                          // Field ID
        'Company Locations',                          // Field Title
        'pdm_blocks_locations_input_callback',        // Callback renders repeatable inputs
        'pdm-blocks-company-info',                    // Page slug
        'pdm_blocks_general_info_section',            // Section ID
        array('id' => 'company_locations', 'label' => 'Add one or more company locations (address, phone, email, map embed).')
    );

    // --- SECTION 2: Service Areas ---
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


// 3. Render the settings page content (The Form)
function pdm_blocks_company_info_page_content()
{
    // Check user capabilities
    if (! current_user_can('manage_options')) {
        return;
    }
?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="options.php">
            <?php
            // Output security fields and the options group reference.
            settings_fields('pdm_blocks_company_info_group');

            // Output settings sections and fields.
            do_settings_sections('pdm-blocks-company-info');

            // Output the save button.
            submit_button('Save Company Info');
            ?>
        </form>
    </div>
<?php
}


// 4. Callback functions for Sections and Fields

// Section callback functions (optional intro text for the section)
function pdm_blocks_general_info_section_callback()
{
    echo '<p>Enter your primary contact information and location details.</p>';
}

function pdm_blocks_service_areas_section_callback()
{
    echo '<p>Configure Service Areas to showcase the cities and regions you serve.</p>';
}

/**
 * Renders a generic text input field.
 */
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

/**
 * Renders a generic textarea input field (used for address and map code).
 */
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

/**
 * Renders a checkbox input field.
 */
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


// 5. Sanitize Callback
/**
 * Sanitize all option fields before saving to the database.
 */
function pdm_blocks_company_info_sanitize($input)
{
    $sanitized_input = array();

    // Sanitize repeatable company locations
    if (isset($input['company_locations']) && is_array($input['company_locations'])) {
        $sanitized_input['company_locations'] = array();
        foreach ($input['company_locations'] as $loc) {
            if (! is_array($loc)) {
                continue;
            }
            $san = array();
            $san['name']    = isset($loc['name']) ? sanitize_text_field($loc['name']) : '';
            $san['address'] = isset($loc['address']) ? sanitize_textarea_field($loc['address']) : '';
            $san['phone']   = isset($loc['phone']) ? sanitize_text_field($loc['phone']) : '';
            $san['email']   = isset($loc['email']) ? sanitize_email($loc['email']) : '';

            // Sanitize hours - flexible repeater rows
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

            // Map iframe: allow limited iframe attributes
            if (isset($loc['map'])) {
                $allowed_html = array(
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
                $san['map'] = wp_kses($loc['map'], $allowed_html);
                // Sanitize enable_service_areas checkbox
                $sanitized_input['enable_service_areas'] = isset($input['enable_service_areas']) ? 1 : 0;
            } else {
                $san['map'] = '';
            }
            $sanitized_input['company_locations'][] = $san;
        }
    }

    // Ensure at least one empty location exists so UI always has one row
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


// 6. Helper Function for Front-End Use (Crucial!)
/**
 * Retrieve a specific company info option.
 */
function pdm_blocks_get_company_info($key, $default = '')
{
    $options = get_option('pdm_blocks_company_info', array());

    // Check for the specific key and if value is not empty
    if (isset($options[$key]) && ! empty($options[$key])) {
        $value = $options[$key];

        // Escaping based on the key type
        if (strpos($key, '_link') !== false) {
            return esc_url($value); // Escape for URL output
        } elseif ($key === 'company_email') {
            return sanitize_email($value); // Clean email output
        } elseif ($key === 'company_map_iframe') {
            // Map code is already safe (kses'd) on save, just echo
            return $value;
        }

        // Default text/address output (already sanitized as text/textarea on save)
        return esc_html($value);
    }

    return $default;
}

/**
 * Retrieve all company locations as an array.
 * Each location includes: address, phone, email, map
 */
function pdm_blocks_get_company_locations()
{
    $options = get_option('pdm_blocks_company_info', array());
    if (isset($options['company_locations']) && is_array($options['company_locations'])) {
        return $options['company_locations'];
    }
    return array();
}

/**
 * Backwards compatibility - allow themes to still use old function names
 */
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

/**
 * Render repeatable locations input
 * Outputs multiple location blocks with add/remove buttons (simple JS clone)
 */
function pdm_blocks_locations_input_callback($args)
{
    $options = get_option('pdm_blocks_company_info');
    $locations = isset($options['company_locations']) && is_array($options['company_locations']) ? $options['company_locations'] : array();

    // Template index placeholder
    $index = 0;

    echo '<div id="pdm-blocks-locations-wrap">';
    if (empty($locations)) {
        // show one empty row by default
        $locations[] = array('address' => '', 'phone' => '', 'email' => '', 'map' => '', 'hours' => array());
    }

    foreach ($locations as $i => $loc) {
        $addr = isset($loc['address']) ? esc_textarea($loc['address']) : '';
        $phone = isset($loc['phone']) ? esc_attr($loc['phone']) : '';
        $email = isset($loc['email']) ? esc_attr($loc['email']) : '';
        $map = isset($loc['map']) ? $loc['map'] : '';

        $hours = isset($loc['hours']) && is_array($loc['hours']) ? $loc['hours'] : array();
        $days = array('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

        $name = isset($loc['name']) ? esc_attr($loc['name']) : '';
        $location_display = $name ? $name : 'Location ' . ($i + 1);

        echo '<div class="pdm-blocks-location-row" data-index="' . esc_attr($i) . '" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; background: #f9f9f9;">';
        echo '<h3>' . esc_html($location_display) . '</h3>';
        echo '<p><label>Location Name (optional):<br><input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][name]" value="' . $name . '" class="regular-text" placeholder="Location ' . ($i + 1) . '" /></label></p>';
        echo '<p><label>Address:<br><textarea name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][address]" rows="3" cols="50">' . $addr . '</textarea></label></p>';
        echo '<p><label>Phone:<br><input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][phone]" value="' . $phone . '" class="regular-text" /></label></p>';
        echo '<p><label>Email:<br><input type="email" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][email]" value="' . $email . '" class="regular-text" /></label></p>';
        echo '<p><label>Map Embed (iframe):<br><textarea name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][map]" rows="3" cols="50">' . esc_textarea($map) . '</textarea></label></p>';

        echo '<h4 style="margin-top: 20px;">Business Hours</h4>';
        echo '<p class="description">Add custom hour rows (e.g., "M-F", "Sat-Sun", or specific days). Enter hours in any format you like.</p>';
        echo '<div class="pdm-hours-repeater" data-location-index="' . esc_attr($i) . '" style="margin-bottom: 15px;">';

        // Show existing hours or one empty row
        if (empty($hours)) {
            $hours = array(array('label' => '', 'hours' => ''));
        }

        foreach ($hours as $h_index => $hour_row) {
            $hour_label = isset($hour_row['label']) ? esc_attr($hour_row['label']) : '';
            $hour_hours = isset($hour_row['hours']) ? esc_attr($hour_row['hours']) : '';

            echo '<div class="pdm-hour-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">';
            echo '<input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][hours][' . esc_attr($h_index) . '][label]" value="' . $hour_label . '" class="regular-text" placeholder="M-F" style="flex: 0 0 150px;" />';
            echo '<input type="text" name="pdm_blocks_company_info[company_locations][' . esc_attr($i) . '][hours][' . esc_attr($h_index) . '][hours]" value="' . $hour_hours . '" class="regular-text" placeholder="9:00 AM - 5:00 PM" style="flex: 1;" />';
            echo '<button type="button" class="button pdm-remove-hour-row">Remove</button>';
            echo '</div>';
        }

        echo '</div>';
        echo '<p><button type="button" class="button pdm-add-hour-row" data-location-index="' . esc_attr($i) . '">Add Hours Row</button></p>';

        echo '<p><button type="button" class="button pdm-blocks-remove-location">Remove Location</button></p>';
        echo '</div>';
    }

    // Add Location button and a small inline script to clone rows
?>
    </div>
    <p><button type="button" class="button" id="pdm-blocks-add-location">Add Location</button></p>
    <script>
        jQuery(document).ready(function($) {
            var wrap = $('#pdm-blocks-locations-wrap');
            var addBtn = $('#pdm-blocks-add-location');
            if (!wrap.length || !addBtn.length) return;

            // Function to renumber all locations
            function renumberLocations() {
                wrap.find('.pdm-blocks-location-row').each(function(index) {
                    var row = $(this);
                    var oldIndex = row.data('index');

                    // Update data-index
                    row.attr('data-index', index);

                    // Update heading
                    var nameInput = row.find('input[name*="[name]"]').first();
                    var customName = nameInput.val();
                    var heading = row.find('h3').first();
                    if (customName) {
                        heading.text(customName);
                    } else {
                        heading.text('Location ' + (index + 1));
                    }

                    // Update all name attributes in this location
                    row.find('textarea, input').each(function() {
                        var el = $(this);
                        var name = el.attr('name');
                        if (name) {
                            el.attr('name', name.replace(/\[company_locations\]\[\d+\]/, '[company_locations][' + index + ']'));
                        }
                    });

                    // Update hours repeater data attribute
                    var hoursRepeater = row.find('.pdm-hours-repeater');
                    if (hoursRepeater.length) {
                        hoursRepeater.attr('data-location-index', index);
                    }

                    // Update add hour button data attribute
                    var addHourBtn = row.find('.pdm-add-hour-row');
                    if (addHourBtn.length) {
                        addHourBtn.attr('data-location-index', index);
                    }
                });
            }

            // Use event delegation for all dynamic buttons
            // Remove location button
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
                    '<button type="button" class="button pdm-remove-hour-row">Remove</button>'
                );

                repeater.append(newRow);
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

                // clone the first row as template
                var template = rows.first().clone();

                // clear values and update name attributes
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

                // Reset hours to one empty row
                var hoursRepeater = template.find('.pdm-hours-repeater');
                if (hoursRepeater.length) {
                    hoursRepeater.attr('data-location-index', index);
                    hoursRepeater.html(
                        '<div class="pdm-hour-row" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">' +
                        '<input type="text" name="pdm_blocks_company_info[company_locations][' + index + '][hours][0][label]" value="" class="regular-text" placeholder="M-F" style="flex: 0 0 150px;" />' +
                        '<input type="text" name="pdm_blocks_company_info[company_locations][' + index + '][hours][0][hours]" value="" class="regular-text" placeholder="9:00 AM - 5:00 PM" style="flex: 1;" />' +
                        '<button type="button" class="button pdm-remove-hour-row">Remove</button>' +
                        '</div>'
                    );
                }

                // Update add hour button
                var addHourBtn = template.find('.pdm-add-hour-row');
                if (addHourBtn.length) {
                    addHourBtn.attr('data-location-index', index);
                }

                // Update the location heading
                var heading = template.find('h3');
                if (heading.length) {
                    heading.text('Location ' + (index + 1));
                }

                wrap.append(template);
                renumberLocations();
            });
        });
    </script>
<?php
}

/**
 * Example: Render all company locations
 * Use this in your theme templates to output each location's address, phone and map.
 */
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
            // If digits couldn't be parsed, still output raw text
            echo '<div class="pdm-blocks-location-phone">' . $phone_raw . '</div>';
        }
        if ($email) {
            echo '<div class="pdm-blocks-location-email"><a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a></div>';
        }
        if ($map) {
            // Map iframe was sanitized on save via wp_kses
            echo '<div class="pdm-blocks-location-map">' . $map . '</div>';
        }
        echo '</div>'; // .pdm-blocks-location
    }
    echo '</div>'; // .pdm-blocks-company-locations
}

// ===== SERVICE AREAS POST TYPE AND TAXONOMIES =====

/**
 * Register Service Areas custom post type if enabled
 */
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
        'template' => [
            ['core/pattern', ['slug' => 'pdm-accelerate/citypage']]
        ],
        'template_lock' => false,
    ]);
}
add_action('init', 'pdm_blocks_register_service_areas_post_type');

/**
 * Register Cities taxonomy for Service Areas
 * This matches the taxonomy from pdm-recent-projects plugin
 */
function pdm_blocks_register_cities_taxonomy()
{
    $options = get_option('pdm_blocks_company_info');
    $enabled = isset($options['enable_service_areas']) && $options['enable_service_areas'];

    if (!$enabled) {
        return;
    }

    // Check if taxonomy is already registered (by pdm-recent-projects or another plugin)
    if (taxonomy_exists('city')) {
        // If it exists, just associate it with our service-areas post type
        register_taxonomy_for_object_type('city', 'service-areas');
        return;
    }

    // Register the taxonomy if it doesn't exist
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

/**
 * Register Counties taxonomy for Service Areas
 */
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

/**
 * Custom meta box for County selection (radio buttons instead of checkboxes)
 */
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

/**
 * Flush rewrite rules when Service Areas is enabled/disabled
 */
function pdm_blocks_flush_rewrite_on_save($old_value, $new_value)
{
    $old_enabled = isset($old_value['enable_service_areas']) && $old_value['enable_service_areas'];
    $new_enabled = isset($new_value['enable_service_areas']) && $new_value['enable_service_areas'];

    if ($old_enabled !== $new_enabled) {
        // Re-register taxonomies and post type to ensure proper setup
        if ($new_enabled) {
            pdm_blocks_register_service_areas_post_type();
            pdm_blocks_register_cities_taxonomy();
            pdm_blocks_register_counties_taxonomy();
        }
        flush_rewrite_rules();
    }
}
add_action('update_option_pdm_blocks_company_info', 'pdm_blocks_flush_rewrite_on_save', 10, 2);
