/**
 * Use this file for JavaScript code that you want to run in the front-end 
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any 
 * JavaScript running in the front-end, then you should delete this file and remove 
 * the `viewScript` property from `block.json`. 
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

document.addEventListener('DOMContentLoaded', function() {
	const overlays = document.querySelectorAll('.pdm-popup-overlay');
	
	overlays.forEach((overlay) => {
		const triggerType = overlay.dataset.triggerType;
		const delayTime = parseInt(overlay.dataset.delayTime) || 5;
		

		const modal = overlay.nextElementSibling;
		if (!modal || !modal.classList.contains('pdm-popup-modal')) return;
		
		// Get close button
		const closeBtn = modal.querySelector('.pdm-popup-close');
		
		// Show popup function with animation
		const showPopup = () => {
			overlay.classList.add('is-visible');
			modal.classList.add('is-visible');
		};
		
		// Close popup function with animation
		const closePopup = () => {
			overlay.classList.remove('is-visible');
			modal.classList.remove('is-visible');
		};
		
		if (closeBtn) {
			closeBtn.addEventListener('click', closePopup);
		}
		overlay.addEventListener('click', closePopup);
		
		// Trigger logic
		if (triggerType === 'on-load') {
			setTimeout(showPopup, 10);
		} else if (triggerType === 'after-delay') {
			setTimeout(showPopup, delayTime * 1000);
		}
	});
});
