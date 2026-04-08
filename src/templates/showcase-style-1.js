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

const ShowcaseStyle1 = {
	name: 'showcase-style-1',
	title: __( 'Horizontal Standard with Icons', 'pdm-blocks' ),
	content: `
            <!-- wp:pdm/tabs {"tabTextColor":{"active":{"color":"#e11919","slug":"primary"},"default":{"color":"#0f0f0f","slug":"contrast"},"hover":{"color":"#e11919","slug":"primary"}},"tabBackgroundColor":{"active":{"color":"#fdfdfd","slug":"base"},"hover":{"color":"#fdfdfd","slug":"base"},"default":{"color":"#fdfdfd","slug":"base"}},"tabIconColor":{"default":{"color":"#0f0f0f","slug":"contrast"},"hover":{"color":"#e11919","slug":"primary"},"active":{"color":"#e11919","slug":"primary"}},"tabPadding":{"top":"4px","right":"8px","bottom":"4px","left":"8px"},"tabBorder":{"border":{"bottom":{"color":"#e11919","width":"2px"}},"onActive":true},"metadata":{},"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|30","left":"var:preset|spacing|30"}},"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"medium"} -->
<!-- wp:pdm/tab {"tabname":"Editor","tabId":"217242fc-0354-4b1f-b7f2-dcae39cda2ea","tabIcon":"\u003csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'\u003e \u003cpath stroke-linecap='round' stroke-linejoin='round' d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10' /\u003e\u003c/svg\u003e"} -->
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

<!-- wp:pdm/tab {"tabname":"Patterns","tabId":"e220607c-259d-4bb3-a2c2-2fba537d573c","tabIcon":"\u003csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'\u003e  \u003cpath stroke-linecap='round' stroke-linejoin='round' d='M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z' /\u003e\u003c/svg\u003e"} -->
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

<!-- wp:pdm/tab {"tabname":"Styles","tabId":"937d9827-a05e-4ca7-a1d5-aa6553442cc6","tabIcon":"\u003csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-6'\u003e\u003cpath stroke-linecap='round' stroke-linejoin='round' d='M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z' /\u003e\u003c/svg\u003e"} -->
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

export default ShowcaseStyle1;
