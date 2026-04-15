import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import BackgroundMediaRender from '../../components/BackgroundMediaRender';

const v1 = {
	attributes: {
		imageURL: { type: 'string' },
		imageID: { type: 'number' },
		videoURL: { type: 'string' },
		useMinHeight: { type: 'boolean', default: false },
		minHeight: { type: 'number', default: 50 },
		moveBehindHeader: { type: 'boolean', default: false },
		verticalAlignment: { type: 'string' },
		responsiveBreakpoint: { type: 'number', default: 0 },
		backgroundAspectRatio: { type: 'string', default: '16/9' },
		contentOrder: { type: 'string', default: 'below' },
		responsiveIgnoreHeader: { type: 'boolean', default: false },
	},
	save( { attributes } ) {
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
		const uniqueResponsiveClass = responsiveBreakpoint > 0 ? `responsive-${ responsiveBreakpoint }` : '';

		const blockProps = useBlockProps.save( {
			className: `${ hasBackground ? 'has-bg-image' : '' } ${ moveBehindHeader ? 'move-behind-header' : '' } ${ verticalAlignment ? `is-vertically-aligned-${ verticalAlignment }` : '' } ${ uniqueResponsiveClass } ${ contentOrder === 'above' ? 'content-above' : '' } ${ moveBehindHeader && responsiveIgnoreHeader ? 'responsive-ignore-header' : '' }`.trim(),
			style: useMinHeight ? { minHeight: `${ minHeight }vh` } : {},
		} );

		return (
			<>
				{ responsiveBreakpoint > 0 && (
					<style dangerouslySetInnerHTML={ {
						__html: `
						@media (max-width: ${ responsiveBreakpoint }px) {
							.wp-block-pdm-section.${ uniqueResponsiveClass } {
								min-height: 0 !important;
								margin: 0 !important;
							}
							${ moveBehindHeader && responsiveIgnoreHeader ? `
							.wp-block-pdm-section.${ uniqueResponsiveClass }.responsive-ignore-header {
								margin-top: 0 !important;
								z-index: auto !important;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass }.responsive-ignore-header .content-wrapper {
								padding-top: 0 !important;
							}` : '' }
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-flex-container {
								display: flex;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-flex-container.content-first .section-background {
								order: 2;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-flex-container.content-last .section-background {
								order: 1;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-background {
								position: relative;
								inset: auto;
								aspect-ratio: ${ backgroundAspectRatio };
								opacity: 1 !important;
								margin-bottom: 20px;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-background img,
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-background video {
								opacity: 1 !important;
							}
						}
						`,
					} } />
				) }
				<div { ...blockProps }>
					<div className={ `section-flex-container ${ contentOrder === 'above' ? 'content-first' : 'content-last' }` }>
						<BackgroundMediaRender attributes={ attributes } />
						<div className="content-wrapper">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</>
		);
	},
};


// v2: adds htmlElement attr, uses it for tag, default 'div' for migration
const v2 = {
	attributes: {
		imageURL: { type: 'string' },
		imageID: { type: 'number' },
		videoURL: { type: 'string' },
		useMinHeight: { type: 'boolean', default: false },
		minHeight: { type: 'number', default: 50 },
		moveBehindHeader: { type: 'boolean', default: false },
		verticalAlignment: { type: 'string' },
		responsiveBreakpoint: { type: 'number', default: 0 },
		backgroundAspectRatio: { type: 'string', default: '16/9' },
		contentOrder: { type: 'string', default: 'below' },
		responsiveIgnoreHeader: { type: 'boolean', default: false },
		htmlElement: { type: 'string', default: 'div' },
	},
	save( { attributes } ) {
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
			htmlElement,
		} = attributes;

		const hasBackground = videoURL || imageURL;
		const uniqueResponsiveClass = responsiveBreakpoint > 0 ? `responsive-${ responsiveBreakpoint }` : '';

		const blockProps = useBlockProps.save( {
			className: `${ hasBackground ? 'has-bg-image' : '' } ${ moveBehindHeader ? 'move-behind-header' : '' } ${ verticalAlignment ? `is-vertically-aligned-${ verticalAlignment }` : '' } ${ uniqueResponsiveClass } ${ contentOrder === 'above' ? 'content-above' : '' } ${ moveBehindHeader && responsiveIgnoreHeader ? 'responsive-ignore-header' : '' }`.trim(),
			style: useMinHeight ? { minHeight: `${ minHeight }vh` } : {},
		} );

		const Tag = htmlElement || 'div';

		return (
			<>
				{ responsiveBreakpoint > 0 && (
					<style dangerouslySetInnerHTML={ {
						__html: `
						@media (max-width: ${ responsiveBreakpoint }px) {
							.wp-block-pdm-section.${ uniqueResponsiveClass } {
								min-height: 0 !important;
								margin: 0 !important;
							}
							${ moveBehindHeader && responsiveIgnoreHeader ? `
							.wp-block-pdm-section.${ uniqueResponsiveClass }.responsive-ignore-header {
								margin-top: 0 !important;
								z-index: auto !important;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass }.responsive-ignore-header .content-wrapper {
								padding-top: 0 !important;
							}` : '' }
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-flex-container {
								display: flex;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-flex-container.content-first .section-background {
								order: 2;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-flex-container.content-last .section-background {
								order: 1;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-background {
								position: relative;
								inset: auto;
								aspect-ratio: ${ backgroundAspectRatio };
								opacity: 1 !important;
								margin-bottom: 20px;
							}
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-background img,
							.wp-block-pdm-section.${ uniqueResponsiveClass } .section-background video {
								opacity: 1 !important;
							}
						}
						`,
					} } />
				) }
				<Tag { ...blockProps }>
					<div className={ `section-flex-container ${ contentOrder === 'above' ? 'content-first' : 'content-last' }` }>
						<BackgroundMediaRender attributes={ attributes } />
						<div className="content-wrapper">
							<InnerBlocks.Content />
						</div>
					</div>
				</Tag>
			</>
		);
	},
};

export default [ v1, v2 ];
