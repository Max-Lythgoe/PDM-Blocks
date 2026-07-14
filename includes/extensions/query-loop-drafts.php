<?php

/**
 * Query Loop Drafts Extension
 * Adds ability to show draft posts in the Query Loop block.
 *
 * When the PDM Accelerate theme is also active, this plugin version takes priority.
 *
 * @package PDM_Blocks
 */

defined('ABSPATH') || exit;

/**
 * Unhook the theme's version (if active) so plugin takes priority.
 */
add_action('init', function () {
    if (function_exists('accelerate_query_loop_drafts_enqueue_editor_assets')) {
        remove_action('enqueue_block_editor_assets', 'accelerate_query_loop_drafts_enqueue_editor_assets');
    }
    if (function_exists('accelerate_query_loop_inject_post_status')) {
        remove_filter('render_block_data', 'accelerate_query_loop_inject_post_status', 10);
    }
    if (function_exists('accelerate_query_loop_show_drafts_filter')) {
        remove_filter('query_loop_block_query_vars', 'accelerate_query_loop_show_drafts_filter', 10);
    }
    if (function_exists('accelerate_remove_draft_post_links')) {
        remove_filter('render_block', 'accelerate_remove_draft_post_links', 10);
    }
}, 1);

/**
 * Enqueue the block editor script.
 */
function pdm_blocks_query_loop_drafts_enqueue_editor_assets()
{
    // Deregister theme's version (if already registered)
    wp_deregister_script('accelerate-query-loop-drafts');

    $asset_file = plugin_dir_path(__FILE__) . '../../build/query-loop-drafts.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'accelerate-query-loop-drafts',
        plugin_dir_url(__FILE__) . '../../build/query-loop-drafts.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
}
add_action('enqueue_block_editor_assets', 'pdm_blocks_query_loop_drafts_enqueue_editor_assets', 20);

/**
 * Global variable to track which queries should show drafts.
 */
global $pdm_blocks_show_drafts_queries;
$pdm_blocks_show_drafts_queries = array();

/**
 * Store which queries should show drafts based on block attributes.
 */
function pdm_blocks_query_loop_inject_post_status($parsed_block, $source_block, $parent_block)
{
    global $pdm_blocks_show_drafts_queries;

    if ($parsed_block['blockName'] !== 'core/query') {
        return $parsed_block;
    }

    $show_drafts = $parsed_block['attrs']['showDrafts'] ?? false;

    if ($show_drafts) {
        $query_id = $parsed_block['attrs']['queryId'] ?? 0;
        $pdm_blocks_show_drafts_queries[$query_id] = true;

        if (!isset($parsed_block['attrs']['query'])) {
            $parsed_block['attrs']['query'] = array();
        }

        // Disable inherit mode so custom query is used
        $parsed_block['attrs']['query']['inherit'] = false;
    }

    return $parsed_block;
}
add_filter('render_block_data', 'pdm_blocks_query_loop_inject_post_status', 10, 3);

/**
 * Modify query to include draft posts when toggle is enabled.
 */
function pdm_blocks_query_loop_show_drafts_filter($query, $block)
{
    global $pdm_blocks_show_drafts_queries;

    $query_id = $block->context['queryId'] ?? 0;

    if (isset($pdm_blocks_show_drafts_queries[$query_id]) && $pdm_blocks_show_drafts_queries[$query_id]) {
        $query['post_status'] = array('publish', 'draft');
    }

    return $query;
}
add_filter('query_loop_block_query_vars', 'pdm_blocks_query_loop_show_drafts_filter', 10, 2);

/**
 * Remove links from draft posts.
 */
function pdm_blocks_remove_draft_post_links($block_content, $block)
{
    global $post;

    if (!$post || $post->post_status !== 'draft') {
        return $block_content;
    }

    // Handle excerpt block - remove "Read More" paragraph
    if ($block['blockName'] === 'core/post-excerpt') {
        $block_content = preg_replace('/<p class="wp-block-post-excerpt__more-text">.*?<\/p>/is', '', $block_content);
        return $block_content;
    }

    // Handle other blocks with links
    $link_blocks = array('core/post-title', 'core/post-featured-image', 'core/read-more');

    if (in_array($block['blockName'], $link_blocks)) {
        $block_content = preg_replace('/<a[^>]*>(.*?)<\/a>/is', '$1', $block_content);
    }

    return $block_content;
}
add_filter('render_block', 'pdm_blocks_remove_draft_post_links', 10, 2);
