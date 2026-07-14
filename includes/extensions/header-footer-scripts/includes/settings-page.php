<?php

/**
 * Settings Page for Custom Code
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add settings page to admin menu
 */
function pdm_hfs_add_settings_page()
{
    add_menu_page(
        'Custom Code',
        'Custom Code',
        'manage_options',
        'custom-code',
        'pdm_hfs_render_settings_page',
        'dashicons-editor-code',
        80
    );

    add_submenu_page(
        'custom-code',
        'Scripts',
        'Scripts',
        'manage_options',
        'custom-code',
        'pdm_hfs_render_settings_page'
    );

    add_submenu_page(
        'custom-code',
        'PHP Snippets',
        'PHP Snippets',
        'manage_options',
        'custom-code&tab=php',
        'pdm_hfs_render_settings_page'
    );
}

/**
 * Render the settings page
 */
function pdm_hfs_render_settings_page()
{
    if (!current_user_can('manage_options')) {
        return;
    }

    $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'scripts';

    if (isset($_POST['pdm_hfs_save_settings']) && check_admin_referer('pdm_hfs_settings_action', 'pdm_hfs_settings_nonce')) {
        pdm_hfs_save_settings();
        echo '<div class="notice notice-success is-dismissible"><p>Settings saved successfully!</p></div>';
    }

    $header_scripts = get_option('hfs_header_scripts', array());
    $footer_scripts = get_option('hfs_footer_scripts', array());
?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <nav class="nav-tab-wrapper">
            <a href="?page=custom-code&tab=scripts" class="nav-tab <?php echo $active_tab === 'scripts' ? 'nav-tab-active' : ''; ?>">
                Scripts
            </a>
            <a href="?page=custom-code&tab=php" class="nav-tab <?php echo $active_tab === 'php' ? 'nav-tab-active' : ''; ?>">
                PHP Snippets
            </a>
        </nav>

        <div class="hfs-tab-content">
            <?php if ($active_tab === 'scripts') : ?>
                <p>Add custom scripts to your website's header or footer. These scripts will be output globally on all pages.</p>

                <form method="post" action="">
                    <?php wp_nonce_field('pdm_hfs_settings_action', 'pdm_hfs_settings_nonce'); ?>

                    <div class="hfs-section">
                        <h2>Header Scripts</h2>
                        <p class="description">Scripts will be output at the end of the <code>&lt;head&gt;</code> tag.</p>

                        <div id="hfs-header-scripts-container">
                            <?php
                            if (!empty($header_scripts)) {
                                foreach ($header_scripts as $index => $script) {
                                    pdm_hfs_render_script_row('header', $index, $script);
                                }
                            } else {
                                pdm_hfs_render_script_row('header', 0);
                            }
                            ?>
                        </div>

                        <button type="button" class="button hfs-add-script" data-type="header">
                            Add Header Script
                        </button>
                    </div>

                    <hr style="margin: 30px 0;">

                    <div class="hfs-section">
                        <h2>Footer Scripts</h2>
                        <p class="description">Scripts will be output just before the closing <code>&lt;/body&gt;</code> tag.</p>

                        <div id="hfs-footer-scripts-container">
                            <?php
                            if (!empty($footer_scripts)) {
                                foreach ($footer_scripts as $index => $script) {
                                    pdm_hfs_render_script_row('footer', $index, $script);
                                }
                            } else {
                                pdm_hfs_render_script_row('footer', 0);
                            }
                            ?>
                        </div>

                        <button type="button" class="button hfs-add-script" data-type="footer">
                            Add Footer Script
                        </button>
                    </div>

                    <?php submit_button('Save Settings', 'primary', 'pdm_hfs_save_settings'); ?>
                </form>

            <?php elseif ($active_tab === 'php') : ?>
                <p>Manage PHP code snippets for your website. Activate snippets to run them automatically.</p>
                <?php pdm_hfs_render_snippets_tab(); ?>
            <?php endif; ?>
        </div>
    </div>
<?php
}

function pdm_hfs_render_script_row($type, $index, $script = array())
{
    $name = isset($script['name']) ? $script['name'] : '';
    $code = isset($script['code']) ? $script['code'] : '';
?>
    <div class="hfs-script-row">
        <div class="hfs-script-header">
            <input
                type="text"
                name="hfs_<?php echo esc_attr($type); ?>_scripts[<?php echo esc_attr($index); ?>][name]"
                value="<?php echo esc_attr($name); ?>"
                placeholder="Script Name (e.g., Google Analytics, Facebook Pixel)"
                class="hfs-script-name" />
            <button type="button" class="button hfs-remove-script" title="Remove this script">
                <span class="dashicons dashicons-trash"></span>
            </button>
        </div>
        <textarea
            name="hfs_<?php echo esc_attr($type); ?>_scripts[<?php echo esc_attr($index); ?>][code]"
            placeholder="Enter your script code here..."
            class="hfs-script-code"
            rows="8"><?php echo esc_textarea($code); ?></textarea>
    </div>
<?php
}

function pdm_hfs_save_settings()
{
    $header_scripts = array();
    if (isset($_POST['hfs_header_scripts']) && is_array($_POST['hfs_header_scripts'])) {
        foreach ($_POST['hfs_header_scripts'] as $script) {
            if (!empty($script['name']) || !empty($script['code'])) {
                $header_scripts[] = array(
                    'name' => sanitize_text_field($script['name']),
                    'code' => wp_unslash($script['code'])
                );
            }
        }
    }
    update_option('hfs_header_scripts', $header_scripts);

    $footer_scripts = array();
    if (isset($_POST['hfs_footer_scripts']) && is_array($_POST['hfs_footer_scripts'])) {
        foreach ($_POST['hfs_footer_scripts'] as $script) {
            if (!empty($script['name']) || !empty($script['code'])) {
                $footer_scripts[] = array(
                    'name' => sanitize_text_field($script['name']),
                    'code' => wp_unslash($script['code'])
                );
            }
        }
    }
    update_option('hfs_footer_scripts', $footer_scripts);
}
