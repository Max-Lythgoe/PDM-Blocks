/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import IconRender from '../../components/IconRender';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const blockProps = useBlockProps.save({
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
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
