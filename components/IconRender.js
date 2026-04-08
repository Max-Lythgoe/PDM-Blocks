import { ICON_LIBRARY, getDefaultIcon } from './icon-library';

/**
 * Reusable component for rendering icons on the frontend
 * Use this in your save.js functions to avoid repeating code
 * 
 * @param {Object} props
 * @param {Object} props.attributes - Block attributes
 * @param {string} props.defaultIcon - Default icon name if none selected (e.g., 'check', 'plus')
 * @param {string} props.className - Optional CSS class for wrapper
 */
export default function IconRender({ attributes = {}, defaultIcon = 'check', className = '' }) {
	const { selectedIcon, customIconUrl, customIconSvg, iconSize, iconColor, useCustomColor } = attributes;

	const size = iconSize || 30;
	// When useCustomColor is true, apply the selected color to override SVG colors
	// When false (default), preserve original SVG colors by not applying any color
	const color = useCustomColor ? (iconColor || 'currentColor') : undefined;

	// Get the icon element
	let iconElement;
	if (customIconUrl) {
		const isSvg = customIconUrl.toLowerCase().endsWith('.svg');
		
		if (isSvg && customIconSvg) {
			// Render SVG inline so color can be controlled
			iconElement = (
				<span 
					className={`custom-svg-inline ${useCustomColor ? 'use-custom-color' : ''}`}
					dangerouslySetInnerHTML={{ __html: customIconSvg }}
					style={{ 
						width: `${size}px`,
						height: `${size}px`,
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				/>
			);
		} else {
			// For regular images or SVGs without content, use img tag
			iconElement = (
				<img 
					src={customIconUrl} 
					alt="" 
					style={{ 
						width: `${size}px`, 
						height: `${size}px`, 
						objectFit: 'contain' 
					}} 
				/>
			);
		}
	} else {
		const iconName = selectedIcon || defaultIcon;
		iconElement = ICON_LIBRARY[iconName] || ICON_LIBRARY[defaultIcon];
	}

	const iconStyle = {
		width: `${size}px`,
		height: `${size}px`,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center'
	};

	// Only apply color when using custom color override
	if (useCustomColor && color) {
		iconStyle.color = color;
	}

	// Add specific class when custom color should be applied
	const containerClassName = useCustomColor ? `${className} use-custom-color` : className;

	return (
		<span 
			className={containerClassName}
			style={iconStyle}
		>
			{iconElement}
		</span>
	);
}

/**
 * Component for rendering dual icons (open/close states)
 * Returns both open and close icon elements for accordion-style blocks
 */
export function DualIconRender({ attributes = {}, openDefault = 'plus', closeDefault = 'minus' }) {
	const { iconOpen, customIconUrlOpen, customIconSvgOpen, iconClose, customIconUrlClose, customIconSvgClose, iconSize, iconColor, useCustomColor } = attributes;

	const color = useCustomColor ? (iconColor || 'currentColor') : undefined;
	
	// Create icon style with conditional color application
	const createIconStyle = () => {
		const baseStyle = {};
		
		// Only apply color when using custom color override
		if (useCustomColor && color) {
			baseStyle.color = color;
		}
		
		return baseStyle;
	};
	
	const iconStyle = createIconStyle();

	// Helper function to render icon with inline SVG support
	const renderIcon = (customUrl, customSvg, iconName, defaultIcon) => {
		if (customUrl) {
			const isSvg = customUrl.toLowerCase().endsWith('.svg');
			if (isSvg && customSvg) {
				return (
					<span 
						className={`custom-svg-inline ${useCustomColor ? 'use-custom-color' : ''}`}
						dangerouslySetInnerHTML={{ __html: customSvg }}
						style={{ 
							width: '100%',
							height: '100%',
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					/>
				);
			}
			return <img src={customUrl} alt="" />;
		}
		return ICON_LIBRARY[iconName] || ICON_LIBRARY[defaultIcon];
	};

	const iconClass = useCustomColor ? 'use-custom-color' : '';

	return {
		openIcon: (
			<span 
				className={`icon-open ${iconClass}`}
				style={iconStyle}
			>
				{renderIcon(customIconUrlOpen, customIconSvgOpen, iconOpen, openDefault)}
			</span>
		),
		closeIcon: (
			<span 
				className={`icon-close ${iconClass}`}
				style={iconStyle}
			>
				{renderIcon(customIconUrlClose, customIconSvgClose, iconClose, closeDefault)}
			</span>
		)
	};
}
