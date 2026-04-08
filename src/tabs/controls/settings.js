/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	__experimentalHStack as HStack, // eslint-disable-line
	__experimentalNumberControl as NumberControl, // eslint-disable-line
	__experimentalToggleGroupControl as ToggleGroupControl, // eslint-disable-line
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, // eslint-disable-line
} from '@wordpress/components';
import {
	arrowDown,
	arrowRight,
	arrowUp,
	justifyCenter,
	justifyLeft,
	justifyRight,
	justifyStretch,
	sidesLeft,
	sidesRight,
	sidesTop,
	sidesBottom
} from '@wordpress/icons';

/**
 * Settings component
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    The block attributes.
 * @param {Function} props.setAttributes Function to update block attributes.
 *
 * @return {JSX.Element} Settings panel
 */
function Settings( { attributes, setAttributes } ) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'pdm-blocks' ) }>
					<HStack align={ 'start' }>
						<ToggleGroupControl
							label={ __(
								'Justification',
								'pdm-blocks'
							) }
							value={ attributes.justification }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							onChange={ ( value ) =>
								setAttributes( { justification: value } )
							}
						>
							<ToggleGroupControlOptionIcon
								icon={ justifyLeft }
								value="left"
								label="Justify items left"
							/>
							<ToggleGroupControlOptionIcon
								icon={ justifyCenter }
								value="center"
								label="Justify items center"
							/>
							<ToggleGroupControlOptionIcon
								icon={ justifyRight }
								value="right"
								label="Justify items right"
							/>
							{ attributes.orientation === 'horizontal' && (
								<ToggleGroupControlOptionIcon
									icon={ justifyStretch }
									value="stretch"
									label="Justify items stretch"
								/>
							) }
						</ToggleGroupControl>
						<ToggleGroupControl
							label={ __(
								'Orientation',
								'pdm-blocks'
							) }
							value={ attributes.orientation }
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							onChange={ ( value ) => {
								// Always update orientation…
								const updates = { orientation: value };

								// but if they just switched to vertical and we were in "stretch", reset to "left"
								if (
									value === 'vertical' &&
									attributes.justification === 'stretch'
								) {
									updates.justification = 'left';
								}

								setAttributes( updates );
							} }
						>
							<ToggleGroupControlOptionIcon
								icon={ arrowRight }
								value="horizontal"
								label="Horizontal"
							/>
							<ToggleGroupControlOptionIcon
								icon={ arrowDown }
								value="vertical"
								label="Vertical"
							/>
						</ToggleGroupControl>
					</HStack>
					{ attributes.orientation === 'vertical' && (
						<HStack align={ 'start' }>
							<ToggleGroupControl
								label={ __(
									'Position',
									'pdm-blocks'
								) }
								value={ attributes.verticalPosition }
								__next40pxDefaultSize
								onChange={ ( value ) =>
									setAttributes( { verticalPosition: value } )
								}
							>
								<ToggleGroupControlOptionIcon
									icon={ justifyLeft }
									value="left"
									label="Left"
								/>
								<ToggleGroupControlOptionIcon
									icon={ justifyRight }
									value="right"
									label="Right"
								/>
							</ToggleGroupControl>
							<NumberControl
								label={ __(
									'Width (%)',
									'pdm-blocks'
								) }
								__next40pxDefaultSize
								value={ attributes.width }
								initialPosition={ attributes.width }
								onChange={ ( value ) =>
									setAttributes( { width: value } )
								}
								style={ { width: '74px' } }
								min={ 10 }
								max={ 50 }
							/>
						</HStack>
					) }
				</PanelBody>
			</InspectorControls>
			<InspectorControls>
				<PanelBody title={ __( 'Tab Icon', 'pdm-blocks' ) } initialOpen={ false }>
					<ToggleGroupControl
						label={ __( 'Position', 'pdm-blocks' ) }
						value={ attributes.iconPosition }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						isBlock
						onChange={ ( value ) =>
							setAttributes( { iconPosition: value } )
						}
					>
						<ToggleGroupControlOptionIcon
						icon={ sidesTop }
							value="top"
							label="Align top"
						/>
						<ToggleGroupControlOptionIcon
							icon={ sidesLeft }
							value="left"
							label="Align left"
						/>
						<ToggleGroupControlOptionIcon
						icon={ sidesBottom }
							value="bottom"
							label="Align bottom"
						/>
						<ToggleGroupControlOptionIcon
							icon={ sidesRight }
							value="right"
							label="Align right"
						/>
					</ToggleGroupControl>
					<RangeControl
						label={ __( 'Size', 'pdm-blocks' ) }
						__next40pxDefaultSize
						value={ attributes.iconSize }
						initialPosition={ attributes.iconSize }
						onChange={ ( value ) =>
							setAttributes( { iconSize: value } )
						}
						min={ 10 }
						max={ 100 }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}

export default Settings;
