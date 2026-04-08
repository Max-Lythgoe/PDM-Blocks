import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		sliderHeight: { type: 'number', default: 50 },
		interval: { type: 'number' },
		autoplay: { type: 'boolean' },
		pauseOnHover: { type: 'boolean' },
		pagination: { type: 'boolean' },
		arrows: { type: 'boolean' },
		loop: { type: 'boolean' },
	},
	save( { attributes } ) {
		const sliderHeightValue = attributes.sliderHeight || 50;

		return (
			<div
				{ ...useBlockProps.save() }
				style={ {
					[ '--slider-height' ]: `${ sliderHeightValue }vh`,
				} }
			>
				<div
					className="splide"
					data-interval={ attributes.interval }
					data-autoplay={ attributes.autoplay }
					data-pause-on-hover={ attributes.pauseOnHover }
					data-pagination={ attributes.pagination }
					data-arrows={ attributes.arrows }
					data-loop={ attributes.loop }
					data-slider-height={ sliderHeightValue }
				>
					<div className="splide__track">
						<ul className="splide__list">
							<InnerBlocks.Content />
						</ul>
					</div>
				</div>
			</div>
		);
	},
};

export default [ v1 ];
