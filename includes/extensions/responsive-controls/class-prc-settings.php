<?php

/**
 * PRC Settings - Manages responsive controls settings and breakpoints.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Settings')) :
	class PRC_Settings
	{

		const OPTION_PREFIX       = 'pdm_accelerate__responsive';
		const CAPABILITY          = 'manage_options';
		const MENU_PAGE_SLUG      = 'pdm-responsive-controls';
		const TEMPLATES_FOLDER    = PDM_PRC_DIR . 'admin/templates/';

		protected static $allowed_breakpoint_units = array('px', 'em', 'rem', 'vw', 'vh');

		/**
		 * Add admin submenu page under Appearance.
		 */
		public static function register_admin_page()
		{
			add_theme_page(
				__('Responsive Controls', 'pdm-accelerate'),
				__('Responsive Controls', 'pdm-accelerate'),
				self::CAPABILITY,
				self::MENU_PAGE_SLUG,
				array(self::class, 'render_settings_page')
			);
		}

		/**
		 * Render the settings page.
		 */
		public static function render_settings_page()
		{
			$template = self::TEMPLATES_FOLDER . 'settings-page.php';
			if (is_file($template) && is_readable($template)) {
				include $template;
			}
		}

		/**
		 * Register settings fields.
		 */
		public static function settings_init()
		{
			add_settings_section(
				self::OPTION_PREFIX . '_section',
				'',
				null,
				self::MENU_PAGE_SLUG
			);

			self::register_breakpoint_field();
		}

		/**
		 * Register and enqueue the breakpoints field + script.
		 */
		private static function register_breakpoint_field()
		{
			$option_name = self::build_breakpoints_option_name();

			register_setting(
				self::OPTION_PREFIX . '_settings',
				$option_name,
				array(
					'default'           => array(),
					'type'              => 'array',
					'sanitize_callback' => array(self::class, 'sanitize_breakpoints'),
				)
			);

			add_settings_field(
				$option_name,
				__('Breakpoints', 'pdm-accelerate'),
				function () {
					$template = self::TEMPLATES_FOLDER . 'breakpoints.php';
					if (is_file($template) && is_readable($template)) {
						include $template;
					}
				},
				self::MENU_PAGE_SLUG,
				self::OPTION_PREFIX . '_section'
			);

			// Register and conditionally enqueue the JS
			$handle = self::OPTION_PREFIX . '_breakpoints_script';
			$js_path = PDM_PRC_DIR . 'admin/js/breakpoints.js';
			$js_url  = PDM_PRC_URL . 'admin/js/breakpoints.js';

			wp_register_script(
				$handle,
				$js_url,
				array(),
				file_exists($js_path) ? filemtime($js_path) : '1.0.0',
				array('in_footer' => true)
			);

			$translations = array(
				'remove_breakpoint_confirm_message' => esc_js(__('Do you want to remove this breakpoint?', 'pdm-accelerate')),
				'remove_breakpoint_button_title'    => esc_js(__('Remove breakpoint', 'pdm-accelerate')),
			);

			$inline = 'const PRC_BREAKPOINT_SETTINGS = ' . wp_json_encode(array(
				'ALLOWED_SIZE_UNITS' => self::$allowed_breakpoint_units,
				'WP_OPTION_NAME'     => $option_name,
				'I18N_TRANSLATIONS'  => $translations,
			)) . ';';

			// Initialize the Map with active breakpoints
			$inline .= 'PRC_BREAKPOINT_SETTINGS.BREAKPOINT_LIST = new Map();' . "\n";
			foreach (self::get_active_breakpoints() as $key => $bp) {
				$inline .= sprintf(
					'PRC_BREAKPOINT_SETTINGS.BREAKPOINT_LIST.set(\'%s\', %s);',
					esc_js((string) $key),
					wp_json_encode($bp)
				) . "\n";
			}

			wp_add_inline_script($handle, $inline, 'before');

			add_action('admin_enqueue_scripts', function ($hook) use ($handle) {
				if ('appearance_page_' . self::MENU_PAGE_SLUG !== $hook) {
					return;
				}
				wp_enqueue_script($handle);
			});
		}

		/**
		 * Sanitize breakpoints before saving.
		 *
		 * @param array $options Raw option values.
		 * @return array Sanitized values.
		 */
		public static function sanitize_breakpoints($options)
		{
			$current = self::get_breakpoints();

			foreach ($options as $key => $data) {
				$sanitized           = $data;
				$sanitized['name']   = (string) $data['name'];
				$sanitized['value']  = floatval($data['value']);
				$sanitized['active'] = true;

				$options[$key] = $sanitized;

				if (
					! in_array($sanitized['unit'], self::$allowed_breakpoint_units, true)
					|| empty($sanitized['name'])
					|| strlen($sanitized['name']) > 20
					|| empty($sanitized['value'])
					|| $sanitized['value'] < 0
					|| $sanitized['value'] > 9999
				) {
					if (array_key_exists($key, $current)) {
						$options[$key] = $current[$key];
					} else {
						unset($options[$key]);
					}
					continue;
				}
			}

			// Mark removed breakpoints as inactive
			foreach (array_diff_key($current, $options) as $key => $data) {
				$options[$key]           = $data;
				$options[$key]['active'] = false;
			}

			return $options;
		}

		/**
		 * Get all breakpoints (including inactive).
		 *
		 * @return array
		 */
		public static function get_breakpoints()
		{
			return (array) get_option(
				self::build_breakpoints_option_name(),
				self::get_default_breakpoints()
			);
		}

		/**
		 * Get only active breakpoints.
		 *
		 * @return array
		 */
		public static function get_active_breakpoints()
		{
			return array_filter(
				self::get_breakpoints(),
				function ($bp) {
					return ! empty($bp['active']);
				}
			);
		}

		/**
		 * Get default breakpoints.
		 *
		 * @return array
		 */
		private static function get_default_breakpoints()
		{
			return array(
				'mobile' => array(
					'name'   => __('Mobile', 'pdm-accelerate'),
					'value'  => '480',
					'unit'   => 'px',
					'active' => true,
				),
				'tablet' => array(
					'name'   => __('Tablet', 'pdm-accelerate'),
					'value'  => '960',
					'unit'   => 'px',
					'active' => true,
				),
			);
		}

		/**
		 * Build the WP option key for breakpoints.
		 *
		 * @return string
		 */
		public static function build_breakpoints_option_name()
		{
			return self::OPTION_PREFIX . '__breakpoints';
		}

		/**
		 * Build breakpoints data array for JS injection.
		 *
		 * @return array
		 */
		public static function get_breakpoints_for_js()
		{
			$data = array();
			foreach (self::get_breakpoints() as $key => $bp) {
				$data[] = array(
					'key'    => $key,
					'name'   => $bp['name'],
					'value'  => $bp['value'] . $bp['unit'],
					'active' => ! empty($bp['active']),
				);
			}
			return $data;
		}
	}

endif;
