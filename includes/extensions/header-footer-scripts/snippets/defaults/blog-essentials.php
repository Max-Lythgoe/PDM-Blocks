<?php

/**
 * Snippet Name: Blog Essentials
 * Description: Require featured image and excerpt for blog posts
 * Category: Features
 */


/**
 * Native Gutenberg SEO Guardrail
 * Uses the official Dispatcher to show a standard editor notice.
 */
add_action('admin_footer-post.php', 'wp_pro_native_notice_seo_guardrail');
add_action('admin_footer-post-new.php', 'wp_pro_native_notice_seo_guardrail');

function wp_pro_native_notice_seo_guardrail()
{
    $screen = get_current_screen();
    if ($screen->post_type !== 'post') return;
?>
    <script type="text/javascript">
        (function() {
            const {
                subscribe,
                select,
                dispatch
            } = wp.data;
            let timeoutId = null;
            const LOCK_ID = 'seo-guardrail-lock';
            const NOTICE_ID = 'seo-guardrail-notice';

            const runValidation = () => {
                const editor = select('core/editor');
                if (!editor) return;

                const hasImage = !!editor.getEditedPostAttribute('featured_media');
                const excerpt = (editor.getEditedPostAttribute('excerpt') || '').trim();
                const hasExcerpt = excerpt.length > 0;

                const isLocked = select('core/editor').isPostSavingLocked(LOCK_ID);
                const needsLock = (!hasImage || !hasExcerpt);

                if (needsLock) {
                    // Lock the editor
                    if (!isLocked) dispatch('core/editor').lockPostSaving(LOCK_ID);

                    // Determine the specific message
                    let missing = [];
                    if (!hasImage) missing.push("Featured Image");
                    if (!hasExcerpt) missing.push("Excerpt");
                    const message = `SEO Requirements: Please add a ${missing.join(' and ')} to enable publishing.`;

                    // Push Native Notice (will overwrite previous if ID is the same)
                    dispatch('core/notices').createNotice(
                        'error', // Status: 'error', 'warning', 'success', 'info'
                        message, {
                            id: NOTICE_ID, // Ensures we don't spam multiple notices
                            isDismissible: false, // User can't click it away until fixed
                            type: 'default'
                        }
                    );
                } else {
                    // Unlock the editor
                    if (isLocked) dispatch('core/editor').unlockPostSaving(LOCK_ID);

                    // Remove the Notice
                    dispatch('core/notices').removeNotice(NOTICE_ID);
                }
            };

            // Use subscribe with debounce for stability
            subscribe(() => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(runValidation, 500);
            });
        })();
    </script>
<?php
}
