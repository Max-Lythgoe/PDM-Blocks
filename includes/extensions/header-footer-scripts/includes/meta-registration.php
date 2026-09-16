<?php

/**
 * Header / Footer Scripts — REST registration of the per-post script meta.
 *
 * This is what lets the block editor read and write per-page scripts through
 * `editPost()` without any meta box at all.
 *
 * Notes on the chosen shape (see includes/scripts-data.php for the history):
 * `register_meta()` only accepts a single scalar `type`, and the `array` type
 * additionally requires an item schema — so the scripts are registered as a
 * `string` holding JSON. Values written by the old meta box are serialized PHP
 * arrays; they are still valid to read and are transparently converted to JSON
 * the next time the post is saved (from either the block editor or the legacy
 * meta box), so no existing script is ever dropped.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the script meta keys for every supported post type.
 */
function pdm_hfs_register_scripts_meta()
{
    foreach (pdm_hfs_meta_keys() as $meta_key) {
        foreach (pdm_hfs_supported_post_types() as $post_type) {
            register_post_meta(
                $post_type,
                $meta_key,
                array(
                    'type'              => 'string',
                    'single'            => true,
                    'default'           => '',
                    'show_in_rest'      => true,
                    'sanitize_callback' => 'pdm_hfs_sanitize_scripts_meta',
                    'auth_callback'     => 'pdm_hfs_auth_scripts_meta',
                )
            );
        }
    }
}
add_action('init', 'pdm_hfs_register_scripts_meta', 11);
