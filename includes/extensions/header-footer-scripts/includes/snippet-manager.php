<?php

/**
 * PHP Snippet Manager
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

function pdm_hfs_get_all_snippets()
{
    $snippets = array();
    $custom_snippets = get_option('hfs_custom_snippets', array());

    $default_dir = PDM_HFS_PATH . 'snippets/defaults/';
    if (is_dir($default_dir)) {
        $files = glob($default_dir . '*.php');
        foreach ($files as $file) {
            $snippet_data = pdm_hfs_parse_snippet_file($file);
            if ($snippet_data) {
                $snippet_data['file'] = basename($file);
                $snippet_id = 'default_' . sanitize_title($snippet_data['name']);

                if (isset($custom_snippets[$snippet_id])) {
                    $snippet_data['name'] = $custom_snippets[$snippet_id]['name'];
                    $snippet_data['description'] = $custom_snippets[$snippet_id]['description'];
                    $snippet_data['category'] = $custom_snippets[$snippet_id]['category'];
                    $snippet_data['code'] = $custom_snippets[$snippet_id]['code'];
                    $snippet_data['modified'] = true;
                }

                $snippet_data['id'] = $snippet_id;
                $snippet_data['type'] = 'default';
                $snippets[] = $snippet_data;
            }
        }
    }

    foreach ($custom_snippets as $id => $snippet) {
        if (strpos($id, 'default_') === 0) {
            continue;
        }
        $snippet['id'] = $id;
        $snippet['type'] = 'custom';
        $snippets[] = $snippet;
    }

    return $snippets;
}

function pdm_hfs_parse_snippet_file($file)
{
    $content = file_get_contents($file);

    preg_match('/\*\s*Snippet Name:\s*(.+)$/m', $content, $name_match);
    $name = isset($name_match[1]) ? trim($name_match[1]) : basename($file, '.php');

    preg_match('/\*\s*Description:\s*(.+)$/m', $content, $desc_match);
    $description = isset($desc_match[1]) ? trim($desc_match[1]) : '';

    preg_match('/\*\s*Category:\s*(.+)$/m', $content, $cat_match);
    $category = isset($cat_match[1]) ? trim($cat_match[1]) : 'General';

    preg_match('/\*\/\s*(.+)$/s', $content, $code_match);
    $code = isset($code_match[1]) ? trim($code_match[1]) : '';

    return array(
        'name' => $name,
        'description' => $description,
        'category' => $category,
        'code' => $code,
        'file' => basename($file)
    );
}

function pdm_hfs_get_active_snippets()
{
    $active_snippets = get_option('hfs_active_snippets', null);

    if ($active_snippets === null) {
        $active_snippets = array();

        $default_dir = PDM_HFS_PATH . 'snippets/defaults/';
        if (is_dir($default_dir)) {
            $files = glob($default_dir . '*.php');
            foreach ($files as $file) {
                $snippet_data = pdm_hfs_parse_snippet_file($file);
                if ($snippet_data) {
                    $snippet_id = 'default_' . sanitize_title($snippet_data['name']);
                    $active_snippets[] = $snippet_id;
                }
            }
        }

        update_option('hfs_active_snippets', $active_snippets);
    }

    return $active_snippets;
}

function pdm_hfs_is_snippet_active($snippet_id)
{
    $active_snippets = pdm_hfs_get_active_snippets();
    return in_array($snippet_id, $active_snippets);
}

function pdm_hfs_toggle_snippet($snippet_id)
{
    $active_snippets = pdm_hfs_get_active_snippets();

    if (in_array($snippet_id, $active_snippets)) {
        $active_snippets = array_diff($active_snippets, array($snippet_id));
    } else {
        $active_snippets[] = $snippet_id;
    }

    update_option('hfs_active_snippets', array_values($active_snippets));
}

function pdm_hfs_save_snippet($snippet_id, $name, $code, $description = '', $category = 'General')
{
    $custom_snippets = get_option('hfs_custom_snippets', array());

    if (empty($snippet_id)) {
        $snippet_id = 'custom_' . uniqid();
    }

    $custom_snippets[$snippet_id] = array(
        'name' => sanitize_text_field($name),
        'description' => sanitize_text_field($description),
        'category' => sanitize_text_field($category),
        'code' => $code
    );

    update_option('hfs_custom_snippets', $custom_snippets);
    return $snippet_id;
}

function pdm_hfs_delete_snippet($snippet_id)
{
    if (strpos($snippet_id, 'custom_') !== 0) {
        return false;
    }

    $custom_snippets = get_option('hfs_custom_snippets', array());

    if (isset($custom_snippets[$snippet_id])) {
        unset($custom_snippets[$snippet_id]);
        update_option('hfs_custom_snippets', $custom_snippets);

        $active_snippets = pdm_hfs_get_active_snippets();
        $active_snippets = array_diff($active_snippets, array($snippet_id));
        update_option('hfs_active_snippets', array_values($active_snippets));

        return true;
    }

    return false;
}

function pdm_hfs_restore_default_snippet($snippet_id)
{
    $custom_snippets = get_option('hfs_custom_snippets', array());

    if (isset($custom_snippets[$snippet_id])) {
        unset($custom_snippets[$snippet_id]);
        update_option('hfs_custom_snippets', $custom_snippets);
        return true;
    }

    return false;
}

function pdm_hfs_execute_active_snippets()
{
    // If the theme already defines this function, its snippet executor is active too.
    // Skip execution here to prevent "cannot redeclare function" fatal errors.
    if (function_exists('hfs_execute_active_snippets')) {
        return;
    }

    $active_snippets = pdm_hfs_get_active_snippets();
    $all_snippets = pdm_hfs_get_all_snippets();

    foreach ($all_snippets as $snippet) {
        if (in_array($snippet['id'], $active_snippets) && !empty($snippet['code'])) {
            // Execute the PHP code
            eval($snippet['code']);
        }
    }
}
