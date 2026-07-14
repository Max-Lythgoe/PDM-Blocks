<?php

/**
 * PHP Snippets Tab
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

if (!defined('ABSPATH')) {
    exit;
}

function pdm_hfs_render_snippets_tab()
{
    if (isset($_POST['pdm_hfs_snippet_action'])) {
        check_admin_referer('pdm_hfs_snippet_action', 'pdm_hfs_snippet_nonce');

        switch ($_POST['pdm_hfs_snippet_action']) {
            case 'toggle':
                if (isset($_POST['snippet_id'])) {
                    pdm_hfs_toggle_snippet(sanitize_text_field($_POST['snippet_id']));
                    echo '<div class="notice notice-success is-dismissible"><p>Snippet status updated!</p></div>';
                }
                break;

            case 'save':
                if (isset($_POST['snippet_name']) && isset($_POST['snippet_code'])) {
                    $snippet_id = isset($_POST['snippet_id']) ? sanitize_text_field($_POST['snippet_id']) : '';
                    $name = sanitize_text_field($_POST['snippet_name']);
                    $code = wp_unslash($_POST['snippet_code']);
                    $description = isset($_POST['snippet_description']) ? sanitize_text_field($_POST['snippet_description']) : '';
                    $category = isset($_POST['snippet_category']) ? sanitize_text_field($_POST['snippet_category']) : 'General';

                    pdm_hfs_save_snippet($snippet_id, $name, $code, $description, $category);
                    echo '<div class="notice notice-success is-dismissible"><p>Snippet saved successfully!</p></div>';
                }
                break;

            case 'delete':
                if (isset($_POST['snippet_id'])) {
                    if (pdm_hfs_delete_snippet(sanitize_text_field($_POST['snippet_id']))) {
                        echo '<div class="notice notice-success is-dismissible"><p>Snippet deleted successfully!</p></div>';
                    } else {
                        echo '<div class="notice notice-error is-dismissible"><p>Cannot delete default snippets!</p></div>';
                    }
                }
                break;

            case 'restore':
                if (isset($_POST['snippet_id'])) {
                    if (pdm_hfs_restore_default_snippet(sanitize_text_field($_POST['snippet_id']))) {
                        echo '<div class="notice notice-success is-dismissible"><p>Snippet restored to default!</p></div>';
                    }
                }
                break;
        }
    }

    $snippets = pdm_hfs_get_all_snippets();
    $active_snippets = pdm_hfs_get_active_snippets();

    $import_nonce = wp_create_nonce('pdm_hfs_import_snippets');
?>
    <div class="hfs-snippets-header">
        <div class="hfs-snippets-search">
            <input type="text" id="hfs-snippet-search" placeholder="Search snippets..." />
        </div>
        <div class="hfs-snippets-filter">
            <select id="hfs-snippet-filter">
                <option value="">All Categories</option>
                <option value="general">General</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="features">Features</option>
                <option value="admin">Admin</option>
                <option value="frontend">Frontend</option>
            </select>
        </div>
        <div class="hfs-snippets-actions">
            <button type="button" class="button" id="hfs-export-snippets">
                <span class="dashicons dashicons-download"></span> Export
            </button>
            <button type="button" class="button" id="hfs-import-snippets">
                <span class="dashicons dashicons-upload"></span> Import
            </button>
            <button type="button" class="button button-primary" id="hfs-add-snippet">
                <span class="dashicons dashicons-plus-alt"></span> Add New Snippet
            </button>
        </div>
    </div>

    <div class="hfs-snippets-list">
        <?php if (empty($snippets)) : ?>
            <p>No snippets found. Click "Add New Snippet" to create your first custom snippet.</p>
        <?php else : ?>
            <?php foreach ($snippets as $snippet) : ?>
                <?php
                $is_active = in_array($snippet['id'], $active_snippets);
                $is_default = $snippet['type'] === 'default';
                $is_modified = isset($snippet['modified']) && $snippet['modified'];
                ?>
                <div class="hfs-snippet-item" data-snippet-id="<?php echo esc_attr($snippet['id']); ?>" data-snippet-name="<?php echo esc_attr(strtolower($snippet['name'])); ?>" data-snippet-category="<?php echo esc_attr(strtolower($snippet['category'])); ?>">
                    <div class="hfs-snippet-header">
                        <div class="hfs-snippet-info">
                            <h3><?php echo esc_html($snippet['name']); ?>
                                <?php if ($is_default) : ?>
                                    <span class="hfs-badge hfs-badge-default">Default</span>
                                <?php endif; ?>
                                <?php if ($is_modified) : ?>
                                    <span class="hfs-badge hfs-badge-modified">Modified</span>
                                <?php endif; ?>
                                <span class="hfs-badge hfs-badge-category"><?php echo esc_html($snippet['category']); ?></span>
                            </h3>
                            <?php if (!empty($snippet['description'])) : ?>
                                <p class="hfs-snippet-description"><?php echo esc_html($snippet['description']); ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="hfs-snippet-actions">
                            <div class="hfs-snippet-buttons">
                                <button type="button" class="button hfs-edit-snippet" data-snippet='<?php echo esc_attr(json_encode($snippet)); ?>' data-is-default="<?php echo $is_default ? '1' : '0'; ?>">
                                    <span class="dashicons dashicons-edit"></span>
                                </button>
                                <?php if (!$is_default) : ?>
                                    <form method="post" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this snippet?');">
                                        <?php wp_nonce_field('pdm_hfs_snippet_action', 'pdm_hfs_snippet_nonce'); ?>
                                        <input type="hidden" name="pdm_hfs_snippet_action" value="delete" />
                                        <input type="hidden" name="snippet_id" value="<?php echo esc_attr($snippet['id']); ?>" />
                                        <button type="submit" class="button hfs-delete-snippet button-danger">
                                            <span class="dashicons dashicons-trash"></span>
                                        </button>
                                    </form>
                                <?php elseif ($is_modified) : ?>
                                    <form method="post" style="display: inline;" onsubmit="return confirm('Are you sure you want to restore this snippet to its default state?');">
                                        <?php wp_nonce_field('pdm_hfs_snippet_action', 'pdm_hfs_snippet_nonce'); ?>
                                        <input type="hidden" name="pdm_hfs_snippet_action" value="restore" />
                                        <input type="hidden" name="snippet_id" value="<?php echo esc_attr($snippet['id']); ?>" />
                                        <button type="submit" class="button" title="Restore to default">
                                            <span class="dashicons dashicons-image-rotate"></span>
                                        </button>
                                    </form>
                                <?php endif; ?>
                                <form method="post" style="display: inline;">
                                    <?php wp_nonce_field('pdm_hfs_snippet_action', 'pdm_hfs_snippet_nonce'); ?>
                                    <input type="hidden" name="pdm_hfs_snippet_action" value="toggle" />
                                    <input type="hidden" name="snippet_id" value="<?php echo esc_attr($snippet['id']); ?>" />
                                    <label class="hfs-toggle">
                                        <input type="checkbox" <?php checked($is_active); ?> onchange="this.form.submit()" />
                                        <span class="hfs-toggle-slider"></span>
                                    </label>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <div id="pdm-hfs-snippet-modal" class="hfs-modal" style="display: none;">
        <div class="hfs-modal-content">
            <div class="hfs-modal-header">
                <h2 id="pdm-hfs-modal-title">Add New Snippet</h2>
                <button type="button" class="hfs-modal-close">&times;</button>
            </div>
            <form method="post" id="pdm-hfs-snippet-form">
                <?php wp_nonce_field('pdm_hfs_snippet_action', 'pdm_hfs_snippet_nonce'); ?>
                <input type="hidden" name="pdm_hfs_snippet_action" value="save" />
                <input type="hidden" name="snippet_id" id="snippet_id" value="" />

                <div class="hfs-form-row">
                    <label for="snippet_name">Snippet Name *</label>
                    <input type="text" name="snippet_name" id="snippet_name" required />
                </div>

                <div class="hfs-form-row">
                    <label for="snippet_description">Description</label>
                    <textarea name="snippet_description" id="snippet_description" rows="3"></textarea>
                </div>

                <div class="hfs-form-row">
                    <label for="snippet_category">Category</label>
                    <select name="snippet_category" id="snippet_category">
                        <option value="General">General</option>
                        <option value="Performance">Performance</option>
                        <option value="Security">Security</option>
                        <option value="Features">Features</option>
                        <option value="Admin">Admin</option>
                        <option value="Frontend">Frontend</option>
                    </select>
                </div>

                <div class="hfs-form-row">
                    <label for="snippet_code">PHP Code *</label>
                    <textarea name="snippet_code" id="snippet_code" rows="15"></textarea>
                    <p class="description">Enter your PHP code. Do not include opening <code>&lt;?php</code> tag.</p>
                </div>

                <div class="hfs-form-row" id="pdm-hfs-default-notice" style="display: none;">
                    <div class="notice notice-warning inline">
                        <p>You are editing a default snippet. Changes will be stored as a custom override.</p>
                    </div>
                </div>

                <?php submit_button('Save Snippet', 'primary', 'pdm_hfs_save_snippet_btn'); ?>
            </form>
        </div>
    </div>
<?php
}
