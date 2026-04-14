/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import IconRender from '../../components/IconRender';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, context }) {
	// Sync context to attributes so they're available in save()
	useEffect(() => {
		const updates = {};
		if (context['pdm/iconList/selectedIcon'] !== attributes.selectedIcon) {
			updates.selectedIcon = context['pdm/iconList/selectedIcon'];
		}
		if (context['pdm/iconList/customIconUrl'] !== attributes.customIconUrl) {
			updates.customIconUrl = context['pdm/iconList/customIconUrl'];
		}
		if (context['pdm/iconList/customIconSvg'] !== attributes.customIconSvg) {
			updates.customIconSvg = context['pdm/iconList/customIconSvg'];
		}
		if (context['pdm/iconList/iconSize'] !== attributes.iconSize) {
			updates.iconSize = context['pdm/iconList/iconSize'];
		}
		if (context['pdm/iconList/iconColor'] !== attributes.iconColor) {
			updates.iconColor = context['pdm/iconList/iconColor'];
		}
		if (context['pdm/iconList/useCustomColor'] !== attributes.useCustomColor) {
			updates.useCustomColor = context['pdm/iconList/useCustomColor'];
		}
		if (Object.keys(updates).length > 0) {
			setAttributes(updates);
		}
	}, [context, attributes, setAttributes]);

	const blockProps = useBlockProps({
		className: 'pdm-icon-list-item',
		style: {
			'--icon-size': attributes.iconSize || '30px',
			'--icon-color': attributes.iconColor || 'currentColor'
		}
	});

	return (
		<div {...blockProps}>
			<div className="pdm-icon-list-item__icon">
				<IconRender 
					attributes={attributes}
					defaultIcon="check"
					className="pdm-icon-list-item__icon-svg"
				/>
			</div>
			<div className="pdm-icon-list-item__content">
				<InnerBlocks
					template={[
						['core/paragraph', { placeholder: 'Add list item content...', style: { spacing: { margin: { top: '0', bottom: '0' } } } }]
					]}
				/>
			</div>
		</div>
	);
}
