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
	const style = {
		'--popup-width': attributes.popupWidth + 'px',
		'--overlay-bg': attributes.overlayBackgroundColor,
	};

	// Convert space-separated contentPosition to kebab-case for CSS classes
	const alignmentClass = attributes.contentPosition ? attributes.contentPosition.replace(/ /g, '-') : 'center-center';

	return (
		<>
			<div 
				className="pdm-popup-overlay"
				style={{ background: attributes.overlayBackgroundColor }}
				data-trigger-type={ attributes.triggerType }
				data-delay-time={ attributes.delayTime }
				data-alignment={ attributes.contentPosition }
			></div>
			<div className={`pdm-popup-modal popup-align-${alignmentClass}`}>
				<div { ...useBlockProps.save({ style, className: 'wp-block-pdm-popup' }) }>
					<button className="pdm-popup-close" aria-label="Close popup">
						<span aria-hidden="true">&times;</span>
					</button>
					<InnerBlocks.Content />
				</div>
			</div>
		</>
	);
}
