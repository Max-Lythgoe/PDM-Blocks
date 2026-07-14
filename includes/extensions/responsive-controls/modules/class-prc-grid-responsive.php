<?php

/**
 * Grid Responsive Module
 *
 * Handles core/group blocks with grid layout.
 * Applies responsive stack-to-single-column, gap, and optional sticky-position disabling.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Grid_Responsive')) :
	class PRC_Grid_Responsive extends PRC_Responsive_Base
	{

		protected const BLOCK_NAME = 'core/group';

		protected function need_to_apply_changes(string $block_content, array $block, $wp_block): bool
		{
			return ($this->attributes['layout']['type'] ?? null) === 'grid';
		}

		protected function render_responsive(string $block_content, array $block, $wp_block): string
		{
			$class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
			$block_content = PRC_Block_Utils::append_classes($block_content, (array) $class_id);

			$css_rules = array();

			if ($this->get_setting('stack', false)) {
				$css_rules['grid-template-columns'] = 'repeat(1, 1fr)';
			}

			$gap = $this->get_setting('gap', null);
			if (null !== $gap) {
				$css_rules['gap'] = $gap . ' !important';
			}

			if (! empty($css_rules)) {
				PRC_Style_Collector::add_media_rule(
					"@media screen and (width <= {$this->switch_width})",
					".{$class_id}.{$class_id}",
					$css_rules
				);
			}

			return $block_content;
		}
	}

endif;
