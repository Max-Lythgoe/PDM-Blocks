<?php

// menu item image 

if (!defined('ABSPATH')) {
    exit;
}

add_action('init', 'pdm_register_menu_item_image_meta');
function pdm_register_menu_item_image_meta()
{
    register_post_meta('nav_menu_item', '_menu_item_image', [
        'show_in_rest'  => true,
        'single'        => true,
        'type'          => 'string',
        'default'       => '',
        'auth_callback' => function () {
            return current_user_can('edit_theme_options');
        },
    ]);
}

// render inside menu item 
add_action('wp_nav_menu_item_custom_fields', 'pdm_menu_item_image_field', 10, 4);
function pdm_menu_item_image_field($item_id, $item, $depth, $args)
{
    $image_url = get_post_meta($item_id, '_menu_item_image', true);
?>
    <p class="field-custom description description-wide pdm-menu-image-field">
        <label><?php esc_html_e('Menu Item Image', 'pdm-blocks'); ?></label>
        <span class="pdm-menu-image-preview" style="display:<?php echo $image_url ? 'block' : 'none'; ?>;margin:6px 0;">
            <img src="<?php echo esc_url($image_url); ?>" style="max-width:150px;height:auto;display:block;" alt="" />
        </span>
        <input
            type="hidden"
            name="pdm-menu-item-image[<?php echo esc_attr($item_id); ?>]"
            value="<?php echo esc_url($image_url); ?>"
            class="pdm-menu-image-url" />
        <button type="button" class="button pdm-menu-image-upload" style="margin-top:4px;">
            <?php echo $image_url ? esc_html__('Change Image', 'pdm-blocks') : esc_html__('Upload Image', 'pdm-blocks'); ?>
        </button>
        <button type="button" class="button pdm-menu-image-remove" style="margin-top:4px;margin-left:4px;display:<?php echo $image_url ? 'inline-block' : 'none'; ?>;">
            <?php esc_html_e('Remove Image', 'pdm-blocks'); ?>
        </button>
    </p>
<?php
}

// save imag eurl 
add_action('wp_update_nav_menu_item', 'pdm_save_menu_item_image', 10, 3);
function pdm_save_menu_item_image($menu_id, $menu_item_db_id, $args)
{
    if (!current_user_can('edit_theme_options')) {
        return;
    }

    if (!isset($_POST['pdm-menu-item-image'][$menu_item_db_id])) {
        return;
    }

    $image_url = esc_url_raw(wp_unslash($_POST['pdm-menu-item-image'][$menu_item_db_id]));

    if (!empty($image_url)) {
        update_post_meta($menu_item_db_id, '_menu_item_image', $image_url);
    } else {
        delete_post_meta($menu_item_db_id, '_menu_item_image');
    }
}

// enqueue media uploader and JS on nav-menus admin page
add_action('admin_enqueue_scripts', 'pdm_menu_item_image_admin_scripts');
function pdm_menu_item_image_admin_scripts($hook)
{
    if ($hook !== 'nav-menus.php') {
        return;
    }

    wp_enqueue_media();

    wp_add_inline_script('jquery', '
jQuery(function($) {

	// Open media frame on "Upload Image" / "Change Image" click.
	// Uses event delegation so it works for newly added menu items too.
	$(document).on("click", ".pdm-menu-image-upload", function(e) {
		e.preventDefault();
		var $field = $(this).closest(".pdm-menu-image-field");
		var frame = wp.media({
			title: "Select Menu Item Image",
			button: { text: "Use this image" },
			multiple: false
		});
		frame.on("select", function() {
			var attachment = frame.state().get("selection").first().toJSON();
			$field.find(".pdm-menu-image-url").val(attachment.url);
			$field.find(".pdm-menu-image-preview").show().find("img").attr("src", attachment.url);
			$field.find(".pdm-menu-image-upload").text("Change Image");
			$field.find(".pdm-menu-image-remove").show();
		});
		frame.open();
	});

	// Clear image on "Remove Image" click.
	$(document).on("click", ".pdm-menu-image-remove", function(e) {
		e.preventDefault();
		var $field = $(this).closest(".pdm-menu-image-field");
		$field.find(".pdm-menu-image-url").val("");
		$field.find(".pdm-menu-image-preview").hide().find("img").attr("src", "");
		$field.find(".pdm-menu-image-upload").text("Upload Image");
		$(this).hide();
	});

});
	');
}
