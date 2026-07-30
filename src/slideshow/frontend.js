import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

function initSplide() {
  const splides = document.querySelectorAll('.splide');
  if (splides && splides.length > 0) {
    splides.forEach(splide => {
      const interval = parseInt(splide.dataset.interval) * 1000 || 3000;
      const autoplay = splide.dataset.autoplay === 'true';
      const enableLightbox = splide.dataset.enableLightbox === 'true';
      const pauseOnHover = splide.dataset.pauseOnHover === 'true';
      const pagination = splide.dataset.pagination === 'true';
      const arrows = splide.dataset.arrows === 'true';
      const slidesPerView = parseInt(splide.dataset.slidesPerView) || 1;
      const gap = splide.dataset.gap || '0px';
      const loop = splide.dataset.loop === 'true';
      if (splide.splide) {
        splide.splide.destroy();
      }
      const instance = new Splide(splide, {
        type: loop ? 'loop' : 'slide',
        autoplay,
        pauseOnHover,
        pagination,
        arrows,
        interval,
        perPage: slidesPerView,
        gap,
        perMove: 1,
        breakpoints: {
          1700: { perPage: Math.min(slidesPerView, 4) },
          1200: { perPage: Math.min(slidesPerView, 3) },
          900: { perPage: Math.min(slidesPerView, 2) },
          650: { perPage: 1 },
        }
      }).mount();
      splide.splide = instance;

      // Initialize lightbox if enabled
      if (enableLightbox) {
        initSlideshowLightbox(splide);
      }
    });
  }
}

/**
 * Initialize lightbox for a slideshow
 */
function initSlideshowLightbox(splideContainer) {
  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'slideshow-lightbox-overlay';
  lightbox.innerHTML = `
    <button class="slideshow-lightbox-close" aria-label="Close lightbox">&times;</button>
    <button class="slideshow-lightbox-arrow slideshow-lightbox-prev" aria-label="Previous image">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
    </button>
    <button class="slideshow-lightbox-arrow slideshow-lightbox-next" aria-label="Next image">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"/></svg>
    </button>
    <div class="slideshow-lightbox-content">
      <img src="" alt="" class="slideshow-lightbox-image" />
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector('.slideshow-lightbox-image');
  const closeButton = lightbox.querySelector('.slideshow-lightbox-close');
  const prevButton = lightbox.querySelector('.slideshow-lightbox-prev');
  const nextButton = lightbox.querySelector('.slideshow-lightbox-next');

  let currentIndex = 0;

  // Collect all slide images
  function getSlideImages() {
    const images = [];
    const slides = splideContainer.querySelectorAll('.splide__slide-image');
    slides.forEach((img) => {
      images.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
      });
    });
    return images;
  }

  // Open lightbox at given index
  function openLightbox(index) {
    const images = getSlideImages();
    if (!images.length || !images[index]) return;

    currentIndex = index;
    showImage(images);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateArrowsVisibility(images);
  }

  // Show current image
  function showImage(images) {
    const image = images[currentIndex];
    if (!image) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
  }

  // Update arrow visibility based on current index
  function updateArrowsVisibility(images) {
    prevButton.style.display = currentIndex > 0 ? 'flex' : 'none';
    nextButton.style.display = currentIndex < images.length - 1 ? 'flex' : 'none';
  }

  // Navigation
  function prevImage() {
    if (currentIndex > 0) {
      currentIndex--;
      const images = getSlideImages();
      showImage(images);
      updateArrowsVisibility(images);
    }
  }

  function nextImage() {
    const images = getSlideImages();
    if (currentIndex < images.length - 1) {
      currentIndex++;
      showImage(images);
      updateArrowsVisibility(images);
    }
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImage.src = '';
      currentIndex = 0;
    }, 300);
  }

  // Add click handler to all slides
  splideContainer.addEventListener('click', function (e) {
    // Don't trigger if clicking on Splide UI elements
    if (
      e.target.closest('.splide__arrow') ||
      e.target.closest('.splide__pagination') ||
      e.target.closest('.slideshow-lightbox-overlay')
    ) {
      return;
    }

    const slide = e.target.closest('.splide__slide');
    if (!slide) return;

    // Find the index of the clicked slide
    const allSlides = splideContainer.querySelectorAll('.splide__slide');
    const index = Array.from(allSlides).indexOf(slide);

    if (index !== -1) {
      // Get the image index based on the Splide perPage setting
      const splideInstance = splideContainer.splide;
      if (splideInstance) {
        // Use the Splide index (accounts for clones in loop mode)
        const realIndex = splideInstance.index;
        const perPage = splideInstance.options.perPage || 1;
        // The visible slide index maps to the first image in that page
        const images = getSlideImages();
        let imgIndex = index;
        if (imgIndex < images.length) {
          openLightbox(imgIndex);
        }
      }
    }
  });

  // Close button click
  closeButton.addEventListener('click', closeLightbox);

  // Arrow button clicks
  prevButton.addEventListener('click', prevImage);
  nextButton.addEventListener('click', nextImage);

  // Close on overlay click (not on image)
  lightbox.addEventListener('click', function (e) {
    if (
      e.target === lightbox ||
      e.target.classList.contains('slideshow-lightbox-content')
    ) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('active')) {
      switch (e.key) {
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
}

document.addEventListener('DOMContentLoaded', initSplide);