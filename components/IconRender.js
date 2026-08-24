import { cloneElement } from '@wordpress/element';
import { ICON_LIBRARY, getDefaultIcon } from './icon-library';

// icon rendering
export default function IconRender({ attributes = {}, defaultIcon = 'check', className = '', decorative = false }) {
	const { selectedIcon, customIconUrl, customIconSvg, iconSize, iconColor, useCustomColor } = attributes;

	const sizeValue = iconSize
		? (typeof iconSize === 'number' ? `${iconSize}px` : iconSize)
		: '30px';
	// custom colorr
	const color = useCustomColor ? (iconColor || 'currentColor') : undefined;

	// Decorative icons are hidden from assistive tech.
	const decorativeProps = decorative ? { 'aria-hidden': 'true' } : {};

	let iconElement;
	if (customIconUrl) {
		const isSvg = customIconUrl.toLowerCase().endsWith('.svg');
		
		if (isSvg && customIconSvg) {
			iconElement = (
				<span 
					className={`custom-svg-inline ${useCustomColor ? 'use-custom-color' : ''}`}
					{...decorativeProps}
					dangerouslySetInnerHTML={{ __html: customIconSvg }}
					style={{ 
					width: sizeValue,
					height: sizeValue,
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				/>
			);
		} else {
			// iamges w/o svg
			iconElement = (
				<img 
					src={customIconUrl} 
					alt="" 
					{...decorativeProps}
					style={{ 
						width: sizeValue, 
						height: sizeValue, 
						objectFit: 'contain' 
					}} 
				/>
			);
		}
	} else {
		const iconName = selectedIcon || defaultIcon;
		const libIcon = ICON_LIBRARY[iconName] || ICON_LIBRARY[defaultIcon];
		iconElement = decorative && libIcon
			? cloneElement(libIcon, { 'aria-hidden': 'true', focusable: 'false' })
			: libIcon;
	}

	const iconStyle = {
		width: sizeValue,
		height: sizeValue,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center'
	};

	if (useCustomColor && color) {
		iconStyle.color = color;
	}

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

// dual icons 
export function DualIconRender({ attributes = {}, openDefault = 'plus', closeDefault = 'minus', openLabel, closeLabel }) {
	const { iconOpen, customIconUrlOpen, customIconSvgOpen, iconClose, customIconUrlClose, customIconSvgClose, iconSize, iconColor, useCustomColor } = attributes;

	const color = useCustomColor ? (iconColor || 'currentColor') : undefined;
	
	const createIconStyle = () => {
		const baseStyle = {};
		
		if (useCustomColor && color) {
			baseStyle.color = color;
		}
		
		return baseStyle;
	};
	
	const iconStyle = createIconStyle();

	const renderIcon = (customUrl, customSvg, iconName, defaultIcon, label) => {
		if (customUrl) {
			const isSvg = customUrl.toLowerCase().endsWith('.svg');
			if (isSvg && customSvg) {
				return (
					<span 
						className={`custom-svg-inline ${useCustomColor ? 'use-custom-color' : ''}`}
						role="img"
						aria-label={label}
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
			return <img src={customUrl} alt={label || ''} />;
		}
		const libIcon = ICON_LIBRARY[iconName] || ICON_LIBRARY[defaultIcon];
		if (!libIcon) return null;
		// Non-decorative icons get a proper accessible name; other consumers stay unchanged.
		return label
			? cloneElement(libIcon, { role: 'img', 'aria-label': label })
			: libIcon;
	};

	const iconClass = useCustomColor ? 'use-custom-color' : '';

	return {
		openIcon: (
			<span 
				className={`icon-open ${iconClass}`}
				style={iconStyle}
			>
				{renderIcon(customIconUrlOpen, customIconSvgOpen, iconOpen, openDefault, openLabel)}
			</span>
		),
		closeIcon: (
			<span 
				className={`icon-close ${iconClass}`}
				style={iconStyle}
			>
				{renderIcon(customIconUrlClose, customIconSvgClose, iconClose, closeDefault, closeLabel)}
			</span>
		)
	};
}
