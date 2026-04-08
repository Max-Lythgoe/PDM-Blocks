/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

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
	const { imageId, imageUrl, imageAlt, offsetX, offsetY, width, hideAt, responsiveBehavior, blockMaxWidth } = attributes;

	if (!imageUrl) {
		return null;
	}

	const wpImageClass = imageId ? `wp-image-${imageId}` : '';
	
	// Apply the CSS custom property to the overflow container when in block mode
	const containerCustomStyle = responsiveBehavior === 'block' && hideAt > 0 
		? { '--block-max-width': `${blockMaxWidth}px` }
		: {};

	// Generate unique class name for this specific breakpoint
	const uniqueClass = hideAt > 0 ? `responsive-${hideAt}-${responsiveBehavior}` : '';

	// Generate inline CSS for the custom breakpoint
	let inlineCSS = '';
	if (hideAt > 0) {
		if (responsiveBehavior === 'hide') {
			inlineCSS = `
				<style>
					@media (max-width: ${hideAt}px) {
						.wp-block-pdm-floating-image.${uniqueClass} {
							display: none !important;
						}
					}
				</style>
			`;
		} else if (responsiveBehavior === 'block') {
			inlineCSS = `
				<style>
					@media (max-width: ${hideAt}px) {
						.wp-block-pdm-floating-image.${uniqueClass} {
							height: auto !important;
							padding: 20px;
						}
						.wp-block-pdm-floating-image.${uniqueClass} .floating-image-overflow-container {
							overflow: visible !important;
							height: auto !important;
							position: static !important;
							max-width: var(--block-max-width, 600px) !important;
							margin: 0 auto !important;
						}
						.wp-block-pdm-floating-image.${uniqueClass} .floating-image {
							position: static !important;
							display: block !important;
							width: 100% !important;
							left: auto !important;
							right: auto !important;
							top: auto !important;
							bottom: auto !important;
							pointer-events: auto !important;
						}
					}
				</style>
			`;
		}
	}

	const blockProps = useBlockProps.save({ 
		className: `floating-image-block-wrapper ${uniqueClass}`
	});

	return (
		<>
			{hideAt > 0 && (
				<style dangerouslySetInnerHTML={{
					__html: `
						@media (max-width: ${hideAt}px) {
							.wp-block-pdm-floating-image.${uniqueClass} {
								${responsiveBehavior === 'hide' ? 'display: none !important;' : 'height: auto !important; padding: 20px;'}
							}
							${responsiveBehavior === 'block' ? `
							.wp-block-pdm-floating-image.${uniqueClass} .floating-image-overflow-container {
								overflow: visible !important;
								height: auto !important;
								position: static !important;
								max-width: var(--block-max-width, 600px) !important;
								margin: 0 auto !important;
							}
							.wp-block-pdm-floating-image.${uniqueClass} .floating-image {
								position: static !important;
								display: block !important;
								width: 100% !important;
								left: auto !important;
								right: auto !important;
								top: auto !important;
								bottom: auto !important;
								pointer-events: auto !important;
							}` : ''}
						}
					`
				}} />
			)}
			<div {...blockProps}>
				<div 
					className="floating-image-overflow-container"
					style={containerCustomStyle}
				>
					<div 
						className="floating-image"
						style={{ 
							left: `${offsetX}%`,
							top: `${offsetY}px`,
							width: `${width}px`
						}}
					>
						<img src={imageUrl} alt={imageAlt} className={wpImageClass} />
					</div>
				</div>
			</div>
		</>
	);
}
