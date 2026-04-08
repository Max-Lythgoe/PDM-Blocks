/**
 * Frontend JavaScript for testimonials slider functionality
 */
import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

function initTestimonialsSlider() {
	const testimonialSliders = document.querySelectorAll('.testimonials-slider .splide');
	
	if (testimonialSliders && testimonialSliders.length > 0) {
		testimonialSliders.forEach(slider => {
			// Get attributes from the slider element
			const arrows = slider.dataset.arrows === 'true';
			const pagination = slider.dataset.pagination === 'false' ? false : true;
			const autoplay = slider.dataset.autoplay === 'true';
			const slidesPerView = parseInt(slider.dataset.slidesPerView) || 4;
			const gap = slider.dataset.gap || '0px';

			// Check if splide instance already exists and destroy it
			if (slider.splide) {
				slider.splide.destroy();
			}

			// Initialize Splide
			const splideInstance = new Splide(slider, {
				type: 'loop',
				autoplay: autoplay,
				pagination: pagination,
				arrows: arrows,
				perPage: slidesPerView,
				gap: gap,
				perMove: 1,
                rewind: true,
				breakpoints: {
					1700: { perPage: Math.min(slidesPerView, 4) },
					1200: { perPage: Math.min(slidesPerView, 3) },
					768: { perPage: Math.min(slidesPerView, 2) },
					576: { perPage: 1 }
				}
			});

			splideInstance.mount();
			
			// Store instance reference
			slider.splide = splideInstance;
		});
	}
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initTestimonialsSlider);

// Also initialize if DOM is already loaded (for dynamic content)
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initTestimonialsSlider);
} else {
	initTestimonialsSlider();
}
