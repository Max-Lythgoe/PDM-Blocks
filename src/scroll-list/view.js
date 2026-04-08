/**
 * Frontend JavaScript for Scroll List block
 * Uses vanilla JavaScript scroll events to handle active states and image switching
 */

document.addEventListener('DOMContentLoaded', function() {
	// Initialize scroll list sections
	document.querySelectorAll('.scroll-list-section').forEach((section) => {
		const scrollItems = section.querySelectorAll('.scroll-list-item');
		const scrollImage = section.querySelector('.scroll-list-image');
		
		if (!scrollImage || scrollItems.length === 0) return;
		
		// Set first item as active on load
		const firstItem = scrollItems[0];
		if (firstItem) {
			firstItem.classList.add('is-active');
			const imageUrl = firstItem.getAttribute('data-image-url');
			const imageAlt = firstItem.getAttribute('data-image-alt') || '';
			const imageTitle = firstItem.getAttribute('data-image-title') || '';
			const focalPoint = firstItem.getAttribute('data-focal-point') || '50% 50%';
			const imageId = firstItem.getAttribute('data-image-id');
			
			if (imageUrl) {
				scrollImage.src = imageUrl;
				scrollImage.alt = imageAlt;
				scrollImage.title = imageTitle;
				scrollImage.style.objectPosition = focalPoint;
				if (imageId) {
					scrollImage.className = `scroll-list-image wp-image-${imageId} attachment-full size-full`;
				}
			}
		}
		
		// Handle scroll events
		document.addEventListener('scroll', function() {
			scrollItems.forEach(function(item) {
				const rect = item.getBoundingClientRect();
				const topTrigger = 400;
				const bottomTrigger = window.innerHeight - 400;
				
				// Check if item is in the active zone
				if (rect.top <= topTrigger && rect.bottom > topTrigger && rect.bottom <= bottomTrigger) {
					// Remove active from all items
					scrollItems.forEach(i => i.classList.remove('is-active'));
					
					// Add active to current item
					item.classList.add('is-active');
					
					// Update image
					const imageUrl = item.getAttribute('data-image-url');
					const imageAlt = item.getAttribute('data-image-alt') || '';
					const imageTitle = item.getAttribute('data-image-title') || '';
					const focalPoint = item.getAttribute('data-focal-point') || '50% 50%';
					const imageId = item.getAttribute('data-image-id');
					
					if (imageUrl && scrollImage) {
						scrollImage.src = imageUrl;
						scrollImage.alt = imageAlt;
						scrollImage.title = imageTitle;
						scrollImage.style.objectPosition = focalPoint;
						if (imageId) {
							scrollImage.className = `scroll-list-image wp-image-${imageId} attachment-full size-full`;
						}
					}
				}
			});
		});
	});
});
