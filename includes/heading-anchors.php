<?php

/**
 * Heading anchor helpers.
 *
 * Shared by the `the_content` filter (which adds missing ids to headings) and
 * the Table of Contents block (which links to those ids), so both always agree
 * on the generated anchor and on the suffixes used for duplicate headings.
 *
 * @package PDM_Blocks
 */

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Find h2-h5 elements and read their id attribute and text content.
 *
 * Attributes are parsed separately from the tag so an existing `id` is never
 * swallowed by the surrounding attribute match.
 *
 * @param string $content Raw block markup or rendered HTML.
 * @return array<int, array{level: int, id: string, text: string, has_id: bool}>
 */
function pdm_blocks_match_headings($content)
{
    if (! is_string($content) || '' === $content || false === stripos($content, '<h')) {
        return array();
    }

    if (! preg_match_all('/<h([2-5])((?:\s[^>]*)?)>(.*?)<\/h\1>/is', $content, $matches, PREG_SET_ORDER)) {
        return array();
    }

    $headings = array();

    foreach ($matches as $match) {
        $attributes = $match[2];
        $has_id     = (bool) preg_match('/(?:^|\s)id\s*=\s*(["\'])(.*?)\1/is', $attributes, $id_match);
        $text       = trim(wp_strip_all_tags($match[3]));

        $headings[] = array(
            'level'  => (int) $match[1],
            'id'     => $has_id ? $id_match[2] : sanitize_title($text),
            'text'   => $text,
            'has_id' => $has_id,
        );
    }

    return $headings;
}

/**
 * Build the list of heading anchors (with duplicates made unique) for content.
 *
 * @param string $content Raw block markup or rendered HTML.
 * @return array<int, array{level: int, id: string, text: string, has_id: bool}>
 */
function pdm_blocks_get_heading_anchors($content)
{
    $headings = pdm_blocks_match_headings($content);

    if (empty($headings)) {
        return array();
    }

    $used = array();

    // Reserve explicit anchors first so a generated id never shadows an author's.
    foreach ($headings as $heading) {
        if ($heading['has_id']) {
            $used[$heading['id']] = true;
        }
    }

    $anchors = array();

    foreach ($headings as $heading) {
        $id = $heading['id'];

        if ('' === $id) {
            continue;
        }

        if (! $heading['has_id']) {
            $base   = $id;
            $suffix = 2;

            while (isset($used[$id])) {
                $id = $base . '-' . $suffix;
                $suffix++;
            }
        }

        $used[$id] = true;

        $anchors[] = array(
            'level'  => $heading['level'],
            'id'     => $id,
            'text'   => $heading['text'],
            'has_id' => $heading['has_id'],
        );
    }

    return $anchors;
}

/**
 * Add a unique id to every heading that doesn't already have one.
 *
 * Duplicate headings get a numeric suffix, and headings that already have an
 * id keep it verbatim.
 *
 * @param string $content Rendered post content.
 * @return string
 */
function pdm_blocks_add_heading_ids($content)
{
    $headings = pdm_blocks_match_headings($content);

    if (empty($headings)) {
        return $content;
    }

    $used = array();

    foreach ($headings as $heading) {
        if ($heading['has_id']) {
            $used[$heading['id']] = true;
        }
    }

    $index  = 0;
    $result = preg_replace_callback(
        '/<h([2-5])((?:\s[^>]*)?)>(.*?)<\/h\1>/is',
        static function ($match) use (&$index, &$used, $headings) {
            $heading = $headings[ $index++ ];

            if ($heading['has_id'] || '' === $heading['id']) {
                return $match[0];
            }

            $base   = $heading['id'];
            $id     = $base;
            $suffix = 2;

            while (isset($used[$id])) {
                $id = $base . '-' . $suffix;
                $suffix++;
            }

            $used[ $id ] = true;

            return '<h' . $match[1] . $match[2] . ' id="' . esc_attr($id) . '">' . $match[3] . '</h' . $match[1] . '>';
        },
        $content
    );

    return is_string($result) ? $result : $content;
}
