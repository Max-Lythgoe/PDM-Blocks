import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {},
	save() {
		const blockProps = useBlockProps.save( {
			className: 'wp-block-pdm-testimonial testimonial-item',
		} );

		return (
			<div className="splide__slide">
				<div className="testimonial-wrapper">
					<div { ...blockProps }>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
};

export default [ v1 ];
