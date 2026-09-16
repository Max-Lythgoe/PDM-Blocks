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
 * Comment labels used to wrap each block of output.
 *
 * Kept identical to the original strings so anything that greps the markup
 * keeps working.
 *
 * @param string $location Either 'header' or 'footer'.
 * @return array<string, string>
 */
function pdm_hfs_scope_labels($location)
{
    $labels = array(
        'header' => array(
            'global' => 'Global Header Scripts',
            'page'   => 'Page-Specific Header Scripts',
        ),
        'footer' => array(
            'global' => 'Global Footer Scripts',
            'page'   => 'Page-Specific Footer Scripts',
        ),
    );

    return isset($labels[$location]) ? $labels[$location] : $labels['header'];
}

/**
 * Print a list of scripts, wrapped in its marker comment.
 *
 * Scripts are printed raw and unescaped — that is the entire point of the
 * feature, and it is restricted to users who can edit the post.
 *
 * @param array<int, array{name: string, code: string}> $scripts Scripts to print.
 * @param string                                        $label   Marker comment label.
 * @return void
 */
function pdm_hfs_print_scripts($scripts, $label)
{
    $output = '';

    foreach ($scripts as $script) {
        if (!isset($script['code']) || '' === trim((string) $script['code'])) {
            continue;
        }

        $output .= $script['code'] . "\n";
    }

    if ('' === $output) {
        return;
    }

    // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Raw script output is intentional.
    echo "\n<!-- Custom Code - " . esc_html($label) . " -->\n" . $output;
}

/**
 * Output the global + per-post scripts for one location.
 *
 * @param string $location Either 'header' or 'footer'.
 * @return void
 */
function pdm_hfs_output_scripts($location)
{
    $labels = pdm_hfs_scope_labels($location);

    // 1. Global scripts (Custom Code > Scripts settings page).
    pdm_hfs_print_scripts(
        pdm_hfs_normalize_scripts(get_option('hfs_' . $location . '_scripts', array())),
        $labels['global']
    );

    // 2. Per-post scripts.
    if (!is_singular()) {
        return;
    }

    $post_id = get_queried_object_id();

    if (!$post_id) {
        return;
    }

    // Reads both the legacy serialized-array format and the current JSON format.
    pdm_hfs_print_scripts(pdm_hfs_get_post_scripts($post_id, $location), $labels['page']);
}

/**
 * Output header scripts
 *
 * @return void
 */
function pdm_hfs_output_header_scripts()
{
    pdm_hfs_output_scripts('header');
}

/**
 * Output footer scripts
 *
 * @return void
 */
function pdm_hfs_output_footer_scripts()
{
    pdm_hfs_output_scripts('footer');
}
