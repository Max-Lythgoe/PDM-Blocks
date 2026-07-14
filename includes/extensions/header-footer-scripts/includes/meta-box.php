<?php

/**
 * Meta Box for Per-Page Scripts
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add meta boxes
 */
function pdm_hfs_add_meta_boxes()
{
    $post_types = get_post_types(array('public' => true), 'names');

    foreach ($post_types as $post_type) {
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

    $header_scripts = get_post_meta($post->ID, '_hfs_header_scripts', true);
    $footer_scripts = get_post_meta($post->ID, '_hfs_footer_scripts', true);

    if (!is_array($header_scripts)) {
        $header_scripts = array();
    }
    if (!is_array($footer_scripts)) {
        $footer_scripts = array();
    }
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

    $header_scripts = array();
    if (isset($_POST['hfs_meta_header_scripts']) && is_array($_POST['hfs_meta_header_scripts'])) {
        foreach ($_POST['hfs_meta_header_scripts'] as $script) {
            if (!empty($script['name']) || !empty($script['code'])) {
                $header_scripts[] = array(
                    'name' => sanitize_text_field($script['name']),
                    'code' => wp_unslash($script['code'])
                );
            }
        }
    }
    update_post_meta($post_id, '_hfs_header_scripts', $header_scripts);

    $footer_scripts = array();
    if (isset($_POST['hfs_meta_footer_scripts']) && is_array($_POST['hfs_meta_footer_scripts'])) {
        foreach ($_POST['hfs_meta_footer_scripts'] as $script) {
            if (!empty($script['name']) || !empty($script['code'])) {
                $footer_scripts[] = array(
                    'name' => sanitize_text_field($script['name']),
                    'code' => wp_unslash($script['code'])
                );
            }
        }
    }
    update_post_meta($post_id, '_hfs_footer_scripts', $footer_scripts);
}
