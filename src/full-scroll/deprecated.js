import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		backgroundOverlay: { type: 'boolean', default: false },
		overlayOpacity: { type: 'number', default: 50 },
		blurAmount: { type: 'number', default: 10 },
		buttonAnimation: { type: 'boolean', default: false },
		switchSides: { type: 'boolean', default: false },
		aspectRatio: { type: 'string', default: '1/1' },
		borderRadius: { type: 'number', default: 0 },
	},
	save( { attributes } ) {
		const {
			backgroundOverlay = false,
			overlayOpacity = 50,
			blurAmount = 10,
			buttonAnimation = false,
			switchSides = false,
			aspectRatio = '1/1',
			borderRadius = 0,
		} = attributes;

		const blockProps = useBlockProps.save( {
			className: `scroll-section${ buttonAnimation ? ' has-button-animation' : '' }${ switchSides ? ' is-switched' : '' }`,
			'data-overlay-enabled': backgroundOverlay ? 'true' : 'false',
			'data-overlay-opacity': overlayOpacity,
			'data-blur-amount': blurAmount,
			'data-aspect-ratio': aspectRatio,
			'data-border-radius': borderRadius,
			style: {
				'--scroll-aspect-ratio': aspectRatio !== 'auto' ? aspectRatio : 'auto',
				'--scroll-border-radius': `${ borderRadius }px`,
			},
		} );

		return (
			<div { ...blockProps }>
				<div className="scroll-visual page-padding">
					<div className="scroll-img-wrap">
						<div className="scroll-list scroll-img-list">
						</div>
					</div>
				</div>
				<div className="scroll-content page-padding">
					<div className="scroll-content-wrap">
						<div className="scroll-list scroll-content-list">
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		);
	},
};

export default [ v1 ];
