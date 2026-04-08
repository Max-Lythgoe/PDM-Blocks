/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InnerBlocks,
	InspectorControls
} from '@wordpress/block-editor';

import {
	PanelBody,
	RadioControl
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { displayMode } = attributes;

	const blockProps = useBlockProps({
		className: `testimonials-container testimonials-${displayMode}`
	});

	const ALLOWED_BLOCKS = ['pdm/testimonial'];
	
	const TEMPLATE = [
		['pdm/testimonial'],
		['pdm/testimonial'],
		['pdm/testimonial']
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Display Settings', 'testimonials')} initialOpen={true}>
					<RadioControl
						label={__('Display Mode', 'testimonials')}
						selected={displayMode}
						options={[
							{ label: __('Slider', 'testimonials'), value: 'slider' },
							{ label: __('Grid', 'testimonials'), value: 'grid' }
						]}
						onChange={(value) => setAttributes({ displayMode: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="testimonials-editor-container">
					<InnerBlocks
						allowedBlocks={ALLOWED_BLOCKS}
						template={TEMPLATE}
						templateLock={false}
						orientation="horizontal"
					/>
				</div>
			</div>
		</>
	);
}
