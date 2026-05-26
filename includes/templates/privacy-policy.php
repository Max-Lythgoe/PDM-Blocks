<?php

if (! defined('ABSPATH')) {
    exit;
}

function pdm_blocks_get_dynamic_privacy_policy_template()
{
    return <<<'HTML'
<!-- wp:pdm/section {"metadata":{"name":"[dynamic_content type=\u0022sitename\u0022] | Privacy Policy"}} -->
<div class="wp-block-pdm-section alignfull is-vertically-aligned-center"><div class="section-flex-container content-last"><div class="content-wrapper"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">[dynamic_content type="sitename"] | Privacy Policy</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>At [dynamic_content type="sitename"] accessible from [dynamic_content type="siteurl"], one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by [dynamic_content type="sitename"] and how we use it.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collected in [dynamic_content type="sitename"]. This policy is not applicable to any information collected offline or via channels other than this website.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Consent</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Information we collect</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">How we use your information</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We use the information we collect in various ways, including to:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Provide, operate, and maintain our website</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Improve, personalize, and expand our website</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Understand and analyze how you use our website</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Develop new products, services, features, and functionality</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Send you emails / text messages</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Serve your ads through various third party advertising networks</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Find and prevent fraud</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">How we protect your information</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We use regular Malware Scanning.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We implement a variety of security measures when a user enters, submits, or accesses their information to maintain the safety of your personal information.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Log Files</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"] follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Cookies and Web Beacons</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Like any other website, [dynamic_content type="sitename"] uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information. We may also use trusted third-party services that track this information on our behalf.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since each browser is a little different, look at your browser’s Help Menu to learn the correct way to modify your cookies.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>If you turn cookies off, it won’t affect the user’s experience.&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Third Party / Advertising Partners Information</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We, therefore, have no responsibility or liability for the content and activities of these sites. Since [dynamic_content type="sitename"] Privacy Policy does not apply to other advertisers or websites, we are advising you to consult the respective Privacy Policies of these third-parties for more detailed information. It may include their practices and instructions about how to opt-out of certain options. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on [dynamic_content type="sitename"], which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Note that [dynamic_content type="sitename"] has no access to or control over these cookies that are used by third-party advertisers.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Under the CCPA, among other rights, California consumers have the right to:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Request that a business delete any personal data about the consumer that a business has collected.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">California Online Privacy Protection Act</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>CalOPPA requires commercial websites and online services to post a privacy policy. The law’s reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. – See more at: <a href="https://consumercal.org/about-cfc/cfc-education-foundation/california-online-privacy-protection-act-caloppa-3/#sthash.0FdRbT51.dpuf">https://consumercal.org/about-cfc/cfc-education-foundation/california-online-privacy-protection-act-caloppa-3/#sthash.0FdRbT51.dpuf</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>According to CalOPPA, we agree to the following:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Users can visit our site anonymously.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Once this privacy policy is created, we will add a link to it on our homepage or as a minimum, on the first significant page after entering our website.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Our Privacy Policy link includes the word ‘Privacy’ and can easily be found on the page specified above.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You will be notified of any Privacy Policy changes:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• On our Privacy Policy Page</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Can change your personal information:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• By emailing us</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">GDPR Data Protection Rights</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Detailed Information on the Processing of Your Personal Data</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The Service Providers we use may have access to Your Personal Data. These third-party vendors collect, store, use, process and transfer information about Your activity on Our Service in accordance with their Privacy Policies.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Analytics</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We may use third-party Service providers to monitor and analyze the use of our Service.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Google Analytics</strong></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><br>You can opt-out of having made your activity on the Service available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js and dc.js) from sharing information with Google Analytics about visits activity.<br><br>For more information on the privacy practices of Google, please visit the Google Privacy &amp; Terms web page: <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a>&nbsp;</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Advertising</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Google Ads</strong></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Google Ads is an online advertising, pay-per-click platform developed by Google. This platform displays advertisements to customers in a variety of places online, such as on Google Search, mobile apps, videos (i.e. YouTube), search partners, and non-search websites. We may utilize this platform to serve you ads based on your interactions with our website, social media channels, previous Google Ads interactions, etc.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We use Google Ads cookies and conversions to measure the effectiveness of our advertising campaigns and to track the performance of our website. Google Ads cookies are small text files that are stored on your computer when you visit our website. They allow Google to track your browsing behavior and to show you more relevant ads.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>When you click on one of our Google Ads, a conversion cookie is placed on your computer. This cookie allows us to track whether you have taken a desired action on our website, such as making a purchase, signing up for our newsletter, filling out a contact form, or calling us.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We do not collect any personal information from you through Google Ads cookies or conversions. The information that we collect is anonymous and is used only to improve our advertising campaigns and to track the performance of our website. We will not share the information that We collect from Google Ads cookies and conversions with any third parties without your consent.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You can opt out of Google Ads cookies at any time by visiting the Google Ads Settings page. You can also opt out of third-party cookies by visiting the Network Advertising Initiative opt out page.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>For more information, visit <a href="https://policies.google.com/technologies/ads">https://policies.google.com/technologies/ads</a>.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Other Paid Advertising Platforms</strong></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"] may use other paid advertising platforms, such as social media advertising (e.g. Facebook Ads, Instagram Ads, Twitter Ads, Linkedin Ads, TikTok Ads) and Microsoft Ads, to reach new customers and promote our products and services. These platforms use cookies and other tracking technologies to collect information about your browsing activity and interests. This information is used to show you more relevant ads and to measure the effectiveness of our advertising campaigns.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We do not collect any personal information from you through paid advertising platforms. The information that we collect is anonymous and is used only to improve our advertising campaigns and to track the performance of our website.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You can opt out of paid advertising cookies at any time by visiting the privacy settings pages of the relevant platforms. You can also opt out of third-party cookies by visiting the Network Advertising Initiative opt out page.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Consent to Receive Text Messages</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>By selecting “I Accept” on any of our contact forms, you expressly authorize [dynamic_content type="sitename"] (and any party acting on behalf of [dynamic_content type="sitename"] to contact you via text message at the mobile number(s) provided.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You agree that [dynamic_content type="sitename"] may use automatic telephone dialing systems to send text messages to any mobile number listed. You agree that you own or are authorized to provide any numbers you enroll.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Information sharing to subcontractors in support services, such as customer service, is permitted. All other use case categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Carrier message and data rates may apply.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>To opt-out, text STOP from the mobile number you want to unenroll.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Children's Information</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>[dynamic_content type="sitename"] does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Fair Information Practices</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We will notify you via email</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>•</strong> Within 7 business days</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We will notify the users via in-site notification</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>•</strong> Within 7 business days</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">CAN-SPAM Act</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>We collect your email address in order to:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Send information, respond to inquiries, and/or other requests or questions</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Market to our mailing list or continue to send emails to our clients after the original transaction or correspondence has occurred.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>To be in accordance with CAN-SPAM, we agree to the following:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Don’t use false or misleading header information.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Don’t use deceptive subject lines.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Identify the message as an ad.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Tell recipients where you’re located.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Tell recipients how to opt out of receiving future marketing email from you.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Remember that subscribers and members can opt out of marketing emails, too.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Honor opt-out requests promptly.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Monitor what others are doing on your behalf.&nbsp;</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Changes to This Privacy Policy</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Contact Us</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
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
<p>[dynamic_content type="year"]</p>
<!-- /wp:paragraph --></div></div></div>
<!-- /wp:pdm/section -->
HTML;
}
