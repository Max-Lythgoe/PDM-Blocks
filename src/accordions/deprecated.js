import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Markup shared by every version that predates the title font size variable.
 */
const legacySave = ( { attributes } ) => {
	const columnsClass = `accord-columns-${ Number( attributes.columns ) || 1 }`;
	const className = `pdm-accordions ${ columnsClass }`;

	const cornerRadius = attributes.cornerRadius || {};
	const cssVariables = {
		'--pdm-toggle-bg': attributes.toggleGradient || attributes.toggleBg || '',
		'--pdm-toggle-color': attributes.toggleColor || '',
		'--pdm-icon-color': attributes.iconColor || '',
		'--pdm-panel-bg': attributes.panelGradient || attributes.panelBg || '',
		'--pdm-panel-color': attributes.panelColor || '',
		'--accordion-max-width': attributes.maxWidth ? attributes.maxWidth + 'px' : '',
		'--accordion-radius':
			typeof cornerRadius === 'object'
				? `${ cornerRadius.topLeft || '20px' } ${ cornerRadius.topRight || '20px' } ${ cornerRadius.bottomRight || '20px' } ${ cornerRadius.bottomLeft || '20px' }`
				: cornerRadius || '20px',
		'--pdm-bottom-border': attributes.bottomBorderEnabled
			? `${ attributes.bottomBorderThickness || 1 }px solid ${ attributes.bottomBorderColor || 'var(--wp--preset--color--contrast)' }`
			: 'none',
		'--pdm-shadow': attributes.shadowEnabled ? 'var(--shadow)' : 'none',
	};

	const blockProps = useBlockProps.save( {
		className: className,
		style: cssVariables,
	} );

	return (
		<div className="accordion-container">
			<div { ...blockProps }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

/**
 * Attribute set shared by the versions that support the full editor options.
 */
const legacyAttributes = {
	maxWidth: { type: 'number', default: 800 },
	toggleBg: { type: 'string', default: 'var(--wp--preset--color--primary)' },
	toggleGradient: { type: 'string' },
	panelBg: { type: 'string', default: 'var(--wp--preset--color--base)' },
	panelGradient: { type: 'string' },
	toggleColor: { type: 'string', default: 'var(--wp--preset--color--base)' },
	panelColor: { type: 'string', default: 'var(--wp--preset--color--contrast)' },
	iconColor: { type: 'string', default: 'var(--wp--preset--color--base)' },
	useCustomColor: { type: 'boolean', default: false },
	iconOpen: { type: 'string', default: 'plus' },
	customIconUrlOpen: { type: 'string' },
	customIconSvgOpen: { type: 'string' },
	iconClose: { type: 'string', default: 'minus' },
	customIconUrlClose: { type: 'string' },
	customIconSvgClose: { type: 'string' },
	iconPosition: { type: 'string', default: 'right' },
	iconSize: { type: 'string', default: '25px' },
	columns: { type: 'number', default: 1 },
	cornerRadius: {
		type: 'object',
		default: {
			topLeft: '20px',
			topRight: '20px',
			bottomLeft: '20px',
			bottomRight: '20px',
		},
	},
	bottomBorderEnabled: { type: 'boolean', default: false },
	bottomBorderThickness: { type: 'number', default: 1 },
	bottomBorderColor: { type: 'string', default: 'var(--wp--preset--color--contrast)' },
	shadowEnabled: { type: 'boolean', default: false },
};

/**
 * v3: adds the `--pdm-title-font-size` variable. Content saved before it
 * existed has no such variable, so it migrates to the default ("small") preset.
 */
const v3 = {
	apiVersion: 3,
	attributes: legacyAttributes,
	save: legacySave,
	migrate( attrs ) {
		return {
			...attrs,
			titleFontSize: 'small',
		};
	},
};

/**
 * v2: `columns` was accidentally stored as a string (e.g. "2") because the
 * editor control passed a string to a `number` attribute. WordPress discards
 * the invalid value on load and falls back to 1, which made the saved
 * `accord-columns-2` class fail block validation. Parsing with a string type
 * here lets those existing blocks validate, then migrate() restores a number.
 */
const v2 = {
	apiVersion: 3,
	attributes: {
		...legacyAttributes,
		columns: { type: 'string', default: '1' },
	},
	save: legacySave,
	migrate( { columns, ...attrs } ) {
		return {
			...attrs,
			columns: Number( columns ) || 1,
			titleFontSize: 'small',
		};
	},
};

const v1 = {
	apiVersion: 3,
	attributes: {
		columns: { type: 'number', default: 1 },
		toggleBg: { type: 'string' },
		toggleGradient: { type: 'string' },
		toggleColor: { type: 'string' },
		iconColor: { type: 'string' },
		panelBg: { type: 'string' },
		panelGradient: { type: 'string' },
		panelColor: { type: 'string' },
		maxWidth: { type: 'number' },
		cornerRadius: { type: 'object' },
		bottomBorderEnabled: { type: 'boolean', default: false },
		bottomBorderThickness: { type: 'number', default: 1 },
		bottomBorderColor: { type: 'string' },
		shadowEnabled: { type: 'boolean', default: false },
	},
	save: legacySave,
};

export default [ v3, v2, v1 ];
