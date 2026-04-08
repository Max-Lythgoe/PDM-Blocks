/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const columnsClass = `accord-columns-${attributes.columns || 1}`;
    const className = `pdm-accordions ${columnsClass}`;

	const cornerRadius = attributes.cornerRadius || {};
	const cssVariables = {
        '--pdm-toggle-bg': attributes.toggleGradient || attributes.toggleBg || '',
        '--pdm-toggle-color': attributes.toggleColor || '',
        '--pdm-icon-color': attributes.iconColor || '',
        '--pdm-panel-bg': attributes.panelGradient || attributes.panelBg || '',
        '--pdm-panel-color': attributes.panelColor || '',
		'--accordion-max-width': attributes.maxWidth ? attributes.maxWidth + 'px' : '',
		'--accordion-radius': typeof cornerRadius === 'object'
			? `${cornerRadius.topLeft || '20px'} ${cornerRadius.topRight || '20px'} ${cornerRadius.bottomRight || '20px'} ${cornerRadius.bottomLeft || '20px'}`
			: (cornerRadius || '20px'),
		'--pdm-bottom-border': attributes.bottomBorderEnabled ? 
			`${attributes.bottomBorderThickness || 1}px solid ${attributes.bottomBorderColor || 'var(--wp--preset--color--contrast)'}` : 
			'none',
		'--pdm-shadow': attributes.shadowEnabled ? 'var(--shadow)' : 'none'
    };

	const blockProps = useBlockProps.save({
		className: className,
		style: cssVariables
	});

	return (
		<div className="accordion-container">
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
		</div>
	);
}
