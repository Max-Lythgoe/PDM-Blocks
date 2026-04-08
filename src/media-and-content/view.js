/**
 * Lightweight lightbox and video facade functionality for media-and-content block
 */
document.addEventListener('DOMContentLoaded', function() {
	// Handle video facade functionality
	const facadeTriggers = document.querySelectorAll('.mc-video-facade-trigger');
	
	facadeTriggers.forEach(trigger => {
		trigger.addEventListener('click', function(e) {
			e.preventDefault();
			const videoId = this.getAttribute('data-video-id');
			
			if (videoId) {
				// Create the iframe element
				const iframe = document.createElement('iframe');
				iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
				iframe.width = '100%';
				iframe.height = '100%';
				iframe.frameBorder = '0';
				iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
				iframe.allowFullscreen = true;
				
				// Copy styles from the facade button
				const computedStyle = getComputedStyle(this);
				iframe.style.aspectRatio = computedStyle.aspectRatio;
				iframe.style.maxWidth = computedStyle.maxWidth;
				
				// Replace the facade with the iframe
				this.parentNode.replaceChild(iframe, this);
			}
		});
	});
	
	// Handle image lightbox functionality
	const triggers = document.querySelectorAll('.mc-lightbox-trigger');
	
	if (triggers.length === 0) return;
	
	// Create lightbox overlay element (only once)
	const lightbox = document.createElement('div');
	lightbox.className = 'mc-lightbox-overlay';
	lightbox.innerHTML = `
		<button class="mc-lightbox-close" aria-label="Close lightbox">&times;</button>
		<div class="mc-lightbox-content">
			<img src="" alt="" class="mc-lightbox-image" />
		</div>
	`;
	document.body.appendChild(lightbox);
	
	const lightboxImage = lightbox.querySelector('.mc-lightbox-image');
	const closeButton = lightbox.querySelector('.mc-lightbox-close');
	
	// Open lightbox
	function openLightbox(imageUrl, imageAlt) {
		lightboxImage.src = imageUrl;
		lightboxImage.alt = imageAlt || '';
		lightbox.classList.add('active');
		document.body.style.overflow = 'hidden';
	}
	
	// Close lightbox
	function closeLightbox() {
		lightbox.classList.remove('active');
		document.body.style.overflow = '';
		// Clear image after animation
		setTimeout(() => {
			lightboxImage.src = '';
		}, 300);
	}
	
	// Add click handlers to all triggers
	triggers.forEach(trigger => {
		trigger.addEventListener('click', function(e) {
			e.preventDefault();
			const imageUrl = this.getAttribute('data-lightbox-url');
			const img = this.querySelector('img');
			const imageAlt = img ? img.getAttribute('alt') : '';
			openLightbox(imageUrl, imageAlt);
		});
	});
	
	// Close button click
	closeButton.addEventListener('click', closeLightbox);
	
	// Close on overlay click (not on image)
	lightbox.addEventListener('click', function(e) {
		if (e.target === lightbox || e.target.classList.contains('mc-lightbox-content')) {
			closeLightbox();
		}
	});
	
	// Close on ESC key
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && lightbox.classList.contains('active')) {
			closeLightbox();
		}
	});
});
