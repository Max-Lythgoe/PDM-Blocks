<?php

/**
 * Block Extension for Company Info and Dynamic Content
 * 
 * Extends paragraph, heading, and list item blocks to add a toolbar control for inserting
 * company information and dynamic content (year, site name, site URL) inline.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class PDM_Blocks_Paragraph_Company_Info_Extension
{
    public function __construct()
    {
        // Register the shortcode for dynamic company info
        add_shortcode('company_info', array($this, 'render_company_info_shortcode'));

        // Register the shortcode for dynamic content (year, sitename, siteurl)
        add_shortcode('dynamic_content', array($this, 'render_dynamic_content_shortcode'));

        // Ensure shortcodes are processed in block content
        add_filter('the_content', 'do_shortcode', 11);
    }

    /**
     * Render company info shortcode
     * Usage: [company_info type="address" location="1"]
     */
    public function render_company_info_shortcode($atts)
    {
        // Parse shortcode attributes
        $attributes = shortcode_atts(array(
            'type' => 'address',
            'location' => '1'  // Default to 1 (first location)
        ), $atts);

        // Check if the helper function exists
        if (!function_exists('pdm_blocks_get_company_locations')) {
            return '';
        }

        $locations = pdm_blocks_get_company_locations();

        // Convert 1-based location number to 0-based array index
        $location_index = intval($attributes['location']) - 1;

        // Check if the location exists (ensure location is 1 or higher, and array index exists)
        if (intval($attributes['location']) < 1 || !isset($locations[$location_index])) {
            return '';
        }

        $location = $locations[$location_index];
        $output = '';

        switch ($attributes['type']) {
            case 'address':
                if (!empty($location['address'])) {
                    // Clean up address formatting - replace multiple line breaks with commas
                    $address = trim($location['address']);
                    $address = preg_replace('/\s*[\r\n]+\s*/', ', ', $address);
                    $output = wp_kses_post($address);
                }
                break;

            case 'phone':
                if (!empty($location['phone'])) {
                    $phone_raw = esc_html($location['phone']);
                    $phone_digits = preg_replace('/[^0-9+]/', '', $phone_raw);
                    if ($phone_digits) {
                        $output = '<a href="tel:' . esc_attr($phone_digits) . '">' . $phone_raw . '</a>';
                    } else {
                        $output = $phone_raw;
                    }
                }
                break;

            case 'email':
                if (!empty($location['email'])) {
                    $email = sanitize_email($location['email']);
                    $output = '<a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>';
                }
                break;
        }

        return $output;
    }

    /**
     * Render dynamic content shortcode
     * Usage: [dynamic_content type="year"], [dynamic_content type="sitename"], [dynamic_content type="siteurl"]
     */
    public function render_dynamic_content_shortcode($atts)
    {
        // Parse shortcode attributes
        $attributes = shortcode_atts(array(
            'type' => 'year'
        ), $atts);

        $output = '';

        switch ($attributes['type']) {
            case 'year':
                $output = date('Y');
                break;

            case 'sitename':
                $output = get_bloginfo('name');
                break;

            case 'siteurl':
                $site_url = home_url('/');
                $output = '<a href="' . esc_url($site_url) . '">' . esc_html($site_url) . '</a>';
                break;
        }

        return $output;
    }
}

// Initialize the extension
new PDM_Blocks_Paragraph_Company_Info_Extension();
