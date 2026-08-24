<?php

/**
 * Menu Block render template.
 *
 * @param array $attributes The block attributes.
 * @param string $content The block default content.
 * @param WP_Block $block The block instance.
 */

// Include icon library
require_once plugin_dir_path(__FILE__) . '../../components/icon-library.php';

// Get block attributes
$menu_id = isset($attributes['menuId']) ? intval($attributes['menuId']) : 0;
$menu_justify = isset($attributes['menuJustify']) ? $attributes['menuJustify'] : 'flex-start';
$max_width = isset($attributes['maxWidth']) ? $attributes['maxWidth'] : 1200;
$menu_radius = isset($attributes['menuRadius']) ? $attributes['menuRadius'] : '8px';
$mobile_breakpoint = isset($attributes['mobileBreakpoint']) ? intval($attributes['mobileBreakpoint']) : 1024;
$desktop_breakpoint = $mobile_breakpoint + 1;
$submenu_bg = isset($attributes['submenuBackgroundColor']) ? $attributes['submenuBackgroundColor'] : '';
$submenu_bg_gradient = isset($attributes['submenuBackgroundGradient']) ? $attributes['submenuBackgroundGradient'] : '';
$submenu_hover_bg = isset($attributes['submenuHoverBackgroundColor']) ? $attributes['submenuHoverBackgroundColor'] : '';
$submenu_hover_bg_gradient = isset($attributes['submenuHoverBackgroundGradient']) ? $attributes['submenuHoverBackgroundGradient'] : '';
$submenu_text = isset($attributes['submenuTextColor']) ? $attributes['submenuTextColor'] : '';
$submenu_hover_text = isset($attributes['submenuHoverTextColor']) ? $attributes['submenuHoverTextColor'] : '';
$icon_open = isset($attributes['iconOpen']) ? $attributes['iconOpen'] : 'bars';
$custom_icon_open = isset($attributes['customIconUrlOpen']) ? $attributes['customIconUrlOpen'] : '';
$icon_close = isset($attributes['iconClose']) ? $attributes['iconClose'] : 'xmark';
$custom_icon_close = isset($attributes['customIconUrlClose']) ? $attributes['customIconUrlClose'] : '';
$icon_size_raw = isset($attributes['iconSize']) ? $attributes['iconSize'] : '45px';
// Support both legacy number (e.g. 45) and new string with unit (e.g. '45px')
$icon_size = is_numeric($icon_size_raw) ? $icon_size_raw . 'px' : $icon_size_raw;
$icon_color = isset($attributes['iconColor']) ? $attributes['iconColor'] : 'currentColor';
$use_custom_color = isset($attributes['useCustomColor']) ? $attributes['useCustomColor'] : false;
$menu_item_image_max_width = isset($attributes['menuItemImageMaxWidth']) ? intval($attributes['menuItemImageMaxWidth']) : 100;
$mobile_image_first = isset($attributes['mobileImageFirst']) ? (bool) $attributes['mobileImageFirst'] : true;
$mobile_menu_position = isset($attributes['mobileMenuPosition']) ? $attributes['mobileMenuPosition'] : 'center';
$arrow_style = isset($attributes['arrowStyle']) ? $attributes['arrowStyle'] : 'chevron';

// Build CSS variables array
$css_vars = [
	'--max-width' => $max_width . 'px',
	'--menu-radius' => $menu_radius,
	'--menu-item-image-max-width' => $menu_item_image_max_width . 'px'
];

// Prioritize gradients over solid colors
if (!empty($submenu_bg_gradient)) {
	$css_vars['--submenu-bg-color'] = $submenu_bg_gradient;
} elseif (!empty($submenu_bg)) {
	$css_vars['--submenu-bg-color'] = $submenu_bg;
}

if (!empty($submenu_hover_bg_gradient)) {
	$css_vars['--submenu-hover-bg-color'] = $submenu_hover_bg_gradient;
} elseif (!empty($submenu_hover_bg)) {
	$css_vars['--submenu-hover-bg-color'] = $submenu_hover_bg;
}

if (!empty($submenu_text)) {
	$css_vars['--submenu-text-color'] = $submenu_text;
}
if (!empty($submenu_hover_text)) {
	$css_vars['--submenu-hover-text-color'] = $submenu_hover_text;
}
if (!empty($menu_justify)) {
	$css_vars['--menu-alignment'] = $menu_justify;
}

// Arrow style
if ($arrow_style === 'none') {
	$css_vars['--pdm-arrow-icon'] = 'none';
}

// Mobile toggle margin & justify based on position
if ($mobile_menu_position === 'left') {
	$mobile_toggle_margin = '0 auto 0 0';
	$mobile_toggle_justify = 'flex-start';
} elseif ($mobile_menu_position === 'right') {
	$mobile_toggle_margin = '0 0 0 auto';
	$mobile_toggle_justify = 'flex-end';
} else {
	$mobile_toggle_margin = 'auto';
	$mobile_toggle_justify = 'center';
}
$css_vars['--mobile-toggle-margin'] = $mobile_toggle_margin;
$css_vars['--mobile-toggle-justify'] = $mobile_toggle_justify;

// Convert to style string
$style_string = '';
foreach ($css_vars as $var => $value) {
	$style_string .= $var . ':' . $value . ';';
}

// Check if menu exists
$menu_exists = $menu_id > 0 && wp_get_nav_menu_object($menu_id) !== false;

// Menu Walker Classes
if (!class_exists('Desktop_Menu_Walker')) {
	class Desktop_Menu_Walker extends Walker_Nav_Menu
	{
		public function start_lvl(&$output, $depth = 0, $args = null)
		{
			$indent = str_repeat("\t", $depth);
			$output .= "\n$indent<ul class=\"sub-menu\">\n";
		}

		public function end_lvl(&$output, $depth = 0, $args = null)
		{
			$indent = str_repeat("\t", $depth);
			$output .= "$indent</ul>\n";
		}

		public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0)
		{
			$indent = ($depth) ? str_repeat("\t", $depth) : '';

			// Unique CSS anchor var for position fallback styles
			$anchor_var = '';
			if ($depth === 0) {
				$anchor_var = "--main-anchor: --main-anchor-" . $item->ID . ";";
			} elseif ($depth === 1) {
				$anchor_var = "--sub-anchor: --sub-anchor-" . $item->ID . ";";
			} elseif ($depth === 2) {
				$anchor_var = "--sub-2-anchor: --sub-2-anchor-" . $item->ID . ";";
			}

			$classes = empty($item->classes) ? array() : (array) $item->classes;

			// Check for a custom image on this menu item
			$image_url = get_post_meta($item->ID, '_menu_item_image', true);
			if (!empty($image_url)) {
				$classes[] = 'menu-item-has-image';
			}

			$class_names = join(' ', array_filter($classes));
			$class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';

			$output .= $indent . '<li' . $class_names . ' style="' . esc_attr($anchor_var) . '">';

			// Menu link
			$link_attr = !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';
			if (!empty($item->target)) {
				$link_attr .= ' target="' . esc_attr($item->target) . '"';
				if ($item->target === '_blank') {
					$link_attr .= ' rel="noopener noreferrer"';
				}
			}
			$title = apply_filters('the_title', $item->title, $item->ID);
			$title_plain = wp_strip_all_tags($title);

			// Mark the current item for assistive tech and styling
			if (!empty($item->current)) {
				$link_attr .= ' aria-current="page"';
			}

			// Announce submenus on parent links
			if (in_array('menu-item-has-children', $classes, true)) {
				$link_attr .= ' aria-haspopup="true" aria-expanded="false"';
			}

			if (!empty($image_url)) {
				$link_content = '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($title_plain) . '" class="menu-item-image" style="max-width:var(--menu-item-image-max-width,100px);height:auto;display:block;" />';
			} else {
				$link_content = esc_html($title);
			}

			$output .= '<a' . $link_attr . '>' . $link_content . '</a>';
		}

		public function end_el(&$output, $item, $depth = 0, $args = null)
		{
			$output .= "</li>\n";
		}
	}
}

if (!class_exists('Mobile_Menu_Walker')) {
	class Mobile_Menu_Walker extends Walker_Nav_Menu
	{
		public function start_lvl(&$output, $depth = 0, $args = null)
		{
			$indent = str_repeat("\t", $depth);
			// Tie this <ul> to its toggle button via aria-controls
			$submenu_id = !empty($this->current_item_id) ? ' id="pdm-submenu-' . intval($this->current_item_id) . '"' : '';
			$output .= "\n$indent<ul class=\"sub-menu\"" . $submenu_id . ">\n";
		}

		public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0)
		{
			$indent = ($depth) ? str_repeat("\t", $depth) : '';

			$classes = empty($item->classes) ? array() : (array) $item->classes;

			// Check for a custom image on this menu item
			$image_url = get_post_meta($item->ID, '_menu_item_image', true);
			if (!empty($image_url)) {
				$classes[] = 'menu-item-has-image';
			}

			$class_names = join(' ', array_filter($classes));
			$class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';

			$output .= $indent . '<li' . $class_names . '>';

			// Track the parent item so start_lvl can tie the <ul> to its button
			$this->current_item_id = $item->ID;

			// Menu link
			$link_attr = !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';
			if (!empty($item->target)) {
				$link_attr .= ' target="' . esc_attr($item->target) . '"';
				if ($item->target === '_blank') {
					$link_attr .= ' rel="noopener noreferrer"';
				}
			}
			$title = apply_filters('the_title', $item->title, $item->ID);
			$title_plain = wp_strip_all_tags($title);

			// Mark the current item for assistive tech and styling
			if (!empty($item->current)) {
				$link_attr .= ' aria-current="page"';
			}

			if (!empty($image_url)) {
				$link_content = '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($title_plain) . '" class="menu-item-image" style="max-width:var(--menu-item-image-max-width,100px);height:auto;display:block;" />';
			} else {
				$link_content = esc_html($title);
			}

			$output .= '<a' . $link_attr . '>' . $link_content . '</a>';

			// Add submenu toggle only if item has children
			if (in_array('menu-item-has-children', $classes)) {
				$submenu_id = 'pdm-submenu-' . $item->ID;
				$toggle_label = sprintf(
					/* translators: %s: menu item title */
					__('Toggle submenu for %s', 'pdm-blocks'),
					$title_plain
				);

				// Real button (keyboard accessible); open state toggled by view.js
				$output .= '<button type="button" class="block-sub-menu-toggle" aria-expanded="false" aria-controls="' . esc_attr($submenu_id) . '" aria-label="' . esc_attr($toggle_label) . '"></button>';
			}
		}

		public function end_el(&$output, $item, $depth = 0, $args = null)
		{
			$output .= "</li>\n";
		}
	}
}

// Generate unique menu toggle ID for this block instance
$menu_toggle_id = 'menu-toggle-' . $block->parsed_block['blockName'] . '-' . wp_unique_id();
$menu_panel_id = 'menu-panel-' . wp_unique_id();
$block_instance_id = 'pdm-menu-block-' . wp_unique_id();
$id = esc_attr($block_instance_id);
$bp_min = intval($desktop_breakpoint);
$bp_max = intval($mobile_breakpoint);

echo "<style>
	@media (min-width: {$bp_min}px) {
		#{$id} .pdm-menu-desktop { display: block; }
		#{$id} .pdm-menu-mobile { display: none; }
		#{$id} .block-menu-toggle { display: none !important; }
	}
	@media (max-width: {$bp_max}px) {
		#{$id} .pdm-menu-desktop { display: none !important; }
		#{$id} .pdm-menu-mobile { display: block; }
		#{$id} .pdm-menu-mobile > .menu-open-toggle-wrap { display: flex !important; justify-content: var(--mobile-toggle-justify, center); }
	}
</style>";
$wrapper_classes = 'menu-block pdm-block';
if ($mobile_image_first) {
	$wrapper_classes .= ' pdm-menu-image-mobile-first';
}
?>
<div <?php echo get_block_wrapper_attributes(['id' => $block_instance_id, 'class' => $wrapper_classes, 'style' => $style_string, 'data-arrow-style' => esc_attr($arrow_style)]); ?>>
	<?php if ($menu_exists): ?>
		<!-- Desktop Menu -->
		<nav class="pdm-menu pdm-menu-desktop" style=" max-width:<?php echo esc_attr($max_width); ?>px;margin-inline:auto;">
			<div class="menu-desktop-wrapper">
				<?php
				wp_nav_menu(array(
					'menu'           => $menu_id,
					'container'      => false,
					'menu_class'     => 'menu-desktop',
					'walker'         => new Desktop_Menu_Walker(),
					'fallback_cb'    => false
				));
				?>
			</div>
		</nav>

		<!-- Mobile Menu -->
		<nav class="pdm-menu pdm-menu-mobile" aria-label="<?php echo esc_attr__('Mobile navigation', 'pdm-blocks'); ?>">

			<div class="menu-open-toggle-wrap">
				<button type="button" id="open-<?php echo esc_attr($menu_toggle_id); ?>" class="block-menu-toggle menu-open-toggle<?php echo $use_custom_color ? ' use-custom-color' : ''; ?>" aria-expanded="false" aria-controls="<?php echo esc_attr($menu_panel_id); ?>" aria-label="<?php echo esc_attr__('Open menu', 'pdm-blocks'); ?>">
					<?php if ($custom_icon_open): ?>
						<img src="<?php echo esc_url($custom_icon_open); ?>" alt="" aria-hidden="true" style="width: <?php echo esc_attr($icon_size); ?>; height: <?php echo esc_attr($icon_size); ?>; color: <?php echo esc_attr($icon_color); ?>;" />
					<?php else: ?>
						<span aria-hidden="true" style="width: <?php echo esc_attr($icon_size); ?>; height: <?php echo esc_attr($icon_size); ?>; color: <?php echo esc_attr($icon_color); ?>; display: inline-flex; align-items: center; justify-content: center;">
							<?php echo pdm_get_icon_svg($icon_open); ?>
						</span>
					<?php endif; ?>
				</button>
			</div>
			<div class="menu-overlay-label" aria-hidden="true">
				<div class="menu-overlay"></div>
			</div>

			<div id="<?php echo esc_attr($menu_panel_id); ?>" class="menu-slideout" role="dialog" aria-modal="true" aria-label="<?php echo esc_attr__('Menu', 'pdm-blocks'); ?>" style="<?php echo esc_attr($style_string); ?>">

				<div class="menu-slideout-toggle-wrap">
					<button type="button" id="close-<?php echo esc_attr($menu_toggle_id); ?>" class="block-menu-toggle menu-close-toggle<?php echo $use_custom_color ? ' use-custom-color' : ''; ?>" aria-expanded="false" aria-controls="<?php echo esc_attr($menu_panel_id); ?>" aria-label="<?php echo esc_attr__('Close menu', 'pdm-blocks'); ?>">
						<?php if ($custom_icon_close): ?>
							<img src="<?php echo esc_url($custom_icon_close); ?>" alt="" aria-hidden="true" style="width: <?php echo esc_attr($icon_size); ?>; height: <?php echo esc_attr($icon_size); ?>; color: <?php echo esc_attr($icon_color); ?>;" />
						<?php else: ?>
							<span aria-hidden="true" style="width: <?php echo esc_attr($icon_size); ?>; height: <?php echo esc_attr($icon_size); ?>; color: <?php echo esc_attr($icon_color); ?>; display: inline-flex; align-items: center; justify-content: center;">
								<?php echo pdm_get_icon_svg($icon_close); ?>
							</span>
						<?php endif; ?>
					</button>
				</div>
				<?php
				wp_nav_menu(array(
					'menu'           => $menu_id,
					'container'      => false,
					'menu_class'     => 'menu-mobile',
					'walker'         => new Mobile_Menu_Walker(),
					'fallback_cb'    => false
				));
				?>

			</div>
		</nav>
	<?php else: ?>
		<!-- No menu assigned - show debug info in admin -->
		<?php if (current_user_can('manage_options')): ?>
			<div style="padding: 20px; border: 2px dashed #ccc; background: #f9f9f9; color: #666;">
				<p><strong>Menu Block:</strong> No menu selected or menu does not exist (ID: <?php echo esc_html($menu_id); ?>)</p>
				<p><small>Available menus: <?php echo implode(', ', wp_list_pluck(wp_get_nav_menus(), 'name')); ?></small></p>
				<p><small>Select a menu in the block settings to display it here.</small></p>
			</div>
		<?php endif; ?>
	<?php endif; ?>
</div>