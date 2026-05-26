<?php

if (! defined('ABSPATH')) {
    exit;
}

function pdm_blocks_get_dynamic_healthcare_disclaimer_template()
{
    return <<<'HTML'
<!-- wp:pdm/section {"metadata":{"name":"Healthcare Disclaimer"}} -->
<div class="wp-block-pdm-section alignfull is-vertically-aligned-center"><div class="section-flex-container content-last"><div class="content-wrapper"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Healthcare Disclaimer</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The information provided on the [dynamic_content type="sitename"] website is intended for general informational and educational purposes only. It should not be construed as professional medical or dental advice, diagnosis, or treatment. Always seek the advice of your dentist, physician, or other qualified healthcare provider with any questions you may have regarding a medical or dental condition. Never disregard professional advice or delay in seeking it because of something you have read on this website.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>No Doctor-Patient Relationship</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Use of this website does not establish a doctor-patient relationship between you and [dynamic_content type="sitename"] or any of our dental professionals. Communication through this website, including emails and contact forms, does not create a doctor-patient relationship. A formal relationship is only established through direct consultation with our dental professionals.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Limitation of Liability</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>While we strive to keep the information on our website accurate and up-to-date, [dynamic_content type="sitename"] makes no warranties or representations regarding the accuracy, completeness, or suitability of the information contained herein. Reliance on any information provided by this website is solely at your own risk. VIP Smiles Dental disclaims any liability for any errors or omissions in the content of this site or for any actions taken based on the information provided.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>External Links</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This website may contain links to external websites for your convenience. [dynamic_content type="sitename"] does not endorse and is not responsible for the content or practices of any third-party websites. Accessing such websites is at your own risk.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Changes to This Disclaimer</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"] reserves the right to modify this disclaimer at any time without prior notice. Your continued use of the website constitutes acceptance of any changes made.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>Contact Information</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If you have any questions or concerns regarding this disclaimer or the content on our website, please contact us at:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"]</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[company_info type="address" location="1"]</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[company_info type="phone" location="1"]</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[dynamic_content type="siteurl"]</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>By using this website, you acknowledge and agree to this disclaimer.</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:pdm/section -->
HTML;
}
