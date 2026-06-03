import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	__experimentalColorGradientControl as ColorGradientControl,
} from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalUnitControl as UnitControl,
	TextControl,
	ToolbarDropdownMenu,
	AlignmentMatrixControl,
	__experimentalText as Text,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const alignmentClass = attributes.contentPosition
		? attributes.contentPosition.replace( / /g, '-' )
		: 'center-center';

	const style = {
		'--popup-width': attributes.popupWidth,
	};

	const blockProps = useBlockProps( {
		style,
		className: `popup-align-${ alignmentClass }`,
	} );

	return (
		<>
			<BlockControls group="block">
				<ToolbarDropdownMenu
					icon={ <AlignmentMatrixControl.Icon value={ attributes.contentPosition } /> }
					label={ __( 'Change popup position', 'pdm-blocks' ) }
					controls={ [] }
				>
					{ ( { onClose } ) => (
						<div style={ { padding: '16px' } }>
							<AlignmentMatrixControl
								label={ __( 'Popup position', 'pdm-blocks' ) }
								value={ attributes.contentPosition }
								onChange={ ( nextPosition ) => {
									setAttributes( { contentPosition: nextPosition } );
									onClose();
								} }
							/>
						</div>
					) }
				</ToolbarDropdownMenu>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Popup Settings', 'pdm-blocks' ) }>
					<TextControl
						label={ __( 'Popup ID', 'pdm-blocks' ) }
						help={ __(
							'Assign a unique ID. Trigger this popup from any link using href="#your-id", or from a button using popovertarget="your-id".',
							'pdm-blocks'
						) }
						value={ attributes.popupId }
						onChange={ ( value ) =>
							setAttributes( {
								popupId: value.replace( /\s+/g, '-' ).toLowerCase(),
							} )
						}
					/>
					<ColorGradientControl
						label={ __( 'Overlay Background Color', 'pdm-blocks' ) }
						colorValue={ attributes.overlayBackgroundColor }
						onColorChange={ ( value ) =>
							setAttributes( { overlayBackgroundColor: value } )
						}
					/>
					<UnitControl
                        __next40pxDefaultSize
						label={ __( 'Popup Width', 'pdm-blocks' ) }
						value={ attributes.popupWidth }
						onChange={ ( value ) => setAttributes( { popupWidth: value } ) }
						units={ [
							{ value: 'px', label: 'px', default: 400 },
							{ value: '%', label: '%', default: 50 },
							{ value: 'vw', label: 'vw', default: 50 },
							{ value: 'em', label: 'em', default: 25 },
							{ value: 'rem', label: 'rem', default: 25 },
						] }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ attributes.popupId && (
					<Text
						className="pdm-toggled-popup-id-badge"
						as="span"
					>
						#{ attributes.popupId }
					</Text>
				) }
				<button
					className="pdm-toggled-popup-close"
					style={ { pointerEvents: 'none' } }
					aria-label="Close popup"
				>
					<span aria-hidden="true">&times;</span>
				</button>
				<InnerBlocks
					template={ [
						[ 'core/heading', { textAlign: 'center', placeholder: 'Popup Title' } ],
						[
							'core/paragraph',
							{ align: 'center', placeholder: 'Add your popup content here.' },
						],
						[
							'core/buttons',
							{ layout: { type: 'flex', justifyContent: 'center' } },
							[ [ 'core/button', { placeholder: 'Click Here' } ] ],
						],
					] }
				/>
			</div>
		</>
	);
}
