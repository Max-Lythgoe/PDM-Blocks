/**
 * Frontend JavaScript for Section block
 * Handles "Move Behind Header" functionality and responsive background aspect ratios
 */

document.addEventListener('DOMContentLoaded', function() {
	const sections = document.querySelectorAll('.wp-block-pdm-section.move-behind-header');
	const responsiveSections = document.querySelectorAll('.wp-block-pdm-section.responsive-block');
	
	// Handle "Move Behind Header" functionality
	if (sections.length > 0) {
		// Find the header element
		const header = document.querySelector('header');
		
		if (!header) {
			console.warn('No <header> element found for "Move Behind Header" functionality');
		} else {
			// Calculate and apply header offset
			function applyHeaderOffset() {
				const headerHeight = header.offsetHeight;
				
				sections.forEach((section) => {
					// Apply negative margin-top
					section.style.marginTop = `calc(-${headerHeight}px)`;
					
					// Add padding-top to content wrapper to preserve spacing
					const contentWrapper = section.querySelector('.content-wrapper');
					if (contentWrapper) {
						contentWrapper.style.paddingTop = `${headerHeight}px`;
					}
				});
			}
			
			// Apply on load
			applyHeaderOffset();
			
			// Reapply on window resize (in case header height changes)
			let resizeTimeout;
			window.addEventListener('resize', function() {
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(applyHeaderOffset, 100);
			});
		}
	}
	
	// Handle responsive background aspect ratios
	if (responsiveSections.length > 0) {
		responsiveSections.forEach((section) => {
			// Get the aspect ratio from the block's attributes
			// This would need to be passed from the backend
			const aspectRatio = section.getAttribute('data-aspect-ratio') || '16/9';
			section.style.setProperty('--section-aspect-ratio', aspectRatio);
		});
	}
});

