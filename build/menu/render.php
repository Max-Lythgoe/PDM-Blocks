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
$icon_size = isset($attributes['iconSize']) ? $attributes['iconSize'] : 25;
$icon_color = isset($attributes['iconColor']) ? $attributes['iconColor'] : 'currentColor';
$use_custom_color = isset($attributes['useCustomColor']) ? $attributes['useCustomColor'] : false;
$menu_item_image_max_width = isset($attributes['menuItemImageMaxWidth']) ? intval($attributes['menuItemImageMaxWidth']) : 100;
$mobile_image_first = isset($attributes['mobileImageFirst']) ? (bool) $attributes['mobileImageFirst'] : true;

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
			$title = apply_filters('the_title', $item->title, $item->ID);

			if (!empty($image_url)) {
				$link_content = '<img src="' . esc_url($image_url) . '" alt="' . esc_attr(wp_strip_all_tags($title)) . '" class="menu-item-image" style="max-width:var(--menu-item-image-max-width,100px);height:auto;display:block;" />';
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

			$classes = empty($item->classes) ? array() : (array) $item->classes;

			// Check for a custom image on this menu item
			$image_url = get_post_meta($item->ID, '_menu_item_image', true);
			if (!empty($image_url)) {
				$classes[] = 'menu-item-has-image';
			}

			$class_names = join(' ', array_filter($classes));
			$class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';

			$output .= $indent . '<li' . $class_names . '>';

			// Menu link
			$link_attr = !empty($item->url) ? ' href="' . esc_url($item->url) . '"' : '';
			$title = apply_filters('the_title', $item->title, $item->ID);

			if (!empty($image_url)) {
				$link_content = '<img src="' . esc_url($image_url) . '" alt="' . esc_attr(wp_strip_all_tags($title)) . '" class="menu-item-image" style="max-width:var(--menu-item-image-max-width,100px);height:auto;display:block;" />';
			} else {
				$link_content = esc_html($title);
			}

			$output .= '<a' . $link_attr . '>' . $link_content . '</a>';

			// Add submenu toggle only if item has children
			if (in_array('menu-item-has-children', $classes)) {
				// Generate a unique ID for each mobile submenu toggle
				$toggle_id = 'mobile-submenu-toggle-' . $item->ID;

				// Checkbox toggle
				$output .= '<input type="checkbox" id="' . esc_attr($toggle_id) . '" class="submenu-toggle" hidden>';

				// Toggle button label (clickable)
				$output .= '<label for="' . esc_attr($toggle_id) . '" class="block-sub-menu-toggle" aria-label="Toggle submenu"></label>';
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
$block_instance_id = 'pdm-menu-block-' . wp_unique_id();
?>

<style>
	@media (min-width: <?php echo intval($desktop_breakpoint); ?>px) {
		#<?php echo esc_attr($block_instance_id); ?>.pdm-menu-desktop {
			display: block;
		}

		#<?php echo esc_attr($block_instance_id); ?>.pdm-menu-mobile {
			display: none;
		}

		#<?php echo esc_attr($block_instance_id); ?>.block-menu-toggle {
			display: none !important;
		}
	}

	@media (max-width: <?php echo intval($mobile_breakpoint); ?>px) {
		#<?php echo esc_attr($block_instance_id); ?>.pdm-menu-desktop {
			display: none !important;
		}

		#<?php echo esc_attr($block_instance_id); ?>.pdm-menu-mobile {
			display: block;
		}

		#<?php echo esc_attr($block_instance_id); ?>.block-menu-toggle {
			display: flex !important;
			margin-inline: auto;
		}

		#<?php echo esc_attr($block_instance_id); ?> {
			width: 100%;
		}
	}
</style>
<?php
$wrapper_classes = 'menu-block pdm-block';
if ($mobile_image_first) {
	$wrapper_classes .= ' pdm-menu-image-mobile-first';
}
?>
<div <?php echo get_block_wrapper_attributes(['id' => $block_instance_id, 'class' => $wrapper_classes, 'style' => $style_string]); ?>>
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
		<nav class="pdm-menu pdm-menu-mobile">

			<input type="checkbox" id="<?php echo esc_attr($menu_toggle_id); ?>" class="menu-toggle" style="display:none;" />

			<label for="<?php echo esc_attr($menu_toggle_id); ?>" id="open-menu-toggle-<?php echo esc_attr($menu_toggle_id); ?>" class="block-menu-toggle<?php echo $use_custom_color ? ' use-custom-color' : ''; ?>" aria-label="open menu button">
				<?php if ($custom_icon_open): ?>
					<img src="<?php echo esc_url($custom_icon_open); ?>" alt="Open menu" style="width: <?php echo esc_attr($icon_size); ?>px; height: <?php echo esc_attr($icon_size); ?>px; color: <?php echo esc_attr($icon_color); ?>;" />
				<?php else: ?>
					<span style="width: <?php echo esc_attr($icon_size); ?>px; height: <?php echo esc_attr($icon_size); ?>px; color: <?php echo esc_attr($icon_color); ?>; display: inline-flex; align-items: center; justify-content: center;">
						<?php echo pdm_get_icon_svg($icon_open); ?>
					</span>
				<?php endif; ?> </label>
			<label for="<?php echo esc_attr($menu_toggle_id); ?>" class="menu-overlay-label">
				<div class="menu-overlay"></div>
			</label>

			<div class="menu-slideout" style="<?php echo esc_attr($style_string); ?>">

				<label for="<?php echo esc_attr($menu_toggle_id); ?>" id="close-menu-toggle-<?php echo esc_attr($menu_toggle_id); ?>" class="block-menu-toggle<?php echo $use_custom_color ? ' use-custom-color' : ''; ?>" aria-label="close menu button">
					<?php if ($custom_icon_close): ?>
						<img src="<?php echo esc_url($custom_icon_close); ?>" alt="Close menu" style="width: <?php echo esc_attr($icon_size); ?>px; height: <?php echo esc_attr($icon_size); ?>px; color: <?php echo esc_attr($icon_color); ?>;" />
					<?php else: ?>
						<span style="width: <?php echo esc_attr($icon_size); ?>px; height: <?php echo esc_attr($icon_size); ?>px; color: <?php echo esc_attr($icon_color); ?>; display: inline-flex; align-items: center; justify-content: center;">
							<?php echo pdm_get_icon_svg($icon_close); ?>
						</span>
					<?php endif; ?> </label>
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