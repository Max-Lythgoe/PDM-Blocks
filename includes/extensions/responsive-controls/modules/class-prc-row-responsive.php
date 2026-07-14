<?php

/**
 * Row / Stack Responsive Module
 *
 * Handles core/group blocks with flex layout (Row and Stack blocks).
 * Applies responsive flex-direction, justification, vertical alignment, gap,
 * and optional sticky-position disabling.
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Row_Responsive')) :
	class PRC_Row_Responsive extends PRC_Responsive_Base
	{

		protected const BLOCK_NAME = 'core/group';

		protected function need_to_apply_changes(string $block_content, array $block, $wp_block): bool
		{
			return ($this->attributes['layout']['type'] ?? null) === 'flex';
		}

		protected function render_responsive(string $block_content, array $block, $wp_block): string
		{
			$class_id      = PRC_Block_Utils::get_unique_class_id($block_content);
			$block_content = PRC_Block_Utils::append_classes($block_content, $class_id);

			$this->add_styles($class_id);

			return $block_content;
		}

		private function add_styles(string $class_id)
		{
			$justification      = $this->get_setting('justification', 'left');
			$orientation        = $this->get_setting('orientation', 'row');
			$vertical_alignment = $this->get_setting('verticalAlignment', 'top');
			$gap                = $this->get_setting('gap', null);

			$vertical_alignment_map = array(
				'top'           => 'flex-start',
				'bottom'        => 'flex-end',
				'center'        => 'center',
				'stretch'       => 'stretch',
				'space-between' => 'space-between',
			);

			$vertical_alignment_reverse_map = array_merge(
				$vertical_alignment_map,
				array(
					'top'    => 'flex-end',
					'bottom' => 'flex-start',
				)
			);

			if (in_array($orientation, array('row', 'row-reverse'), true)) {
				$horizontal_alignment_property = 'justify-content';
				$vertical_alignment_property   = 'align-items';
			} else {
				$horizontal_alignment_property = 'align-items';
				$vertical_alignment_property   = 'justify-content';
			}

			$horizontal_alignment_value = PRC_Block_Utils::get_flex_justify(
				$justification,
				$orientation === 'row-reverse'
			);

			$va_map = $orientation === 'column-reverse'
				? $vertical_alignment_reverse_map
				: $vertical_alignment_map;

			$declarations = array(
				$horizontal_alignment_property => ($horizontal_alignment_value ?? 'flex-start') . ' !important',
				$vertical_alignment_property   => ($va_map[$vertical_alignment] ?? 'flex-start') . ' !important',
				'flex-direction'               => $orientation,
			);

			if (null !== $gap) {
				$declarations['gap'] = $gap . ' !important';
			}

			$media_query = "@media screen and (width <= {$this->switch_width})";
			$selector    = "body .{$class_id}.{$class_id}";

			// Primary rule
			$css_rules = array(
				array(
					'selector'     => $media_query,
					'declarations' => array(
						array(
							'selector'     => $selector,
							'declarations' => $declarations,
						),
					),
				),
			);

			// Remove flex-basis from children when orientation switches axis
			$layout_orientation     = $this->attributes['layout']['orientation'] ?? 'horizontal';
			$responsive_orientation = in_array($orientation, array('row', 'row-reverse'), true)
				? 'horizontal'
				: 'vertical';

			if ($layout_orientation !== $responsive_orientation) {
				$css_rules[0]['declarations'][] = array(
					'selector'     => "body .{$class_id}.{$class_id} > *",
					'declarations' => array('flex-basis' => 'auto !important'),
				);
			}

			PRC_Style_Collector::add_rules_array($css_rules);
		}
	}

endif;
