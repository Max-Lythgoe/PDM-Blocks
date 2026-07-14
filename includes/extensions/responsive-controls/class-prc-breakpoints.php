<?php

/**
 * PRC Breakpoints - Resolves a named breakpoint key to a CSS width value.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Breakpoints')) :
	class PRC_Breakpoints
	{

		const NAME_MOBILE = 'mobile';
		const NAME_TABLET = 'tablet';
		const NAME_CUSTOM = 'custom';
		const NAME_OFF    = '';

		/**
		 * Given a breakpoint key (e.g. 'mobile', 'tablet', 'custom', or custom name),
		 * return the CSS-ready width string (e.g. '480px').
		 *
		 * @param string      $breakpoint       Breakpoint key.
		 * @param string|null $custom_value     Raw value when breakpoint = 'custom'.
		 *
		 * @return string|null CSS width string, or null if off/not found.
		 */
		public static function get_switch_width($breakpoint, $custom_value = null)
		{
			if ($breakpoint === self::NAME_CUSTOM) {
				return $custom_value ?: null;
			}

			if ($breakpoint === self::NAME_OFF || empty($breakpoint)) {
				return null;
			}

			$breakpoints = PRC_Settings::get_breakpoints();

			if (isset($breakpoints[$breakpoint])) {
				$bp = $breakpoints[$breakpoint];
				return $bp['value'] . $bp['unit'];
			}

			return null;
		}
	}

endif;
