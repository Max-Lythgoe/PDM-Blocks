import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		displayMode: { type: 'string', default: 'grid' },
	},
	save( { attributes } ) {
		const { displayMode } = attributes;

		const blockProps = useBlockProps.save( {
			className: `testimonials-container testimonials-${ displayMode }`,
		} );

		if ( displayMode === 'slider' ) {
			return (
				<div { ...blockProps }>
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

		return (
			<div { ...blockProps }>
				<div className="testimonials-grid">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

export default [ v1 ];
