<?php

// extend paragraphs to support company info 

if (!defined('ABSPATH')) {
    exit;
}

class PDM_Blocks_Paragraph_Company_Info_Extension
{
    public function __construct()
    {
        // register shortcode for dynamic company info
        add_shortcode('company_info', array($this, 'render_company_info_shortcode'));

        // register shortcode for dynamic content (year, sitename, siteurl)
        add_shortcode('dynamic_content', array($this, 'render_dynamic_content_shortcode'));

        // ensure shortcodes work in blocks
        add_filter('the_content', 'do_shortcode', 11);
    }

    // comapny info shortcode registration 
    public function render_company_info_shortcode($atts)
    {
        $attributes = shortcode_atts(array(
            'type' => 'address',
            'location' => '1'
        ), $atts);

        if (!function_exists('pdm_blocks_get_company_locations')) {
            return '';
        }

        $locations = pdm_blocks_get_company_locations();

        $location_index = intval($attributes['location']) - 1;

        if (intval($attributes['location']) < 1 || !isset($locations[$location_index])) {
            return '';
        }

        $location = $locations[$location_index];
        $output = '';

        switch ($attributes['type']) {
            case 'address':
                if (!empty($location['address'])) {
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

    // dynamic shortcodes (year, sitename, siteurl)
    public function render_dynamic_content_shortcode($atts)
    {
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

new PDM_Blocks_Paragraph_Company_Info_Extension();
