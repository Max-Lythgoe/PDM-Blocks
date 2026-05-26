<?php

if (! defined('ABSPATH')) {
    exit;
}

function pdm_blocks_get_dynamic_accessibility_statement_template()
{
    return <<<'HTML'
<!-- wp:pdm/section {"metadata":{"name":"Accessibility Statement"}} -->
<div class="wp-block-pdm-section alignfull is-vertically-aligned-center"><div class="section-flex-container content-last"><div class="content-wrapper"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><strong>Accessibility Statement</strong></h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Updated </strong>[dynamic_content type="published_date"]</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>General</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"] is committed to ensuring that its services are accessible to individuals with disabilities. We have invested considerable resources to enhance the usability and accessibility of our website, driven by our firm belief that everyone deserves to live with dignity, equality, comfort, and independence.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Accessibility</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"] continuously works toward complying with Web Content Accessibility Guidelines (WCAG 2.0). We aim to make our website easy to navigate and accessible to everyone, including people with disabilities.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Disclaimer</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"] is committed to ongoing efforts to enhance the accessibility of our website and services, recognizing it as our collective moral responsibility to provide seamless, accessible, and barrier-free experiences for individuals with disabilities.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Despite our dedicated efforts to make all pages and content on our website fully accessible, some content might not yet meet the highest accessibility standards. This may be due to ongoing efforts to identify and implement the most effective technological solutions.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Here For You</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If you encounter difficulties with any content on our website or require assistance with any aspect of our site, please reach out to us during normal business hours. We are always ready and willing to help.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Contact Us</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If you need to report an accessibility issue, have any questions, or require further assistance, please contact [dynamic_content type="sitename"] Customer Support.</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:pdm/section -->
HTML;
}
