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

const ShowcaseStyle2 = {
	name: 'showcase-style-2',
	title: __( 'Vertical Standard', 'pdm-blocks' ),
	content: `
           <!-- wp:pdm/tabs {"orientation":"vertical","tabTextColor":{"active":{"color":"#e11919","slug":"primary"},"default":{"color":"#0f0f0f","slug":"contrast"},"hover":{"color":"#e11919","slug":"primary"}},"tabBackgroundColor":{"active":{"color":"#efefef","slug":"tertiary"},"hover":{"color":"#efefef","slug":"tertiary"}},"tabIconColor":{"default":[],"hover":[],"active":[]},"tabPadding":{"top":"25px","right":"15px","bottom":"25px","left":"15px"},"tabBorder":{"border":{"bottom":{"color":"#e11919","width":"2px"}},"onActive":true},"metadata":{},"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|20","left":"var:preset|spacing|30"}},"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"medium"} -->
<!-- wp:pdm/tab {"tabname":"What Is the Block Editor?","tabId":"cbac2979-f595-4677-9be3-6a53b96f5d2b","tabIcon":""} -->
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

<!-- wp:pdm/tab {"tabname":"How Do Block Patterns Work?","tabId":"ad688105-b721-4934-a33f-cabaefaf4a3b","tabIcon":""} -->
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

<!-- wp:pdm/tab {"tabname":"Why Use the Styles Panel?","tabId":"b877ca51-a9a4-46c9-b57a-dcedd302fe10","tabIcon":""} -->
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

export default ShowcaseStyle2;
