<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

// Get block attributes
$info_type = isset($attributes['infoType']) ? $attributes['infoType'] : 'address';
$location_index = isset($attributes['locationIndex']) ? intval($attributes['locationIndex']) : 0;
$map_width = isset($attributes['mapWidth']) ? $attributes['mapWidth'] : 'map-default';
$hours_format = isset($attributes['hoursFormat']) ? $attributes['hoursFormat'] : 'list';
$custom_text = isset($attributes['customText']) ? $attributes['customText'] : '';
$custom_link = isset($attributes['customLink']) ? $attributes['customLink'] : array();
$show_location_name = isset($attributes['showLocationName']) ? $attributes['showLocationName'] : false;

// Get company data - use new function names
$locations = function_exists('pdm_blocks_get_company_locations')
	? pdm_blocks_get_company_locations()
	: (function_exists('accelerate_get_company_locations') ? accelerate_get_company_locations() : array());

// Check if we have locations
if (empty($locations)) {
	return;
}

// Get the selected location
$current_location = isset($locations[$location_index]) ? $locations[$location_index] : $locations[0];

// Wrapper classes
$wrapper_classes = array('wp-block-pdm-company-info');
if (!empty($map_width) && $info_type === 'map') {
	$wrapper_classes[] = $map_width;
}

// Start output
$output = '';

switch ($info_type) {
	case 'address':
		if (!empty($current_location['address'])) {
			// Show location name if enabled (use custom name or default)
			if ($show_location_name) {
				$location_name = !empty($current_location['name']) ? $current_location['name'] : 'Location ' . ($location_index + 1);
				$output .= '<div style="margin-bottom: 8px; font-weight: bold; display: block;">' . esc_html($location_name) . '</div>';
			}
			$output .= '<div>' . esc_html($current_location['address']) . '</div>';
		}
		break;

	case 'phone':
		if (!empty($current_location['phone'])) {
			$phone_clean = preg_replace('/[^\d+]/', '', $current_location['phone']);
			$output .= '<a href="tel:' . esc_attr($phone_clean) . '" class="company-phone">' . esc_html($current_location['phone']) . '</a>';
		}
		break;

	case 'email':
		if (!empty($current_location['email'])) {
			$output .= '<a href="mailto:' . esc_attr($current_location['email']) . '" class="company-email">' . esc_html($current_location['email']) . '</a>';
		}
		break;

	case 'hours':
		if (!empty($current_location['hours']) && is_array($current_location['hours'])) {
			// Show location name if enabled (use custom name or default)
			if ($show_location_name) {
				$location_name = !empty($current_location['name']) ? $current_location['name'] : 'Location ' . ($location_index + 1);
				$output .= '<div style="margin-bottom: 8px; font-weight: bold; display: block;">' . esc_html($location_name) . '</div>';
			}

			$output .= '<table class="company-hours-table" style="width: 100%; border-spacing: 0 8px;"><tbody>';

			// Loop through each hour row (flexible repeater)
			foreach ($current_location['hours'] as $hour_row) {
				if (is_array($hour_row) && (!empty($hour_row['label']) || !empty($hour_row['hours']))) {
					$output .= '<tr>';

					// Display the label (e.g., "M-F", "Sat-Sun", etc.)
					if (!empty($hour_row['label'])) {
						$output .= '<td style="padding-right: 20px;"><strong>' . esc_html($hour_row['label']) . '</strong></td>';
					} else {
						$output .= '<td style="padding-right: 20px;"></td>';
					}

					// Display the hours text
					$output .= '<td>';
					if (!empty($hour_row['hours'])) {
						$output .= esc_html($hour_row['hours']);
					}
					$output .= '</td>';
					$output .= '</tr>';
				}
			}

			$output .= '</tbody></table>';
		}
		break;

	case 'map':
		if (!empty($current_location['map'])) {
			// Use wp_kses to safely output the map iframe
			$allowed_html = array(
				'iframe' => array(
					'src' => array(),
					'width' => array(),
					'height' => array(),
					'style' => array(),
					'frameborder' => array(),
					'allowfullscreen' => array(),
					'loading' => array(),
					'referrerpolicy' => array()
				)
			);
			$output .= '<div class="company-map ' . esc_attr($map_width) . '">' . wp_kses($current_location['map'], $allowed_html) . '</div>';
		}
		break;
}

// Output the block if we have content
if (!empty($output)) {
	echo '<div ' . get_block_wrapper_attributes(array('class' => implode(' ', $wrapper_classes))) . '>';

	// For full-width maps, render differently to avoid container constraints
	if ($info_type === 'map' && $map_width === 'map-full') {
		echo $output; // Output map directly without nested containers
	} else {
		echo '<div class="company-info-flex">';
		echo '<div class="company-info-item">';

		// Add the content
		echo $output;

		echo '</div>'; // .company-info-item
		echo '</div>'; // .company-info-flex
	}

	echo '</div>'; // .wp-block-pdm-company-info
}
