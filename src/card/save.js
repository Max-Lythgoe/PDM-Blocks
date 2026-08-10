/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import BackgroundMediaRender from '../../components/BackgroundMediaRender';

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
	const { url, linkTarget, rel, verticalAlignment } = attributes;

	const blockProps = useBlockProps.save({
		className: `is-vertically-aligned-${verticalAlignment || 'top'}`
	});

	return (
		<div { ...blockProps }>
			<BackgroundMediaRender attributes={attributes} />
			{url && (
				<a
					className="pdm-card-link"
					href={url}
					{...(linkTarget && { target: linkTarget })}
					{...(rel && { rel: rel })}
					aria-hidden="true"
					tabIndex="-1"
				/>
			)}
			<div className="content-wrapper">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
