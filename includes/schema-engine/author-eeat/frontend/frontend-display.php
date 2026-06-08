<?php

/**
 * Author E-E-A-T Frontend Display
 * 
 * Handles displaying author information on blog posts.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get SVG icon for social media
 * 
 * @param string $icon Icon name
 * @return string SVG markup
 */
function pdm_get_social_icon_svg($icon)
{
    $icons = array(
        'linkedin' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M196.3 512L103.4 512L103.4 212.9L196.3 212.9L196.3 512zM149.8 172.1C120.1 172.1 96 147.5 96 117.8C96 103.5 101.7 89.9 111.8 79.8C121.9 69.7 135.6 64 149.8 64C164 64 177.7 69.7 187.8 79.8C197.9 89.9 203.6 103.6 203.6 117.8C203.6 147.5 179.5 172.1 149.8 172.1zM543.9 512L451.2 512L451.2 366.4C451.2 331.7 450.5 287.2 402.9 287.2C354.6 287.2 347.2 324.9 347.2 363.9L347.2 512L254.4 512L254.4 212.9L343.5 212.9L343.5 253.7L344.8 253.7C357.2 230.2 387.5 205.4 432.7 205.4C526.7 205.4 544 267.3 544 347.7L544 512L543.9 512z"/></svg>',
        'facebook' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M240 363.3L240 576L356 576L356 363.3L442.5 363.3L460.5 265.5L356 265.5L356 230.9C356 179.2 376.3 159.4 428.7 159.4C445 159.4 458.1 159.8 465.7 160.6L465.7 71.9C451.4 68 416.4 64 396.2 64C289.3 64 240 114.5 240 223.4L240 265.5L174 265.5L174 363.3L240 363.3z"/></svg>',
        'twitter' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M453.2 112L523.8 112L369.6 288.2L551 528L409 528L297.7 382.6L170.5 528L99.8 528L264.7 339.5L90.8 112L236.4 112L336.9 244.9L453.2 112zM428.4 485.8L467.5 485.8L215.1 152L173.1 152L428.4 485.8z"/></svg>',
        'link' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M367.2 477C345.7 520.7 325.8 528 320 528C314.2 528 294.3 520.7 272.8 477C255.8 442.5 243.6 395.4 240.7 344L399.3 344C396.3 395.5 384.1 442.6 367.2 477zM399.3 296L240.7 296C243.7 244.5 255.9 197.4 272.8 163C294.3 119.3 314.2 112 320 112C325.8 112 345.7 119.3 367.2 163C384.2 197.5 396.4 244.6 399.3 296zM447.4 344L526.6 344C518 418.6 469.9 481.3 403.8 510.4C427.8 467.6 444.1 408 447.4 344zM526.6 296L447.4 296C444.1 232 427.8 172.4 403.8 129.6C469.9 158.8 518 221.4 526.6 296zM192.6 296L113.4 296C122 221.4 170.1 158.7 236.2 129.6C212.2 172.4 195.9 232 192.6 296zM113.4 344L192.6 344C195.9 408 212.2 467.6 236.2 510.4C170.1 481.2 122 418.6 113.4 344zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576z"/></svg>',
    );

    return isset($icons[$icon]) ? $icons[$icon] : '';
}

/**
 * Automatically add author box to post content
 */
function pdm_auto_add_author_box($content)
{
    // Only on single posts
    if (!is_single() || !in_the_loop() || !is_main_query()) {
        return $content;
    }

    // Check if auto-display is enabled
    $options = get_option('pdm_settings', array());
    if (empty($options['author_box_enabled'])) {
        return $content;
    }

    // Get position setting
    $position = isset($options['author_box_position']) ? $options['author_box_position'] : 'after_content';

    // Get display style
    $style = isset($options['author_box_style']) ? $options['author_box_style'] : 'regular';

    // If manual, don't auto-add
    if ($position === 'manual') {
        return $content;
    }

    // Generate author box or tooltip based on style
    if ($style === 'tooltip') {
        $author_display = pdm_render_author_tooltip_inline();
    } else {
        $author_display = pdm_render_author_box();
    }

    if (empty($author_display)) {
        return $content;
    }

    // Add based on position
    if ($position === 'before_content') {
        return $author_display . $content;
    } else {
        return $content . $author_display;
    }
}
add_filter('the_content', 'pdm_auto_add_author_box');

/**
 * Render author box HTML
 * 
 * @param int $author_id Author user ID (optional)
 * @return string HTML markup
 */
function pdm_render_author_box($author_id = null)
{
    if (!$author_id) {
        $author_id = get_the_author_meta('ID');
    }

    if (!$author_id) {
        return '';
    }

    // Get author data
    $author_name = get_the_author_meta('display_name', $author_id);
    $author_url = get_author_posts_url($author_id);

    // Get custom profile image or fallback to Gravatar
    $custom_image_id = get_user_meta($author_id, 'author_profile_image', true);
    if ($custom_image_id) {
        $author_avatar = wp_get_attachment_image($custom_image_id, 'thumbnail', false, array(
            'class' => 'avatar avatar-100 photo',
            'alt' => esc_attr($author_name),
        ));
    } else {
        $author_avatar = get_avatar($author_id, 100);
    }

    // Get E-E-A-T description (extended bio)
    $author_description = get_user_meta($author_id, 'author_description', true);

    // If no extended description, use standard bio
    if (empty($author_description)) {
        $author_description = get_user_meta($author_id, 'description', true);
    }

    // Get job title
    $job_title = get_user_meta($author_id, 'author_jobtitle', true);

    // Get social links
    $social_links = array();
    $social_fields = array(
        'author_linkedin' => array('label' => 'LinkedIn', 'icon' => 'linkedin'),
        'author_twitter' => array('label' => 'Twitter/X', 'icon' => 'twitter'),
        'author_facebook' => array('label' => 'Facebook', 'icon' => 'facebook'),
        'author_website' => array('label' => 'Website', 'icon' => 'link'),
    );

    foreach ($social_fields as $field => $data) {
        $url = get_user_meta($author_id, $field, true);
        if (!empty($url)) {
            $social_links[] = array(
                'url' => esc_url($url),
                'label' => $data['label'],
                'icon' => $data['icon'],
            );
        }
    }

    // Build HTML
    ob_start();
?>
    <div class="pdm-author-box">
        <div class="pdm-author-box-inner">
            <div class="pdm-author-header">
                <div class="pdm-author-avatar">
                    <a href="<?php echo esc_url($author_url); ?>">
                        <?php echo $author_avatar; ?>
                    </a>
                </div>
                <div class="pdm-author-info">
                    <h3 class="pdm-author-name">
                        <a href="<?php echo esc_url($author_url); ?>">
                            <?php echo esc_html($author_name); ?>
                        </a>
                    </h3>
                    <?php if (!empty($job_title)): ?>
                        <p class="pdm-author-title"><?php echo esc_html($job_title); ?></p>
                    <?php endif; ?>
                </div>
            </div>

            <?php if (!empty($author_description)): ?>
                <div class="pdm-author-bio">
                    <?php echo wp_kses_post(wpautop($author_description)); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($social_links)): ?>
                <div class="pdm-author-social">
                    <?php foreach ($social_links as $link): ?>
                        <a href="<?php echo esc_url($link['url']); ?>"
                            class="pdm-social-link pdm-social-<?php echo esc_attr($link['icon']); ?>"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="<?php echo esc_attr($link['label']); ?>">
                            <?php echo pdm_get_social_icon_svg($link['icon']); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <div class="pdm-author-link">
                <a href="<?php echo esc_url($author_url); ?>" class="pdm-view-all-posts">
                    View All Posts by <?php echo esc_html($author_name); ?> →
                </a>
            </div>
        </div>
    </div>
<?php
    return ob_get_clean();
}

/**
 * Author box shortcode (respects style setting)
 * 
 * Usage: [pdm_author_box] or [pdm_author_box author_id="5"]
 */
function pdm_author_box_shortcode($atts)
{
    // Don't display if Author E-E-A-T is not enabled
    if (!pdm_is_author_eeat_enabled()) {
        return '';
    }

    $atts = shortcode_atts(array(
        'author_id' => null,
    ), $atts);

    // Auto-detect author ID for FSE templates
    if (!empty($atts['author_id'])) {
        $author_id = intval($atts['author_id']);
    } elseif (is_author()) {
        $author_id = get_queried_object_id();
    } elseif (is_singular() && in_the_loop()) {
        $author_id = get_the_author_meta('ID');
    } elseif (is_singular()) {
        global $post;
        $author_id = $post ? $post->post_author : null;
    } else {
        $author_id = null;
    }

    // Get style setting
    $options = get_option('pdm_settings', array());
    $style = isset($options['author_box_style']) ? $options['author_box_style'] : 'regular';

    if ($style === 'tooltip') {
        return pdm_render_author_tooltip_inline($author_id);
    } else {
        return pdm_render_author_box($author_id);
    }
}
add_shortcode('pdm_author_box', 'pdm_author_box_shortcode');

/**
 * Author info shortcode for author archive pages
 * Same as author box but without profile links
 * 
 * Usage: [pdm_author_info] or [pdm_author_info author_id="5"]
 */
function pdm_author_info_shortcode($atts)
{
    // Don't display if Author E-E-A-T is not enabled
    if (!pdm_is_author_eeat_enabled()) {
        return '';
    }

    $atts = shortcode_atts(array(
        'author_id' => null,
    ), $atts);

    // Auto-detect author ID for FSE templates
    if (!empty($atts['author_id'])) {
        $author_id = intval($atts['author_id']);
    } elseif (is_author()) {
        $author_id = get_queried_object_id();
    } elseif (is_singular() && in_the_loop()) {
        $author_id = get_the_author_meta('ID');
    } elseif (is_singular()) {
        global $post;
        $author_id = $post ? $post->post_author : null;
    } else {
        $author_id = null;
    }

    if (!$author_id) {
        return '';
    }

    // Get author data
    $author_name = get_the_author_meta('display_name', $author_id);

    // Get custom profile image or fallback to Gravatar
    $custom_image_id = get_user_meta($author_id, 'author_profile_image', true);
    if ($custom_image_id) {
        $author_avatar = wp_get_attachment_image($custom_image_id, 'thumbnail', false, array(
            'class' => 'avatar avatar-100 photo',
            'alt' => esc_attr($author_name),
        ));
    } else {
        $author_avatar = get_avatar($author_id, 100);
    }

    // Get E-E-A-T description (extended bio)
    $author_description = get_user_meta($author_id, 'author_description', true);

    // If no extended description, use standard bio
    if (empty($author_description)) {
        $author_description = get_user_meta($author_id, 'description', true);
    }

    // Get job title
    $job_title = get_user_meta($author_id, 'author_jobtitle', true);

    // Get social links
    $social_links = array();
    $social_fields = array(
        'author_linkedin' => array('label' => 'LinkedIn', 'icon' => 'linkedin'),
        'author_twitter' => array('label' => 'Twitter/X', 'icon' => 'twitter'),
        'author_facebook' => array('label' => 'Facebook', 'icon' => 'facebook'),
        'author_website' => array('label' => 'Website', 'icon' => 'link'),
    );

    foreach ($social_fields as $field => $data) {
        $url = get_user_meta($author_id, $field, true);
        if (!empty($url)) {
            $social_links[] = array(
                'url' => esc_url($url),
                'label' => $data['label'],
                'icon' => $data['icon'],
            );
        }
    }

    // Build HTML (same as author box but without links)
    ob_start();
?>
    <div class="pdm-author-box">
        <div class="pdm-author-box-inner">
            <div class="pdm-author-header">
                <div class="pdm-author-avatar">
                    <?php echo $author_avatar; ?>
                </div>
                <div class="pdm-author-info">
                    <h3 class="pdm-author-name">
                        <?php echo esc_html($author_name); ?>
                    </h3>
                    <?php if (!empty($job_title)): ?>
                        <p class="pdm-author-title"><?php echo esc_html($job_title); ?></p>
                    <?php endif; ?>
                </div>
            </div>

            <?php if (!empty($author_description)): ?>
                <div class="pdm-author-bio">
                    <?php echo wp_kses_post(wpautop($author_description)); ?>
                </div>
            <?php endif; ?>

            <?php if (!empty($social_links)): ?>
                <div class="pdm-author-social">
                    <?php foreach ($social_links as $link): ?>
                        <a href="<?php echo esc_url($link['url']); ?>"
                            class="pdm-social-link pdm-social-<?php echo esc_attr($link['icon']); ?>"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="<?php echo esc_attr($link['label']); ?>">
                            <?php echo pdm_get_social_icon_svg($link['icon']); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
<?php
    return ob_get_clean();
}
add_shortcode('pdm_author_info', 'pdm_author_info_shortcode');

/**
 * Render inline tooltip for auto-insertion
 * 
 * @param int $author_id Author user ID (optional)
 * @return string HTML markup
 */
function pdm_render_author_tooltip_inline($author_id = null)
{
    if (!$author_id) {
        $author_id = get_the_author_meta('ID');
    }

    if (!$author_id) {
        return '';
    }

    // Get author data
    $author_name = get_the_author_meta('display_name', $author_id);
    $author_url = get_author_posts_url($author_id);

    // Get custom profile image or fallback to Gravatar
    $custom_image_id = get_user_meta($author_id, 'author_profile_image', true);
    if ($custom_image_id) {
        $author_avatar = wp_get_attachment_image($custom_image_id, 'thumbnail', false, array(
            'class' => 'avatar avatar-80 photo',
            'alt' => esc_attr($author_name),
        ));
    } else {
        $author_avatar = get_avatar($author_id, 80);
    }

    $author_description = get_user_meta($author_id, 'author_description', true);

    if (empty($author_description)) {
        $author_description = get_user_meta($author_id, 'description', true);
    }

    // Truncate description for tooltip
    $short_description = wp_trim_words(wp_strip_all_tags($author_description), 15, '...');

    ob_start();
?>
    <div class="pdm-author-tooltip-inline">
        <div class="pdm-author-tooltip-wrapper">
            <span class="pdm-author-trigger-text">Written by </span><a href="<?php echo esc_url($author_url); ?>" class="pdm-author-trigger"><?php echo esc_html($author_name); ?></a>
            <div class="pdm-author-tooltip">
                <div class="pdm-tooltip-avatar">
                    <?php echo $author_avatar; ?>
                </div>
                <div class="pdm-tooltip-content">
                    <h4><?php echo esc_html($author_name); ?></h4>
                    <?php if (!empty($short_description)): ?>
                        <p><?php echo esc_html($short_description); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
<?php
    return ob_get_clean();
}

/**
 * Template function to display author box
 * Use in template files: <?php pdm_the_author_box(); ?>
 * 
 * @param int $author_id Optional author ID
 */
function pdm_the_author_box($author_id = null)
{
    echo pdm_author_box_shortcode(array('author_id' => $author_id));
}

/**
 * Template function to display author info (no links)
 * Use in template files: <?php pdm_the_author_info(); ?>
 * 
 * @param int $author_id Optional author ID
 */
function pdm_the_author_info($author_id = null)
{
    echo pdm_author_info_shortcode(array('author_id' => $author_id));
}
