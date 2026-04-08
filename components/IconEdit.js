import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, __experimentalUnitControl as UnitControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IconSelector } from './IconSelector';

/**
 * Reusable component for icon editing controls
 * Use this in your edit.js to add icon selection UI
 * 
 * @param {Object} props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {string} props.label - Label for the panel (default: "Icon Settings")
 * @param {boolean} props.initialOpen - Whether panel is initially open (default: false)
 */
export default function IconEdit({ attributes, setAttributes, label = "Icon Settings", initialOpen = false }) {
	const { selectedIcon, customIconUrl, iconSize, iconColor, useCustomColor } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={label} initialOpen={initialOpen}>
				<IconSelector
					selectedIcon={selectedIcon}
					customIconUrl={customIconUrl}
					onIconSelect={(icon) => {
						setAttributes({ 
							selectedIcon: icon,
							customIconUrl: null,
							customIconSvg: null
						});
					}}
					onCustomIconSelect={(url, svgContent) => {
						setAttributes({ 
							customIconUrl: url,
							customIconSvg: svgContent || null,
							selectedIcon: null 
						});
					}}
				/>
				
				<UnitControl
					label={__('Icon Size', 'pdm-blocks')}
					value={iconSize}
					onChange={(value) => setAttributes({ iconSize: parseInt(value) || 24 })}
					min={1}
					max={600}
					units={[{ value: 'px', label: 'px' }]}
				/>

				<ToggleControl
					label={__('Use Custom Color', 'pdm-blocks')}
					checked={useCustomColor}
					onChange={(value) => setAttributes({ useCustomColor: value })}
					help={__('Override original SVG colors with selected icon color', 'pdm-blocks')}
				/>

				<PanelColorSettings
					title={__('Icon Color', 'pdm-blocks')}
					colorSettings={[
						{
							value: iconColor,
							onChange: (value) => setAttributes({ iconColor: value }),
							label: __('Icon Color', 'pdm-blocks'),
						},
					]}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * Component for dual icon editing (open/close states)
 * Use for accordions or toggle-style blocks
 */
export function DualIconEdit({ attributes, setAttributes }) {
	const { iconOpen, customIconUrlOpen, iconClose, customIconUrlClose, iconSize, iconColor, useCustomColor } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Icon Settings', 'pdm-blocks')} initialOpen={false}>
					<UnitControl
						label={__('Icon Size', 'pdm-blocks')}
						value={iconSize}
						onChange={(value) => setAttributes({ iconSize: parseInt(value) || 25 })}
						min={12}
						max={64}
						units={[{ value: 'px', label: 'px' }]}
					/>

					<ToggleControl
						label={__('Use Custom Color', 'pdm-blocks')}
						checked={useCustomColor}
						onChange={(value) => setAttributes({ useCustomColor: value })}
						help={__('Override original SVG colors with selected icon color', 'pdm-blocks')}
					/>

					<PanelColorSettings
						title={__('Icon Color', 'pdm-blocks')}
						colorSettings={[
							{
								value: iconColor,
								onChange: (value) => setAttributes({ iconColor: value }),
								label: __('Icon Color', 'pdm-blocks'),
							},
						]}
					/>
				</PanelBody>

				<PanelBody title={__('Closed Icon', 'pdm-blocks')} initialOpen={false}>
					<IconSelector
						selectedIcon={iconOpen}
						customIconUrl={customIconUrlOpen}
						onIconSelect={(icon) => setAttributes({ 
							iconOpen: icon,
							customIconUrlOpen: null,
							customIconSvgOpen: null
						})}
						onCustomIconSelect={(url, svgContent) => setAttributes({ 
							customIconUrlOpen: url,
							customIconSvgOpen: svgContent || null,
							iconOpen: null
						})}
					/>
				</PanelBody>

				<PanelBody title={__('Opened Icon', 'pdm-blocks')} initialOpen={false}>
					<IconSelector
						selectedIcon={iconClose}
						customIconUrl={customIconUrlClose}
						onIconSelect={(icon) => setAttributes({ 
							iconClose: icon,
							customIconUrlClose: null,
							customIconSvgClose: null
						})}
						onCustomIconSelect={(url, svgContent) => setAttributes({ 
							customIconUrlClose: url,
							customIconSvgClose: svgContent || null,
							iconClose: null
						})}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
