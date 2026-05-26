<?php

if (! defined('ABSPATH')) {
    exit;
}

function pdm_blocks_get_dynamic_terms_template()
{
    return <<<'HTML'
<!-- wp:pdm/section {"metadata":{"name":"[dynamic_content type=\u0022sitename\u0022] | Terms of Service"}} -->
<div class="wp-block-pdm-section alignfull is-vertically-aligned-center"><div class="section-flex-container content-last"><div class="content-wrapper"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">[dynamic_content type="sitename"]<strong> | Terms of Service</strong></h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Terms of Service for [dynamic_content type="siteurl"]&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Introduction</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Welcome to [dynamic_content type="siteurl"], This website is owned and operated by [dynamic_content type="sitename"]. By visiting our website and accessing the information, resources, services, products, and tools we provide, you understand and agree to accept and adhere to the following terms and conditions as stated in this policy (hereafter referred to as ‘User Agreement’), along with the terms and conditions as stated in our Privacy Policy (please refer to the Privacy Policy section below for more information).</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This agreement is in effect as of [dynamic_content type="year"].</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We reserve the right to change this User Agreement from time to time without notice. You acknowledge and agree that it is your responsibility to review this User Agreement periodically to familiarize yourself with any modifications. Your continued use of this site after such modifications will constitute acknowledgment and agreement of the modified terms and conditions.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Responsible Use and Conduct</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>By visiting our website and accessing the information, resources, services, products, and tools we provide for you, either directly or indirectly (hereafter referred to as ‘Resources’), you agree to use these Resources only for the purposes intended as permitted by (a) the terms of this User Agreement, and (b) applicable laws, regulations and generally accepted online practices or guidelines.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Wherein, you understand that:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>a. In order to access our Resources, you may be required to provide certain information about yourself (such as identification, contact details, etc.) as part of the registration process, or as part of your ability to use the Resources. You agree that any information you provide will always be accurate, correct, and up to date.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>b. You are responsible for maintaining the confidentiality of any login information associated with any account you use to access our Resources. Accordingly, you are responsible for all activities that occur under your account/s.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>c. Accessing (or attempting to access) any of our Resources by any means other than through the means we provide, is strictly prohibited. You specifically agree not to access (or attempt to access) any of our Resources through any automated, unethical or unconventional means.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>d. Engaging in any activity that disrupts or interferes with our Resources, including the servers and/or networks to which our Resources are located or connected, is strictly prohibited.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>e. Attempting to copy, duplicate, reproduce, sell, trade, or resell our Resources is strictly prohibited.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>f. You are solely responsible for any consequences, losses, or damages that we may directly or indirectly incur or suffer due to any unauthorized activities conducted by you, as explained above, and may incur criminal or civil liability.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>g. We may provide various open communication tools on our website, such as blog comments, blog posts, public chat, forums, message boards, newsgroups, product ratings and reviews, various social media services, etc. You understand that generally we do not pre-screen or monitor the content posted by users of these various communication tools, which means that if you choose to use these tools to submit any type of content to our website, then it is your personal responsibility to use these tools in a responsible and ethical manner. By posting information or otherwise using any open communication tools as mentioned, you agree that you will not upload, post, share, or otherwise distribute any content that:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>i. Is illegal, threatening, defamatory, abusive, harassing, degrading, intimidating, fraudulent, deceptive, invasive, racist, or contains any type of suggestive, inappropriate, or explicit language;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>ii. Infringes on any trademark, patent, trade secret, copyright, or other proprietary right of any party;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Iii. Contains any type of unauthorized or unsolicited advertising;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Iiii. Impersonates any person or entity, including any [dynamic_content type="sitename"] employees or representatives.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We have the right at our sole discretion to remove any content that we feel in our judgment does not comply with this User Agreement, along with any content that we feel is otherwise offensive, harmful, objectionable, inaccurate, or violates any 3rd party copyrights or trademarks. We are not responsible for any delay or failure in removing such content. If you post content that we choose to remove, you hereby consent to such removal, and consent to waive any claim against us.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>h. We do not assume any liability for any content posted by you or any other 3rd party users of our website. However, any content posted by you using any open communication tools on our website, provided that it doesn’t violate or infringe on any 3rd party copyrights or trademarks, becomes the property of , and as such, gives us a perpetual, irrevocable, worldwide, royalty-free, exclusive license to reproduce, modify, adapt, translate, publish, publicly display and/or distribute as we see fit. This only refers and applies to content posted via open communication tools as described, and does not refer to information that is provided as part of the registration process, necessary in order to use our Resources. All information provided as part of our registration process is covered by our privacy policy.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>i. You agree to indemnify and hold harmless [dynamic_content type="sitename"] and its parent company and affiliates, and their directors, officers, managers, employees, donors, agents, and licensors from and against all losses, expenses, damages and costs, including reasonable attorneys’ fees, resulting from any violation of this User Agreement or the failure to fulfill any obligations relating to your account incurred by you or any other person using your account. We reserve the right to take over the exclusive defense of any claim for which we are entitled to indemnification under this User Agreement. In such an event, you shall provide us with such cooperation as is reasonably requested by us.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Privacy</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Your privacy is very important to us, which is why we’ve created a separate Privacy Policy in order to explain in detail how we collect, manage, process, secure, and store your private information. Our privacy policy is included under the scope of this User Agreement. To read our <a href="/privacy-policy/">privacy policy</a> in its entirety, visit our privacy policy page.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Consent to Receive Text Messages</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>By signing up through our website, You are consenting to receive text messages that may be sent via an automatic telephone dialing system to the mobile number provided from [dynamic_content type="sitename"], its affiliates or its successors.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Your consent to receive text messages (including promotional and transactional alert text messages, which come from a ten digit phone number) from [dynamic_content type="sitename"], is subject to these Text Terms, including the Dispute Resolution provisions found below, and also is subject to the Privacy Policy at the link below (collectively referred to herein as the "Agreement").</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You agree that when You consent to receive text messages from any of our text message programs, You will receive confirmatory opt-in text messages from the respective program. You agree to receive opt-out texts from any of our programs if You subsequently reply STOP to any text messages you receive. For help related to any text message program, reply HELP to any text message received. You agree that when You initiate a text message to any of our text message programs, You may receive related text messages in reply.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>When opted-in, you will receive text messages (SMS/MMS) to your mobile number. These kinds of messages may include responses to a quote, estimate, or service inquiry, real-time texts to ask and answer questions about our services and pricing, appointment scheduling and confirmations, feedback requests, project updates, marketing messages, and follow-up.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>You can cancel the SMS service at any time. Simply text "STOP" to the shortcode. Upon sending "STOP," we will confirm your unsubscribe status via SMS. Following this confirmation, you will no longer receive SMS messages from us. To rejoin, sign up as you did initially, and we will resume sending SMS messages to you.&nbsp;</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>If you experience issues with the messaging program, reply with the keyword HELP for more assistance, or reach out to us directly.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Carriers are not liable for delayed or undelivered messages.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>As always, message and data rates may apply for messages sent to you from us and to us from you. The number of messages you can expect to receive per month will vary based on your interaction with us, [dynamic_content type="sitename"].</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>For privacy-related inquiries, please refer to our <a href="/privacy-policy/">Privacy Policy</a>.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Please consult Your service agreement with Your wireless carrier to determine Your phone's pricing plan. This program may not be available on all wireless carriers. The carriers supported by this program are AT&amp;T, Boost Mobile, Sprint, T-Mobile, U.S. Cellular, and Verizon, but [dynamic_content type="sitename"] may add or remove any wireless carrier from this program without notice.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You warrant that You have provided Your accurate mobile telephone number to [dynamic_content type="sitename"] and that You have authority to consent to receive text messages at that number. Before changing, deactivating, or relinquishing Your mobile phone number, You agree that You will opt-out of [dynamic_content type="sitename"] text message programs, or text message programs offered by our other brands which You may have signed up to receive. Failure to do so constitutes a material breach of these Text Terms.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>For customer service related to [dynamic_content type="sitename"] text message programs, please contact us. You may also review our <a href="/privacy-policy/">Privacy Policy</a>.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You agree that [dynamic_content type="sitename"] may change these Text Terms from time to time, through updating the online version of these Text Terms. Should there be a material change to these Text Terms, [dynamic_content type="sitename"] will provide notice of such change via text messaging.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Limitation of Warranties</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>By using our website, you understand and agree that all Resources we provide are “as is” and “as available”. This means that we do not represent or warrant to you that:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>i) the use of our Resources will meet your needs or requirements.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>ii) the use of our Resources will be uninterrupted, timely, secure or free from errors.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>iii) the information obtained by using our Resources will be accurate or reliable, and</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>iv) any defects in the operation or functionality of any Resources we provide will be repaired or corrected.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Furthermore, you understand and agree that:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>v) any content downloaded or otherwise obtained through the use of our Resources is done at your own discretion and risk, and that you are solely responsible for any damage to your computer or other devices for any loss of data that may result from the download of such content.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>vi) no information or advice, whether expressed, implied, oral or written, obtained by you from [dynamic_content type="sitename"] or through any Resources we provide shall create any warranty, guarantee, or conditions of any kind, except for those expressly outlined in this User Agreement.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Limitation of Liability</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>In conjunction with the Limitation of Warranties as explained above, you expressly understand and agree that any claim against us shall be limited to the amount you paid, if any, for use of products and/or services. [dynamic_content type="sitename"] will not be liable for any direct, indirect, incidental, consequential or exemplary loss or damages which may be incurred by you as a result of using our Resources, or as a result of any changes, data loss or corruption, cancellation, loss of access, or downtime to the full extent that applicable limitation of liability laws apply.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Copyrights/Trademarks</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>All content and materials available on [dynamic_content type="siteurl"], including but not limited to text, graphics, website name, code, images and logos are the intellectual property of [dynamic_content type="sitename"], and are protected by applicable copyright and trademark law. Any inappropriate use, including but not limited to the reproduction, distribution, display or transmission of any content on this site is strictly prohibited, unless specifically authorized by [dynamic_content type="sitename"].</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Termination of Use</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>You agree that we may, at our sole discretion, suspend or terminate your access to all or part of our website and Resources with or without notice and for any reason, including, without limitation, breach of this User Agreement. Any suspected illegal, fraudulent or abusive activity may be grounds for terminating your relationship and may be referred to appropriate law enforcement authorities. Upon suspension or termination, your right to use the Resources we provide will immediately cease, and we reserve the right to remove or delete any information that you may have on file with us, including any account or login information.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Governing Law</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>This website is controlled by [dynamic_content type="sitename"] from our offices located in the state of [dynamic_content type="state"], United States. It can be accessed by most countries around the world. As each country has laws that may differ from those of [dynamic_content type="state"], by accessing our website, you agree that the statutes and laws of [dynamic_content type="state"] regard to the conflict of laws and the United Nations Convention on the International Sales of Goods, will apply to all matters relating to the use of this website and the purchase of any products or services through this site.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Furthermore, any action to enforce this User Agreement shall be brought in the federal or state courts located in the United States, [dynamic_content type="state"]. You hereby agree to personal jurisdiction by such courts, and waive any jurisdictional, venue, or inconvenient forum objections to such courts.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Guarantee</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>UNLESS OTHERWISE EXPRESSED, [dynamic_content type="sitename"] EXPRESSLY DISCLAIMS ALL WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Contact Information</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If you have any questions or comments about our Terms of Service as outlined above, you can contact us at:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"]</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[company_info type="address" location="1"]</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[company_info type="phone" location="1"]</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:pdm/section -->
HTML;
}
