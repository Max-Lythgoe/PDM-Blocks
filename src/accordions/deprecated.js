import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
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
	save( { attributes } ) {
		const columnsClass = `accord-columns-${ attributes.columns || 1 }`;
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
	},
};

export default [ v1 ];
