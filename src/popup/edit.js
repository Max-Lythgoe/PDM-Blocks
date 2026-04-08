import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, AlignmentMatrixControl, ToolbarDropdownMenu } from '@wordpress/components';
import { __experimentalColorGradientControl as ColorGradientControl } from '@wordpress/block-editor';

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
	const style = {
		'--popup-width': attributes.popupWidth + 'px'
	}

	const blockProps = useBlockProps({
        style: style
    });
	

	return (
		<>
		<BlockControls group="block">
			<ToolbarDropdownMenu
				icon={<AlignmentMatrixControl.Icon value={attributes.contentPosition} />}
				label={__('Change popup position', 'pdm-blocks')}
				controls={[]}
			>
				{({ onClose }) => (
					<div style={{ padding: '16px' }}>
						<AlignmentMatrixControl
							label={__('Popup position', 'pdm-blocks')}
							value={attributes.contentPosition}
							onChange={(nextPosition) => {
								setAttributes({
									contentPosition: nextPosition,
								});
								onClose();
							}}
						/>
					</div>
				)}
			</ToolbarDropdownMenu>
		</BlockControls>
		<InspectorControls>

			<PanelBody title={ __( 'Popup Settings', 'pdm-blocks' ) }>
				<ColorGradientControl
					label={ __( 'Overlay Background Color', 'pdm-blocks' ) }
					colorValue={ attributes.overlayBackgroundColor }
					onColorChange={ ( value ) => setAttributes( { overlayBackgroundColor: value } ) }
				/>
				<RangeControl
					label={ __( 'Popup Width (px)', 'pdm-blocks' ) }
					value={ attributes.popupWidth }
					onChange={ ( value ) => setAttributes( { popupWidth: value } ) }
					min={ 200 }
					max={ 1200 }
				/>
			</PanelBody>
			<PanelBody title={ __( 'Trigger Settings', 'pdm-blocks' ) }>
				<SelectControl
					label={ __( 'Trigger Type', 'pdm-blocks' ) }
					value={ attributes.triggerType }
					options={ [
						{ label: 'On Page Load', value: 'on-load' },
						{ label: 'After Delay', value: 'after-delay' },
					] }
					onChange={ ( value ) => setAttributes( { triggerType: value } ) }
				/>
				{ attributes.triggerType === 'after-delay' && (
					<RangeControl
						label={ __( 'Delay (seconds)', 'pdm-blocks' ) }
						value={ attributes.delayTime }
						onChange={ ( value ) => setAttributes( { delayTime: value } ) }
						min={ 1 }
						max={ 60 }
					/>
				) }
			</PanelBody>
		</InspectorControls>

		<div { ...blockProps }>
			<button 
				className="pdm-popup-close" 
				style={{ pointerEvents: 'none' }}
				aria-label="Close popup"
			>
				<span aria-hidden="true">&times;</span>
			</button>
			<InnerBlocks 
				template={ [
					['core/heading', { textAlign: 'center', placeholder: 'Sale going on now!!' }],
					['core/paragraph', { align: 'center', placeholder: 'Buy it before it\'s too late' }],
					['core/buttons', { layout: { type: 'flex', justifyContent: 'center' } }, [
						['core/button', { placeholder: 'Click Here' }]
					]]
				] }
			/>
		</div>
		</>
	);
}
