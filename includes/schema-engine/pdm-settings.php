<?php

/**
 * Register a custom 'PDM Settings' admin page with SEO and Call Tracking tabs.
 *
 * This file is intended to be included in your theme's functions.php.
 */

// 1. Add the custom settings menu item under 'Settings'
function pdm_add_settings_menu_page()
{
    add_options_page(
        'PDM Settings',                 // Page title
        'PDM Settings',                 // Menu title
        'manage_options',               // Capability required to see the page
        'pdm-settings',                 // Menu slug (unique ID)
        'pdm_settings_page_content'     // Callback function to display the page content
    );
}
add_action('admin_menu', 'pdm_add_settings_menu_page');

// 2. Register all settings, sections, and fields
function pdm_settings_init()
{
    // Register the setting group (which saves all options as a single array)
    register_setting(
        'pdm_settings_group',           // Option group (matches settings_fields() in the form)
        'pdm_settings',                 // Option name (the key in wp_options)
        'pdm_settings_sanitize'         // Sanitize callback function
    );

    // --- SECTION 1: FAQ Schema Settings ---
    add_settings_section(
        'pdm_seo_section',              // Section ID
        'FAQ Schema Settings',          // Section Title
        'pdm_seo_section_callback',     // Callback to display section intro text
        'pdm-settings'                  // Page slug (unique ID)
    );

    // Auto FAQ Schema Toggle
    add_settings_field(
        'auto_faq_schema',
        'Auto FAQ Schema',
        'pdm_checkbox_input_callback',
        'pdm-settings',
        'pdm_seo_section',
        array('id' => 'auto_faq_schema', 'label' => 'Automatically generate FAQ schema from accordion content.')
    );

    // FAQ Question Class (shown only when auto_faq_schema is enabled)
    add_settings_field(
        'faq_question_class',
        'FAQ Question Class',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_seo_section',
        array('id' => 'faq_question_class', 'label' => 'CSS class selector for FAQ questions', 'default' => '.accord-title', 'depends_on' => 'auto_faq_schema')
    );

    // FAQ Answer Class (shown only when auto_faq_schema is enabled)
    add_settings_field(
        'faq_answer_class',
        'FAQ Answer Class',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_seo_section',
        array('id' => 'faq_answer_class', 'label' => 'CSS class selector for FAQ answers', 'default' => '.accord-panel', 'depends_on' => 'auto_faq_schema')
    );

    // --- SECTION 2: Article Schema Settings ---
    add_settings_section(
        'pdm_article_schema_section',
        'Article Schema Settings',
        'pdm_article_schema_section_callback',
        'pdm-settings'
    );

    // Auto Article Schema Toggle
    add_settings_field(
        'enable_article_schema',
        'Enable Article Schema',
        'pdm_checkbox_input_callback',
        'pdm-settings',
        'pdm_article_schema_section',
        array('id' => 'enable_article_schema', 'label' => 'Automatically generate Article schema for blog posts and pages.')
    );

    // Publisher Name
    add_settings_field(
        'article_publisher_name',
        'Publisher Name',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_article_schema_section',
        array('id' => 'article_publisher_name', 'label' => 'Name of the publishing organization (leave blank to default to site name)', 'depends_on' => 'enable_article_schema')
    );

    // Publisher Logo URL
    add_settings_field(
        'article_publisher_logo',
        'Publisher Logo URL',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_article_schema_section',
        array('id' => 'article_publisher_logo', 'label' => 'Full URL to publisher logo (leave blank to default to site icon)', 'depends_on' => 'enable_article_schema')
    );

    // Default Article Section
    add_settings_field(
        'article_default_section',
        'Default Article Section',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_article_schema_section',
        array('id' => 'article_default_section', 'label' => 'Default section name when post has no category', 'default' => 'Blog', 'depends_on' => 'enable_article_schema')
    );

    // Post Types to Include
    add_settings_field(
        'article_post_types',
        'Post Types',
        'pdm_textarea_input_callback',
        'pdm-settings',
        'pdm_article_schema_section',
        array('id' => 'article_post_types', 'label' => 'Post types to include (one per line, defaults to "post" only)', 'default' => "post", 'depends_on' => 'enable_article_schema')
    );

    // --- SECTION 3: Service Area Schema Settings ---
    add_settings_section(
        'pdm_service_area_schema_section',
        'Service Area Schema Settings',
        'pdm_service_area_schema_section_callback',
        'pdm-settings'
    );

    // Enable Service Area Schema
    add_settings_field(
        'enable_service_area_schema',
        'Enable Service Area Schema',
        'pdm_checkbox_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'enable_service_area_schema', 'label' => 'Generate LocalBusiness and Place schemas for service area posts.')
    );

    // Business Name
    add_settings_field(
        'service_area_business_name',
        'Business Name',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_business_name', 'label' => 'Name of your business (defaults to site name if left blank)', 'depends_on' => 'enable_service_area_schema')
    );

    // Business Type
    add_settings_field(
        'service_area_business_type',
        'Business Type',
        'pdm_select_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array(
            'id' => 'service_area_business_type',
            'label' => 'Type of business for schema.org',
            'options' => array(
                'HomeAndConstructionBusiness' => 'Home & Construction Business',
                'LocalBusiness' => 'Local Business',
                'ProfessionalService' => 'Professional Service',
                'Electrician' => 'Electrician',
                'GeneralContractor' => 'General Contractor',
                'HousePainter' => 'House Painter',
                'Locksmith' => 'Locksmith',
                'MovingCompany' => 'Moving Company',
                'Plumber' => 'Plumber',
                'RoofingContractor' => 'Roofing Contractor'
            ),
            'default' => 'HomeAndConstructionBusiness',
            'depends_on' => 'enable_service_area_schema'
        )
    );

    // Description
    add_settings_field(
        'service_area_description',
        'Business Description',
        'pdm_textarea_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_description', 'label' => 'Brief description of your business and services', 'depends_on' => 'enable_service_area_schema')
    );

    // Services
    add_settings_field(
        'service_area_services',
        'Services Offered',
        'pdm_textarea_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_services', 'label' => 'List your services (one per line)', 'depends_on' => 'enable_service_area_schema')
    );

    // Price Range
    add_settings_field(
        'service_area_price_range',
        'Price Range',
        'pdm_select_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array(
            'id' => 'service_area_price_range',
            'label' => 'Price range indicator',
            'options' => array(
                '$' => '$ (Budget-friendly)',
                '$$' => '$$ (Moderate)',
                '$$$' => '$$$ (Premium)',
                '$$$$' => '$$$$ (High-end)'
            ),
            'default' => '$$',
            'depends_on' => 'enable_service_area_schema'
        )
    );

    // Geoapify API Key for automatic geocoding
    add_settings_field(
        'service_area_geoapify_api_key',
        'Geoapify API Key',
        'pdm_password_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_geoapify_api_key', 'label' => 'API key for automatic geocoding of city pages', 'placeholder' => 'Enter your Geoapify API key', 'depends_on' => 'enable_service_area_schema')
    );

    // Note: Coordinates and addresses are automatically generated using Geoapify API
    // based on the Service Area page title (city name) + state/region above

    // Business Hours
    add_settings_field(
        'service_area_business_hours',
        'Business Hours',
        'pdm_textarea_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_business_hours', 'label' => 'Format: "Monday-Friday: 08:00-17:00" (one per line)', 'depends_on' => 'enable_service_area_schema')
    );

    // Company Physical Address
    add_settings_field(
        'service_area_company_street',
        'Company Street Address',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_company_street', 'label' => 'Your business physical street address', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_company_city',
        'Company City',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_company_city', 'label' => 'Your business physical city location', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_company_state',
        'Company State',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_company_state', 'label' => 'Your business physical state (e.g., UT)', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_company_zip',
        'Company ZIP Code',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_company_zip', 'label' => 'Your business physical ZIP code', 'depends_on' => 'enable_service_area_schema')
    );

    // Social Media URLs
    add_settings_field(
        'service_area_facebook_url',
        'Facebook URL',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_facebook_url', 'label' => 'Complete Facebook page URL', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_twitter_url',
        'Twitter/X URL',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_twitter_url', 'label' => 'Complete Twitter/X profile URL', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_instagram_url',
        'Instagram URL',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_instagram_url', 'label' => 'Complete Instagram profile URL', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_linkedin_url',
        'LinkedIn URL',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_linkedin_url', 'label' => 'Complete LinkedIn company page URL', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_youtube_url',
        'YouTube URL',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_youtube_url', 'label' => 'Complete YouTube channel URL', 'depends_on' => 'enable_service_area_schema')
    );

    add_settings_field(
        'service_area_yelp_url',
        'Yelp URL',
        'pdm_text_input_callback',
        'pdm-settings',
        'pdm_service_area_schema_section',
        array('id' => 'service_area_yelp_url', 'label' => 'Complete Yelp business page URL', 'depends_on' => 'enable_service_area_schema')
    );
}
add_action('admin_init', 'pdm_settings_init');

// Section callback functions
function pdm_service_area_schema_section_callback()
{
    echo '<p>Configure settings for LocalBusiness and Place schema generation on service area pages.</p>';
}

// 3. Render the settings page content with tabs
function pdm_settings_page_content()
{
    // Check user capabilities
    if (! current_user_can('manage_options')) {
        return;
    }

    // Get current tab
    $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'author-eeat';
?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <!-- Tab Navigation -->
        <h2 class="nav-tab-wrapper">
            <a href="?page=pdm-settings&tab=author-eeat" class="nav-tab <?php echo $active_tab == 'author-eeat' ? 'nav-tab-active' : ''; ?>">Author E-E-A-T</a>
            <a href="?page=pdm-settings&tab=seo" class="nav-tab <?php echo $active_tab == 'seo' ? 'nav-tab-active' : ''; ?>">FAQs</a>
            <a href="?page=pdm-settings&tab=articles" class="nav-tab <?php echo $active_tab == 'articles' ? 'nav-tab-active' : ''; ?>">Articles</a>
            <a href="?page=pdm-settings&tab=service-areas" class="nav-tab <?php echo $active_tab == 'service-areas' ? 'nav-tab-active' : ''; ?>">Service Areas</a>

        </h2>

        <form method="post" action="options.php">
            <?php
            // Output security fields and the options group reference.
            settings_fields('pdm_settings_group');
            ?>

            <!-- Hidden field to track current tab -->
            <input type="hidden" name="pdm_current_tab" value="<?php echo esc_attr($active_tab); ?>" />

            <!-- SEO Tab Content -->
            <?php if ($active_tab == 'seo'): ?>
                <div class="tab-content" id="seo-tab">
                    <?php
                    // Output only the SEO section
                    do_settings_section_fields('pdm-settings', 'pdm_seo_section');
                    ?>

                    <?php
                    // Display FAQ status if auto FAQ is enabled
                    $options = get_option('pdm_settings');
                    if (!empty($options['auto_faq_schema'])):
                    ?>
                        <div id="faq-schema-section" style="margin-top: 30px;">
                            <h2>FAQ Schema Management</h2>
                            <div class="notice notice-success" style="padding: 10px; margin: 15px 0;">
                                <p><strong>✅ Automatic FAQ Schema Active</strong><br>
                                    FAQ schemas are automatically generated when posts/pages are published or updated. No manual action required.</p>
                            </div>
                            <div id="pdm-faq-results" style="margin-top: 20px;">
                                <?php pdm_display_faq_pages_list(); ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <!-- Author E-E-A-T Tab Content -->
            <?php if ($active_tab == 'author-eeat'): ?>
                <div class="tab-content" id="author-eeat-tab">
                    <?php
                    // Output only the Author E-E-A-T section
                    do_settings_section_fields('pdm-settings', 'pdm_author_eeat_section');

                    // Display author schema status if enabled
                    $options = get_option('pdm_settings');
                    if (!empty($options['enable_rankmath_schema'])):
                    ?>
                        <div id="author-eeat-schema-section" style="margin-top: 30px;">
                            <div class="notice notice-success" style="padding: 10px; margin: 15px 0;">
                                <p><strong>✅ Automatic Author Schema Active</strong><br>
                                    Author schemas are automatically generated when blog posts are published or updated. No manual action required.</p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <!-- Articles Tab Content -->
            <?php if ($active_tab == 'articles'): ?>
                <div class="tab-content" id="articles-tab">
                    <?php
                    // Output only the Article Schema section
                    do_settings_section_fields('pdm-settings', 'pdm_article_schema_section');

                    // Display article schema status if enabled
                    $options = get_option('pdm_settings');
                    if (!empty($options['enable_article_schema'])):
                    ?>
                        <div id="article-schema-section" style="margin-top: 30px;">
                            <div class="notice notice-success" style="padding: 10px; margin: 15px 0;">
                                <p><strong>✅ Automatic Article Schema Active</strong><br>
                                    Article schemas are automatically generated when posts/pages are published or updated. No manual action required.</p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <!-- Service Areas Tab Content -->
            <?php if ($active_tab == 'service-areas'): ?>
                <div class="tab-content" id="service-areas-tab">
                    <?php
                    // Output only the Service Area Schema section
                    do_settings_section_fields('pdm-settings', 'pdm_service_area_schema_section');

                    // Display service area schema status if enabled
                    $options = get_option('pdm_settings');
                    if (!empty($options['enable_service_area_schema'])):
                    ?>
                        <div id="service-area-schema-section" style="margin-top: 30px;">
                            <div class="notice notice-success" style="padding: 10px; margin: 15px 0;">
                                <p><strong>✅ Automatic Service Area Schema Active</strong><br>
                                    LocalBusiness schemas are automatically generated when service area pages are published or updated. No manual action required.</p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>





            <?php
            // Output the save button.
            submit_button('Save Settings');
            ?>
        </form>
    </div>

    <!-- JavaScript for conditional fields -->
    <script>
        (function() {
            function toggleConditionalFields() {
                // Auto FAQ Schema conditional fields
                var autoFaqSchema = document.getElementById('auto_faq_schema');
                if (autoFaqSchema) {
                    var questionClassRow = document.getElementById('faq_question_class') ? document.getElementById('faq_question_class').closest('tr') : null;
                    var answerClassRow = document.getElementById('faq_answer_class') ? document.getElementById('faq_answer_class').closest('tr') : null;
                    var faqSchemaSection = document.getElementById('faq-schema-section');

                    if (autoFaqSchema.checked) {
                        if (questionClassRow) questionClassRow.style.display = '';
                        if (answerClassRow) answerClassRow.style.display = '';
                        if (faqSchemaSection) faqSchemaSection.style.display = '';
                    } else {
                        if (questionClassRow) questionClassRow.style.display = 'none';
                        if (answerClassRow) answerClassRow.style.display = 'none';
                        if (faqSchemaSection) faqSchemaSection.style.display = 'none';
                    }
                }

                // Author E-E-A-T conditional fields
                var enableAuthorEeat = document.getElementById('enable_author_eeat');
                if (enableAuthorEeat) {
                    var authorBoxRow = document.getElementById('author_box_enabled') ? document.getElementById('author_box_enabled').closest('tr') : null;
                    var rankmathRow = document.getElementById('enable_rankmath_schema') ? document.getElementById('enable_rankmath_schema').closest('tr') : null;

                    if (enableAuthorEeat.checked) {
                        if (authorBoxRow) authorBoxRow.style.display = '';
                        if (rankmathRow) rankmathRow.style.display = '';
                    } else {
                        if (authorBoxRow) authorBoxRow.style.display = 'none';
                        if (rankmathRow) rankmathRow.style.display = 'none';
                    }
                }

                // Author Schema Generation conditional (bulk update button)
                var enableRankmathSchema = document.getElementById('enable_rankmath_schema');
                if (enableRankmathSchema) {
                    var authorSchemaSection = document.getElementById('author-eeat-schema-section');

                    if (enableRankmathSchema.checked && enableAuthorEeat && enableAuthorEeat.checked) {
                        if (authorSchemaSection) authorSchemaSection.style.display = '';
                    } else {
                        if (authorSchemaSection) authorSchemaSection.style.display = 'none';
                    }
                }

                // Author Box Position conditional
                var authorBoxEnabled = document.getElementById('author_box_enabled');
                if (authorBoxEnabled) {
                    var positionRow = document.getElementById('author_box_position') ? document.getElementById('author_box_position').closest('tr') : null;
                    var styleRow = document.getElementById('author_box_style') ? document.getElementById('author_box_style').closest('tr') : null;

                    if (authorBoxEnabled.checked && enableAuthorEeat && enableAuthorEeat.checked) {
                        if (positionRow) positionRow.style.display = '';
                        if (styleRow) styleRow.style.display = '';
                    } else {
                        if (positionRow) positionRow.style.display = 'none';
                        if (styleRow) styleRow.style.display = 'none';
                    }
                }

                // Service Area Schema conditional fields
                var enableServiceArea = document.getElementById('enable_service_area_schema');
                if (enableServiceArea) {
                    var businessNameRow = document.getElementById('service_area_business_name') ? document.getElementById('service_area_business_name').closest('tr') : null;
                    var businessTypeRow = document.getElementById('service_area_business_type') ? document.getElementById('service_area_business_type').closest('tr') : null;
                    var servicesRow = document.getElementById('service_area_services') ? document.getElementById('service_area_services').closest('tr') : null;
                    var descriptionRow = document.getElementById('service_area_description') ? document.getElementById('service_area_description').closest('tr') : null;
                    var priceRangeRow = document.getElementById('service_area_price_range') ? document.getElementById('service_area_price_range').closest('tr') : null;
                    var geoapifyRow = document.getElementById('service_area_geoapify_api_key') ? document.getElementById('service_area_geoapify_api_key').closest('tr') : null;
                    var businessHoursRow = document.getElementById('service_area_business_hours') ? document.getElementById('service_area_business_hours').closest('tr') : null;
                    var companyStreetRow = document.getElementById('service_area_company_street') ? document.getElementById('service_area_company_street').closest('tr') : null;
                    var companyCityRow = document.getElementById('service_area_company_city') ? document.getElementById('service_area_company_city').closest('tr') : null;
                    var companyStateRow = document.getElementById('service_area_company_state') ? document.getElementById('service_area_company_state').closest('tr') : null;
                    var companyZipRow = document.getElementById('service_area_company_zip') ? document.getElementById('service_area_company_zip').closest('tr') : null;
                    var facebookRow = document.getElementById('service_area_facebook_url') ? document.getElementById('service_area_facebook_url').closest('tr') : null;
                    var twitterRow = document.getElementById('service_area_twitter_url') ? document.getElementById('service_area_twitter_url').closest('tr') : null;
                    var instagramRow = document.getElementById('service_area_instagram_url') ? document.getElementById('service_area_instagram_url').closest('tr') : null;
                    var linkedinRow = document.getElementById('service_area_linkedin_url') ? document.getElementById('service_area_linkedin_url').closest('tr') : null;
                    var youtubeRow = document.getElementById('service_area_youtube_url') ? document.getElementById('service_area_youtube_url').closest('tr') : null;
                    var yelpRow = document.getElementById('service_area_yelp_url') ? document.getElementById('service_area_yelp_url').closest('tr') : null;
                    var schemaSection = document.getElementById('service-area-schema-section');

                    if (enableServiceArea.checked) {
                        if (businessNameRow) businessNameRow.style.display = '';
                        if (businessTypeRow) businessTypeRow.style.display = '';
                        if (servicesRow) servicesRow.style.display = '';
                        if (descriptionRow) descriptionRow.style.display = '';
                        if (priceRangeRow) priceRangeRow.style.display = '';
                        if (geoapifyRow) geoapifyRow.style.display = '';
                        if (businessHoursRow) businessHoursRow.style.display = '';
                        if (companyStreetRow) companyStreetRow.style.display = '';
                        if (companyCityRow) companyCityRow.style.display = '';
                        if (companyStateRow) companyStateRow.style.display = '';
                        if (companyZipRow) companyZipRow.style.display = '';
                        if (facebookRow) facebookRow.style.display = '';
                        if (twitterRow) twitterRow.style.display = '';
                        if (instagramRow) instagramRow.style.display = '';
                        if (linkedinRow) linkedinRow.style.display = '';
                        if (youtubeRow) youtubeRow.style.display = '';
                        if (yelpRow) yelpRow.style.display = '';
                        if (schemaSection) schemaSection.style.display = '';
                    } else {
                        if (businessNameRow) businessNameRow.style.display = 'none';
                        if (businessTypeRow) businessTypeRow.style.display = 'none';
                        if (servicesRow) servicesRow.style.display = 'none';
                        if (descriptionRow) descriptionRow.style.display = 'none';
                        if (priceRangeRow) priceRangeRow.style.display = 'none';
                        if (geoapifyRow) geoapifyRow.style.display = 'none';
                        if (businessHoursRow) businessHoursRow.style.display = 'none';
                        if (companyStreetRow) companyStreetRow.style.display = 'none';
                        if (companyCityRow) companyCityRow.style.display = 'none';
                        if (companyStateRow) companyStateRow.style.display = 'none';
                        if (companyZipRow) companyZipRow.style.display = 'none';
                        if (facebookRow) facebookRow.style.display = 'none';
                        if (twitterRow) twitterRow.style.display = 'none';
                        if (instagramRow) instagramRow.style.display = 'none';
                        if (linkedinRow) linkedinRow.style.display = 'none';
                        if (youtubeRow) youtubeRow.style.display = 'none';
                        if (yelpRow) yelpRow.style.display = 'none';
                        if (schemaSection) schemaSection.style.display = 'none';
                    }
                }

                // Article Schema conditional fields
                var enableArticleSchema = document.getElementById('enable_article_schema');
                if (enableArticleSchema) {
                    var publisherNameRow = document.getElementById('article_publisher_name') ? document.getElementById('article_publisher_name').closest('tr') : null;
                    var publisherLogoRow = document.getElementById('article_publisher_logo') ? document.getElementById('article_publisher_logo').closest('tr') : null;
                    var defaultSectionRow = document.getElementById('article_default_section') ? document.getElementById('article_default_section').closest('tr') : null;
                    var postTypesRow = document.getElementById('article_post_types') ? document.getElementById('article_post_types').closest('tr') : null;
                    var articleSchemaSection = document.getElementById('article-schema-section');

                    if (enableArticleSchema.checked) {
                        if (publisherNameRow) publisherNameRow.style.display = '';
                        if (publisherLogoRow) publisherLogoRow.style.display = '';
                        if (defaultSectionRow) defaultSectionRow.style.display = '';
                        if (postTypesRow) postTypesRow.style.display = '';
                        if (articleSchemaSection) articleSchemaSection.style.display = '';
                    } else {
                        if (publisherNameRow) publisherNameRow.style.display = 'none';
                        if (publisherLogoRow) publisherLogoRow.style.display = 'none';
                        if (defaultSectionRow) defaultSectionRow.style.display = 'none';
                        if (postTypesRow) postTypesRow.style.display = 'none';
                        if (articleSchemaSection) articleSchemaSection.style.display = 'none';
                    }
                }



            }

            // Run on page load
            document.addEventListener('DOMContentLoaded', function() {
                toggleConditionalFields();

                // Add event listeners
                var autoFaqSchema = document.getElementById('auto_faq_schema');
                if (autoFaqSchema) {
                    autoFaqSchema.addEventListener('change', toggleConditionalFields);
                }

                var enableAuthorEeat = document.getElementById('enable_author_eeat');
                if (enableAuthorEeat) {
                    enableAuthorEeat.addEventListener('change', toggleConditionalFields);
                }

                var enableRankmathSchema = document.getElementById('enable_rankmath_schema');
                if (enableRankmathSchema) {
                    enableRankmathSchema.addEventListener('change', toggleConditionalFields);
                }

                var authorBoxEnabled = document.getElementById('author_box_enabled');
                if (authorBoxEnabled) {
                    authorBoxEnabled.addEventListener('change', toggleConditionalFields);
                }

                var enableServiceArea = document.getElementById('enable_service_area_schema');
                if (enableServiceArea) {
                    enableServiceArea.addEventListener('change', toggleConditionalFields);
                }

                var enableArticleSchema = document.getElementById('enable_article_schema');
                if (enableArticleSchema) {
                    enableArticleSchema.addEventListener('change', toggleConditionalFields);
                }

                // FAQ Update Button AJAX
                var updateBtn = document.getElementById('pdm-update-faq-schema');
                if (updateBtn) {
                    updateBtn.addEventListener('click', function() {
                        var statusSpan = document.getElementById('pdm-faq-status');
                        var resultsDiv = document.getElementById('pdm-faq-results');

                        updateBtn.disabled = true;
                        statusSpan.innerHTML = '<span style="color: #0073aa;">Scanning and updating FAQ schema...</span>';

                        jQuery.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'pdm_update_faq_schema',
                                nonce: '<?php echo wp_create_nonce("pdm_faq_schema_nonce"); ?>'
                            },
                            success: function(response) {
                                if (response.success) {
                                    statusSpan.innerHTML = '<span style="color: #46b450;">✓ ' + response.data.message + '</span>';
                                    if (response.data.html) {
                                        resultsDiv.innerHTML = response.data.html;
                                    }
                                } else {
                                    statusSpan.innerHTML = '<span style="color: #dc3232;">✗ ' + response.data.message + '</span>';
                                }
                                updateBtn.disabled = false;
                            },
                            error: function() {
                                statusSpan.innerHTML = '<span style="color: #dc3232;">✗ An error occurred.</span>';
                                updateBtn.disabled = false;
                            }
                        });
                    });
                }

                // Service Area Schema Update Button AJAX
                var serviceAreaBtn = document.getElementById('pdm-update-service-area-schema');
                if (serviceAreaBtn) {
                    serviceAreaBtn.addEventListener('click', function() {
                        var statusSpan = document.getElementById('pdm-service-area-status');

                        serviceAreaBtn.disabled = true;
                        statusSpan.innerHTML = '<span style="color: #0073aa;">Updating Service Area schemas...</span>';

                        jQuery.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'pdm_scan_service_areas',
                                pdm_scan_service_areas_nonce: '<?php echo wp_create_nonce("pdm_scan_service_areas"); ?>'
                            },
                            success: function(response) {
                                if (response.success) {
                                    statusSpan.innerHTML = '<span style="color: #46b450;">✓ ' + response.data.message + '</span>';
                                } else {
                                    statusSpan.innerHTML = '<span style="color: #dc3232;">✗ ' + response.data + '</span>';
                                }
                                serviceAreaBtn.disabled = false;
                            },
                            error: function() {
                                statusSpan.innerHTML = '<span style="color: #dc3232;">✗ An error occurred.</span>';
                                serviceAreaBtn.disabled = false;
                            }
                        });
                    });
                }

                // Author Schema Update Button AJAX
                var authorSchemaBtn = document.getElementById('pdm-update-author-schema');
                if (authorSchemaBtn) {
                    authorSchemaBtn.addEventListener('click', function() {
                        var statusSpan = document.getElementById('pdm-author-schema-status');

                        authorSchemaBtn.disabled = true;
                        statusSpan.innerHTML = '<span style="color: #0073aa;">Updating author schemas...</span>';

                        jQuery.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'pdm_update_author_schemas',
                                pdm_author_schema_nonce: '<?php echo wp_create_nonce("pdm_author_schema"); ?>'
                            },
                            success: function(response) {
                                if (response.success) {
                                    statusSpan.innerHTML = '<span style="color: #46b450;">✓ ' + response.data.message + '</span>';
                                } else {
                                    statusSpan.innerHTML = '<span style="color: #dc3232;">✗ ' + response.data + '</span>';
                                }
                                authorSchemaBtn.disabled = false;
                            },
                            error: function() {
                                statusSpan.innerHTML = '<span style="color: #dc3232;">✗ An error occurred.</span>';
                                authorSchemaBtn.disabled = false;
                            }
                        });
                    });
                }

                // Article Schema Update Button AJAX
                var articleSchemaBtn = document.getElementById('pdm-update-article-schema');
                if (articleSchemaBtn) {
                    articleSchemaBtn.addEventListener('click', function() {
                        var statusSpan = document.getElementById('pdm-article-schema-status');

                        articleSchemaBtn.disabled = true;
                        statusSpan.innerHTML = '<span style="color: #0073aa;">Updating article schemas...</span>';

                        jQuery.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'pdm_update_article_schemas',
                                pdm_article_schema_nonce: '<?php echo wp_create_nonce("pdm_article_schema"); ?>'
                            },
                            success: function(response) {
                                if (response.success) {
                                    statusSpan.innerHTML = '<span style="color: #46b450;">✓ ' + response.data.message + '</span>';
                                } else {
                                    statusSpan.innerHTML = '<span style="color: #dc3232;">✗ ' + response.data + '</span>';
                                }
                                articleSchemaBtn.disabled = false;
                            },
                            error: function() {
                                statusSpan.innerHTML = '<span style="color: #dc3232;">✗ An error occurred.</span>';
                                articleSchemaBtn.disabled = false;
                            }
                        });
                    });
                }

            });
        })();
    </script>

    <style>
        #pdm-faq-results ul {
            list-style: disc;
            margin-left: 20px;
            margin-top: 10px;
        }

        #pdm-faq-results li {
            margin: 5px 0;
        }

        #pdm-faq-results a {
            text-decoration: none;
        }

        #pdm-faq-results a:hover {
            text-decoration: underline;
        }
    </style>
<?php
}

// 4. Helper function to output settings section fields (since we're using tabs)
function do_settings_section_fields($page, $section_id)
{
    global $wp_settings_sections, $wp_settings_fields;

    if (!isset($wp_settings_sections[$page][$section_id])) {
        return;
    }

    $section = $wp_settings_sections[$page][$section_id];

    if ($section['title']) {
        echo "<h2>{$section['title']}</h2>\n";
    }

    if ($section['callback']) {
        call_user_func($section['callback'], $section);
    }

    if (!isset($wp_settings_fields[$page][$section_id])) {
        return;
    }

    echo '<table class="form-table" role="presentation">';
    do_settings_fields($page, $section_id);
    echo '</table>';
}

// 5. Callback functions for Sections and Fields

// Section callback functions (optional intro text for the section)
function pdm_seo_section_callback()
{
    echo '<p>Configure FAQ schema settings for automatically generating structured data from accordion content.</p>';
}

function pdm_article_schema_section_callback()
{
    echo '<p>Configure Article schema settings for automatically generating structured data for blog posts and pages.</p>';
}


/**
 * Renders a checkbox input field.
 */
function pdm_checkbox_input_callback($args)
{
    $options = get_option('pdm_settings');
    $value = isset($options[$args['id']]) ? (bool) $options[$args['id']] : false;

    $name_attr = 'pdm_settings[' . esc_attr($args['id']) . ']';

    echo '<input type="checkbox" id="' . esc_attr($args['id']) . '" name="' . $name_attr . '" value="1" ' . checked(1, $value, false) . ' />';
    if (! empty($args['label'])) {
        echo ' <label for="' . esc_attr($args['id']) . '">' . $args['label'] . '</label>';
    }
}

/**
 * Renders a textarea input field.
 */
function pdm_textarea_input_callback($args)
{
    $options = get_option('pdm_settings');
    $value = isset($options[$args['id']]) ? $options[$args['id']] : '';

    $name_attr = 'pdm_settings[' . esc_attr($args['id']) . ']';

    echo '<textarea id="' . esc_attr($args['id']) . '" name="' . $name_attr . '" rows="10" cols="80" class="large-text">' . esc_textarea($value) . '</textarea>';
    if (! empty($args['label'])) {
        echo '<p class="description">' . $args['label'] . '</p>';
    }
}

/**
 * Renders a text input field.
 */
function pdm_text_input_callback($args)
{
    $options = get_option('pdm_settings');
    $default = isset($args['default']) ? $args['default'] : '';
    $value = isset($options[$args['id']]) ? $options[$args['id']] : $default;
    $placeholder = isset($args['placeholder']) ? $args['placeholder'] : '';

    $name_attr = 'pdm_settings[' . esc_attr($args['id']) . ']';
    $placeholder_attr = $placeholder ? 'placeholder="' . esc_attr($placeholder) . '"' : '';

    echo '<input type="text" id="' . esc_attr($args['id']) . '" name="' . $name_attr . '" value="' . esc_attr($value) . '" class="regular-text" ' . $placeholder_attr . ' />';
    if (! empty($args['label'])) {
        echo '<p class="description">' . $args['label'] . '</p>';
    }
}

/**
 * Renders a password input field.
 */
function pdm_password_input_callback($args)
{
    $options = get_option('pdm_settings');
    $value = isset($options[$args['id']]) ? $options[$args['id']] : '';
    $placeholder = isset($args['placeholder']) ? $args['placeholder'] : '';

    $name_attr = 'pdm_settings[' . esc_attr($args['id']) . ']';
    $placeholder_attr = $placeholder ? 'placeholder="' . esc_attr($placeholder) . '"' : '';

    echo '<input type="password" id="' . esc_attr($args['id']) . '" name="' . $name_attr . '" value="' . esc_attr($value) . '" class="regular-text" ' . $placeholder_attr . ' />';
    if (! empty($args['label'])) {
        echo '<p class="description">' . $args['label'] . '</p>';
    }
}

/**
 * Renders a select dropdown field.
 */
function pdm_select_input_callback($args)
{
    $options = get_option('pdm_settings');
    $default = isset($args['default']) ? $args['default'] : '';
    $value = isset($options[$args['id']]) ? $options[$args['id']] : $default;
    $select_options = isset($args['options']) ? $args['options'] : array();

    $name_attr = 'pdm_settings[' . esc_attr($args['id']) . ']';

    echo '<select id="' . esc_attr($args['id']) . '" name="' . $name_attr . '">';
    foreach ($select_options as $option_value => $option_label) {
        echo '<option value="' . esc_attr($option_value) . '" ' . selected($value, $option_value, false) . '>' . esc_html($option_label) . '</option>';
    }
    echo '</select>';
    if (! empty($args['label'])) {
        echo '<p class="description">' . $args['label'] . '</p>';
    }
}

// 6. Sanitize Callback
/**
 * Sanitize all option fields before saving to the database.
 */
function pdm_settings_sanitize($input)
{
    // Get existing settings to preserve values from other tabs
    $existing = get_option('pdm_settings', array());
    $sanitized_input = $existing; // Start with existing settings

    // Determine which tab we're saving from
    $current_tab = isset($_POST['pdm_current_tab']) ? sanitize_text_field($_POST['pdm_current_tab']) : '';

    // Sanitize checkbox values based on current tab
    // For checkboxes, if they're not in $_POST on their tab, they're unchecked
    if ($current_tab === 'seo' || empty($current_tab)) {
        // FAQ Schema checkboxes
        $sanitized_input['auto_faq_schema'] = !empty($input['auto_faq_schema']) ? true : false;
    }

    if ($current_tab === 'author-eeat' || empty($current_tab)) {
        // Author E-E-A-T checkboxes
        $sanitized_input['enable_author_eeat'] = !empty($input['enable_author_eeat']) ? true : false;
        $sanitized_input['author_box_enabled'] = !empty($input['author_box_enabled']) ? true : false;
        $sanitized_input['enable_rankmath_schema'] = !empty($input['enable_rankmath_schema']) ? true : false;
    }

    if ($current_tab === 'service-areas' || empty($current_tab)) {
        // Service Area Schema checkbox
        $sanitized_input['enable_service_area_schema'] = !empty($input['enable_service_area_schema']) ? true : false;
    }

    if ($current_tab === 'articles' || empty($current_tab)) {
        // Article Schema checkbox
        $sanitized_input['enable_article_schema'] = !empty($input['enable_article_schema']) ? true : false;
    }


    // Sanitize text inputs
    if (isset($input['faq_question_class'])) {
        $sanitized_input['faq_question_class'] = sanitize_text_field($input['faq_question_class']);
    }
    if (isset($input['faq_answer_class'])) {
        $sanitized_input['faq_answer_class'] = sanitize_text_field($input['faq_answer_class']);
    }

    // Sanitize Author E-E-A-T settings
    if (isset($input['author_box_position'])) {
        $allowed_positions = array('before_content', 'after_content', 'manual');
        $sanitized_input['author_box_position'] = in_array($input['author_box_position'], $allowed_positions)
            ? $input['author_box_position']
            : 'after_content';
    }

    if (isset($input['author_box_style'])) {
        $allowed_styles = array('regular', 'tooltip');
        $sanitized_input['author_box_style'] = in_array($input['author_box_style'], $allowed_styles)
            ? $input['author_box_style']
            : 'regular';
    }

    // Sanitize Service Area Schema settings
    if (isset($input['service_area_business_name'])) {
        $sanitized_input['service_area_business_name'] = sanitize_text_field($input['service_area_business_name']);
    }

    if (isset($input['service_area_business_type'])) {
        $sanitized_input['service_area_business_type'] = sanitize_text_field($input['service_area_business_type']);
    }

    if (isset($input['service_area_state'])) {
        $sanitized_input['service_area_state'] = sanitize_text_field($input['service_area_state']);
    }

    if (isset($input['service_area_geoapify_api_key'])) {
        $sanitized_input['service_area_geoapify_api_key'] = sanitize_text_field($input['service_area_geoapify_api_key']);
    }

    if (isset($input['service_area_services'])) {
        $sanitized_input['service_area_services'] = sanitize_textarea_field($input['service_area_services']);
    }

    if (isset($input['service_area_description'])) {
        $sanitized_input['service_area_description'] = sanitize_textarea_field($input['service_area_description']);
    }

    if (isset($input['service_area_business_hours'])) {
        $sanitized_input['service_area_business_hours'] = sanitize_textarea_field($input['service_area_business_hours']);
    }

    if (isset($input['service_area_price_range'])) {
        $sanitized_input['service_area_price_range'] = sanitize_text_field($input['service_area_price_range']);
    }

    // Sanitize Company Physical Address
    if (isset($input['service_area_company_street'])) {
        $sanitized_input['service_area_company_street'] = sanitize_text_field($input['service_area_company_street']);
    }

    if (isset($input['service_area_company_city'])) {
        $sanitized_input['service_area_company_city'] = sanitize_text_field($input['service_area_company_city']);
    }

    if (isset($input['service_area_company_state'])) {
        $sanitized_input['service_area_company_state'] = sanitize_text_field($input['service_area_company_state']);
    }

    if (isset($input['service_area_company_zip'])) {
        $sanitized_input['service_area_company_zip'] = sanitize_text_field($input['service_area_company_zip']);
    }

    // Sanitize Service Area Social Media URLs
    if (isset($input['service_area_facebook_url'])) {
        $sanitized_input['service_area_facebook_url'] = esc_url_raw($input['service_area_facebook_url']);
    }

    if (isset($input['service_area_twitter_url'])) {
        $sanitized_input['service_area_twitter_url'] = esc_url_raw($input['service_area_twitter_url']);
    }

    if (isset($input['service_area_instagram_url'])) {
        $sanitized_input['service_area_instagram_url'] = esc_url_raw($input['service_area_instagram_url']);
    }

    if (isset($input['service_area_linkedin_url'])) {
        $sanitized_input['service_area_linkedin_url'] = esc_url_raw($input['service_area_linkedin_url']);
    }

    if (isset($input['service_area_youtube_url'])) {
        $sanitized_input['service_area_youtube_url'] = esc_url_raw($input['service_area_youtube_url']);
    }

    if (isset($input['service_area_yelp_url'])) {
        $sanitized_input['service_area_yelp_url'] = esc_url_raw($input['service_area_yelp_url']);
    }

    // Sanitize Article Schema settings
    if (isset($input['article_publisher_name'])) {
        $sanitized_input['article_publisher_name'] = sanitize_text_field($input['article_publisher_name']);
    }

    if (isset($input['article_publisher_logo'])) {
        $sanitized_input['article_publisher_logo'] = esc_url_raw($input['article_publisher_logo']);
    }

    if (isset($input['article_default_section'])) {
        $sanitized_input['article_default_section'] = sanitize_text_field($input['article_default_section']);
    }

    if (isset($input['article_post_types'])) {
        $sanitized_input['article_post_types'] = sanitize_textarea_field($input['article_post_types']);
    }

    // Sanitize Organization Schema settings
    if (isset($input['organization_company_name'])) {
        $sanitized_input['organization_company_name'] = sanitize_text_field($input['organization_company_name']);
    }

    if (isset($input['organization_company_description'])) {
        $sanitized_input['organization_company_description'] = sanitize_textarea_field($input['organization_company_description']);
    }

    return $sanitized_input;
}

// 7. Helper Functions for Front-End Use
/**
 * Retrieve a specific PDM setting.
 */
function pdm_get_setting($key, $default = false)
{
    $options = get_option('pdm_settings', array());
    return isset($options[$key]) ? $options[$key] : $default;
}

/**
 * Check if site is marked as SEO site.
 */
function pdm_is_seo_site()
{
    return (bool) pdm_get_setting('is_seo_site');
}

// ============================================
// FAQ SCHEMA AUTO-GENERATION FUNCTIONS
// ============================================

/**
 * Scan a post/page for FAQ content and extract questions/answers
 */
function pdm_extract_faqs_from_content($post_id)
{
    $options = get_option('pdm_settings');
    $question_class = isset($options['faq_question_class']) ? $options['faq_question_class'] : '.accord-title';
    $answer_class = isset($options['faq_answer_class']) ? $options['faq_answer_class'] : '.accord-panel';

    // Get the post content
    $post = get_post($post_id);
    if (!$post) {
        return array();
    }

    $content = apply_filters('the_content', $post->post_content);

    // Load HTML into DOMDocument
    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML('<?xml encoding="UTF-8">' . $content);
    libxml_clear_errors();

    // Remove the XML encoding wrapper
    foreach ($dom->childNodes as $item) {
        if ($item->nodeType == XML_PI_NODE) {
            $dom->removeChild($item);
        }
    }
    $dom->encoding = 'UTF-8';

    // Create XPath object
    $xpath = new DOMXPath($dom);

    // Convert CSS selectors to XPath
    $question_xpath = pdm_css_to_xpath($question_class);
    $answer_xpath = pdm_css_to_xpath($answer_class);

    // Find all question elements
    $question_nodes = $xpath->query($question_xpath);
    $faqs = array();

    if ($question_nodes->length > 0) {
        foreach ($question_nodes as $question_node) {
            // Get question text (strip icon elements)
            $question_text = '';
            foreach ($question_node->childNodes as $child) {
                if ($child->nodeType === XML_TEXT_NODE) {
                    $question_text .= $child->nodeValue;
                } elseif ($child->nodeName !== 'i') { // Skip icon elements
                    $question_text .= $child->textContent;
                }
            }
            $question_text = trim($question_text);

            // Find the corresponding answer (next sibling or parent's next element)
            $answer_text = '';
            $current = $question_node;

            // Check if parent is <details> element
            if ($question_node->parentNode && $question_node->parentNode->nodeName === 'details') {
                $details = $question_node->parentNode;
                $answer_nodes = $xpath->query($answer_xpath, $details);
                if ($answer_nodes->length > 0) {
                    $answer_text = trim($answer_nodes->item(0)->textContent);
                }
            } else {
                // Try to find answer as next sibling
                $next = $question_node->nextSibling;
                while ($next) {
                    if ($next->nodeType === XML_ELEMENT_NODE && $next instanceof DOMElement) {
                        $classes = $next->getAttribute('class');
                        if (strpos($classes, str_replace('.', '', $answer_class)) !== false) {
                            $answer_text = trim($next->textContent);
                            break;
                        }
                    }
                    $next = $next->nextSibling;
                }
            }

            if (!empty($question_text) && !empty($answer_text)) {
                $faqs[] = array(
                    'question' => $question_text,
                    'answer' => $answer_text
                );
            }
        }
    }

    return $faqs;
}

/**
 * Convert simple CSS selector to XPath
 */
function pdm_css_to_xpath($css_selector)
{
    $css_selector = trim($css_selector);

    // Handle class selector
    if (strpos($css_selector, '.') === 0) {
        $class = substr($css_selector, 1);
        return "//*[contains(concat(' ', normalize-space(@class), ' '), ' $class ')]";
    }

    // Handle ID selector
    if (strpos($css_selector, '#') === 0) {
        $id = substr($css_selector, 1);
        return "//*[@id='$id']";
    }

    // Handle tag selector
    return "//$css_selector";
}

/**
 * Update RankMath FAQ schema for a post
 * - If RankMath PRO is active: Save to RankMath meta (shows in editor)
 * - If RankMath Free: Save to custom meta (filter will add to JSON-LD)
 */
function pdm_update_rankmath_faq_schema($post_id, $faqs)
{
    if (!class_exists('RankMath')) {
        return false;
    }

    if (empty($faqs)) {
        // Remove FAQ schema from both custom and RankMath meta
        delete_post_meta($post_id, 'pdm_auto_faq_data');
        delete_post_meta($post_id, 'rank_math_schema_FAQPage');
        return true;
    }

    // Build mainEntity array
    $main_entity = array();
    foreach ($faqs as $index => $faq) {
        $main_entity[] = array(
            '@type' => 'Question',
            '@id' => get_permalink($post_id) . '#faq-question-' . $index,
            'name' => $faq['question'],
            'acceptedAnswer' => array(
                '@type' => 'Answer',
                '@id' => get_permalink($post_id) . '#faq-answer-' . $index,
                'text' => $faq['answer']
            )
        );
    }

    // Save to RankMath meta for both Free and PRO (RankMath Free supports meta storage too)
    $schema_data = array(
        'metadata' => array(
            'title' => 'FAQ',
            'type' => 'template',
            'isPrimary' => false,
            'shortcode' => uniqid('s-')
        ),
        '@type' => 'FAQPage',
        '@id' => get_permalink($post_id) . '#faqpage',
        'name' => get_the_title($post_id),
        'mainEntity' => $main_entity
    );
    update_post_meta($post_id, 'rank_math_schema_FAQPage', $schema_data);
    // Remove custom meta to avoid duplication
    delete_post_meta($post_id, 'pdm_auto_faq_data');

    return true;
}

/**
 * Add FAQ schema to RankMath's JSON-LD output
 * DISABLED - Using RankMath meta storage instead (pdm_update_rankmath_faq_schema)
 */
function pdm_add_faq_schema_to_jsonld($data, $jsonld)
{
    // Disabled - we now save schema directly to RankMath post meta instead
    return $data;
}
// Disabled - using RankMath meta storage instead
// add_filter('rank_math/json_ld', 'pdm_add_faq_schema_to_jsonld', 99, 2);
/**
 * Scan all posts and pages for FAQs and update RankMath schema
 */
function pdm_scan_and_update_all_faq_schemas()
{
    $options = get_option('pdm_settings');

    if (empty($options['auto_faq_schema'])) {
        return array(
            'success' => false,
            'message' => 'Auto FAQ Schema is not enabled.'
        );
    }

    if (!class_exists('RankMath')) {
        return array(
            'success' => false,
            'message' => 'RankMath plugin is not active.'
        );
    }

    // Get all public post types
    $post_types = get_post_types(array('public' => true), 'names');

    // Remove attachment post type
    $post_types = array_diff($post_types, array('attachment'));

    $args = array(
        'post_type' => $post_types,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids'
    );

    $posts = get_posts($args);
    $updated_count = 0;
    $posts_with_faqs = array();

    foreach ($posts as $post_id) {
        $faqs = pdm_extract_faqs_from_content($post_id);

        if (!empty($faqs)) {
            pdm_update_rankmath_faq_schema($post_id, $faqs);
            $posts_with_faqs[] = $post_id;
            $updated_count++;
        } else {
            // Clean up old FAQ schema if no FAQs found
            delete_post_meta($post_id, 'rank_math_schema_FAQPage');
        }
    }

    // Store the list of posts with FAQs
    update_option('pdm_posts_with_faqs', $posts_with_faqs);

    return array(
        'success' => true,
        'message' => "Updated FAQ schema for $updated_count page(s).",
        'posts' => $posts_with_faqs
    );
}

/**
 * Display list of pages/posts with FAQs
 */
function pdm_display_faq_pages_list()
{
    $posts_with_faqs = get_option('pdm_posts_with_faqs', array());

    if (empty($posts_with_faqs)) {
        echo '<p><em>No pages or posts with FAQs found yet. Click "Update FAQ Schema" to scan.</em></p>';
        return;
    }

    echo '<h3>Pages/Posts with FAQs (' . count($posts_with_faqs) . ')</h3>';
    echo '<ul>';

    foreach ($posts_with_faqs as $post_id) {
        $post = get_post($post_id);
        if ($post) {
            $edit_link = get_edit_post_link($post_id);
            $post_type = get_post_type_object($post->post_type);
            $type_label = $post_type ? $post_type->labels->singular_name : 'Post';

            echo '<li>';
            echo '<a href="' . esc_url($edit_link) . '" target="_blank">' . esc_html($post->post_title) . '</a>';
            echo ' <span style="color: #666;">(' . esc_html($type_label) . ')</span>';
            echo '</li>';
        }
    }

    echo '</ul>';
}

/**
 * AJAX handler for updating FAQ schema
 */
function pdm_ajax_update_faq_schema()
{
    check_ajax_referer('pdm_faq_schema_nonce', 'nonce');

    if (!current_user_can('manage_options')) {
        wp_send_json_error(array('message' => 'Insufficient permissions.'));
    }

    $result = pdm_scan_and_update_all_faq_schemas();

    if ($result['success']) {
        ob_start();
        pdm_display_faq_pages_list();
        $html = ob_get_clean();

        wp_send_json_success(array(
            'message' => $result['message'],
            'html' => $html
        ));
    } else {
        wp_send_json_error(array('message' => $result['message']));
    }
}
add_action('wp_ajax_pdm_update_faq_schema', 'pdm_ajax_update_faq_schema');

// ============================================
// ARTICLE SCHEMA AUTO-GENERATION FUNCTIONS
// ============================================

/**
 * Generate Article schema for a post/page
 */
function pdm_generate_article_schema($post_id)
{
    $options = get_option('pdm_settings');

    if (empty($options['enable_article_schema'])) {
        return false;
    }

    $post = get_post($post_id);
    if (!$post) {
        return false;
    }

    // Get configured post types
    $allowed_post_types = array('post'); // default to blog posts only
    if (!empty($options['article_post_types'])) {
        $allowed_post_types = array_map('trim', explode("\n", $options['article_post_types']));
        $allowed_post_types = array_filter($allowed_post_types); // remove empty lines
    }

    if (!in_array($post->post_type, $allowed_post_types)) {
        return false;
    }

    // Get post data
    $post_url = get_permalink($post_id);
    $title = get_the_title($post_id);
    $excerpt = get_the_excerpt($post_id);
    $content = strip_shortcodes(wp_strip_all_tags($post->post_content));
    $word_count = str_word_count($content);

    // Get featured image
    $featured_image = null;
    if (has_post_thumbnail($post_id)) {
        $image_id = get_post_thumbnail_id($post_id);
        $image_data = wp_get_attachment_image_src($image_id, 'large');
        if ($image_data) {
            $featured_image = array(
                '@type' => 'ImageObject',
                'url' => $image_data[0],
                'width' => $image_data[1],
                'height' => $image_data[2]
            );
        }
    }

    // Get categories/sections
    $categories = get_the_category($post_id);
    $article_section = !empty($options['article_default_section']) ? $options['article_default_section'] : 'Blog';
    if (!empty($categories)) {
        $article_section = $categories[0]->name;
    }

    // Get author data (use existing author functions if available)
    $author_data = null;
    $author_id = $post->post_author;
    if ($author_id) {
        $author_name = get_the_author_meta('display_name', $author_id);
        $author_url = get_author_posts_url($author_id);

        $author_data = array(
            '@type' => 'Person',
            '@id' => $author_url,
            'name' => $author_name,
            'url' => $author_url
        );

        // Add author image if available
        $avatar_url = get_avatar_url($author_id, array('size' => 96));
        if ($avatar_url) {
            $author_data['image'] = array(
                '@type' => 'ImageObject',
                'url' => $avatar_url,
                'width' => 96,
                'height' => 96
            );
        }
    }

    // Get publisher data
    $publisher_data = null;
    $publisher_name = !empty($options['article_publisher_name']) ? $options['article_publisher_name'] : get_bloginfo('name');
    $publisher_logo_url = !empty($options['article_publisher_logo']) ? $options['article_publisher_logo'] : get_site_icon_url(112);

    if ($publisher_name) {
        $publisher_data = array(
            '@type' => 'Organization',
            'name' => $publisher_name
        );

        if ($publisher_logo_url) {
            $publisher_data['logo'] = array(
                '@type' => 'ImageObject',
                'url' => $publisher_logo_url
            );
        }
    }

    // Build Article schema
    $article_schema = array(
        '@type' => 'Article',
        '@id' => $post_url . '#article',
        'headline' => $title,
        'name' => $title,
        'url' => $post_url,
        'datePublished' => get_the_date('c', $post_id),
        'dateModified' => get_the_modified_date('c', $post_id),
        'articleSection' => $article_section,
        'wordCount' => $word_count,
        'mainEntityOfPage' => array(
            '@type' => 'WebPage',
            '@id' => $post_url
        )
    );

    // Add description
    if (!empty($excerpt)) {
        $article_schema['description'] = wp_trim_words($excerpt, 25, '...');
    }

    // Add image
    if ($featured_image) {
        $article_schema['image'] = $featured_image;
    }

    // Add author
    if ($author_data) {
        $article_schema['author'] = $author_data;
    }

    // Add publisher
    if ($publisher_data) {
        $article_schema['publisher'] = $publisher_data;
    }

    return $article_schema;
}

/**
 * Update RankMath Article schema for a post
 */
function pdm_update_rankmath_article_schema($post_id)
{
    if (!class_exists('RankMath')) {
        return false;
    }

    $article_schema = pdm_generate_article_schema($post_id);

    if (!$article_schema) {
        // Remove Article schema
        delete_post_meta($post_id, 'rank_math_schema_Article');
        return false;
    }

    // Add RankMath metadata
    $schema_data = array(
        'metadata' => array(
            'title' => 'Article',
            'type' => 'template',
            'isPrimary' => true,
            'shortcode' => uniqid('s-')
        )
    );

    // Merge with article schema
    $schema_data = array_merge($schema_data, $article_schema);

    // Save to RankMath meta
    update_post_meta($post_id, 'rank_math_schema_Article', $schema_data);

    return true;
}

/**
 * Scan all posts and update Article schemas
 */
function pdm_scan_and_update_all_article_schemas()
{
    $options = get_option('pdm_settings');

    if (empty($options['enable_article_schema'])) {
        return array(
            'success' => false,
            'message' => 'Article Schema is not enabled.'
        );
    }

    if (!class_exists('RankMath')) {
        return array(
            'success' => false,
            'message' => 'RankMath plugin is not active.'
        );
    }

    // Get configured post types
    $allowed_post_types = array('post'); // default to blog posts only
    if (!empty($options['article_post_types'])) {
        $allowed_post_types = array_map('trim', explode("\n", $options['article_post_types']));
        $allowed_post_types = array_filter($allowed_post_types); // remove empty lines
    }

    $args = array(
        'post_type' => $allowed_post_types,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'fields' => 'ids'
    );

    $posts = get_posts($args);
    $updated_count = 0;

    foreach ($posts as $post_id) {
        if (pdm_update_rankmath_article_schema($post_id)) {
            $updated_count++;
        }
    }

    return array(
        'success' => true,
        'message' => "Updated Article schema for $updated_count post(s)."
    );
}

/**
 * AJAX handler for updating Article schemas
 */
function pdm_ajax_update_article_schemas()
{
    try {
        check_ajax_referer('pdm_article_schema', 'pdm_article_schema_nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error('Insufficient permissions.');
        }

        $result = pdm_scan_and_update_all_article_schemas();

        if ($result['success']) {
            wp_send_json_success(array('message' => $result['message']));
        } else {
            wp_send_json_error($result['message']);
        }
    } catch (Exception $e) {
        wp_send_json_error('Error: ' . $e->getMessage());
    } catch (Error $e) {
        wp_send_json_error('PHP Error: ' . $e->getMessage());
    }
}
add_action('wp_ajax_pdm_update_article_schemas', 'pdm_ajax_update_article_schemas');
