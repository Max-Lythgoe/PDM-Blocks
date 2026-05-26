<?php

if (! defined('ABSPATH')) {
    exit;
}

function pdm_blocks_get_dynamic_hipaa_template()
{
    return <<<'HTML'
<!-- wp:pdm/section {"metadata":{"name":"HIPAA Privacy Policy"}} -->
<div class="wp-block-pdm-section alignfull is-vertically-aligned-center"><div class="section-flex-container content-last"><div class="content-wrapper"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading"><strong>HIPAA Privacy Policy</strong></h1>
<!-- /wp:heading -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Notice of Privacy Practices</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Your Medical Information Privacy Matters</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This notice describes how we handle your dental and health information, outlining its use and disclosure, your rights, and our commitment to safeguarding your privacy. Please review it carefully.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>OUR COMMITMENT TO PRIVACY</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We understand the importance of your privacy and are committed to maintaining the confidentiality of your health information. This notice explains how we may use and disclose your health information, your rights regarding this information, and how to contact our Privacy Officer with any questions.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>TABLE OF CONTENTS</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>A. How We May Use or Disclose Your Health Information<br>B. When We May Not Use or Disclose Your Health Information<br>C. Your Health Information Rights<br>D. Changes to this Notice of Privacy Practices<br>E. Complaints</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>A. How We May Use or Disclose Your Health Information</strong></h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Treatment:</strong> We use your health information to provide you with dental care and may share it with other providers involved in your treatment.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Payment:</strong> We may disclose your health information to obtain payment for services, including sharing it with insurance companies.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Health Care Operations:</strong> Your information may be used for operational purposes such as quality reviews, audits, and staff training.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Appointment Reminders:</strong> We may contact you to remind you of upcoming appointments, using voicemail, text, email, or other means.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Sign-In Sheet:</strong> We may use your information when you sign in at our office and to call your name when we are ready to see you.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Notification and Communication with Family:</strong> We may disclose your information to family members or others involved in your care unless you object.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Marketing:</strong> We may contact you about our services or promotions. We will not disclose your information for marketing without your written authorization.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Sale of Health Information:</strong> We do not and will not sell your health information.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Required by Law:</strong> We may use or disclose your information as required by federal, state, or local law.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Public Health:</strong> Disclosures may be made for public health activities like disease control or reporting abuse.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Health Oversight Activities:</strong> We may share your information with agencies overseeing healthcare.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Judicial and Administrative Proceedings:</strong> We may disclose your information for legal processes such as subpoenas or court orders.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Law Enforcement:</strong> Your information may be shared with law enforcement when legally required.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Coroners and Medical Examiners:</strong> We may disclose information for investigations related to deaths.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Organ or Tissue Donation:</strong> We may release information to organizations involved in donations.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Public Safety:</strong> We may disclose information to prevent a serious threat to health or safety.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Proof of Immunization:</strong> With your consent, we may provide immunization records to schools.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Specialized Government Functions:</strong> Your information may be used for military, national security, or correctional purposes.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Workers’ Compensation:</strong> Disclosures may be made to comply with workers’ compensation laws.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Change of Ownership:</strong> If [dynamic_content type="sitename"] is sold or merges with another practice, your health information will remain protected and under the same privacy practices.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Breach Notification:</strong> We will notify you promptly if there is a breach involving your unsecured health information.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>B. When We May Not Use or Disclose Your Health Information</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We will not use or disclose your health information without your written authorization, except as described in this Notice.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>C. Your Health Information Rights</strong></h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Right to Request Special Privacy Protections:</strong> You may request limits on how we use or disclose your information.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Right to Request Confidential Communications:</strong> You may ask us to contact you in specific ways or at specific locations.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Right to Inspect and Copy:</strong> You may inspect and obtain a copy of your health information, with certain exceptions.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Right to Amend or Supplement:</strong> You may request corrections to your health record if you believe it is incomplete or inaccurate.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Right to an Accounting of Disclosures:</strong> You may request a list of disclosures made over the past six years, excluding those for treatment, payment, or healthcare operations.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Right to a Paper or Electronic Copy of This Notice:</strong> You may request a printed or digital version of this Notice at any time.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>For more information or to exercise your rights, please contact our Privacy Officer.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>D. Changes to This Notice of Privacy Practices</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We reserve the right to revise this Notice at any time. Changes will apply to all health information we maintain. We will display the current Notice in our office and on our website at [dynamic_content type="sitename"].</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>E. Complaints</strong></h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If you believe your privacy rights have been violated, you may file a complaint with our Privacy Officer or with the U.S. Department of Health and Human Services.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Email:</strong> OCRMail@hhs.gov<br><strong>Complaint Form:</strong> <a href="https://www.hhs.gov/sites/default/files/ocr/privacy/hipaa/complaints/hipcomplaintform.pdf">https://www.hhs.gov/sites/default/files/ocr/privacy/hipaa/complaints/hipcomplaintform.pdf</a>&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You will not be penalized for filing a complaint. Your privacy and satisfaction are of utmost importance to us.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Thank you for choosing [dynamic_content type="sitename"].</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:pdm/section -->
HTML;
}
