<?php

/**
 * Render the tab block.
 *
 * @param array     $attributes Block attributes.
 * @param string    $content Block content.
 * @param WP_Block  $block Block instance.
 *
 * @package         PDM Blocks
 */

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

$wrapper_attributes = get_block_wrapper_attributes([
    // The panel and the tab button must not share an id: `-panel` pairs with the
    // button's `-tab` id so aria-controls/aria-labelledby resolve correctly.
    'id' => esc_attr('tab-' . $attributes['tabId'] . '-panel'),
    'class' => esc_attr('pdm-tab-content'),
    'role' => "tabpanel",
    'tabindex' => "0",
    'data-wp-bind--hidden' => "!state.isActive",
    'aria-labelledby' => esc_attr('tab-' . $attributes['tabId'] . '-tab')
]);
?>
<div <?php echo wp_kses_data($wrapper_attributes); ?>>
    <?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    ?>
</div>