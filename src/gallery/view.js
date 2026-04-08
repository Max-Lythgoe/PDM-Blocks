/**
 * Lightweight lightbox functionality for gallery block
 */
document.addEventListener('DOMContentLoaded', function() {
	// Find all gallery lightbox triggers
	const triggers = document.querySelectorAll('.gallery-lightbox-trigger');
	
	if (triggers.length === 0) return;
	
	// Group triggers by gallery block
	const galleries = new Map();
	triggers.forEach(trigger => {
		const gallery = trigger.closest('.wp-block-pdm-gallery');
		if (!galleries.has(gallery)) {
			galleries.set(gallery, []);
		}
		galleries.get(gallery).push(trigger);
	});
	
	// Create lightbox overlay element (only once)
	const lightbox = document.createElement('div');
	lightbox.className = 'gallery-lightbox-overlay';
	lightbox.innerHTML = `
		<button class="gallery-lightbox-close" aria-label="Close lightbox">&times;</button>
		<button class="gallery-lightbox-arrow gallery-lightbox-prev" aria-label="Previous image">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
		</button>
		<button class="gallery-lightbox-arrow gallery-lightbox-next" aria-label="Next image">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
		</button>
		<div class="gallery-lightbox-content">
			<img src="" alt="" class="gallery-lightbox-image" />
		</div>
	`;
	document.body.appendChild(lightbox);
	
	const lightboxImage = lightbox.querySelector('.gallery-lightbox-image');
	const closeButton = lightbox.querySelector('.gallery-lightbox-close');
	const prevButton = lightbox.querySelector('.gallery-lightbox-prev');
	const nextButton = lightbox.querySelector('.gallery-lightbox-next');
	
	let currentGallery = null;
	let currentIndex = 0;
	
	// Open lightbox
	function openLightbox(gallery, index) {
		currentGallery = gallery;
		currentIndex = index;
		showImage();
		lightbox.classList.add('active');
		document.body.style.overflow = 'hidden';
		updateArrowsVisibility();
	}
	
	// Show current image
	function showImage() {
		if (!currentGallery) return;
		
		const images = galleries.get(currentGallery);
		if (!images || !images[currentIndex]) return;
		
		const trigger = images[currentIndex];
		const imageUrl = trigger.getAttribute('data-lightbox-url');
		const img = trigger.querySelector('img');
		const imageAlt = img ? img.getAttribute('alt') : '';
		
		lightboxImage.src = imageUrl;
		lightboxImage.alt = imageAlt || '';
	}
	
	// Update arrows visibility
	function updateArrowsVisibility() {
		if (!currentGallery) return;
		
		const images = galleries.get(currentGallery);
		if (!images) return;
		
		prevButton.style.display = currentIndex > 0 ? 'flex' : 'none';
		nextButton.style.display = currentIndex < images.length - 1 ? 'flex' : 'none';
	}
	
	// Navigate to previous image
	function prevImage() {
		if (currentIndex > 0) {
			currentIndex--;
			showImage();
			updateArrowsVisibility();
		}
	}
	
	// Navigate to next image
	function nextImage() {
		if (!currentGallery) return;
		
		const images = galleries.get(currentGallery);
		if (images && currentIndex < images.length - 1) {
			currentIndex++;
			showImage();
			updateArrowsVisibility();
		}
	}
	
	// Close lightbox
	function closeLightbox() {
		lightbox.classList.remove('active');
		document.body.style.overflow = '';
		// Clear image after animation
		setTimeout(() => {
			lightboxImage.src = '';
			currentGallery = null;
			currentIndex = 0;
		}, 300);
	}
	
	// Add click handlers to all triggers
	triggers.forEach(trigger => {
		trigger.addEventListener('click', function(e) {
			e.preventDefault();
			const gallery = this.closest('.wp-block-pdm-gallery');
			const index = parseInt(this.getAttribute('data-lightbox-index'), 10);
			openLightbox(gallery, index);
		});
	});
	
	// Close button click
	closeButton.addEventListener('click', closeLightbox);
	
	// Arrow button clicks
	prevButton.addEventListener('click', prevImage);
	nextButton.addEventListener('click', nextImage);
	
	// Close on overlay click (not on image)
	lightbox.addEventListener('click', function(e) {
		if (e.target === lightbox || e.target.classList.contains('gallery-lightbox-content')) {
			closeLightbox();
		}
	});
	
	// Keyboard navigation
	document.addEventListener('keydown', function(e) {
		if (lightbox.classList.contains('active')) {
			switch(e.key) {
				case 'Escape':
					closeLightbox();
					break;
				case 'ArrowLeft':
					prevImage();
					break;
				case 'ArrowRight':
					nextImage();
					break;
			}
		}
	});
});
