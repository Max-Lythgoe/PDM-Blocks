<?php

/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$show_icons = isset($attributes['showIcons']) ? $attributes['showIcons'] : true;
$marker_color = isset($attributes['markerColor']) ? $attributes['markerColor'] : '#000000';
$group_by_county = isset($attributes['groupByCounty']) ? $attributes['groupByCounty'] : false;
$link_counties = isset($attributes['linkCounties']) ? $attributes['linkCounties'] : false;

// Query service areas
$args = array(
	'post_type' => 'service-areas',
	'post_status' => array('publish', 'draft'),
	'posts_per_page' => -1,
	'orderby' => 'title',
	'order' => 'ASC',
);

$service_areas = new WP_Query($args);

if (!$service_areas->have_posts()) {
	return '';
}

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="service-areas-container style-<?php echo isset($attributes['pillStyle']) && $attributes['pillStyle'] ? 'pill' : 'default'; ?>" style="overflow-y: auto;">
		<?php if ($group_by_county) :
			// Get all counties
			$counties = get_terms(array(
				'taxonomy' => 'county',
				'hide_empty' => false,
				'orderby' => 'name',
				'order' => 'ASC',
			));

			if (!empty($counties) && !is_wp_error($counties)) :
				foreach ($counties as $county) :
					// Get service areas for this county
					$county_args = array(
						'post_type' => 'service-areas',
						'post_status' => array('publish', 'draft'),
						'posts_per_page' => -1,
						'orderby' => 'title',
						'order' => 'ASC',
						'tax_query' => array(
							array(
								'taxonomy' => 'county',
								'field' => 'term_id',
								'terms' => $county->term_id,
							),
						),
					);

					$county_areas = new WP_Query($county_args);

					if ($county_areas->have_posts()) :
		?>
						<div class="county-group">
							<h3 class="county-title">
								<?php if ($link_counties) : ?>
									<a href="<?php echo esc_url(get_term_link($county)); ?>"><?php echo esc_html($county->name); ?></a>
								<?php else : ?>
									<?php echo esc_html($county->name); ?>
								<?php endif; ?>
							</h3>
							<div class="service-areas-grid">
								<?php while ($county_areas->have_posts()) : $county_areas->the_post(); ?>
									<div class="service-area-item">
										<?php if ($show_icons) : ?>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="location-marker" style="fill: <?php echo esc_attr($marker_color); ?>;">
												<path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 403.4 320 592 320 592C320 592 128 403.4 128 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
											</svg>
										<?php endif; ?>
										<?php if (get_post_status() === 'publish') : ?>
											<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
										<?php else : ?>
											<span class="draft"><?php the_title(); ?></span>
										<?php endif; ?>
									</div>
								<?php endwhile; ?>
							</div>
						</div>
			<?php
					endif;
					wp_reset_postdata();
				endforeach;
			endif;
		else : ?>
			<div class="service-areas-grid">
				<?php while ($service_areas->have_posts()) : $service_areas->the_post(); ?>
					<div class="service-area-item">
						<?php if ($show_icons) : ?>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="location-marker" style="fill: <?php echo esc_attr($marker_color); ?>;">
								<path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 403.4 320 592 320 592C320 592 128 403.4 128 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
							</svg>
						<?php endif; ?>
						<?php if (get_post_status() === 'publish') : ?>
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						<?php else : ?>
							<span class="draft"><?php the_title(); ?></span>
						<?php endif; ?>
					</div>
				<?php endwhile; ?>
			</div>
		<?php endif; ?>
	</div>
</div>

<?php wp_reset_postdata(); ?>