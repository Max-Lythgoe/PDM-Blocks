<?php

/**
 * PRC Style Collector - Accumulates CSS rules generated during block rendering
 * and outputs them in a single <style> tag.
 *
 * Supports nested media-query structures identical to how the Better Block Editor
 * plugin stores CSS via its StyleEngine.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Style_Collector')) :
	class PRC_Style_Collector
	{

		/**
		 * Accumulated raw CSS rules.
		 *
		 * Each entry is a string.
		 *
		 * @var string[]
		 */
		private static $css_rules = array();

		/**
		 * Whether the output hooks have been registered.
		 *
		 * @var bool
		 */
		private static $hooks_registered = false;

		/**
		 * Whether output has already been rendered (prevents duplicates).
		 *
		 * @var bool
		 */
		private static $output_done = false;

		/**
		 * Register output hooks once.
		 */
		public static function init()
		{
			if (self::$hooks_registered) {
				return;
			}
			self::$hooks_registered = true;

			// Block themes: output in <head>
			add_action('wp_enqueue_scripts', array(self::class, 'output_styles'), 20);

			// Classic themes / fallback: output in footer
			add_action('wp_footer', array(self::class, 'output_styles'), 2);
		}

		/**
		 * Add a plain CSS rule string.
		 *
		 * @param string $css Raw CSS.
		 */
		public static function add_raw_css(string $css)
		{
			if (! empty(trim($css))) {
				self::$css_rules[] = $css;
			}
		}

		/**
		 * Add a standard CSS rule (selector + declarations).
		 *
		 * @param string $selector
		 * @param array  $declarations  Associative array of property => value.
		 */
		public static function add_rule(string $selector, array $declarations)
		{
			if (empty($declarations)) {
				return;
			}
			self::add_raw_css(self::compile_rule($selector, $declarations));
		}

		/**
		 * Add a media-query rule containing one or more inner selectors.
		 *
		 * @param string $media_query  e.g. '@media screen and (width <= 480px)'.
		 * @param string $selector     Inner selector.
		 * @param array  $declarations Associative array of property => value.
		 */
		public static function add_media_rule(string $media_query, string $selector, array $declarations)
		{
			if (empty($declarations)) {
				return;
			}

			$inner = self::compile_rule($selector, $declarations);
			self::add_raw_css("{$media_query}{{$inner}}");
		}

		/**
		 * Add CSS rules using the nested array format used by the plugin:
		 *
		 * [
		 *   [
		 *     'selector'     => '@media ...',
		 *     'declarations' => [
		 *       [ 'selector' => '.foo', 'declarations' => [ 'color' => 'red' ] ],
		 *       ...
		 *     ],
		 *   ],
		 *   [
		 *     'selector'     => '.bar',
		 *     'declarations' => [ 'display' => 'block' ],
		 *   ],
		 * ]
		 *
		 * @param array $css_rules
		 */
		public static function add_rules_array(array $css_rules)
		{
			foreach ($css_rules as $rule) {
				$selector     = $rule['selector'] ?? '';
				$declarations = $rule['declarations'] ?? array();

				if (empty($selector) || empty($declarations)) {
					continue;
				}

				// Check if declarations is a nested array (media query style)
				if (isset($declarations[0]) && is_array($declarations[0])) {
					// Media query block
					$inner_css = '';
					foreach ($declarations as $inner) {
						$inner_selector     = $inner['selector'] ?? '';
						$inner_declarations = $inner['declarations'] ?? array();
						if (! empty($inner_selector) && ! empty($inner_declarations)) {
							$inner_css .= self::compile_rule($inner_selector, $inner_declarations);
						}
					}
					if (! empty($inner_css)) {
						self::add_raw_css("{$selector}{{$inner_css}}");
					}
				} else {
					// Regular selector block
					self::add_rule($selector, $declarations);
				}
			}
		}

		/**
		 * Output all accumulated CSS as an inline style tag.
		 *
		 * In block themes, wp_enqueue_scripts fires before blocks render so the rules
		 * may be empty. Always check and output whenever rules exist.
		 */
		public static function output_styles()
		{
			// Skip if no CSS rules accumulated yet (blocks may not have rendered).
			// Important: do NOT set $output_done here — rules might arrive before the
			// next hook call (e.g., wp_enqueue_scripts → block rendering → wp_footer).
			if (empty(self::$css_rules)) {
				return;
			}

			// Prevent double output if both wp_enqueue_scripts and wp_footer fire
			// with rules available (unlikely but safe).
			if (self::$output_done) {
				return;
			}
			self::$output_done = true;

			$css = implode('', self::$css_rules);

			// Preprocess: convert WP preset var syntax to CSS variables
			$css = preg_replace(
				'/var:preset\|(.+)\|([a-z0-9-]+)/',
				'var(--wp--preset--$1--$2)',
				$css
			);

			// Direct output to avoid wp_add_inline_style registration timing issues
			echo "\n<style id=\"prc-responsive-controls\">\n" . $css . "\n</style>\n";

			self::$css_rules = array();
		}

		/**
		 * Compile a selector + declarations into a CSS rule string.
		 *
		 * @param string $selector
		 * @param array  $declarations
		 * @return string
		 */
		private static function compile_rule(string $selector, array $declarations): string
		{
			$props = '';
			foreach ($declarations as $property => $value) {
				$props .= "{$property}:{$value};";
			}
			return "{$selector}{{$props}}";
		}
	}

endif;
