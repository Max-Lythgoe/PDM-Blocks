<?php

/**
 * Responsive Controls - Responsive block controls for the Gutenberg editor.
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

defined('ABSPATH') || exit;

// ---------------------------------------------------------------------------
// Constants (use plugin-specific prefix to avoid conflict with theme)
// ---------------------------------------------------------------------------
define('PDM_PRC_DIR', plugin_dir_path(__FILE__));
define('PDM_PRC_URL', plugin_dir_url(__FILE__));

// Note: PRC_DIR / PRC_URL are intentionally NOT defined here.
// The theme defines them — if both are active the plugin uses PDM_PRC_DIR internally.

// ---------------------------------------------------------------------------
// Unhook theme's version if active (runs before plugin's init registration)
// ---------------------------------------------------------------------------
add_action('init', function () {
    if (defined('PRC_DIR') && PRC_DIR !== PDM_PRC_DIR) {
        remove_action('enqueue_block_editor_assets', 'prc_enqueue_editor_assets', 9);
        remove_action('admin_menu', ['PRC_Settings', 'register_admin_page']);
        remove_action('admin_init', ['PRC_Settings', 'settings_init']);
    }
}, 1);

// ---------------------------------------------------------------------------
// Autoload core classes (use plugin path — skip if theme already loaded them)
// ---------------------------------------------------------------------------
if (!class_exists('PRC_Settings')) {
    require_once PDM_PRC_DIR . 'class-prc-settings.php';
}
if (!class_exists('PRC_Breakpoints')) {
    require_once PDM_PRC_DIR . 'class-prc-breakpoints.php';
}
if (!class_exists('PRC_Block_Utils')) {
    require_once PDM_PRC_DIR . 'class-prc-block-utils.php';
}
if (!class_exists('PRC_Style_Collector')) {
    require_once PDM_PRC_DIR . 'class-prc-style-collector.php';
}
if (!class_exists('PRC_Responsive_Base')) {
    require_once PDM_PRC_DIR . 'class-prc-responsive-base.php';
}

// Modules
if (!class_exists('PRC_Row_Responsive')) {
    require_once PDM_PRC_DIR . 'modules/class-prc-row-responsive.php';
}
if (!class_exists('PRC_Group_Responsive')) {
    require_once PDM_PRC_DIR . 'modules/class-prc-group-responsive.php';
}
if (!class_exists('PRC_Grid_Responsive')) {
    require_once PDM_PRC_DIR . 'modules/class-prc-grid-responsive.php';
}
if (!class_exists('PRC_Columns_Responsive')) {
    require_once PDM_PRC_DIR . 'modules/class-prc-columns-responsive.php';
}
if (!class_exists('PRC_Buttons_Responsive')) {
    require_once PDM_PRC_DIR . 'modules/class-prc-buttons-responsive.php';
}
if (!class_exists('PRC_Text_Responsive')) {
    require_once PDM_PRC_DIR . 'modules/class-prc-text-responsive.php';
}

// ---------------------------------------------------------------------------
// Initialise the style collector
// ---------------------------------------------------------------------------
PRC_Style_Collector::init();

// ---------------------------------------------------------------------------
// Register and initialise all responsive block modules
// ---------------------------------------------------------------------------
add_action('init', function () {
    (new PRC_Row_Responsive())->register();
    (new PRC_Group_Responsive())->register();
    (new PRC_Grid_Responsive())->register();
    (new PRC_Buttons_Responsive())->register();
    (new PRC_Text_Responsive())->register();
    (new PRC_Columns_Responsive())->register();

    add_filter('render_block', function (string $block_content, array $block): string {
        if ($block_content === '') {
            return $block_content;
        }
        $prc = $block['attrs']['prcResponsive'] ?? null;
        if (!is_array($prc)) {
            return $block_content;
        }

        $prevent_shrink = !empty($prc['settings']['preventShrink']);
        $order          = isset($prc['settings']['order']) && $prc['settings']['order'] !== null && $prc['settings']['order'] !== ''
            ? (int) $prc['settings']['order']
            : null;

        if (!$prevent_shrink && null === $order) {
            return $block_content;
        }

        $class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
        $block_content = PRC_Block_Utils::append_classes($block_content, (array) $class_id);

        if ($prevent_shrink) {
            PRC_Style_Collector::add_rule(
                ".{$class_id}",
                array('flex-shrink' => '0')
            );
        }

        if (null !== $order) {
            $switch_width = PRC_Breakpoints::get_switch_width(
                $prc['breakpoint'] ?? null,
                $prc['breakpointCustomValue'] ?? null
            );
            if ($switch_width) {
                PRC_Style_Collector::add_media_rule(
                    "@media screen and (width <= {$switch_width})",
                    ".{$class_id}",
                    array('order' => (string) $order)
                );
            }
        }

        return $block_content;
    }, 21, 2);
});

// ---------------------------------------------------------------------------
// Admin settings page (Appearance > Responsive Controls)
// ---------------------------------------------------------------------------
add_action('admin_menu', array('PRC_Settings', 'register_admin_page'));
add_action('admin_init', array('PRC_Settings', 'settings_init'));

// ---------------------------------------------------------------------------
// Enqueue editor JavaScript
// ---------------------------------------------------------------------------
add_action('enqueue_block_editor_assets', 'pdm_prc_enqueue_editor_assets', 9);

function pdm_prc_enqueue_editor_assets()
{
    $js_file = PDM_PRC_DIR . '../../../build/responsive-controls-editor.js';
    $js_url  = PDM_PRC_URL . '../../../build/responsive-controls-editor.js';

    if (!file_exists($js_file)) {
        return;
    }

    $asset_file = PDM_PRC_DIR . '../../../build/responsive-controls-editor.asset.php';
    $asset = file_exists($asset_file) ? require $asset_file : array(
        'dependencies' => array('wp-block-editor', 'wp-components', 'wp-compose', 'wp-data', 'wp-element', 'wp-hooks', 'wp-i18n', 'wp-primitives'),
        'version'      => filemtime($js_file),
    );

    wp_enqueue_script(
        'prc-responsive-controls-editor',
        $js_url,
        $asset['dependencies'],
        $asset['version'],
        true
    );

    wp_add_inline_script(
        'wp-block-editor',
        'window.PRC_RESPONSIVE_DATA = ' . wp_json_encode(array(
            'breakpoints' => PRC_Settings::get_breakpoints_for_js(),
        )) . ';'
    );
}
