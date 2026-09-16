<?php

/**
 * Header / Footer Scripts — one-time legacy data migration.
 *
 * The removed meta box stored `_hfs_header_scripts` / `_hfs_footer_scripts` as
 * a *serialized PHP array*. The block editor registers those same keys as a
 * REST-exposed `string` holding JSON, so this migration converts the old values
 * once so every post ends up in the new format.
 *
 * Nothing is deleted before the replacement value has been written, and reads
 * fall back to the legacy format on their own (see includes/scripts-data.php),
 * so scripts survive even if this migration never gets a chance to run.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

define('PDM_HFS_LEGACY_META_FLAG', 'pdm_hfs_legacy_scripts_meta_migrated');

/**
 * Convert legacy serialized-array script meta into JSON strings.
 *
 * Runs once, for administrators only, on `admin_init`.
 */
function pdm_hfs_migrate_legacy_scripts_meta()
{
    if (get_option(PDM_HFS_LEGACY_META_FLAG)) {
        return;
    }

    // `edit_post_meta` needs a post-level capability, so only run for a user who
    // is guaranteed to have it. Editors/contributors logging in first must not
    // block the migration, so nothing is flagged in that case.
    if (!current_user_can('manage_options')) {
        return;
    }

    // Guard against two admin requests starting the migration at the same time.
    if (get_transient('pdm_hfs_migrating_scripts')) {
        return;
    }

    set_transient('pdm_hfs_migrating_scripts', 1, 5 * MINUTE_IN_SECONDS);

    global $wpdb;

    $meta_keys = array_values(pdm_hfs_meta_keys());

    $post_ids = $wpdb->get_col(
        $wpdb->prepare(
            "SELECT DISTINCT post_id FROM {$wpdb->postmeta} WHERE meta_key IN (%s, %s) LIMIT 5000",
            $meta_keys[0],
            $meta_keys[1]
        )
    );

    if (!is_array($post_ids)) {
        $post_ids = array();
    }

    foreach ($post_ids as $post_id) {
        foreach (pdm_hfs_meta_keys() as $location => $meta_key) {
            $value = get_post_meta($post_id, $meta_key, true);

            // Only serialized arrays need converting; JSON strings are already done.
            if (!is_array($value)) {
                continue;
            }

            $scripts = pdm_hfs_normalize_scripts($value, true);

            if (!pdm_hfs_update_post_scripts($post_id, $location, $scripts)) {
                // A write failed — leave the flag unset so it is retried later.
                delete_transient('pdm_hfs_migrating_scripts');
                return;
            }
        }
    }

    delete_transient('pdm_hfs_migrating_scripts');
    update_option(PDM_HFS_LEGACY_META_FLAG, 1, false);
}
