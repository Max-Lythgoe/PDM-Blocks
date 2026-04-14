import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, __experimentalUnitControl as UnitControl, ToggleControl, __experimentalToolsPanel as ToolsPanel, __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
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
					__next40pxDefaultSize
					label={__('Icon Size', 'pdm-blocks')}
					value={iconSize}
					onChange={(value) => setAttributes({ iconSize: value })}
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
				>
					<ToggleControl
						label={__('Use Custom Color', 'pdm-blocks')}
						checked={useCustomColor}
						onChange={(value) => setAttributes({ useCustomColor: value })}
						help={__('Override original SVG colors with selected icon color', 'pdm-blocks')}
					/>
				</PanelColorSettings>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * Component for dual icon editing (open/close states)
 * Use for accordions or toggle-style blocks
 * 
 * @param {Object} props
 * @param {Object} props.attributes - Block attributes
 * @param {Function} props.setAttributes - Function to update attributes
 * @param {string} [props.openLabel] - Label for the closed-state (open trigger) icon item
 * @param {string} [props.closeLabel] - Label for the opened-state (close trigger) icon item
 * @param {string} [props.defaultIconSize] - Default icon size string (e.g. '25px')
 */
export function DualIconEdit({ attributes, setAttributes, openLabel, closeLabel, defaultIconSize = '25px', hideByDefault = false, openDefault = 'plus', closeDefault = 'minus' }) {
	const { iconOpen, customIconUrlOpen, iconClose, customIconUrlClose, iconSize, iconColor, useCustomColor, iconPosition } = attributes;
	const hasIconPosition = iconPosition !== undefined;
	const shownByDefault = !hideByDefault;

	return (
		<InspectorControls>
			<ToolsPanel
				label={__('Icon Settings', 'pdm-blocks')}
				resetAll={() => setAttributes({
					iconSize: defaultIconSize,
					iconColor: 'currentColor',
					useCustomColor: false,
					iconOpen: 'plus',
					customIconUrlOpen: null,
					customIconSvgOpen: null,
					iconClose: 'minus',
					customIconUrlClose: null,
					customIconSvgClose: null,
					...(hasIconPosition && { iconPosition: 'right' }),
				})}
			>
				<ToolsPanelItem
					hasValue={() => iconSize !== defaultIconSize}
					label={__('Icon Size', 'pdm-blocks')}
					onDeselect={() => setAttributes({ iconSize: defaultIconSize })}
					isShownByDefault={shownByDefault}
				>
					<UnitControl
						__next40pxDefaultSize
						label={__('Icon Size', 'pdm-blocks')}
						value={iconSize}
						onChange={(value) => setAttributes({ iconSize: value })}
					/>
				</ToolsPanelItem>

				{hasIconPosition && (
					<ToolsPanelItem
						hasValue={() => iconPosition !== 'right'}
						label={__('Icon Position', 'pdm-blocks')}
						onDeselect={() => setAttributes({ iconPosition: 'right' })}
						isShownByDefault={false}
					>
						<ToggleControl
							label={__('Icon on Right', 'pdm-blocks')}
							checked={iconPosition === 'right'}
							onChange={(val) => setAttributes({ iconPosition: val ? 'right' : 'left' })}
						/>
					</ToolsPanelItem>
				)}

				<ToolsPanelItem
					hasValue={() => !!useCustomColor || iconColor !== 'currentColor'}
					label={__('Icon Color', 'pdm-blocks')}
					onDeselect={() => setAttributes({ useCustomColor: false, iconColor: 'currentColor' })}
					isShownByDefault={false}
				>
					<PanelColorSettings
						title={__('Icon Color', 'pdm-blocks')}
						colorSettings={[
							{
								value: iconColor,
								onChange: (value) => setAttributes({ iconColor: value }),
								label: __('Icon Color', 'pdm-blocks'),
							},
						]}
					>
						<ToggleControl
							label={__('Use Custom Color', 'pdm-blocks')}
							checked={useCustomColor}
							onChange={(value) => setAttributes({ useCustomColor: value })}
							help={__('Override original SVG colors with selected icon color', 'pdm-blocks')}
						/>
					</PanelColorSettings>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={() => !!customIconUrlOpen || (iconOpen && iconOpen !== openDefault)}
					label={openLabel || __('Closed State Icon', 'pdm-blocks')}
					onDeselect={() => setAttributes({ iconOpen: 'plus', customIconUrlOpen: null, customIconSvgOpen: null })}
					isShownByDefault={false}
				>
					<p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>{openLabel || __('Closed State Icon', 'pdm-blocks')}</p>
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
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={() => !!customIconUrlClose || (iconClose && iconClose !== closeDefault)}
					label={closeLabel || __('Opened State Icon', 'pdm-blocks')}
					onDeselect={() => setAttributes({ iconClose: 'minus', customIconUrlClose: null, customIconSvgClose: null })}
					isShownByDefault={false}
				>
					<p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'inherit' }}>{closeLabel || __('Opened State Icon', 'pdm-blocks')}</p>
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
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
}
