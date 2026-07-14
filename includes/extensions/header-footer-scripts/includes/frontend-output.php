<?php

/**
 * Frontend Output Functions
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Output header scripts
 */
function pdm_hfs_output_header_scripts()
{
    $global_scripts = get_option('hfs_header_scripts', array());
    if (!empty($global_scripts)) {
        echo "\n<!-- Custom Code - Global Header Scripts -->\n";
        foreach ($global_scripts as $script) {
            if (!empty($script['code'])) {
                echo $script['code'] . "\n";
            }
        }
    }

    if (is_singular()) {
        global $post;
        $page_scripts = get_post_meta($post->ID, '_hfs_header_scripts', true);

        if (!empty($page_scripts) && is_array($page_scripts)) {
            echo "\n<!-- Custom Code - Page-Specific Header Scripts -->\n";
            foreach ($page_scripts as $script) {
                if (isset($script['code']) && !empty($script['code'])) {
                    echo $script['code'] . "\n";
                }
            }
        }
    }
}

/**
 * Output footer scripts
 */
function pdm_hfs_output_footer_scripts()
{
    $global_scripts = get_option('hfs_footer_scripts', array());
    if (!empty($global_scripts)) {
        echo "\n<!-- Custom Code - Global Footer Scripts -->\n";
        foreach ($global_scripts as $script) {
            if (!empty($script['code'])) {
                echo $script['code'] . "\n";
            }
        }
    }

    if (is_singular()) {
        global $post;
        $page_scripts = get_post_meta($post->ID, '_hfs_footer_scripts', true);

        if (!empty($page_scripts) && is_array($page_scripts)) {
            echo "\n<!-- Custom Code - Page-Specific Footer Scripts -->\n";
            foreach ($page_scripts as $script) {
                if (isset($script['code']) && !empty($script['code'])) {
                    echo $script['code'] . "\n";
                }
            }
        }
    }
}
