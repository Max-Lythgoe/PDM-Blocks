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

        // register shortcode for dynamic content (year, sitename, siteurl, etc.)
        add_shortcode('dynamic_content', array($this, 'render_dynamic_content_shortcode'));

        // register shortcode for client or patient label
        add_shortcode('client_or_patient', array($this, 'render_client_or_patient_shortcode'));

        // register shortcode for footer links
        add_shortcode('footer_links', array($this, 'render_footer_links_shortcode'));

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

            case 'published_date':
                $output = get_the_date('m/d/Y');
                break;

            case 'state':
                if (function_exists('pdm_blocks_get_company_info')) {
                    $output = pdm_blocks_get_company_info('company_state');
                }
                break;
        }

        return $output;
    }

    // client or patient shortcode — outputs "patient" if HIPAA or healthcare disclaimer pages are enabled
    public function render_client_or_patient_shortcode($atts)
    {
        $options = get_option('pdm_blocks_company_info', array());
        $hipaa_enabled      = ! empty($options['enable_hipaa_page']);
        $healthcare_enabled = ! empty($options['enable_healthcare_disclaimer_page']);
        return ($hipaa_enabled || $healthcare_enabled) ? 'patient' : 'client';
    }

    // footer links shortcode
    public function render_footer_links_shortcode($atts)
    {
        $options = get_option('pdm_blocks_company_info', array());

        // Conditional pages: only included when their toggle is enabled.
        $conditional_links = array(
            'enable_accessibility_page'        => array('label' => 'Accessibility',               'slug' => 'accessibility-statement'),
            'enable_anti_discrimination_page'  => array('label' => 'Anti-Discrimination',         'slug' => 'anti-discrimination-disclaimer'),
            'enable_healthcare_disclaimer_page' => array('label' => 'Healthcare Disclaimer',       'slug' => 'healthcare-disclaimer'),
            'enable_hipaa_page'                => array('label' => 'HIPAA Privacy Policy',        'slug' => 'hipaa'),
            'enable_privacy_policy_page'       => array('label' => 'Privacy Policy',              'slug' => 'privacy-policy'),
            'enable_terms_page'                => array('label' => 'Terms',                       'slug' => 'terms'),
        );

        // Always-present static links.
        $static_links = array(
            array('label' => 'XML Sitemap', 'url' => '/sitemap_index.xml'),
            array('label' => 'Sitemap',     'url' => '/sitemap/'),
        );

        $parts = array();

        foreach ($conditional_links as $option_key => $link) {
            if (! empty($options[$option_key])) {
                $url = home_url('/' . $link['slug'] . '/');
                $parts[] = '<a href="' . esc_url($url) . '">' . esc_html($link['label']) . '</a>';
            }
        }

        foreach ($static_links as $link) {
            $parts[] = '<a href="' . esc_url($link['url']) . '">' . esc_html($link['label']) . '</a>';
        }

        return implode(' | ', $parts);
    }
}

new PDM_Blocks_Paragraph_Company_Info_Extension();
