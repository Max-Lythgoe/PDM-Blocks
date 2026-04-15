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
	const {
		imageURL,
		videoURL,
		useMinHeight,
		minHeight,
		moveBehindHeader,
		verticalAlignment,
		responsiveBreakpoint,
		backgroundAspectRatio,
		contentOrder,
		responsiveIgnoreHeader,
	} = attributes;

	const hasBackground = videoURL || imageURL;
	
	// Generate unique class name for responsive breakpoint
	const uniqueResponsiveClass = responsiveBreakpoint > 0 ? `responsive-${responsiveBreakpoint}` : '';

    const blockProps = useBlockProps.save({
        className: `${hasBackground ? 'has-bg-image' : ''} ${moveBehindHeader ? 'move-behind-header' : ''} ${verticalAlignment ? `is-vertically-aligned-${verticalAlignment}` : ''} ${uniqueResponsiveClass} ${contentOrder === 'above' ? 'content-above' : ''} ${moveBehindHeader && responsiveIgnoreHeader ? 'responsive-ignore-header' : ''}`.trim(),
        style: useMinHeight ? { minHeight: `${minHeight}vh` } : {},
    });

	const Tag = attributes.htmlElement || 'div';
	return (
		<>
			{responsiveBreakpoint > 0 && (
				<style dangerouslySetInnerHTML={{
					__html: `
						@media (max-width: ${responsiveBreakpoint}px) {
							.wp-block-pdm-section.${uniqueResponsiveClass} {
								min-height: 0 !important;
								margin: 0 !important;
							}
							${moveBehindHeader && responsiveIgnoreHeader ? `
							.wp-block-pdm-section.${uniqueResponsiveClass}.responsive-ignore-header {
								margin-top: 0 !important;
								z-index: auto !important;
							}
							.wp-block-pdm-section.${uniqueResponsiveClass}.responsive-ignore-header .content-wrapper {
								padding-top: 0 !important;
							}` : ''}
							.wp-block-pdm-section.${uniqueResponsiveClass} .section-flex-container {
								display: flex;
							}
							.wp-block-pdm-section.${uniqueResponsiveClass} .section-flex-container.content-first .section-background {
								order: 2;
							}
							.wp-block-pdm-section.${uniqueResponsiveClass} .section-flex-container.content-last .section-background {
								order: 1;
							}
							.wp-block-pdm-section.${uniqueResponsiveClass} .section-background {
								position: relative;
								inset: auto;
								aspect-ratio: ${backgroundAspectRatio};
								opacity: 1 !important;
								margin-bottom: 20px;
							}
							.wp-block-pdm-section.${uniqueResponsiveClass} .section-background img,
							.wp-block-pdm-section.${uniqueResponsiveClass} .section-background video {
								opacity: 1 !important;
							}
						}
					`
				}} />
			)}
			<Tag { ...blockProps }>
				<div className={`section-flex-container ${contentOrder === 'above' ? 'content-first' : 'content-last'}`}>
					<BackgroundMediaRender attributes={attributes} />
					<div className="content-wrapper"> 
						<InnerBlocks.Content />
					</div>
				</div>
			</Tag>
		</>
	);
}
