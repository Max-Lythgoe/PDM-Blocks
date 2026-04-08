import Splide from '@splidejs/splide';
import '@splidejs/splide/css';

function initSplide() {
  const splides = document.querySelectorAll('.splide');
  if (splides && splides.length > 0) {
    splides.forEach(splide => {
      const interval = parseInt(splide.dataset.interval) * 1000 || 3000;
      const autoplay = splide.dataset.autoplay === 'true';
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
    });
  }
}

document.addEventListener('DOMContentLoaded', initSplide);