<?php

/**
 * Buttons Responsive Module
 *
 * Handles core/buttons blocks. Applies responsive flex-direction and justification.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Buttons_Responsive')) :
	class PRC_Buttons_Responsive extends PRC_Responsive_Base
	{

		protected const BLOCK_NAME = 'core/buttons';

		protected function need_to_apply_changes(string $block_content, array $block, $wp_block): bool
		{
			return true;
		}

		protected function render_responsive(string $block_content, array $block, $wp_block): string
		{
			$class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
			$block_content = PRC_Block_Utils::append_classes($block_content, (array) $class_id);

			$orientation   = $this->get_setting('orientation', 'row');
			$justification = $this->get_setting('justification', 'left');

			$horizontal_alignment_property = in_array($orientation, array('row', 'row-reverse'), true)
				? 'justify-content'
				: 'align-items';

			$horizontal_alignment_value = PRC_Block_Utils::get_flex_justify(
				$justification,
				$orientation === 'row-reverse'
			);

			PRC_Style_Collector::add_media_rule(
				"@media screen and (width <= {$this->switch_width})",
				".wp-block-buttons.{$class_id}.{$class_id}.{$class_id}",
				array(
					'flex-direction'               => $orientation,
					$horizontal_alignment_property => $horizontal_alignment_value ?? 'flex-start',
				)
			);

			return $block_content;
		}
	}

endif;
