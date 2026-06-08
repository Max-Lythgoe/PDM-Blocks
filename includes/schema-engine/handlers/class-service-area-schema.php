<?php

/**
 * Service Area Schema Handler
 * Generates Place + Organization + hasOfferCatalog schema for service-areas post type
 * Matches structure from georgiagaragefloorcoatings.com example
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Geocode city using Geoapify API
 * Uses Service Area page title as city name + state from settings
 */
function pdm_service_area_geocode_city($city_name, $state)
{
    $options = get_option('pdm_settings', array());
    $api_key = $options['service_area_geoapify_api_key'] ?? '';

    if (empty($api_key) || empty($city_name) || empty($state)) {
        return false;
    }

    $search_query = $city_name . ', ' . $state . ', US';

    $url = 'https://api.geoapify.com/v1/geocode/search';
    $params = array(
        'text' => $search_query,
        'apiKey' => $api_key,
        'limit' => 1,
        'type' => 'city'
    );

    $response = wp_remote_get($url . '?' . http_build_query($params), array(
        'timeout' => 10
    ));

    if (is_wp_error($response)) {
        return false;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (isset($data['features'][0])) {
        $feature = $data['features'][0];
        $coords = $feature['geometry']['coordinates'];
        $properties = $feature['properties'];

        return array(
            'latitude' => $coords[1],
            'longitude' => $coords[0],
            'formatted_address' => $properties['formatted'] ?? '',
            'street' => trim(($properties['housenumber'] ?? '') . ' ' . ($properties['street'] ?? '')),
            'city' => $properties['city'] ?? $city_name,
            'state' => $properties['state_code'] ?? $state,
            'postal_code' => $properties['postcode'] ?? '',
            'country' => 'US'
        );
    }

    return false;
}

/**
 * Clean up and enhance schemas on service area pages
 * - Separates Place and Organization entities
 * - Ensures consistent @id references
 * - Removes Organization/Person dual type confusion
 * - Removes invalid LocalBusiness properties
 */
function pdm_schema_engine_clean_service_area_schema($data, $jsonld)
{
    // Prevent multiple executions on same page load
    static $already_processed = false;

    if ($already_processed) {
        return $data;
    }

    if (empty($data) || !is_array($data)) {
        return $data;
    }

    // Only apply on service area pages
    if (!is_singular('service-areas')) {
        return $data;
    }

    // Mark as processed
    $already_processed = true;

    // Remove RankMath's global Person/Organization schema to prevent duplicate identity nodes
    // (We have page-specific Organization schema that should be the main entity)
    foreach ($data as $key => $schema) {
        if (
            isset($schema['@id']) &&
            (strpos($schema['@id'], '#person') !== false ||
                strpos($schema['@id'], '/#person') !== false ||
                strpos($schema['@id'], '/#organization') !== false)
        ) {
            // Check if it's NOT our page-specific organization
            if (!isset($schema['location']) && !isset($schema['priceRange'])) {
                unset($data[$key]);
                continue;
            }
        }
    }

    // Get the current page URL for consistent ID generation
    $page_url = get_permalink();

    foreach ($data as $key => $schema) {
        // Clean up Place schema - remove WebPage properties and force consistent @id
        if (isset($schema['@type']) && $schema['@type'] === 'Place') {
            unset($data[$key]['inLanguage']);
            unset($data[$key]['isPartOf']);
            unset($data[$key]['publisher']);
            unset($data[$key]['breadcrumb']);

            // CRITICAL: Force Place @id to be #place (RankMath auto-generates #schema-XXXX)
            if (isset($schema['geo']) && isset($schema['hasMap'])) {
                $data[$key]['@id'] = $page_url . '#place';
            }
        }

        // Clean up Organization/Business types - remove invalid properties and force consistent @id
        if (isset($schema['@type'])) {
            $type = is_array($schema['@type']) ? $schema['@type'][0] : $schema['@type'];

            $business_types = [
                'LocalBusiness',
                'HomeAndConstructionBusiness',
                'Dentist',
                'Doctor',
                'Electrician',
                'GeneralContractor',
                'HousePainter',
                'Locksmith',
                'MovingCompany',
                'Plumber',
                'RoofingContractor',
                'Organization'
            ];

            if (in_array($type, $business_types)) {
                // Remove WebPage properties (keep metadata for editor compatibility)
                unset($data[$key]['inLanguage']);
                unset($data[$key]['isPartOf']);
                unset($data[$key]['publisher']);

                // CRITICAL: Force Organization @id to be #organization (RankMath auto-generates #schema-XXXX)
                // This ensures Service provider IDs match the Organization @id
                if (isset($schema['location']) || isset($schema['priceRange'])) {
                    $data[$key]['@id'] = $page_url . '#organization';
                }
            }
        }

        // Fix WebSite publisher to point to #organization instead of #person
        if (isset($schema['@type']) && $schema['@type'] === 'WebSite') {
            if (isset($data[$key]['publisher']['@id'])) {
                // Change publisher from #person to #organization
                $data[$key]['publisher']['@id'] = $page_url . '#organization';
            }
        }
    }

    return $data;
}
add_filter('rank_math/json_ld', 'pdm_schema_engine_clean_service_area_schema', 9999, 2);

/**
 * Service Area Schema Class
 * Handles automatic schema generation for service-areas post type
 */
class PDM_Service_Area_Schema
{
    private $settings;

    public function __construct()
    {
        $this->settings = get_option('pdm_settings', array());
        add_action('save_post', array($this, 'generate_schema'), 20, 1);

        // Handle settings updates
        add_action('update_option_pdm_settings', array($this, 'handle_settings_update'), 10, 2);

        // Add admin notices
        add_action('admin_notices', array($this, 'show_admin_notices'));
    }

    /**
     * Check if schema should be generated for this post
     */
    public function should_generate_for_post($post)
    {
        if (empty($this->settings['enable_service_area_schema'])) {
            return false;
        }

        return $post->post_type === 'service-areas' && $post->post_status === 'publish';
    }

    /**
     * Generate Service Area schema following georgiagaragefloorcoatings.com structure
     * Creates: Place entity + Organization entity with hasOfferCatalog
     */
    public function generate_schema($post_id)
    {
        // Prevent double execution on same post
        static $processing = array();
        if (isset($processing[$post_id])) {
            return;
        }
        $processing[$post_id] = true;

        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
            unset($processing[$post_id]);
            return;
        }

        $post = get_post($post_id);
        if (!$post) {
            unset($processing[$post_id]);
            return;
        }

        // Check if this is a Service Area post type
        if (!$this->should_generate_for_post($post)) {
            // If disabled, clean up any auto-generated schemas
            $this->cleanup_post_schemas($post_id);
            return;
        }

        // Check if manual schema exists - don't overwrite
        $existing_place = get_post_meta($post_id, 'rank_math_schema_Place', true);
        $existing_organization = get_post_meta($post_id, 'rank_math_schema_Organization', true);

        if ((!empty($existing_place) && !$this->is_auto_generated_schema($existing_place)) ||
            (!empty($existing_organization) && !$this->is_auto_generated_schema($existing_organization))
        ) {
            return; // Manual schema exists, don't overwrite
        }

        // Get settings
        $business_name = !empty($this->settings['service_area_business_name'])
            ? $this->settings['service_area_business_name']
            : get_bloginfo('name');
        $business_type = $this->settings['service_area_business_type'] ?? 'HomeAndConstructionBusiness';
        $description = $this->settings['service_area_description'] ?? '';
        $services = $this->settings['service_area_services'] ?? '';
        $price_range = $this->settings['service_area_price_range'] ?? '$$';
        $state = $this->settings['service_area_state'] ?? 'UT';
        $business_hours = $this->settings['service_area_business_hours'] ?? '';

        // Get company physical address (state comes from company_state field)
        $company_street = $this->settings['service_area_company_street'] ?? '';
        $company_city = $this->settings['service_area_company_city'] ?? '';
        $company_state = $this->settings['service_area_company_state'] ?? 'UT';
        $company_zip = $this->settings['service_area_company_zip'] ?? '';
        $state = $company_state; // Use company state for geocoding

        // Get company info from PDM Blocks company settings
        $company_info = get_option('pdm_blocks_company_info', array());
        $locations = $company_info['company_locations'] ?? array();
        $first_location = !empty($locations) ? reset($locations) : array();
        $phone = $first_location['phone'] ?? '';
        $email = $first_location['email'] ?? '';

        // Get city name from post title and geocode it
        $area_name = get_the_title($post_id);
        $city_name = $area_name;

        $location_data = pdm_service_area_geocode_city($city_name, $state);

        // Bail if geocoding failed or essential data is missing
        if (empty($business_name)) {
            return;
        }

        if (empty($location_data)) {
            return;
        }

        // Clean up existing schemas first
        delete_post_meta($post_id, 'rank_math_schema_Place');
        delete_post_meta($post_id, 'rank_math_schema_Organization');
        delete_post_meta($post_id, 'rank_math_schema_LocalBusiness');

        // Clean up old service schemas
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM $wpdb->postmeta WHERE post_id = %d AND meta_key LIKE %s",
            $post_id,
            'rank_math_schema_Service_%'
        ));

        // 1. CREATE PLACE SCHEMA
        $place_schema = array(
            'metadata' => array(
                'title' => 'Place',
                'type' => 'template',
                'isPrimary' => false,
                'shortcode' => uniqid('s-'),
                'pdm_auto_generated' => true
            ),
            '@type' => 'Place',
            '@id' => get_permalink($post_id) . '#place',
            'geo' => array(
                '@type' => 'GeoCoordinates',
                'latitude' => (string) $location_data['latitude'],
                'longitude' => (string) $location_data['longitude']
            ),
            'hasMap' => "https://www.google.com/maps/search/?api=1&query={$location_data['latitude']},{$location_data['longitude']}",
            'address' => array(
                '@type' => 'PostalAddress',
                'addressLocality' => $location_data['city'],
                'addressRegion' => $location_data['state'],
                'postalCode' => $location_data['postal_code'],
                'addressCountry' => 'US'
            )
        );

        // Add street address if available from geocoding
        if (!empty($location_data['street'])) {
            $place_schema['address']['streetAddress'] = $location_data['street'];
        }

        // 2. CREATE ORGANIZATION SCHEMA
        $organization_schema = array(
            'metadata' => array(
                'title' => 'Organization',
                'type' => 'template',
                'isPrimary' => false,
                'shortcode' => uniqid('s-'),
                'pdm_auto_generated' => true
            ),
            '@type' => $business_type,
            '@id' => get_permalink($post_id) . '#organization',
            'name' => $business_name,
            'url' => home_url('/'),
            'priceRange' => $price_range,
            'location' => array(
                '@id' => get_permalink($post_id) . '#place'
            ),
            'address' => array(
                '@type' => 'PostalAddress',
                'addressLocality' => $company_city,
                'addressRegion' => $company_state,
                'postalCode' => $company_zip,
                'addressCountry' => 'US'
            ),
            'areaServed' => array(
                '@type' => 'City',
                'name' => $location_data['city'],
                'address' => array(
                    '@type' => 'PostalAddress',
                    'addressLocality' => $location_data['city'],
                    'addressRegion' => $location_data['state'],
                    'addressCountry' => 'US'
                )
            )
        );

        // Add street address to Organization if available
        if (!empty($company_street)) {
            $organization_schema['address']['streetAddress'] = $company_street;
        }

        // Add contact information
        if (!empty($phone)) {
            $organization_schema['telephone'] = $phone;
        }
        if (!empty($email)) {
            $organization_schema['email'] = $email;
        }

        // Add description
        if (!empty($description)) {
            $organization_schema['description'] = $description;
        }

        // Add logo and image
        $custom_logo_id = get_theme_mod('custom_logo');
        if ($custom_logo_id) {
            $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
            $logo_data = wp_get_attachment_metadata($custom_logo_id);

            if ($logo_url) {
                $organization_schema['logo'] = array(
                    '@type' => 'ImageObject',
                    '@id' => home_url('/#logo'),
                    'url' => $logo_url,
                    'contentUrl' => $logo_url,
                    'caption' => $business_name,
                    'inLanguage' => 'en-US'
                );

                if (!empty($logo_data['width']) && !empty($logo_data['height'])) {
                    $organization_schema['logo']['width'] = (int) $logo_data['width'];
                    $organization_schema['logo']['height'] = (int) $logo_data['height'];
                }

                $organization_schema['image'] = array(
                    '@id' => home_url('/#logo')
                );
            }
        }

        // Add social media profiles (sameAs)
        $social_profiles = array();
        $social_fields = array(
            'service_area_facebook_url',
            'service_area_twitter_url',
            'service_area_instagram_url',
            'service_area_linkedin_url',
            'service_area_youtube_url',
            'service_area_yelp_url'
        );

        foreach ($social_fields as $field) {
            if (!empty($this->settings[$field])) {
                $social_profiles[] = $this->settings[$field];
            }
        }

        if (!empty($social_profiles)) {
            $organization_schema['sameAs'] = $social_profiles;
        }

        // Add opening hours if configured
        if (!empty($business_hours)) {
            $hours_lines = array_filter(array_map('trim', explode("\n", $business_hours)));
            $opening_hours = array();

            foreach ($hours_lines as $line) {
                $line = trim($line);
                if (empty($line)) continue;

                // Parse format like "Monday-Friday: 08:00-17:00"
                if (preg_match('/^([^:]+):\s*([0-9]{2}:[0-9]{2})-([0-9]{2}:[0-9]{2})$/i', $line, $matches)) {
                    $days_part = trim($matches[1]);
                    $open_time = $matches[2];
                    $close_time = $matches[3];

                    // Convert to schema.org format: "Monday,Tuesday,Wednesday,Thursday,Friday 08:00-17:00"
                    if (strpos($days_part, '-') !== false) {
                        $day_range = explode('-', $days_part);
                        if (count($day_range) == 2) {
                            $start_day = trim($day_range[0]);
                            $end_day = trim($day_range[1]);

                            $days_sequence = array('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
                            $start_index = array_search($start_day, $days_sequence);
                            $end_index = array_search($end_day, $days_sequence);

                            if ($start_index !== false && $end_index !== false) {
                                $selected_days = array();
                                for ($i = $start_index; $i <= $end_index; $i++) {
                                    $selected_days[] = $days_sequence[$i];
                                }
                                $opening_hours[] = implode(',', $selected_days) . ' ' . $open_time . '-' . $close_time;
                            }
                        }
                    } else {
                        // Single day
                        $opening_hours[] = $days_part . ' ' . $open_time . '-' . $close_time;
                    }
                }
            }

            if (!empty($opening_hours)) {
                $organization_schema['openingHours'] = $opening_hours;
            }
        }

        // Create individual Service schemas instead of hasOfferCatalog (avoids array duplication issues)
        $service_schemas = array();
        if (!empty($services)) {
            // Split services by newline and clean up
            $raw_services = explode("\n", $services);
            $clean_services = array();

            // Process each service: trim whitespace and skip empties
            foreach ($raw_services as $service) {
                $service = trim($service);
                if (!empty($service)) {
                    $clean_services[] = $service;
                }
            }

            // Remove duplicates
            $clean_services = array_values(array_unique($clean_services));

            if (!empty($clean_services)) {
                // Create individual Service schema for each service
                foreach ($clean_services as $index => $service_name) {
                    $service_id = sanitize_title($service_name);

                    $service_schemas['Service_' . $index] = array(
                        '@type' => 'Service',
                        '@id' => get_permalink($post_id) . '#service-' . $service_id,
                        'name' => $service_name,
                        'provider' => array(
                            '@id' => get_permalink($post_id) . '#organization'
                        ),
                        'areaServed' => array(
                            '@type' => 'City',
                            'name' => $area_name,
                            'address' => array(
                                '@type' => 'PostalAddress',
                                'addressLocality' => $area_name,
                                'addressRegion' => $state,
                                'addressCountry' => 'US'
                            )
                        ),
                        'metadata' => array(
                            'title' => $service_name . ' - ' . $area_name,
                            'type' => 'template',
                            'isPrimary' => false
                        )
                    );
                }
            }
        }

        // CRITICAL: Delete ALL existing rank_math_schema_* meta entries to prevent duplicates
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key LIKE %s",
                $post_id,
                'rank_math_schema_%'
            )
        );

        // Store Place and Organization schemas
        update_post_meta($post_id, 'rank_math_schema_Place', $place_schema);
        update_post_meta($post_id, 'rank_math_schema_Organization', $organization_schema);

        // Store each Service schema individually
        foreach ($service_schemas as $key => $service_schema) {
            update_post_meta($post_id, 'rank_math_schema_' . $key, $service_schema);
        }

        // Clear processing flag
        unset($processing[$post_id]);
    }

    /**
     * Check if a schema is auto-generated by our system
     */
    private function is_auto_generated_schema($schema)
    {
        if (!is_array($schema)) {
            return false;
        }

        // Primary check: Look for our unique marker
        if (isset($schema['metadata']['pdm_auto_generated']) && $schema['metadata']['pdm_auto_generated'] === true) {
            return true;
        }

        // Secondary check: Look for our auto-generated title pattern
        if (
            isset($schema['metadata']['title']) && strpos($schema['metadata']['title'], 'Place') !== false ||
            strpos($schema['metadata']['title'], 'Organization') !== false
        ) {
            return true;
        }

        return false;
    }

    /**
     * Clean up auto-generated schemas for a specific post
     */
    private function cleanup_post_schemas($post_id)
    {
        $existing_place = get_post_meta($post_id, 'rank_math_schema_Place', true);
        $existing_organization = get_post_meta($post_id, 'rank_math_schema_Organization', true);

        if (!empty($existing_place) && $this->is_auto_generated_schema($existing_place)) {
            delete_post_meta($post_id, 'rank_math_schema_Place');
        }

        if (!empty($existing_organization) && $this->is_auto_generated_schema($existing_organization)) {
            delete_post_meta($post_id, 'rank_math_schema_Organization');
        }

        // Clean up old service schemas
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM $wpdb->postmeta WHERE post_id = %d AND meta_key LIKE %s",
            $post_id,
            'rank_math_schema_Service_%'
        ));
    }

    /**
     * Handle settings update - generate for all posts when enabled
     */
    public function handle_settings_update($old_value, $new_value)
    {
        // Check if Service Area schema was just enabled
        $was_enabled = !empty($old_value['enable_service_area_schema']);
        $is_enabled = !empty($new_value['enable_service_area_schema']);

        if (!$was_enabled && $is_enabled) {
            $this->generate_for_all_posts();
        } elseif ($was_enabled && !$is_enabled) {
            $this->cleanup_all_auto_generated();
        }
    }

    /**
     * Generate Service Area schemas for all eligible posts
     */
    private function generate_for_all_posts()
    {
        // Refresh settings to ensure we have the latest values
        $this->settings = get_option('pdm_settings', array());

        $posts = get_posts(array(
            'post_type' => 'service-areas',
            'post_status' => 'publish',
            'numberposts' => -1
        ));

        $generated_count = 0;
        foreach ($posts as $post) {
            if ($this->should_generate_for_post($post)) {
                $this->generate_schema($post->ID);
                $generated_count++;
            }
        }

        // Set transient to show admin notice
        set_transient('pdm_service_area_bulk_generated', $generated_count, 30);
    }

    /**
     * Clean up all auto-generated Service Area schemas
     */
    private function cleanup_all_auto_generated()
    {
        $posts = get_posts(array(
            'post_type' => 'service-areas',
            'post_status' => 'publish',
            'numberposts' => -1
        ));

        $cleaned_count = 0;
        foreach ($posts as $post) {
            $this->cleanup_post_schemas($post->ID);
            $cleaned_count++;
        }

        // Set transient to show admin notice
        set_transient('pdm_service_area_bulk_cleaned', $cleaned_count, 30);
    }

    /**
     * Show admin notices for bulk generation results
     */
    public function show_admin_notices()
    {
        $count = get_transient('pdm_service_area_bulk_generated');
        if ($count !== false) {
            delete_transient('pdm_service_area_bulk_generated');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('Service Area schemas automatically generated for %d pages!', $count) . '</p></div>';
        }

        $cleaned_count = get_transient('pdm_service_area_bulk_cleaned');
        if ($cleaned_count !== false) {
            delete_transient('pdm_service_area_bulk_cleaned');
            echo '<div class="notice notice-success is-dismissible"><p>' . sprintf('Service Area schemas removed from %d pages!', $cleaned_count) . '</p></div>';
        }
    }
}

// Note: Instantiation is handled by PDM_Schema_Manager in the plugin context.
