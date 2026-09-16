<?php

/**
 * Meta Box for Per-Page Scripts
 *
 * LEGACY FALLBACK ONLY.
 *
 * The per-page scripts are edited from the block editor panel (see
 * src/extensions/header-footer-scripts/index.js). This meta box is kept so that
 * classic-editor screens keep a working UI, and it writes to the exact same
 * meta keys using the exact same helpers, so both UIs stay in sync.
 *
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Whether the legacy meta box should be registered for a post type.
 *
 * It is skipped whenever the post type uses the block editor, because the
 * block editor panel already covers it (showing both would be confusing and
 * two save paths writing one field is a recipe for trouble).
 *
 * @param string $post_type Post type name.
 * @return bool
 */
function pdm_hfs_legacy_meta_box_enabled($post_type)
{
    $enabled = !(function_exists('use_block_editor_for_post_type') && use_block_editor_for_post_type($post_type));

    /**
     * Filters whether the legacy per-page scripts meta box is registered.
     *
     * @param bool   $enabled   Whether the meta box is enabled.
     * @param string $post_type Post type name.
     */
    return (bool) apply_filters('pdm_hfs_legacy_meta_box', $enabled, $post_type);
}

/**
 * Add meta boxes
 */
function pdm_hfs_add_meta_boxes()
{
    foreach (pdm_hfs_supported_post_types() as $post_type) {
        if (!pdm_hfs_legacy_meta_box_enabled($post_type)) {
            continue;
        }

        add_meta_box(
            'pdm_hfs_page_scripts',
            'Custom Code - Page Scripts',
            'pdm_hfs_render_meta_box',
            $post_type,
            'normal',
            'low'
        );
    }
}

function pdm_hfs_render_meta_box($post)
{
    wp_nonce_field('pdm_hfs_save_meta_box', 'pdm_hfs_meta_box_nonce');

    // Reads legacy serialized arrays and current JSON strings alike.
    $header_scripts = pdm_hfs_get_post_scripts($post->ID, 'header', true);
    $footer_scripts = pdm_hfs_get_post_scripts($post->ID, 'footer', true);
?>
    <div class="hfs-meta-box">
        <p class="description">Add custom scripts specific to this page. These will be output in addition to any global scripts.</p>

        <div class="hfs-meta-section">
            <h3>Header Scripts</h3>
            <div id="hfs-meta-header-scripts">
                <?php
                if (!empty($header_scripts)) {
                    foreach ($header_scripts as $index => $script) {
                        pdm_hfs_render_meta_script_row('header', $index, $script);
                    }
                } else {
                    pdm_hfs_render_meta_script_row('header', 0);
                }
                ?>
            </div>
            <button type="button" class="button hfs-add-meta-script" data-type="header">
                Add Header Script
            </button>
        </div>

        <hr style="margin: 20px 0;">

        <div class="hfs-meta-section">
            <h3>Footer Scripts</h3>
            <div id="hfs-meta-footer-scripts">
                <?php
                if (!empty($footer_scripts)) {
                    foreach ($footer_scripts as $index => $script) {
                        pdm_hfs_render_meta_script_row('footer', $index, $script);
                    }
                } else {
                    pdm_hfs_render_meta_script_row('footer', 0);
                }
                ?>
            </div>
            <button type="button" class="button hfs-add-meta-script" data-type="footer">
                Add Footer Script
            </button>
        </div>
    </div>
<?php
}

function pdm_hfs_render_meta_script_row($type, $index, $script = array())
{
    $name = isset($script['name']) ? $script['name'] : '';
    $code = isset($script['code']) ? $script['code'] : '';
?>
    <div class="hfs-meta-script-row">
        <div class="hfs-script-header">
            <input
                type="text"
                name="hfs_meta_<?php echo esc_attr($type); ?>_scripts[<?php echo esc_attr($index); ?>][name]"
                value="<?php echo esc_attr($name); ?>"
                placeholder="Script Name"
                class="hfs-script-name" />
            <button type="button" class="button hfs-remove-meta-script" title="Remove">
                <span class="dashicons dashicons-trash"></span>
            </button>
        </div>
        <textarea
            name="hfs_meta_<?php echo esc_attr($type); ?>_scripts[<?php echo esc_attr($index); ?>][code]"
            placeholder="Enter script code..."
            class="hfs-script-code"
            rows="6"><?php echo esc_textarea($code); ?></textarea>
    </div>
<?php
}

function pdm_hfs_save_meta_box_data($post_id)
{
    if (!isset($_POST['pdm_hfs_meta_box_nonce'])) {
        return;
    }

    if (!wp_verify_nonce($_POST['pdm_hfs_meta_box_nonce'], 'pdm_hfs_save_meta_box')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Note: $_POST is slashed by WordPress and `update_post_meta()` unslashes it
    // again, so the values are passed through as-is. Unslashing them here would
    // strip backslashes out of the script code.
    update_post_meta(
        $post_id,
        pdm_hfs_meta_key('header'),
        pdm_hfs_collect_posted_scripts('hfs_meta_header_scripts')
    );

    update_post_meta(
        $post_id,
        pdm_hfs_meta_key('footer'),
        pdm_hfs_collect_posted_scripts('hfs_meta_footer_scripts')
    );
}

/**
 * Collect the script rows submitted by the meta box.
 *
 * The returned value is normalised to a JSON string by the meta
 * `sanitize_callback` registered in includes/meta-registration.php, so the meta
 * box and the block editor always end up storing the same shape.
 *
 * @param string $field Name of the $_POST field holding the rows.
 * @return array<int, array{name: string, code: string}>
 */
function pdm_hfs_collect_posted_scripts($field)
{
    // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce checked by the caller.
    if (!isset($_POST[$field]) || !is_array($_POST[$field])) {
        return array();
    }

    $scripts = array();

    // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Nonce checked by the caller; script code is intentionally raw.
    foreach ($_POST[$field] as $script) {
        if (!is_array($script)) {
            continue;
        }

        $name = isset($script['name']) ? sanitize_text_field($script['name']) : '';
        $code = isset($script['code']) ? (string) $script['code'] : '';

        if ('' === $name && '' === trim($code)) {
            continue;
        }

        $scripts[] = array(
            'name' => $name,
            'code' => $code,
        );
    }

    return $scripts;
}
