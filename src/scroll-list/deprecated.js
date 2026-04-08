import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		switchSides: { type: 'boolean', default: false },
		aspectRatio: { type: 'string', default: '1/1' },
		borderRadius: { type: 'number', default: 0 },
		activeBackgroundColor: { type: 'string' },
		activeTextColor: { type: 'string' },
	},
	save( { attributes } ) {
		const { switchSides = false, aspectRatio = '1/1', borderRadius = 0, activeBackgroundColor, activeTextColor } = attributes;

		const blockProps = useBlockProps.save( {
			className: `scroll-list-section${ switchSides ? ' is-switched' : '' }`,
			'data-aspect-ratio': aspectRatio,
			'data-border-radius': borderRadius,
			style: {
				'--scroll-list-aspect-ratio': aspectRatio !== 'auto' ? aspectRatio : 'auto',
				'--scroll-list-border-radius': `${ borderRadius }px`,
				'--scroll-list-active-background': activeBackgroundColor || '',
				'--scroll-list-active-text': activeTextColor || '',
			},
		} );

		return (
			<div { ...blockProps }>
				<div className="scroll-list-sticky">
					<img src="" className="scroll-list-image" alt="" />
				</div>
				<div className="scroll-list-items">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

export default [ v1 ];
