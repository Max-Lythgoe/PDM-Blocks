/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, useInnerBlocksProps, InnerBlocks } from '@wordpress/block-editor';
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
	const {
		imageURL,
		videoURL,
		verticalAlignment,
		layout,
	} = attributes;

	const hasBackground = videoURL || imageURL;

    const blockProps = useBlockProps.save({
        className: `splide__slide ${hasBackground ? 'has-bg-image' : ''} ${verticalAlignment ? `is-vertically-aligned-${verticalAlignment}` : ''}`.trim(),
    });

	const innerBlocksProps = useInnerBlocksProps.save({
		className: 'content-wrapper',
	});

	return (
		<li { ...blockProps }>
			<BackgroundMediaRender attributes={attributes} />
			<div { ...innerBlocksProps } />
		</li>
	);
}
