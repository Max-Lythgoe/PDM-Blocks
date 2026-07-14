<?php

/**
 * PRC Block Utils - Helpers for manipulating block HTML content.
 *
 * Uses WP_HTML_Tag_Processor (available since WP 6.2).
 *
 * @package PdmAccelerate
 */

defined('ABSPATH') || exit;

if (!class_exists('PRC_Block_Utils')) :
	class PRC_Block_Utils
	{

		const UNIQUE_CLASS_PREFIX = 'prc-';

		/**
		 * Create a new unique class ID.
		 *
		 * @return string
		 */
		public static function create_unique_class_id(): string
		{
			return wp_unique_prefixed_id(self::UNIQUE_CLASS_PREFIX);
		}

		/**
		 * Get the existing unique prc- class from block content, or create a new one.
		 *
		 * @param string $block_content
		 * @return string
		 */
		public static function get_unique_class_id(string $block_content): string
		{
			$prefix = self::UNIQUE_CLASS_PREFIX;
			$tags   = new WP_HTML_Tag_Processor($block_content);

			if ($tags->next_tag()) {
				foreach ($tags->class_list() as $class_name) {
					if (
						strncmp($class_name, $prefix, strlen($prefix)) === 0
						&& preg_match('/\d/', substr($class_name, strlen($prefix)))
					) {
						return $class_name;
					}
				}
			}

			return self::create_unique_class_id();
		}

		/**
		 * Append one or more class names to the first non-style/script tag.
		 *
		 * @param string       $block_content
		 * @param array|string $classes
		 * @return string
		 */
		public static function append_classes(string $block_content, $classes): string
		{
			$tag = self::get_first_tag($block_content);
			if (! $tag || empty($classes)) {
				return $block_content;
			}

			foreach ((array) $classes as $class) {
				$tag->add_class($class);
			}

			return $tag->get_updated_html();
		}

		/**
		 * Remove one or more class names from the first non-style/script tag.
		 *
		 * @param string $block_content
		 * @param array  $classes
		 * @return string
		 */
		public static function remove_classes(string $block_content, array $classes): string
		{
			$tag = self::get_first_tag($block_content);
			if (! $tag || empty($classes)) {
				return $block_content;
			}

			foreach ($classes as $class) {
				$tag->remove_class($class);
			}

			return $tag->get_updated_html();
		}

		/**
		 * Set an attribute on the first non-style/script tag.
		 *
		 * @param string $block_content
		 * @param string $attribute
		 * @param string $value
		 * @return string
		 */
		public static function set_attribute(string $block_content, string $attribute, string $value): string
		{
			$tag = self::get_first_tag($block_content);
			if (! $tag) {
				return $block_content;
			}

			$tag->set_attribute($attribute, $value);

			return $tag->get_updated_html();
		}

		/**
		 * Append inline CSS style rules to the first non-style/script tag.
		 *
		 * @param string $block_content
		 * @param array  $css_rules  Associative array of property => value.
		 * @return string
		 */
		public static function append_inline_styles(string $block_content, array $css_rules): string
		{
			$tag = self::get_first_tag($block_content);
			if (! $tag || empty($css_rules)) {
				return $block_content;
			}

			$existing = $tag->get_attribute('style') ?? '';
			$new_css  = '';
			foreach ($css_rules as $property => $value) {
				$new_css .= '; ' . $property . ': ' . $value;
			}

			$tag->set_attribute('style', trim($existing . $new_css, '; '));

			return $tag->get_updated_html();
		}

		/**
		 * Map a block horizontal justification attribute to its CSS flex value.
		 *
		 * @param string $attribute_value  e.g. 'left', 'center', 'right', 'space-between', 'stretch'.
		 * @param bool   $reverse          Reverse left/right when orientation is row-reverse.
		 *
		 * @return string|null
		 */
		public static function get_flex_justify(string $attribute_value, bool $reverse = false): ?string
		{
			$map = array(
				'left'          => 'flex-start',
				'right'         => 'flex-end',
				'center'        => 'center',
				'stretch'       => 'stretch',
				'space-between' => 'space-between',
			);

			$reverse_map = array_merge($map, array(
				'left'  => 'flex-end',
				'right' => 'flex-start',
			));

			return $reverse ? ($reverse_map[$attribute_value] ?? null) : ($map[$attribute_value] ?? null);
		}

		/**
		 * Get a WP_HTML_Tag_Processor positioned at the first non-style/script tag.
		 *
		 * @param string $block_content
		 * @return WP_HTML_Tag_Processor|null
		 */
		public static function get_first_tag(string $block_content): ?WP_HTML_Tag_Processor
		{
			$p = new WP_HTML_Tag_Processor($block_content);
			while ($p->next_tag()) {
				$tag = $p->get_tag();
				if ($tag !== 'STYLE' && $tag !== 'SCRIPT') {
					return $p;
				}
			}
			return null;
		}
	}

endif;
