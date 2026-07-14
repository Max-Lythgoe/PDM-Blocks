<?php

/**
 * Text Responsive Module
 *
 * Handles core/heading, core/paragraph, core/post-title, core/post-excerpt.
 * Applies responsive text-align at the configured breakpoint.
 * flex-shrink: 0 (preventShrink) is handled globally by the filter in responsive-controls.php.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Text_Responsive')) :
	class PRC_Text_Responsive extends PRC_Responsive_Base
	{

		protected const BLOCK_NAME = null; // Handles multiple blocks

		const SUPPORTED_BLOCKS = array(
			'core/heading',
			'core/paragraph',
			'core/post-title',
			'core/post-excerpt',
		);

		protected function need_to_apply_changes(string $block_content, array $block, $wp_block): bool
		{
			return in_array($block['blockName'] ?? null, self::SUPPORTED_BLOCKS, true);
		}

		protected function render_responsive(string $block_content, array $block, $wp_block): string
		{
			$alignment = $this->get_setting('alignment', null);

			if (! $alignment) {
				return $block_content;
			}

			$class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
			$block_content = PRC_Block_Utils::append_classes($block_content, (array) $class_id);

			PRC_Style_Collector::add_media_rule(
				"@media screen and (width <= {$this->switch_width})",
				"body .{$class_id}",
				array('text-align' => $alignment)
			);

			return $block_content;
		}
	}

endif;
