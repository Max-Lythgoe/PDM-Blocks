/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

const Pricing = {
	name: 'pricing',
	title: __( 'Horizontal Pricing', 'pdm-blocks' ),
	content: `
                    <!-- wp:pdm/tabs {"justification":"center","tabTextColor":{"hover":{"color":"#fefefe"}},"tabBackgroundColor":{"default":{"color":"#fefefe"},"active":{"color":"#e11919","slug":"primary"},"hover":{"color":"#e11919","slug":"primary"}},"tabBorder":{"border":{"radius":"50px"}},"metadata":{},"align":"wide","style":{"border":{"radius":"50px","width":"3px"},"spacing":{"padding":{"left":"8px","right":"8px","top":"8px","bottom":"8px"}},"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"500"}},"borderColor":"tertiary"} -->
<!-- wp:pdm/tab {"tabname":"Monthly","tabId":"915a024e-7b5e-420f-8e81-223349c21e12"} -->
<!-- wp:pdm/cards {"desktopColumns":3} -->
<div class="wp-block-pdm-cards alignwide pdm-cards is-vertically-aligned-stretch is-justified-center" style="--desktop-columns:3;--tablet-columns:2;--mobile-columns:1;--desktop-gap:20px;--tablet-gap:20px;--mobile-gap:20px;--align-bottom:initial"><!-- wp:pdm/card {"style":{"spacing":{"padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small","right":"var:preset|spacing|small"}},"shadow":"none","border":{"width":"3px"}},"borderColor":"tertiary"} -->
<div class="wp-block-pdm-card is-vertically-aligned-top has-border-color has-tertiary-border-color" style="border-width:3px;padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small);box-shadow:none"><!-- wp:heading {"style":{"typography":{"fontSize":"30px","fontStyle":"normal","fontWeight":"400"}}} -->
<h2 class="wp-block-heading" style="font-size:30px;font-style:normal;font-weight:400"><strong>Basic</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->
<p style="font-size:16px">Ideal for individuals who need to manage up to 5 projects with essential analytics and reliable email support.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"36px","fontStyle":"normal","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:36px;font-style:normal;font-weight:700">$19</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p> <sub>/month</sub></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--x-small);margin-bottom:var(--wp--preset--spacing--x-small)"><!-- wp:button {"backgroundColor":"primary","width":100,"className":"is-style-fill","style":{"border":{"radius":"6px"},"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"small"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-fill"><a class="wp-block-button__link has-primary-background-color has-background has-small-font-size has-custom-font-size wp-element-button" style="border-radius:6px;font-style:normal;font-weight:500">Buy Plan</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:list {"className":"is-style-checkmark-list","style":{"spacing":{"margin":{"right":"0px","left":"0px"},"padding":{"right":"0px","left":"15px"}},"typography":{"fontSize":"16px"}}} -->
<ul style="margin-right:0px;margin-left:0px;padding-right:0px;padding-left:15px;font-size:16px" class="wp-block-list is-style-checkmark-list"><!-- wp:list-item -->
<li>Up to 5 projects</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Basic analytics dashboard</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Email support (response within 48 hrs)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:pdm/card -->

<!-- wp:pdm/card {"style":{"spacing":{"padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small","right":"var:preset|spacing|small"}},"shadow":"none","border":{"width":"3px"}},"borderColor":"tertiary"} -->
<div class="wp-block-pdm-card is-vertically-aligned-top has-border-color has-tertiary-border-color" style="border-width:3px;padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small);box-shadow:none"><!-- wp:heading {"style":{"typography":{"fontSize":"30px","fontStyle":"normal","fontWeight":"400"}}} -->
<h2 class="wp-block-heading" style="font-size:30px;font-style:normal;font-weight:400"><strong><strong>Standard</strong></strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"#4a5565"}}},"color":{"text":"#4a5565"},"typography":{"fontSize":"16px"}}} -->
<p class="has-text-color has-link-color" style="color:#4a5565;font-size:16px">Perfect for small teams seeking advanced reporting, collaboration tools, and faster priority email support.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"36px","fontStyle":"normal","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:36px;font-style:normal;font-weight:700">$49</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#4a5565"},"elements":{"link":{"color":{"text":"#4a5565"}}}}} -->
<p class="has-text-color has-link-color" style="color:#4a5565"> <sub>/month</sub></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--x-small);margin-bottom:var(--wp--preset--spacing--x-small)"><!-- wp:button {"backgroundColor":"primary","width":100,"className":"is-style-fill","style":{"border":{"radius":"6px"},"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"small"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-fill"><a class="wp-block-button__link has-primary-background-color has-background has-small-font-size has-custom-font-size wp-element-button" style="border-radius:6px;font-style:normal;font-weight:500">Buy Plan</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:list {"className":"is-style-checkmark-list","style":{"spacing":{"margin":{"right":"0px","left":"0px"},"padding":{"right":"0px","left":"15px"}},"color":{"text":"#4a5565"},"elements":{"link":{"color":{"text":"#4a5565"}}},"typography":{"fontSize":"16px"}}} -->
<ul style="color:#4a5565;margin-right:0px;margin-left:0px;padding-right:0px;padding-left:15px;font-size:16px" class="wp-block-list is-style-checkmark-list has-text-color has-link-color"><!-- wp:list-item -->
<li>Up to 5 projects</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Basic analytics dashboard</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Email support (response within 48 hrs)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:pdm/card -->

<!-- wp:pdm/card {"style":{"spacing":{"padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small","right":"var:preset|spacing|small"}},"shadow":"none","border":{"width":"3px"},"elements":{"link":{"color":{"text":"var:preset|color|white"}}}},"backgroundColor":"primary","textColor":"white","borderColor":"primary"} -->
<div class="wp-block-pdm-card is-vertically-aligned-top has-border-color has-primary-border-color has-white-color has-primary-background-color has-text-color has-background has-link-color" style="border-width:3px;padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small);box-shadow:none"><!-- wp:heading {"style":{"typography":{"fontSize":"30px","fontStyle":"normal","fontWeight":"400"}}} -->
<h2 class="wp-block-heading" style="font-size:30px;font-style:normal;font-weight:400"><strong><strong>Premium</strong></strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->
<p style="font-size:16px">Tailored for enterprises requiring unlimited projects, full analytics, 24/7 support, and a dedicated account manager.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"36px","fontStyle":"normal","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:36px;font-style:normal;font-weight:700">$99</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p> <sub>/month</sub></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--x-small);margin-bottom:var(--wp--preset--spacing--x-small)"><!-- wp:button {"backgroundColor":"white","textColor":"primary","width":100,"className":"is-style-fill","style":{"border":{"radius":"6px"},"typography":{"fontStyle":"normal","fontWeight":"500"},"elements":{"link":{"color":{"text":"var:preset|color|primary"}}}},"fontSize":"small"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-fill"><a class="wp-block-button__link has-primary-color has-white-background-color has-text-color has-background has-link-color has-small-font-size has-custom-font-size wp-element-button" style="border-radius:6px;font-style:normal;font-weight:500">Buy Plan</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:list {"className":"is-style-checkmark-list","style":{"spacing":{"margin":{"right":"0px","left":"0px"},"padding":{"right":"0px","left":"15px"}},"typography":{"fontSize":"16px"}}} -->
<ul style="margin-right:0px;margin-left:0px;padding-right:0px;padding-left:15px;font-size:16px" class="wp-block-list is-style-checkmark-list"><!-- wp:list-item -->
<li>Unlimited projects</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Full analytics suite with custom reports</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>24/7 phone &amp; email support</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Dedicated account manager</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Custom integrations &amp; onboarding</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:pdm/card --></div>
<!-- /wp:pdm/cards -->
<!-- /wp:pdm/tab -->

<!-- wp:pdm/tab {"tabname":"Annually","tabId":"80bd547d-74c3-473e-9001-b1802c0adaa6"} -->
<!-- wp:pdm/cards {"desktopColumns":3} -->
<div class="wp-block-pdm-cards alignwide pdm-cards is-vertically-aligned-stretch is-justified-center" style="--desktop-columns:3;--tablet-columns:2;--mobile-columns:1;--desktop-gap:20px;--tablet-gap:20px;--mobile-gap:20px;--align-bottom:initial"><!-- wp:pdm/card {"style":{"spacing":{"padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small","right":"var:preset|spacing|small"}},"shadow":"none","border":{"width":"3px"}},"borderColor":"tertiary"} -->
<div class="wp-block-pdm-card is-vertically-aligned-top has-border-color has-tertiary-border-color" style="border-width:3px;padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small);box-shadow:none"><!-- wp:heading {"style":{"typography":{"fontSize":"30px","fontStyle":"normal","fontWeight":"400"}}} -->
<h2 class="wp-block-heading" style="font-size:30px;font-style:normal;font-weight:400"><strong>Basic</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->
<p style="font-size:16px">Ideal for individuals who need to manage up to 5 projects with essential analytics and reliable email support.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"36px","fontStyle":"normal","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:36px;font-style:normal;font-weight:700">$16</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p> <sub>/month</sub></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--x-small);margin-bottom:var(--wp--preset--spacing--x-small)"><!-- wp:button {"backgroundColor":"primary","width":100,"className":"is-style-fill","style":{"border":{"radius":"6px"},"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"small"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-fill"><a class="wp-block-button__link has-primary-background-color has-background has-small-font-size has-custom-font-size wp-element-button" style="border-radius:6px;font-style:normal;font-weight:500">Buy Plan</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:list {"className":"is-style-checkmark-list","style":{"spacing":{"margin":{"right":"0px","left":"0px"},"padding":{"right":"0px","left":"15px"}},"typography":{"fontSize":"16px"}}} -->
<ul style="margin-right:0px;margin-left:0px;padding-right:0px;padding-left:15px;font-size:16px" class="wp-block-list is-style-checkmark-list"><!-- wp:list-item -->
<li>Up to 5 projects</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Basic analytics dashboard</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Email support (response within 48 hrs)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:pdm/card -->

<!-- wp:pdm/card {"style":{"spacing":{"padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small","right":"var:preset|spacing|small"}},"shadow":"none","border":{"width":"3px"}},"borderColor":"tertiary"} -->
<div class="wp-block-pdm-card is-vertically-aligned-top has-border-color has-tertiary-border-color" style="border-width:3px;padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small);box-shadow:none"><!-- wp:heading {"style":{"typography":{"fontSize":"30px","fontStyle":"normal","fontWeight":"400"}}} -->
<h2 class="wp-block-heading" style="font-size:30px;font-style:normal;font-weight:400"><strong><strong>Standard</strong></strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"#4a5565"}}},"color":{"text":"#4a5565"},"typography":{"fontSize":"16px"}}} -->
<p class="has-text-color has-link-color" style="color:#4a5565;font-size:16px">Perfect for small teams seeking advanced reporting, collaboration tools, and faster priority email support.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"36px","fontStyle":"normal","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:36px;font-style:normal;font-weight:700">$40</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"color":{"text":"#4a5565"},"elements":{"link":{"color":{"text":"#4a5565"}}}}} -->
<p class="has-text-color has-link-color" style="color:#4a5565"> <sub>/month</sub></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--x-small);margin-bottom:var(--wp--preset--spacing--x-small)"><!-- wp:button {"backgroundColor":"primary","width":100,"className":"is-style-fill","style":{"border":{"radius":"6px"},"typography":{"fontStyle":"normal","fontWeight":"500"}},"fontSize":"small"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-fill"><a class="wp-block-button__link has-primary-background-color has-background has-small-font-size has-custom-font-size wp-element-button" style="border-radius:6px;font-style:normal;font-weight:500">Buy Plan</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:list {"className":"is-style-checkmark-list","style":{"spacing":{"margin":{"right":"0px","left":"0px"},"padding":{"right":"0px","left":"15px"}},"color":{"text":"#4a5565"},"elements":{"link":{"color":{"text":"#4a5565"}}},"typography":{"fontSize":"16px"}}} -->
<ul style="color:#4a5565;margin-right:0px;margin-left:0px;padding-right:0px;padding-left:15px;font-size:16px" class="wp-block-list is-style-checkmark-list has-text-color has-link-color"><!-- wp:list-item -->
<li>Up to 5 projects</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Basic analytics dashboard</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Email support (response within 48 hrs)</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:pdm/card -->

<!-- wp:pdm/card {"style":{"spacing":{"padding":{"top":"var:preset|spacing|small","bottom":"var:preset|spacing|small","left":"var:preset|spacing|small","right":"var:preset|spacing|small"}},"shadow":"none","border":{"width":"3px"},"elements":{"link":{"color":{"text":"var:preset|color|white"}}}},"backgroundColor":"primary","textColor":"white","borderColor":"primary"} -->
<div class="wp-block-pdm-card is-vertically-aligned-top has-border-color has-primary-border-color has-white-color has-primary-background-color has-text-color has-background has-link-color" style="border-width:3px;padding-top:var(--wp--preset--spacing--small);padding-right:var(--wp--preset--spacing--small);padding-bottom:var(--wp--preset--spacing--small);padding-left:var(--wp--preset--spacing--small);box-shadow:none"><!-- wp:heading {"style":{"typography":{"fontSize":"30px","fontStyle":"normal","fontWeight":"400"}}} -->
<h2 class="wp-block-heading" style="font-size:30px;font-style:normal;font-weight:400"><strong><strong>Premium</strong></strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"style":{"typography":{"fontSize":"16px"}}} -->
<p style="font-size:16px">Tailored for enterprises requiring unlimited projects, full analytics, 24/7 support, and a dedicated account manager.</p>
<!-- /wp:paragraph -->

<!-- wp:group {"style":{"spacing":{"blockGap":"0px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":3,"style":{"typography":{"fontSize":"36px","fontStyle":"normal","fontWeight":"700"}}} -->
<h3 class="wp-block-heading" style="font-size:36px;font-style:normal;font-weight:700">$95</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p> <sub>/month</sub></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->

<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|x-small","bottom":"var:preset|spacing|x-small"}}}} -->
<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--x-small);margin-bottom:var(--wp--preset--spacing--x-small)"><!-- wp:button {"backgroundColor":"white","textColor":"primary","width":100,"className":"is-style-fill","style":{"border":{"radius":"6px"},"typography":{"fontStyle":"normal","fontWeight":"500"},"elements":{"link":{"color":{"text":"var:preset|color|primary"}}}},"fontSize":"small"} -->
<div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-fill"><a class="wp-block-button__link has-primary-color has-white-background-color has-text-color has-background has-link-color has-small-font-size has-custom-font-size wp-element-button" style="border-radius:6px;font-style:normal;font-weight:500">Buy Plan</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:list {"className":"is-style-checkmark-list","style":{"spacing":{"margin":{"right":"0px","left":"0px"},"padding":{"right":"0px","left":"15px"}},"typography":{"fontSize":"16px"}}} -->
<ul style="margin-right:0px;margin-left:0px;padding-right:0px;padding-left:15px;font-size:16px" class="wp-block-list is-style-checkmark-list"><!-- wp:list-item -->
<li>Unlimited projects</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Full analytics suite with custom reports</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>24/7 phone &amp; email support</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Dedicated account manager</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Custom integrations &amp; onboarding</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:pdm/card --></div>
<!-- /wp:pdm/cards -->
<!-- /wp:pdm/tab -->
<!-- /wp:pdm/tabs -->`,
};

export default Pricing;
