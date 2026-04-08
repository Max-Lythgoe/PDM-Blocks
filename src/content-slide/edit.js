/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, BlockControls, BlockVerticalAlignmentControl } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import BackgroundMediaEdit from '../../components/BackgroundMediaEdit';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { imageURL, videoURL, verticalAlignment, layout } = attributes;

	// Ensure layout attribute is explicitly set on block creation
	useEffect(() => {
		if (!layout) {
			setAttributes({ 
				layout: { 
					type: 'constrained' 
				} 
			});
		}
	}, []);

	const blockProps = useBlockProps({
		className: `${(imageURL || videoURL) ? 'has-bg-image' : ''} ${verticalAlignment ? `is-vertically-aligned-${verticalAlignment}` : ''}`.trim(),
	})

    return (
        <div { ...blockProps }>
            <BlockControls group="block">
                <BlockVerticalAlignmentControl
                    value={ verticalAlignment }
                    onChange={ ( value ) => setAttributes( { verticalAlignment: value } ) }
                />
            </BlockControls>

            <BackgroundMediaEdit
                attributes={ attributes }
                setAttributes={ setAttributes }
            />

            <div className="content-wrapper">
                <InnerBlocks
                    template={[
                        ['core/heading', { level: 2, fontSize: 'xx-large', placeholder: 'Slide Title' }]
                    ]}
                />
            </div>
        </div>
    );
}
