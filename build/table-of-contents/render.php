<?php

$is_editor = defined('REST_REQUEST') && REST_REQUEST;

$post_id = $block->context['postId'] ?? get_queried_object_id();
$post    = $post_id ? get_post($post_id) : null;

if (! $post || empty($post->post_content)) {
    if ($is_editor) {
        echo '<p style="padding:12px;opacity:0.5">Table of Contents — visible when viewing a post or page.</p>';
    }
    return;
}

// Parse headings directly from raw block content — avoids recursive rendering
preg_match_all('/<h([2-5])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h\1>/is', $post->post_content, $matches, PREG_SET_ORDER);

if (empty($matches)) {
    if ($is_editor) {
        echo '<p style="padding:12px;opacity:0.5">Table of Contents — no headings found in this post.</p>';
    }
    return;
}

$list_style = $attributes['listStyle'] ?? 'numbers';
$list_tag   = $list_style === 'numbers' ? 'ol' : 'ul';

$output        = '';
$current_level = 0;

foreach ($matches as $match) {
    $heading_level = (int) $match[1];
    $heading_id    = ! empty($match[2]) ? $match[2] : sanitize_title(wp_strip_all_tags($match[3]));
    $heading_text  = wp_strip_all_tags($match[3]);

    if ($heading_level > $current_level) {
        $output .= '<' . $list_tag . ' class="toc-level-' . esc_attr($heading_level) . '">';
    } elseif ($heading_level < $current_level) {
        $output .= str_repeat('</li></' . $list_tag . '>', $current_level - $heading_level);
    } else {
        $output .= '</li>';
    }

    $output       .= '<li class="toc-level-' . esc_attr($heading_level) . '"><a href="#' . esc_attr($heading_id) . '">' . esc_html($heading_text) . '</a>';
    $current_level = $heading_level;
}

if ($current_level > 0) $output .= str_repeat('</li></' . $list_tag . '>', $current_level);

$toc_html  = '<details class="toc-accordion" open>';
$toc_html .= '<summary>Table of Contents <span class="toc-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="currentColor" d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"/></svg></span></summary>';
$toc_html .= '<div class="table-of-contents-inner">' . $output . '</div></details>';

$extra_class = ! empty($attributes['listStyle']) ? 'toc-list-style-' . esc_attr($attributes['listStyle']) : '';

// In the editor, ServerSideRender is already wrapped by useBlockProps() in edit.js.
// Skip the wrapper here to avoid double-applying block support styles.
if (defined('REST_REQUEST') && REST_REQUEST) {
    echo $toc_html;
} else {
?>
    <div <?php echo get_block_wrapper_attributes(['class' => $extra_class]); ?>>
        <?php echo $toc_html; ?>
    </div>
<?php
}
