<?php

/**
 * Header / Footer Scripts — shared data helpers.
 *
 * Storage history
 * ---------------
 * Per-post scripts have been stored in two different shapes over time:
 *
 * 1. Legacy (PDM Accelerate theme + the original plugin meta box):
 *    the `_hfs_header_scripts` / `_hfs_footer_scripts` post meta keys hold a
 *    *serialized PHP array* of `array( 'name' => string, 'code' => string )`.
 *
 * 2. Current (block editor panel): the exact same meta keys hold a *JSON
 *    string*. WordPress only supports a single scalar type per registered meta
 *    key (and the `array` type requires an item schema), so a JSON string is the
 *    only shape that can be registered with the REST API reliably.
 *
 * Every read goes through `pdm_hfs_normalize_scripts()`, which understands both
 * shapes (plus a couple of defensive fallbacks), so scripts written by the old
 * meta box are never lost after the plugin updates.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The post meta keys used to store per-post scripts, keyed by location.
 *
 * @return array<string, string>
 */
function pdm_hfs_meta_keys()
{
    return array(
        'header' => '_hfs_header_scripts',
        'footer' => '_hfs_footer_scripts',
    );
}

/**
 * Meta key for a single location.
 *
 * @param string $location Either 'header' or 'footer'.
 * @return string
 */
function pdm_hfs_meta_key($location)
{
    $keys = pdm_hfs_meta_keys();

    return isset($keys[$location]) ? $keys[$location] : $keys['header'];
}

/**
 * Post types that can hold per-post scripts.
 *
 * Matches the original meta box (every public post type) and is filterable.
 *
 * @return string[]
 */
function pdm_hfs_supported_post_types()
{
    static $post_types = null;

    if (null === $post_types) {
        $post_types = array_values(get_post_types(array('public' => true), 'names'));

        /**
         * Filters the post types that support per-post header/footer scripts.
         *
         * @param string[] $post_types Post type names.
         */
        $post_types = array_values(array_filter((array) apply_filters('pdm_hfs_supported_post_types', $post_types)));
    }

    return $post_types;
}

/**
 * Normalise any stored representation of scripts into a clean list.
 *
 * Handles, in order: an array of scripts (legacy meta / global options), a JSON
 * string (current storage), a double-encoded string, a single script array, and
 * a raw string. Anything that already looks like script data is preserved.
 *
 * @param mixed $value      Stored value.
 * @param bool  $keep_empty Whether fully empty rows should be kept. The editor
 *                          needs them (a row being filled in is empty at first),
 *                          the frontend does not.
 * @return array<int, array{name: string, code: string}>
 */
function pdm_hfs_normalize_scripts($value, $keep_empty = false)
{
    if (is_object($value)) {
        $value = get_object_vars($value);
    }

    if (is_string($value)) {
        $value = trim($value);

        if ('' === $value) {
            return array();
        }

        $decoded = json_decode($value, true);

        if (is_array($decoded)) {
            $value = $decoded;
        } else {
            // Defensive: some installs may have double-encoded the JSON payload.
            $unserialized = @unserialize($value, array('allowed_classes' => false));

            if (is_array($unserialized)) {
                $value = $unserialized;
            } else {
                // A raw string is kept as a single script rather than dropped.
                return array(array('name' => '', 'code' => $value));
            }
        }
    }

    if (!is_array($value)) {
        return array();
    }

    // A single script (associative) rather than a list of scripts.
    if (isset($value['code']) || isset($value['name'])) {
        $value = array($value);
    }

    $scripts = array();

    foreach ($value as $script) {
        if (is_string($script)) {
            $script = array('name' => '', 'code' => $script);
        }

        if (!is_array($script)) {
            continue;
        }

        $name = isset($script['name']) ? (string) $script['name'] : '';
        $code = isset($script['code']) ? (string) $script['code'] : '';

        if (!$keep_empty && '' === trim($name) && '' === trim($code)) {
            continue;
        }

        $scripts[] = array(
            'name' => $name,
            'code' => $code,
        );
    }

    return $scripts;
}

/**
 * Read the scripts stored against a post, in whichever format they were saved.
 *
 * @param int    $post_id    Post ID.
 * @param string $location   Either 'header' or 'footer'.
 * @param bool   $keep_empty Whether fully empty rows should be kept.
 * @return array<int, array{name: string, code: string}>
 */
function pdm_hfs_get_post_scripts($post_id, $location, $keep_empty = false)
{
    $value = get_post_meta($post_id, pdm_hfs_meta_key($location), true);

    return pdm_hfs_normalize_scripts($value, $keep_empty);
}

/**
 * Encode a list of scripts for storage / the block editor.
 *
 * @param mixed $value Anything `pdm_hfs_normalize_scripts()` understands.
 * @return string JSON string.
 */
function pdm_hfs_encode_scripts($value)
{
    return (string) wp_json_encode(array_values(pdm_hfs_normalize_scripts($value, true)));
}

/**
 * Write scripts to a post's meta, encoded as JSON.
 *
 * `update_post_meta()` runs `wp_unslash()` on the value before it reaches the
 * database, so the payload has to be slashed first — otherwise every backslash
 * inside the script code would be silently stripped.
 *
 * @param int                                                    $post_id  Post ID.
 * @param string                                                 $location Either 'header' or 'footer'.
 * @param array<int, array{name: string, code: string}>|mixed     $scripts  Scripts to store.
 * @return bool True when the value was written.
 */
function pdm_hfs_update_post_scripts($post_id, $location, $scripts)
{
    return (bool) update_post_meta(
        $post_id,
        pdm_hfs_meta_key($location),
        wp_slash(pdm_hfs_encode_scripts($scripts))
    );
}

/**
 * Sanitize callback for the registered script meta.
 *
 * Keeps the stored value a valid JSON string no matter which format was passed
 * in, which means the legacy meta box (and any third-party code) can keep
 * writing serialized arrays while the block editor reads/writes JSON.
 *
 * @param mixed $value Raw meta value.
 * @return string JSON string.
 */
function pdm_hfs_sanitize_scripts_meta($value)
{
    return pdm_hfs_encode_scripts($value);
}

/**
 * Authorization callback for the registered script meta.
 *
 * `_`-prefixed (protected) meta defaults to `__return_false`, so an explicit
 * capability check is required for REST reads and writes to work.
 *
 * @param bool   $allowed  Whether the user can add/edit the meta.
 * @param string $meta_key Meta key.
 * @param int    $post_id  Post ID.
 * @param int    $user_id  User ID.
 * @param string $cap      Capability being checked.
 * @param array  $caps     Primitive capabilities required.
 * @return bool
 */
function pdm_hfs_auth_scripts_meta($allowed, $meta_key, $post_id, $user_id, $cap, $caps)
{
    return user_can($user_id, 'edit_post', $post_id);
}
