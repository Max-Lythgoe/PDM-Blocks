<?php

/**
 * Group Responsive Module
 *
 * Handles core/group blocks with default or constrained layout.
 * Applies responsive justification and optional sticky-position disabling.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Group_Responsive')) :
	class PRC_Group_Responsive extends PRC_Responsive_Base
	{

		protected const BLOCK_NAME = 'core/group';

		protected function need_to_apply_changes(string $block_content, array $block, $wp_block): bool
		{
			$layout_type = $this->attributes['layout']['type'] ?? null;
			return in_array($layout_type, array('default', 'constrained', null), true);
		}

		protected function render_responsive(string $block_content, array $block, $wp_block): string
		{
			$class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
			$block_content = PRC_Block_Utils::append_classes($block_content, $class_id);

			$justification = $this->get_setting('justification', 'left');

			$media_query = "@media screen and (width <= {$this->switch_width})";

			$css_rules = array(
				'margin-left'  => ($justification === 'left' ? '0' : 'auto') . ' !important',
				'margin-right' => ($justification === 'right' ? '0' : 'auto') . ' !important',
			);

			$selector = ".{$class_id}.{$class_id} > :where(:not(.alignleft):not(.alignright):not(.alignfull))";

			PRC_Style_Collector::add_media_rule($media_query, $selector, $css_rules);

			return $block_content;
		}
	}

endif;
