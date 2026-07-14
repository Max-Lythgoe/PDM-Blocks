<?php

/**
 * Snippet Name: Active Plugins First
 * Description: Reorders the plugins list to show active plugins first
 * Category: Features
 */

add_filter('views_plugins', function ($views) {
    global $wp_list_table;

    if (!is_network_admin() && isset($wp_list_table->items)) {
        $all_plugins = $wp_list_table->items;
        $active_plugins = get_option('active_plugins');

        $reordered_plugins = array();

        // Add active plugins first
        foreach ($all_plugins as $plugin_file => $plugin_data) {
            if (in_array($plugin_file, $active_plugins)) {
                $reordered_plugins[$plugin_file] = $plugin_data;
            }
        }

        // Add inactive plugins
        foreach ($all_plugins as $plugin_file => $plugin_data) {
            if (!in_array($plugin_file, $active_plugins)) {
                $reordered_plugins[$plugin_file] = $plugin_data;
            }
        }

        $wp_list_table->items = $reordered_plugins;
    }

    return $views;
});
