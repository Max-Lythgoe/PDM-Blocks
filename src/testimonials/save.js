/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

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
	const { displayMode } = attributes;

	const blockProps = useBlockProps.save({
		className: `testimonials-container testimonials-${displayMode}`
	});

	if (displayMode === 'slider') {
		return (
			<div {...blockProps}>
				<div className="testimonials-slider">
					<div className="splide" data-arrows="true" data-pagination="false" data-autoplay="false" data-slides-per-view="4" data-gap="0px">
						<div className="splide__track">
							<div className="splide__list">
								<InnerBlocks.Content />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Grid mode
	return (
		<div {...blockProps}>
			<div className="testimonials-grid">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
