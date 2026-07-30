<?php

if (function_exists('rank_math_get_breadcrumbs')) {
	$breadcrumbs = rank_math_get_breadcrumbs(
		array(
			'wrap_before' => '',
			'wrap_after'  => '',
		)
	);
} else {
	$breadcrumbs = do_shortcode('[rank_math_breadcrumb]');
}

$breadcrumbs = trim($breadcrumbs);

if (empty($breadcrumbs)) {
	if (current_user_can('edit_posts')) {
?>
		<div <?php echo get_block_wrapper_attributes(); ?>>
			<p style="opacity: 0.6; font-style: italic; margin: 0;">
				<?php esc_html_e('Breadcrumbs: enable Rank Math breadcrumbs or install Rank Math SEO.', 'breadcrumbs'); ?>
			</p>
		</div>
<?php
	}
	return;
}
?>
<nav <?php echo get_block_wrapper_attributes(array('aria-label' => 'Breadcrumbs')); ?>>
	<?php echo $breadcrumbs;
	?>
</nav>