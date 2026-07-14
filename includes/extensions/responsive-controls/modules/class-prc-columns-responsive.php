<?php

/**
 * Columns Responsive Module
 *
 * Handles core/columns and core/column blocks.
 * - Overrides the native 'isStackedOnMobile' breakpoint with a custom one.
 * - Optionally reverses the column stack order.
 * - Preserves explicit column widths at larger viewports.
 *
 * Note: This module does NOT extend PRC_Responsive_Base because it handles
 * two different block names and has a more complex stacking approach.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Columns_Responsive')) :
	class PRC_Columns_Responsive
	{

		const ATTR_GROUP    = 'prcResponsive';
		const ATTR_BREAKPOINT = 'breakpoint';
		const ATTR_CUSTOM   = 'breakpointCustomValue';
		const ATTR_REVERSE  = 'reverseOrder';

		/**
		 * Register render_block hooks.
		 */
		public function register()
		{
			add_filter('render_block', array($this, 'handle_columns'), 20, 2);
			add_filter('render_block', array($this, 'handle_column'), 20, 2);
		}

		/**
		 * Handle the wrapper core/columns block.
		 *
		 * @param string $block_content
		 * @param array  $block
		 * @return string
		 */
		public function handle_columns(string $block_content, array $block): string
		{
			if (($block['blockName'] ?? null) !== 'core/columns' || $block_content === '') {
				return $block_content;
			}

			$attributes = $block['attrs'] ?? array();

			$class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
			$block_content = PRC_Block_Utils::append_classes($block_content, (array) $class_id);

			// When stacking is explicitly turned off at the native level, honour that
			if (isset($attributes['isStackedOnMobile']) && $attributes['isStackedOnMobile'] === false) {
				$block_content = PRC_Block_Utils::append_classes($block_content, 'is-not-stacked-on-mobile');
				return $block_content;
			}

			$this->add_columns_styles($attributes, $class_id);

			return $block_content;
		}

		/**
		 * Handle individual core/column blocks — preserve explicit widths above the breakpoint.
		 *
		 * @param string $block_content
		 * @param array  $block
		 * @return string
		 */
		public function handle_column(string $block_content, array $block): string
		{
			if (($block['blockName'] ?? null) !== 'core/column' || $block_content === '') {
				return $block_content;
			}

			$attributes = $block['attrs'] ?? array();

			if (! isset($attributes['width'])) {
				return $block_content;
			}

			$class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
			$block_content = PRC_Block_Utils::append_classes($block_content, (array) $class_id);

			// Keep the explicit width when NOT stacked (i.e., above the breakpoint)
			PRC_Style_Collector::add_rule(
				".wp-block-columns:not(.is-not-stacked-on-mobile) > .wp-block-column.{$class_id}[style*=flex-basis]",
				array('flex-basis' => $attributes['width'] . ' !important')
			);

			return $block_content;
		}

		/**
		 * Build and enqueue all CSS for a columns block.
		 *
		 * @param array  $attributes Block attributes.
		 * @param string $class_id   Unique class ID applied to this block.
		 */
		private function add_columns_styles(array $attributes, string $class_id)
		{
			$config = $this->get_responsive_config($attributes);

			$switch_width = PRC_Breakpoints::get_switch_width(
				$config[self::ATTR_BREAKPOINT] ?? null,
				$config[self::ATTR_CUSTOM] ?? null
			);

			// Fall back to '0px' to prevent WP core CSS from stacking
			$switch_width = $switch_width ?: '0px';

			$reverse = $config['settings'][self::ATTR_REVERSE] ?? false;

			$columns_selector   = ".wp-block-columns.{$class_id}.{$class_id}";
			$stacked_selector   = "{$columns_selector}:not(.is-not-stacked-on-mobile)";

			PRC_Style_Collector::add_rules_array(array(
				// Override WP core flex-wrap so we control wrapping ourselves
				array(
					'selector'     => $columns_selector,
					'declarations' => array('flex-wrap' => 'nowrap !important;'),
				),

				// At/below the breakpoint: stack columns vertically
				array(
					'selector'     => "@media screen and (width <= {$switch_width})",
					'declarations' => array(
						array(
							'selector'     => $stacked_selector,
							'declarations' => array(
								'flex-direction' => $reverse ? 'column-reverse' : 'column',
								'align-items'    => 'stretch !important',
							),
						),
						array(
							'selector'     => "{$stacked_selector} > .wp-block-column.wp-block-column",
							'declarations' => array(
								'flex-basis' => 'auto !important',
								'width'      => 'auto',
								'flex-grow'  => '1',
								'align-self' => 'auto !important',
							),
						),
					),
				),

				// Above the breakpoint: restore flex widths
				array(
					'selector'     => "@media screen and (width > {$switch_width})",
					'declarations' => array(
						array(
							'selector'     => "{$stacked_selector} > .wp-block-column:not([style*=flex-basis])",
							'declarations' => array(
								'flex-basis' => '0 !important',
								'flex-grow'  => '1',
							),
						),
						array(
							'selector'     => "{$stacked_selector} > .wp-block-column[style*=flex-basis]",
							'declarations' => array(
								'flex-grow' => '0',
							),
						),
					),
				),
			));
		}

		/**
		 * Get the responsive configuration for a columns block.
		 * Falls back to native 'isStackedOnMobile' when no prcResponsive attrs exist.
		 *
		 * @param array $attributes
		 * @return array
		 */
		private function get_responsive_config(array $attributes): array
		{
			if (isset($attributes[self::ATTR_GROUP])) {
				return $attributes[self::ATTR_GROUP];
			}

			// Derive from native attribute (stacked on mobile by default)
			$is_stacked = $attributes['isStackedOnMobile'] ?? true;

			return array(
				self::ATTR_BREAKPOINT => $is_stacked
					? PRC_Breakpoints::NAME_MOBILE
					: PRC_Breakpoints::NAME_OFF,
				self::ATTR_CUSTOM     => null,
				'settings'            => array(self::ATTR_REVERSE => false),
			);
		}
	}

endif;
