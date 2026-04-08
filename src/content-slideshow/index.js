/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import Splide from '@splidejs/splide';
// Note: Splide CSS is imported dynamically in edit.js when preview mode is active
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
    deprecated
} );

export function initSplideEditorPreview() {
    // Find the editor canvas iframe by name
    const iframe = document.querySelector('iframe[name="editor-canvas"]');
    const doc = iframe ? iframe.contentDocument || iframe.contentWindow.document : document;
    const splides = doc.querySelectorAll('.wp-block-pdm-content-slideshow .splide');
    splides.forEach(splide => {
        const interval = parseInt(splide.dataset.interval) * 1000 || 3000;
        const autoplay = splide.dataset.autoplay === 'true';
        const pauseOnHover = splide.dataset.pauseOnHover === 'true';
        const pagination = splide.dataset.pagination === 'true';
        const arrows = splide.dataset.arrows === 'true';
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
                perPage: 1,
                gap: 0,
                drag: false,
                perMove: 1,
                height: 'auto',
                autoHeight: false
            }).mount();
            splide.splide = instance;
            // Always re-apply the --slider-height inline style after Splide mounts
            const sliderHeight = splide.dataset.sliderHeight || '50';
            splide.style.setProperty('--slider-height', `${sliderHeight}vh`);
        } catch (e) {
            console.error('[Splide Editor Preview] Error mounting Splide:', e);
        }
    });
}
