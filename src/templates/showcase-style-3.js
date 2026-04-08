/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/* global PdmTabsData */
const baseImageUrl =
	typeof PdmTabsData !== 'undefined'
		? PdmTabsData.assetsUrl
		: '';
const showcaseImagePath = `${ baseImageUrl }/templates/showcase`;

const ShowcaseStyle3 = {
	name: 'showcase-style-2',
	title: __( 'Vertical Standard Pointing', 'pdm-blocks' ),
	content: `
          <!-- wp:pdm/tabs {"orientation":"vertical","tabTextColor":{"active":[],"default":{"color":"#030712"},"hover":[]},"tabBackgroundColor":{"active":{"color":"#030712"},"hover":{"color":"#030712"}},"tabIconColor":{"default":[],"hover":[],"active":[]},"tabPadding":{"top":"15px","right":"15px","bottom":"15px","left":"15px"},"metadata":{},"align":"wide","className":"is-style-pointing-tabs","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|20","left":"var:preset|spacing|30"}},"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"medium"} -->
<!-- wp:pdm/tab {"tabname":"What Is the Block Editor?","tabId":"149e64ae-c345-4355-bd1f-8865181da442","tabIcon":""} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small","left":"var:preset|spacing|x-small","right":"var:preset|spacing|x-small"}},"border":{"radius":{"topLeft":"5px","topRight":"5px","bottomLeft":"5px","bottomRight":"5px"}}},"backgroundColor":"tertiary","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tertiary-background-color has-background" style="border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;padding-top:var(--wp--preset--spacing--x-small);padding-right:var(--wp--preset--spacing--x-small);padding-bottom:var(--wp--preset--spacing--x-small);padding-left:var(--wp--preset--spacing--x-small)"><!-- wp:pdm/media-and-content {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"backgroundColor":"tertiary"} -->
<div class="wp-block-pdm-media-and-content mc-flex mc-media-image is-vertically-aligned-center has-tertiary-background-color has-background" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;--mediaSide:row;--mediaStack:column;--imageFit:cover;--aspect:16/9;--max-width:800px;--itaGap:40px;--imageAspect:16/9;--imageMaxHeight:500px;--mediaBorderRadius:0px 0px 0px 0px"><div class="mc-media"></div><div class="mc-content"><!-- wp:heading {"placeholder":"Heading (h2)","fontSize":"m-large"} -->
<h2 class="wp-block-heading has-m-large-font-size"></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"placeholder":"Lorem ipsum dolor sit amet consectetur. Tincidunt vel ornare duis ac posuere sed tempus leo viverra. Donec integer in in justo felis. Tristique in massa ut ut aliquet quisque aliquet urna. Arcu feugiat odio duis diam faucibus massa. Pulvinar donec in massa tincidunt tellus. Diam nec iaculis ut cras ornare. Neque semper et vestibulum quis hendrerit vulputate. Cum porta arcu fermentum maecenas. Quis nulla pretium convallis egestas pellentesque fusce scelerisque."} -->
<p></p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:pdm/media-and-content --></div>
<!-- /wp:group -->
<!-- /wp:pdm/tab -->

<!-- wp:pdm/tab {"tabname":"How Do Block Patterns Work?","tabId":"ca940882-873c-4f34-b070-bbbd047c2be0","tabIcon":""} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small","left":"var:preset|spacing|x-small","right":"var:preset|spacing|x-small"}},"border":{"radius":{"topLeft":"5px","topRight":"5px","bottomLeft":"5px","bottomRight":"5px"}}},"backgroundColor":"tertiary","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tertiary-background-color has-background" style="border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;padding-top:var(--wp--preset--spacing--x-small);padding-right:var(--wp--preset--spacing--x-small);padding-bottom:var(--wp--preset--spacing--x-small);padding-left:var(--wp--preset--spacing--x-small)"><!-- wp:pdm/media-and-content {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"backgroundColor":"tertiary"} -->
<div class="wp-block-pdm-media-and-content mc-flex mc-media-image is-vertically-aligned-center has-tertiary-background-color has-background" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;--mediaSide:row;--mediaStack:column;--imageFit:cover;--aspect:16/9;--max-width:800px;--itaGap:40px;--imageAspect:16/9;--imageMaxHeight:500px;--mediaBorderRadius:0px 0px 0px 0px"><div class="mc-media"></div><div class="mc-content"><!-- wp:heading {"placeholder":"Heading (h2)","fontSize":"m-large"} -->
<h2 class="wp-block-heading has-m-large-font-size"></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"placeholder":"Lorem ipsum dolor sit amet consectetur. Tincidunt vel ornare duis ac posuere sed tempus leo viverra. Donec integer in in justo felis. Tristique in massa ut ut aliquet quisque aliquet urna. Arcu feugiat odio duis diam faucibus massa. Pulvinar donec in massa tincidunt tellus. Diam nec iaculis ut cras ornare. Neque semper et vestibulum quis hendrerit vulputate. Cum porta arcu fermentum maecenas. Quis nulla pretium convallis egestas pellentesque fusce scelerisque."} -->
<p></p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:pdm/media-and-content --></div>
<!-- /wp:group -->
<!-- /wp:pdm/tab -->

<!-- wp:pdm/tab {"tabname":"Why Use the Styles Panel?","tabId":"06f22469-904d-4189-ad12-80e4b197b6e7","tabIcon":""} -->
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small","left":"var:preset|spacing|x-small","right":"var:preset|spacing|x-small"}},"border":{"radius":{"topLeft":"5px","topRight":"5px","bottomLeft":"5px","bottomRight":"5px"}}},"backgroundColor":"tertiary","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-tertiary-background-color has-background" style="border-top-left-radius:5px;border-top-right-radius:5px;border-bottom-left-radius:5px;border-bottom-right-radius:5px;padding-top:var(--wp--preset--spacing--x-small);padding-right:var(--wp--preset--spacing--x-small);padding-bottom:var(--wp--preset--spacing--x-small);padding-left:var(--wp--preset--spacing--x-small)"><!-- wp:pdm/media-and-content {"style":{"spacing":{"padding":{"top":"0","bottom":"0","left":"0","right":"0"}}},"backgroundColor":"tertiary"} -->
<div class="wp-block-pdm-media-and-content mc-flex mc-media-image is-vertically-aligned-center has-tertiary-background-color has-background" style="padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;--mediaSide:row;--mediaStack:column;--imageFit:cover;--aspect:16/9;--max-width:800px;--itaGap:40px;--imageAspect:16/9;--imageMaxHeight:500px;--mediaBorderRadius:0px 0px 0px 0px"><div class="mc-media"></div><div class="mc-content"><!-- wp:heading {"placeholder":"Heading (h2)","fontSize":"m-large"} -->
<h2 class="wp-block-heading has-m-large-font-size"></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"placeholder":"Lorem ipsum dolor sit amet consectetur. Tincidunt vel ornare duis ac posuere sed tempus leo viverra. Donec integer in in justo felis. Tristique in massa ut ut aliquet quisque aliquet urna. Arcu feugiat odio duis diam faucibus massa. Pulvinar donec in massa tincidunt tellus. Diam nec iaculis ut cras ornare. Neque semper et vestibulum quis hendrerit vulputate. Cum porta arcu fermentum maecenas. Quis nulla pretium convallis egestas pellentesque fusce scelerisque."} -->
<p></p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:pdm/media-and-content --></div>
<!-- /wp:group -->
<!-- /wp:pdm/tab -->
<!-- /wp:pdm/tabs -->`,
};

export default ShowcaseStyle3;
