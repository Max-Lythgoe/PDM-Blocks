<?php

/**
 * SlotFill Registration - Meta fields for block editor
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register meta fields for block editor (deregister theme version first).
 */
add_action('init', function () {
    $meta_keys = array('_hfs_header_scripts', '_hfs_footer_scripts');
    $post_types = array('post', 'page');

    foreach ($post_types as $post_type) {
        foreach ($meta_keys as $meta_key) {
            // Unregister theme's version if already registered
            if (registered_meta_key_exists('post', $meta_key, $post_type)) {
                unregister_post_meta($post_type, $meta_key);
            }

            register_post_meta($post_type, $meta_key, array(
                'show_in_rest' => array(
                    'schema' => array(
                        'type'    => array('string', 'null'),
                        'default' => '',
                    ),
                ),
                'single'       => true,
                'type'         => 'string',
                'default'      => '',
                'auth_callback' => '__return_true',
            ));
        }
    }
}, 20);
