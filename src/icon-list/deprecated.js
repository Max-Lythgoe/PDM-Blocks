import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

// v2: full attribute set, iconSize stored as number — deprecated when iconSize changed to string
const v2 = {
	attributes: {
		style: { type: 'object' },
		selectedIcon: { type: 'string', default: 'check' },
		customIconUrl: { type: 'string' },
		customIconSvg: { type: 'string' },
		iconSize: { type: 'number', default: 24 },
		iconColor: { type: 'string', default: 'var(--wp--preset--color--primary)' },
		useCustomColor: { type: 'boolean', default: false },
		verticalAlignment: { type: 'string', default: 'top' },
	},
	save( { attributes } ) {
		const { selectedIcon, customIconUrl, iconSize, iconColor } = attributes;

		const blockProps = useBlockProps.save( {
			className: 'pdm-icon-list' + ( attributes.verticalAlignment ? ` is-vertically-aligned-${ attributes.verticalAlignment }` : '' ),
			'data-selected-icon': selectedIcon,
			'data-custom-icon-url': customIconUrl || '',
			'data-icon-size': iconSize,
			'data-icon-color': iconColor,
		} );

		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
	},
	migrate( { iconSize, ...attrs } ) {
		return {
			...attrs,
			iconSize: iconSize ? `${ iconSize }px` : '24px',
		};
	},
};

const v1 = {
	attributes: {
		selectedIcon: { type: 'string' },
		customIconUrl: { type: 'string' },
		iconSize: { type: 'number', default: 30 },
		iconColor: { type: 'string', default: 'currentColor' },
		verticalAlignment: { type: 'string' },
	},
	save( { attributes } ) {
		const { selectedIcon, customIconUrl, iconSize, iconColor } = attributes;

		const blockProps = useBlockProps.save( {
			className: 'pdm-icon-list' + ( attributes.verticalAlignment ? ` is-vertically-aligned-${ attributes.verticalAlignment }` : '' ),
			'data-selected-icon': selectedIcon,
			'data-custom-icon-url': customIconUrl || '',
			'data-icon-size': iconSize,
			'data-icon-color': iconColor,
		} );

		return (
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		);
	},
};

export default [ v2, v1 ];
