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
import { useBlockProps, InnerBlocks, BlockControls, InspectorControls, BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

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
export default function Edit({attributes, setAttributes}) {
	const ALLOWED_BLOCKS = [ 'pdm/split-column' ];
	const TEMPLATE = [ [ 'pdm/split-column', {} ], [ 'pdm/split-column', {} ] ];

	const style = {
		'--column-sizing': attributes.columnSizing + '%',
		'--h-gap': attributes.horizontalGap,
		'--v-gap': attributes.verticalGap,
		'--row-direction': attributes.rowDirection ? 'row-reverse' : 'row',
		'--stack-order': attributes.stackOrder ? 'column-reverse' : 'column',
	};

	const className = 'stack-' + attributes.verticalStack + (attributes.verticalAlignment ? ` is-vertically-aligned-${attributes.verticalAlignment}` : '');

	const blockProps = useBlockProps({
		style: style,
		className: className
	});

	return (
		<>
		<InspectorControls>
			<PanelBody title={ __( 'Columns Settings', 'split-columns' ) }>
				<RangeControl
					label={ __( 'Column Sizing', 'split-columns' ) }
					value={ attributes.columnSizing }
					onChange={ ( value ) => setAttributes( { columnSizing: value } ) }
					step={ 1 }
					min={ 20 }
					max={ 80 }
				/>
				<UnitControl
					__next40pxDefaultSize
					label={ __( 'Horizontal Gap', 'split-columns' ) }
					value={ attributes.horizontalGap }
					onChange={ ( value ) => setAttributes( { horizontalGap: value } ) }
				/>
				<UnitControl
					__next40pxDefaultSize
					label={ __( 'Vertical Gap', 'split-columns' ) }
					value={ attributes.verticalGap }
					onChange={ ( value ) => setAttributes( { verticalGap: value } ) }
				/>
				<ToggleControl
					label={ __( 'Row Reverse?', 'split-columns' ) }
					checked={ attributes.rowDirection }
					onChange={ ( value ) => setAttributes( { rowDirection: value } ) }
				/>
				<ToggleControl
					label={ __( 'Stack Reverse?', 'split-columns' ) }
					checked={ attributes.stackOrder }
					onChange={ ( value ) => setAttributes( { stackOrder: value } ) }
				/>
				<SelectControl
					label={ __( 'Stack On', 'split-columns' ) }
					value={ attributes.verticalStack }
					options={ [
						{ label: 'Desktop Medium 1550px', value: '1550' },
						{ label: 'Desktop Small 1250px', value: '1250' },
						{ label: 'Tablet 1024px', value: '1024' },
						{ label: 'Mobile 768px', value: '768' },
					] }
					onChange={ ( value ) => setAttributes( { verticalStack: value } ) }
				/>
			</PanelBody>
		</InspectorControls>
		<BlockControls>
                <BlockVerticalAlignmentToolbar
                    value={attributes.verticalAlignment}
                    onChange={(newAlignment) => setAttributes({ verticalAlignment: newAlignment })}
					controls={['top', 'center', 'bottom', 'stretch']}
                />
            </BlockControls>
			<div {...blockProps}>
                <InnerBlocks template={TEMPLATE} allowedBlocks={ALLOWED_BLOCKS} orientation="horizontal" templateLock={false} />
            </div>
		</>
	);
}
