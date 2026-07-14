<?php

/**
 * Snippet Name: Force Font Display Swap
 * Description: Forces all fonts to use font-display: swap for better performance
 * Category: Performance
 */

if (!defined('ABSPATH')) exit;

// Force font-display: swap for all fonts
add_filter('print_inline_style', function ($html) {
    // Specifically target the font-display property within the CSS string
    if (strpos($html, '@font-face') !== false) {
        $html = str_replace('font-display: fallback', 'font-display: swap', $html);
        $html = str_replace('font-display: auto', 'font-display: swap', $html);
        $html = str_replace('font-display: block', 'font-display: swap', $html);
    }
    return $html;
}, 11);

// Secondary filter for global styles output
add_filter('wp_get_font_face_styles', function ($styles) {
    return str_replace('fallback', 'swap', $styles);
}, 30);
