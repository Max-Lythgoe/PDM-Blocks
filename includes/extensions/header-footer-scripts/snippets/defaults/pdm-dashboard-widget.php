<?php

/**
 * Snippet Name: PDM Custom Dashboard Widget
 * Description: Adds a custom welcome widget to the WordPress dashboard for Performance Driven Marketing clients
 * Category: Admin
 */

/**
 * Register a custom Welcome Dashboard Widget for PDM
 */
add_action('wp_dashboard_setup', 'pdm_custom_dashboard_widget');

function pdm_custom_dashboard_widget()
{
    wp_add_dashboard_widget(
        'pdm_welcome_widget',                 // Widget slug
        'Performance Driven Marketing',       // Widget title
        'pdm_welcome_widget_display'          // Display function
    );
}

function pdm_welcome_widget_display()
{
    $logo_url = plugin_dir_url(dirname(__FILE__, 4)) . 'assets/img/pdm-logo.svg';
?>
    <div style="text-align: center; padding: 20px 10px;">
        <img src="<?php echo esc_url($logo_url); ?>" alt="PDM Logo" style="width: 150px; height: auto; padding: 16px; margin-bottom: 20px; background: black;">

        <h2 style="font-size: 1.4em; font-weight: 600; margin-bottom: 20px; color: #23282d; line-height: 1.3; text-wrap: balance;">
            Welcome to your Performance Driven Marketing Website
        </h2>

        <a href="https://www.performancedrivenmarketing.com/contact-us/support/"
            target="_blank"
            rel="noopener"
            class="button button-primary"
            style="background-color: #e96a25; border-color: #e96a25; color: #fff!important; text-shadow: none; box-shadow: none;">
            Need Support? Click Here
        </a>
    </div>

    <style>
        #pdm_welcome_widget {
            border: 2px solid #e96a25;
        }

        #pdm_welcome_widget h2.hndle {
            color: #23282d;
        }

        #pdm_welcome_widget .button-primary:hover {
            background-color: #d15a1d !important;
            border-color: #d15a1d !important;
        }
    </style>
<?php
}
