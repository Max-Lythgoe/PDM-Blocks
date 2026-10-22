<?php

$is_editor = defined('REST_REQUEST') && REST_REQUEST;

$post_id = $block->context['postId'] ?? get_queried_object_id();
$post    = $post_id ? get_post($post_id) : null;

if (! $post || empty($post->post_content)) {
    if ($is_editor) {
        echo '<p style="padding:12px;opacity:0.5">' . esc_html__('Table of Contents — visible when viewing a post or page.', 'pdm-blocks') . '</p>';
    }
    return;
}

// Use the same helper as the `the_content` filter, so every link points at the
// id that is actually rendered (including duplicate-heading suffixes).
$anchors = pdm_blocks_get_heading_anchors($post->post_content);

if (empty($anchors)) {
    if ($is_editor) {
        echo '<p style="padding:12px;opacity:0.5">' . esc_html__('Table of Contents — no headings found in this post.', 'pdm-blocks') . '</p>';
    }
    return;
}

$list_style = $attributes['listStyle'] ?? 'numbers';
$list_tag   = $list_style === 'numbers' ? 'ol' : 'ul';

$output      = '';
$open_levels = array();

// Collect heading data for both HTML output and JSON-LD schema
$schema_items = [];
$position     = 1;
$page_url     = get_permalink($post_id);

foreach ($anchors as $anchor) {
    $heading_level = $anchor['level'];

    if (empty($open_levels)) {
        $open_levels[] = $heading_level;
        $output       .= '<' . $list_tag . ' class="toc-level-' . esc_attr($heading_level) . '">';
    } elseif ($heading_level > end($open_levels)) {
        // Deeper heading: the nested list belongs inside the open <li>.
        $open_levels[] = $heading_level;
        $output       .= '<' . $list_tag . ' class="toc-level-' . esc_attr($heading_level) . '">';
    } elseif ($heading_level < end($open_levels)) {
        // Shallower heading: close this item and every list above the new level.
        $output .= '</li>';

        while (count($open_levels) > 1 && $heading_level < end($open_levels)) {
            array_pop($open_levels);
            $output .= '</' . $list_tag . '></li>';
        }
    } else {
        $output .= '</li>';
    }

    $output .= '<li class="toc-level-' . esc_attr($heading_level) . '"><a href="#' . esc_attr($anchor['id']) . '">' . esc_html($anchor['text']) . '</a>';

    // Collect for SiteNavigationElement JSON-LD schema
    $schema_items[] = [
        '@type' => 'SiteNavigationElement',
        'name'  => $anchor['text'],
        'url'   => $page_url . '#' . $anchor['id'],
        'position' => $position++,
    ];
}

while (! empty($open_levels)) {
    array_pop($open_levels);
    $output .= '</li></' . $list_tag . '>';
}

// SiteNavigationElement JSON-LD schema — helps search engines understand
// the TOC as a structured navigation element, improving SEO rich results.
$toc_title = __('Table of Contents', 'pdm-blocks');

$schema_json = wp_json_encode([
    '@context' => 'https://schema.org',
    '@type'    => 'SiteNavigationElement',
    'name'     => $toc_title,
    'hasPart'  => $schema_items,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$toc_html  = '<script type="application/ld+json">' . $schema_json . '</script>';
$toc_html .= '<details class="toc-accordion" open>';
$toc_html .= '<summary>' . esc_html($toc_title) . ' <span class="toc-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="currentColor" d="M297.4 438.6C309.9 451.1 330.2 451.1 342.7 438.6L502.7 278.6C515.2 266.1 515.2 245.8 502.7 233.3C490.2 220.8 469.9 220.8 457.4 233.3L320 370.7L182.6 233.4C170.1 220.9 149.8 220.9 137.3 233.4C124.8 245.9 124.8 266.2 137.3 278.7L297.3 438.7z"/></svg></span></summary>';
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
