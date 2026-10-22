<?php

/**
 * Schema Engine Manager - PDM Blocks Plugin version
 *
 * Handles schema generation for the site.
 *
 * @package PDM_Blocks
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class PDM_Schema_Manager
{

    private $schema_handlers = array();

    public function __construct()
    {
        add_action('init', array($this, 'load_schema_handlers'));
        add_action('wp_head', array($this, 'output_homepage_schemas'));
        add_action('wp_head', array($this, 'output_site_wide_schemas'));
    }

    /**
     * Load all schema handlers from the plugin's handlers directory.
     * Handler files are already require_once'd by the loader; this method
     * instantiates the classes that don't self-instantiate at file scope.
     */
    public function load_schema_handlers()
    {
        $handlers_dir = plugin_dir_path(__FILE__) . 'handlers/';

        if (!is_dir($handlers_dir)) {
            return;
        }

        $schema_files = glob($handlers_dir . 'class-*.php');

        foreach ($schema_files as $file) {
            // Files are already loaded; require_once is a safe no-op here.
            require_once $file;

            // Derive class name from filename:
            //   class-author-schema  → PDM_Author_Schema
            //   class-faq-schema     → PDM_Faq_Schema (won't match PDM_FAQ_Schema → skipped,
            //                          FAQ handler self-instantiates at file scope)
            $filename   = basename($file, '.php');
            $class_name = str_replace('class-', '', $filename);
            $class_name = str_replace('-', '_', $class_name);
            $class_name = 'PDM_' . ucwords($class_name, '_');

            if (class_exists($class_name)) {
                $this->schema_handlers[] = new $class_name();
            }
        }
    }

    /**
     * Output homepage-specific schemas.
     */
    public function output_homepage_schemas()
    {
        if (!is_front_page()) {
            return;
        }

        foreach ($this->schema_handlers as $handler) {
            if (method_exists($handler, 'output_homepage_schema')) {
                $handler->output_homepage_schema();
            }
        }
    }

    /**
     * Output site-wide schemas.
     */
    public function output_site_wide_schemas()
    {
        foreach ($this->schema_handlers as $handler) {
            if (method_exists($handler, 'output_sitewide_schema')) {
                $handler->output_sitewide_schema();
            }
        }
    }

    /**
     * Static helper to clean up malformed RankMath schema meta entries.
     *
     * Rows are read in batches so a large postmeta table can't exhaust the
     * request's time or memory limit. Only malformed rows are written back.
     *
     * @param int $batch_size Number of meta rows to read per query.
     * @return int Number of repaired meta rows.
     */
    public static function cleanup_malformed_schemas($batch_size = 200)
    {
        global $wpdb;

        $batch_size  = max(1, (int) $batch_size);
        $offset      = 0;
        $fixed_count = 0;

        do {
            $schema_metas = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT post_id, meta_key, meta_value
                     FROM {$wpdb->postmeta}
                     WHERE meta_key LIKE %s
                     ORDER BY meta_id ASC
                     LIMIT %d OFFSET %d",
                    $wpdb->esc_like('rank_math_schema_') . '%',
                    $batch_size,
                    $offset
                )
            );

            $found = is_array($schema_metas) ? count($schema_metas) : 0;

            foreach ($schema_metas as $meta) {
                $schema_data = maybe_unserialize($meta->meta_value);

                if (!is_array($schema_data)) {
                    continue;
                }

                if (!isset($schema_data['metadata']) || !is_array($schema_data['metadata'])) {
                    $schema_data['metadata'] = array(
                        'title'     => (isset($schema_data['@type']) ? $schema_data['@type'] : 'Unknown') . ' Schema',
                        'type'      => 'template',
                        'isPrimary' => false,
                        'shortcode' => uniqid('s-'),
                    );
                } elseif (!isset($schema_data['metadata']['isPrimary'])) {
                    $schema_data['metadata']['isPrimary'] = false;

                    if (!isset($schema_data['metadata']['type'])) {
                        $schema_data['metadata']['type'] = 'template';
                    }
                    if (!isset($schema_data['metadata']['shortcode'])) {
                        $schema_data['metadata']['shortcode'] = uniqid('s-');
                    }
                } else {
                    continue;
                }

                update_post_meta($meta->post_id, $meta->meta_key, $schema_data);
                $fixed_count++;
            }

            $offset += $batch_size;
        } while ($found === $batch_size);

        return $fixed_count;
    }
}
