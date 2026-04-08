import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

function initContentSplide() {
  const splides = document.querySelectorAll('.wp-block-pdm-content-slideshow .splide');
  if (splides && splides.length > 0) {
    splides.forEach(splide => {
      const interval = parseInt(splide.dataset.interval) * 1000 || 3000;
      const autoplay = splide.dataset.autoplay === 'true';
      const pauseOnHover = splide.dataset.pauseOnHover === 'true';
      const pagination = splide.dataset.pagination === 'true';
      const arrows = splide.dataset.arrows === 'true';
      const loop = splide.dataset.loop === 'true';
      const sliderHeight = splide.dataset.sliderHeight || '50';
      
      // Set the CSS variable for slider height on parent container
      const container = splide.closest('.wp-block-pdm-content-slideshow');
      if (container) {
        container.style.setProperty('--slider-height', `${sliderHeight}vh`);
      }
      
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
        perPage: 1,
        gap: 0,
        perMove: 1,
        height: 'auto',
        autoHeight: false
      }).mount();
      
      splide.splide = instance;
    });
  }
}

document.addEventListener('DOMContentLoaded', initContentSplide);
