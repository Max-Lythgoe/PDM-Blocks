/**
 * Lightweight lightbox and facade functionality for YouTube video block
 */
document.addEventListener('DOMContentLoaded', function() {
	// Handle facade functionality
	const facadeTriggers = document.querySelectorAll('.youtube-facade-trigger');
	
	facadeTriggers.forEach(trigger => {
		trigger.addEventListener('click', function(e) {
			e.preventDefault();
			const videoId = this.getAttribute('data-video-id');
			
			if (videoId) {
				// Create the iframe element
				const iframe = document.createElement('iframe');
				iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
				iframe.title = 'YouTube video player';
				iframe.frameBorder = '0';
				iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
				iframe.allowFullscreen = true;
				iframe.className = 'youtube-iframe';
				
				// Replace the facade with the iframe
				this.parentNode.replaceChild(iframe, this);
			}
		});
	});
	
	// Handle lightbox functionality
	const triggers = document.querySelectorAll('.youtube-lightbox-trigger');
	
	if (triggers.length === 0) return;
	
	// Create lightbox overlay element (only once)
	const lightbox = document.createElement('div');
	lightbox.className = 'youtube-lightbox-overlay';
	lightbox.innerHTML = `
		<button class="youtube-lightbox-close" aria-label="Close lightbox">&times;</button>
		<div class="youtube-lightbox-content">
			<div class="youtube-lightbox-player"></div>
		</div>
	`;
	document.body.appendChild(lightbox);
	
	const lightboxPlayer = lightbox.querySelector('.youtube-lightbox-player');
	const closeButton = lightbox.querySelector('.youtube-lightbox-close');
	
	// Open lightbox with YouTube video
	function openLightbox(videoId, autoplay) {
		const autoplayParam = autoplay === '1' ? '&autoplay=1&mute=1' : '&autoplay=1';
		const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0${autoplayParam}`;
		
		lightboxPlayer.innerHTML = `
			<iframe
				src="${embedUrl}"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		`;
		
		lightbox.classList.add('active');
		document.body.style.overflow = 'hidden';
	}
	
	// Close lightbox
	function closeLightbox() {
		lightbox.classList.remove('active');
		document.body.style.overflow = '';
		// Clear iframe after animation to stop video
		setTimeout(() => {
			lightboxPlayer.innerHTML = '';
		}, 300);
	}
	
	// Add click handlers to all triggers
	triggers.forEach(trigger => {
		trigger.addEventListener('click', function(e) {
			e.preventDefault();
			const videoId = this.getAttribute('data-video-id');
			const autoplay = this.getAttribute('data-autoplay');
			openLightbox(videoId, autoplay);
		});
	});
	
	// Close button click
	closeButton.addEventListener('click', closeLightbox);
	
	// Close on overlay click (not on player)
	lightbox.addEventListener('click', function(e) {
		if (e.target === lightbox || e.target.classList.contains('youtube-lightbox-content')) {
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
