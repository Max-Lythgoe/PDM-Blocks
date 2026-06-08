<?php

/**
 * Admin Fields Display for User Profile
 * 
 * Renders the custom E-E-A-T fields on user profile edit screens.
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue media scripts for user profile page
 */
function pdm_author_eeat_enqueue_media_scripts($hook)
{
    // Only load on user profile/edit pages
    if ($hook !== 'profile.php' && $hook !== 'user-edit.php') {
        return;
    }

    // Enqueue WordPress media library
    wp_enqueue_media();
}
add_action('admin_enqueue_scripts', 'pdm_author_eeat_enqueue_media_scripts');

/**
 * Display Author E-E-A-T fields on user profile page
 */
function pdm_display_author_eeat_fields($user)
{
    // Check if user can edit
    if (!current_user_can('edit_user', $user->ID)) {
        return;
    }

    $fields = pdm_get_author_eeat_fields();
?>

    <h2>Author E-E-A-T Information</h2>
    <p class="description">
        Enhance your author profile with E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) information.
        This data improves SEO and helps establish author credibility.
    </p>

    <table class="form-table" role="presentation">
        <?php foreach ($fields as $field_key => $field_data):
            $value = get_user_meta($user->ID, $field_key, true);
        ?>
            <tr>
                <th>
                    <label for="<?php echo esc_attr($field_key); ?>">
                        <?php echo esc_html($field_data['label']); ?>
                    </label>
                </th>
                <td>
                    <?php if ($field_data['type'] === 'image'): ?>
                        <?php
                        $image_id = $value;
                        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : '';
                        ?>
                        <div class="pdm-image-upload-wrapper">
                            <div class="pdm-image-preview" style="margin-bottom: 10px;">
                                <?php if ($image_url): ?>
                                    <img src="<?php echo esc_url($image_url); ?>" style="width: 150px; height: 150px; display: block; border-radius: 50%; border: 2px solid #ddd; object-fit: cover;" />
                                <?php else: ?>
                                    <img src="" style="width: 150px; height: 150px; display: none; border-radius: 50%; border: 2px solid #ddd; object-fit: cover;" />
                                <?php endif; ?>
                            </div>
                            <input
                                type="hidden"
                                name="<?php echo esc_attr($field_key); ?>"
                                id="<?php echo esc_attr($field_key); ?>"
                                value="<?php echo esc_attr($image_id); ?>" />
                            <button type="button" class="button pdm-upload-image-button" data-field="<?php echo esc_attr($field_key); ?>">
                                <?php echo $image_url ? 'Change Image' : 'Upload Image'; ?>
                            </button>
                            <?php if ($image_url): ?>
                                <button type="button" class="button pdm-remove-image-button" data-field="<?php echo esc_attr($field_key); ?>" style="margin-left: 5px;">
                                    Remove Image
                                </button>
                            <?php endif; ?>
                        </div>
                    <?php elseif ($field_data['type'] === 'wysiwyg'): ?>
                        <?php
                        wp_editor(
                            $value,
                            $field_key,
                            array(
                                'textarea_name' => $field_key,
                                'textarea_rows' => 10,
                                'media_buttons' => false,
                                'teeny' => true,
                            )
                        );
                        ?>
                    <?php elseif ($field_data['type'] === 'url'): ?>
                        <input
                            type="url"
                            name="<?php echo esc_attr($field_key); ?>"
                            id="<?php echo esc_attr($field_key); ?>"
                            value="<?php echo esc_attr($value); ?>"
                            class="regular-text"
                            placeholder="https://" />
                    <?php else: ?>
                        <input
                            type="text"
                            name="<?php echo esc_attr($field_key); ?>"
                            id="<?php echo esc_attr($field_key); ?>"
                            value="<?php echo esc_attr($value); ?>"
                            class="regular-text" />
                    <?php endif; ?>

                    <?php if (!empty($field_data['description'])): ?>
                        <p class="description"><?php echo esc_html($field_data['description']); ?></p>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </table>

    <style>
        .form-table th[scope="row"] {
            width: 200px;
        }

        .pdm-image-preview img {
            object-fit: cover;
        }
    </style>

    <script>
        jQuery(document).ready(function($) {
            // Media Uploader for Profile Image
            var mediaUploader;

            $('.pdm-upload-image-button').on('click', function(e) {
                e.preventDefault();

                var button = $(this);
                var fieldId = button.data('field');
                var inputField = $('#' + fieldId);
                var previewImg = button.closest('.pdm-image-upload-wrapper').find('.pdm-image-preview img');
                var removeButton = button.siblings('.pdm-remove-image-button');

                // If the media uploader already exists, reopen it
                if (mediaUploader) {
                    mediaUploader.open();
                    return;
                }

                // Create the media uploader
                mediaUploader = wp.media({
                    title: 'Choose Profile Image',
                    button: {
                        text: 'Use this image'
                    },
                    multiple: false,
                    library: {
                        type: 'image'
                    }
                });

                // When an image is selected
                mediaUploader.on('select', function() {
                    var attachment = mediaUploader.state().get('selection').first().toJSON();
                    inputField.val(attachment.id);
                    previewImg.attr('src', attachment.url).show();
                    button.text('Change Image');

                    // Show remove button if it doesn't exist
                    if (removeButton.length === 0) {
                        button.after('<button type="button" class="button pdm-remove-image-button" data-field="' + fieldId + '" style="margin-left: 5px;">Remove Image</button>');
                    } else {
                        removeButton.show();
                    }
                });

                mediaUploader.open();
            });

            // Remove image
            $(document).on('click', '.pdm-remove-image-button', function(e) {
                e.preventDefault();

                var button = $(this);
                var fieldId = button.data('field');
                var inputField = $('#' + fieldId);
                var previewImg = button.closest('.pdm-image-upload-wrapper').find('.pdm-image-preview img');
                var uploadButton = button.siblings('.pdm-upload-image-button');

                inputField.val('');
                previewImg.hide().attr('src', '');
                uploadButton.text('Upload Image');
                button.hide();
            });
        });
    </script>

<?php
}
add_action('show_user_profile', 'pdm_display_author_eeat_fields');
add_action('edit_user_profile', 'pdm_display_author_eeat_fields');
