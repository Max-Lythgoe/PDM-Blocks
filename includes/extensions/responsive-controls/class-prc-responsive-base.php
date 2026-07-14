<?php

/**
 * PRC Responsive Base - Abstract base class for responsive block modules.
 *
 * Each responsive block module extends this class and implements
 * need_to_apply_changes() and render_responsive().
 *
 * The attribute group stored on blocks is 'prcResponsive' with the structure:
 *   {
 *     breakpoint: 'mobile' | 'tablet' | 'custom' | '' | <custom-key>,
 *     breakpointCustomValue: '600px',   // only used when breakpoint === 'custom'
 *     settings: {
 *       // module-specific settings
 *     }
 *   }
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Responsive_Base')) :
	abstract class PRC_Responsive_Base
	{

		/**
		 * The attribute group name stored on blocks.
		 */
		const ATTR_GROUP = 'prcResponsive';

		/**
		 * Processed block attributes for the current render call.
		 *
		 * @var array
		 */
		protected $attributes = array();

		/**
		 * The resolved CSS switch width (e.g. '480px') for the current block.
		 *
		 * @var string|null
		 */
		protected $switch_width = null;

		/**
		 * Return true if this module should handle the given block name.
		 * When null, all blocks are potentially handled (checked in need_to_apply_changes).
		 *
		 * @var string|null
		 */
		protected const BLOCK_NAME = null;

		/**
		 * Register the render_block filter.
		 */
		public function register()
		{
			add_filter('render_block', array($this, 'handle_render'), 20, 3);
		}

		/**
		 * Filter callback — parse responsive attrs and delegate to render_responsive().
		 *
		 * @param string   $block_content
		 * @param array    $block
		 * @param WP_Block $wp_block
		 * @return string
		 */
		public function handle_render(string $block_content, array $block, $wp_block): string
		{
			if ($block_content === '') {
				return $block_content;
			}

			// Check if block has our responsive attribute group
			if (! $this->is_responsive($block)) {
				return $block_content;
			}

			// Check block name constraint
			$block_name = $block['blockName'] ?? null;
			if (static::BLOCK_NAME !== null && $block_name !== static::BLOCK_NAME) {
				return $block_content;
			}

			// Store attributes for subclass use
			$this->attributes = $block['attrs'] ?? array();

			// Resolve breakpoint → CSS width
			$this->switch_width = PRC_Breakpoints::get_switch_width(
				$this->attributes[self::ATTR_GROUP]['breakpoint'] ?? null,
				$this->attributes[self::ATTR_GROUP]['breakpointCustomValue'] ?? null
			);

			if (null === $this->switch_width) {
				return $block_content;
			}

			if (! $this->need_to_apply_changes($block_content, $block, $wp_block)) {
				return $block_content;
			}

			return $this->render_responsive($block_content, $block, $wp_block);
		}

		/**
		 * Get a value from the responsive settings sub-object.
		 *
		 * @param string $name    Setting key.
		 * @param mixed  $default Default value.
		 * @return mixed
		 */
		protected function get_setting(string $name, $default = null)
		{
			return $this->attributes[self::ATTR_GROUP]['settings'][$name] ?? $default;
		}

		/**
		 * Whether this block has our responsive attribute set.
		 *
		 * @param array $block
		 * @return bool
		 */
		private function is_responsive(array $block): bool
		{
			return is_array($block['attrs'][self::ATTR_GROUP] ?? null);
		}

		/**
		 * Determine whether responsive styles should actually be applied.
		 * Subclasses can inspect $this->attributes to make the decision.
		 *
		 * @param string   $block_content
		 * @param array    $block
		 * @param WP_Block $wp_block
		 * @return bool
		 */
		abstract protected function need_to_apply_changes(string $block_content, array $block, $wp_block): bool;

		/**
		 * Apply responsive styles and return the modified block content.
		 *
		 * @param string   $block_content
		 * @param array    $block
		 * @param WP_Block $wp_block
		 * @return string
		 */
		abstract protected function render_responsive(string $block_content, array $block, $wp_block): string;

		/**
		 * Add flex-shrink: 0 at the responsive breakpoint if the preventShrink setting is enabled.
		 *
		 * @param string $class_id Unique class applied to the block element.
		 */
		protected function maybe_prevent_shrink(string $class_id): void
		{
			if ($this->get_setting('preventShrink', false)) {
				PRC_Style_Collector::add_media_rule(
					"@media screen and (width <= {$this->switch_width})",
					".{$class_id}.{$class_id}",
					array('flex-shrink' => '0 !important')
				);
			}
		}
	}

endif;
