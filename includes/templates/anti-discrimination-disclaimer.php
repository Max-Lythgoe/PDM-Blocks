<?php

if (! defined('ABSPATH')) {
    exit;
}

function pdm_blocks_get_dynamic_anti_discrimination_disclaimer_template()
{
    return <<<'HTML'
<!-- wp:pdm/section {"metadata":{"name":"Anti-Discrimination Disclaimer"}} -->
<div class="wp-block-pdm-section alignfull is-vertically-aligned-center"><div class="section-flex-container content-last"><div class="content-wrapper"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><strong>Anti-Discrimination Disclaimer</strong></h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>At [dynamic_content type="sitename"], we proudly serve the diverse community of [dynamic_content type="state"] and we are dedicated to providing exceptional care to everyone. Our values are rooted in anti-discrimination, inclusivity, and respect for all individuals, irrespective of race, ethnicity, gender, sexual orientation, religion, disability, or any other characteristic.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We unequivocally state that discrimination or bias has no place within our company. Such behaviors conflict with our core values and the compassionate care we provide. We firmly stand against any actions, words, or behaviors that discriminate or cause harm.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Our Commitment to Anti-Discrimination:</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Equal Access to Care:</strong> All [client_or_patient]s at [dynamic_content type="sitename"] receives equal access to care, regardless of race, color, national origin, religion, gender, sexual orientation, gender identity, age, disability, or any other protected characteristic.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Respect and Dignity:</strong> Our team treats every [client_or_patient] with respect, dignity, and kindness, fostering a welcoming, inclusive environment where everyone feels safe and valued.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Non-Discrimination in Employment: </strong>[dynamic_content type="sitename"] is an equal opportunity employer, hiring and promoting based on qualifications, skills, and experience, without regard to discriminatory factors.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Culturally Competent Care:</strong> Recognizing each [client_or_patient]'s unique background and needs, we provide culturally competent care that respects individuality.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Zero Tolerance for Discrimination:</strong> We have zero tolerance for discrimination, harassment, or bias within our company, involving staff or [client_or_patient]s. Clear procedures are in place for reporting discrimination concerns.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Accessibility: </strong>[dynamic_content type="sitename"] ensures services are accessible to all [client_or_patient]s. If you have specific accessibility needs or require accommodations, please inform us, and we will do our utmost to assist you.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Education and Training:</strong> Our staff regularly undergoes training in diversity, inclusion, and anti-discrimination practices, ensuring our knowledge and practices continually evolve.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Community Engagement:</strong> We actively participate in local community initiatives promoting diversity, inclusion, and equality, supporting organizations working toward these essential goals.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>We aim for every [client_or_patient] visiting [dynamic_content type="sitename"] to feel comfortable and respected. Discrimination and bias have no place in our industry, and we uphold the highest standards of professionalism, ethics, and inclusivity.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>If you experience or witness discrimination or have concerns regarding your experience at [dynamic_content type="sitename"], please contact us immediately. Your feedback is crucial to maintaining our commitment to continuous improvement and anti-discrimination.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Thank you for trusting us with your health and well-being. Together, we can foster a healthier, more inclusive community in [dynamic_content type="state"].</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You may file a grievance in person, by mail, fax, or email. If assistance is needed in filing a grievance, our staff is available to help.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You can also file a civil rights complaint with the U.S. Department of Health and Human Services, Office for Civil Rights, electronically through the Office for Civil Rights Complaint Portal, available at <a href="https://ocrportal.hhs.gov/ocr/portal/lobby.jsf">https://ocrportal.hhs.gov/ocr/portal/lobby.jsf</a>, or by mail or phone at:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>U.S. Department of Health and Human Services<br>200 Independence Avenue, SW<br>Room 509F, HHH Building<br>Washington, D.C. 20201<br>1-800-368-1019, 800-537-7697 (TDD)</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:pdm/section -->
HTML;
}
