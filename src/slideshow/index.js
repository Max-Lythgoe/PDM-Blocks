import { registerBlockType } from '@wordpress/blocks';
import Splide from '@splidejs/splide';
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import icon from './icon';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    icon: icon.svg,
	edit: Edit,
	save: save,
    deprecated,
} );

export function initSplideEditorPreview() {
    // Find the editor canvas iframe by name
    const iframe = document.querySelector('iframe[name="editor-canvas"]');
    const doc = iframe ? iframe.contentDocument || iframe.contentWindow.document : document;
    const splides = doc.querySelectorAll('.splide');
    splides.forEach(splide => {
        const interval = parseInt(splide.dataset.interval) * 1000 || 3000;
        const autoplay = splide.dataset.autoplay === 'true';
        const pauseOnHover = splide.dataset.pauseOnHover === 'true';
        const pagination = splide.dataset.pagination === 'true';
        const arrows = splide.dataset.arrows === 'true';
        const slidesPerView = parseInt(splide.dataset.slidesPerView) || 1;
        const gap = splide.dataset.gap || '0px';
        const loop = splide.dataset.loop === 'true';
        try {
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
                drag: false,
                perMove: 1,
                breakpoints: {
                    1700: { perPage: Math.min(slidesPerView, 4) },
					1200: { perPage: Math.min(slidesPerView, 3) },
					900: { perPage: Math.min(slidesPerView, 2) },
					550: { perPage: 1 },
                }
            }).mount();
            splide.splide = instance;
                // Always re-apply inline styles after Splide mounts
                const sliderHeight = splide.dataset.sliderHeight || '50';
                splide.style.setProperty('--slider-height', `${sliderHeight}vh`);
                const slideRadius = splide.dataset.slideRadius || '0px';
                splide.style.setProperty('--slide-radius', slideRadius);
        } catch (e) {
            console.error('[Splide Editor Preview] Error mounting Splide:', e);
        }
    });
}
