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

$post_id    = get_the_ID();
$post_url   = $post_id ? get_permalink($post_id) : '';
$post_title = $post_id ? html_entity_decode(get_the_title($post_id), ENT_QUOTES, 'UTF-8') : '';
$post_image = $post_id ? get_the_post_thumbnail_url($post_id, 'large') : '';

// Build share URLs with proper encoding
$facebook_url  = 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode($post_url);
$twitter_url   = 'https://twitter.com/intent/tweet?text=' . rawurlencode($post_title) . '&url=' . rawurlencode($post_url);
$linkedin_url  = 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode($post_url);
$email_url     = 'mailto:?subject=' . rawurlencode($post_title) . '&body=' . rawurlencode('Check this out: ' . $post_url);
$pinterest_url = $post_image ? 'https://pinterest.com/pin/create/button/?url=' . rawurlencode($post_url) . '&media=' . rawurlencode($post_image) . '&description=' . rawurlencode($post_title) : '';

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<a class="share-link link-fb" href="<?php echo esc_url($facebook_url); ?>" target="_blank" rel="noopener noreferrer">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
			<path d="M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z" />
		</svg>
	</a>
	<a class="share-link link-x" href="<?php echo esc_url($twitter_url); ?>" target="_blank" rel="noopener noreferrer">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
			<path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z" />
		</svg>
	</a>
	<a class="share-link link-li" href="<?php echo esc_url($linkedin_url); ?>" target="_blank" rel="noopener noreferrer">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
			<path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z" />
		</svg>
	</a>
	<a class="share-link link-mail" href="<?php echo esc_attr($email_url); ?>">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
			<path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z" />
		</svg>
	</a>
	<?php if ($pinterest_url) : ?>
		<a class="share-link link-pinterest" href="<?php echo esc_url($pinterest_url); ?>" target="_blank" rel="noopener noreferrer">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
				<path d="M332 70.5C229.4 70.5 128 138.9 128 249.6C128 320 167.6 360 191.6 360C201.5 360 207.2 332.4 207.2 324.6C207.2 315.3 183.5 295.5 183.5 256.8C183.5 176.4 244.7 119.4 323.9 119.4C392 119.4 442.4 158.1 442.4 229.2C442.4 282.3 421.1 381.9 352.1 381.9C327.2 381.9 305.9 363.9 305.9 338.1C305.9 300.3 332.3 263.7 332.3 224.7C332.3 158.5 238.4 170.5 238.4 250.5C238.4 267.3 240.5 285.9 248 301.2C234.2 360.6 206 449.1 206 510.3C206 529.2 208.7 547.8 210.5 566.7C213.9 570.5 212.2 570.1 217.4 568.2C267.8 499.2 266 485.7 288.8 395.4C301.1 418.8 332.9 431.4 358.1 431.4C464.3 431.4 512 327.9 512 234.6C512 135.3 426.2 70.5 332 70.5z" />
			</svg>
		</a>
	<?php endif; ?>
</div>