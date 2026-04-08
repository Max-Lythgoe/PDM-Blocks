import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		imageURL: { type: 'string' },
		imageID: { type: 'number' },
		customAlt: { type: 'string' },
		customTitle: { type: 'string' },
		focalPoint: { type: 'object' },
	},
	save( { attributes } ) {
		const { imageURL, imageID, customAlt, customTitle, focalPoint } = attributes;

		const blockProps = useBlockProps.save( {
			className: 'scroll-content-item',
			'data-image-url': imageURL || '',
			'data-image-id': imageID || '',
			'data-image-alt': customAlt || '',
			'data-image-title': customTitle || '',
			'data-focal-point': focalPoint ? `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%` : '50% 50%',
		} );

		return (
			<div { ...blockProps }>
				{ imageURL && (
					<div className="scroll-img-item-mobile">
						<img
							src={ imageURL }
							alt={ customAlt || '' }
							title={ customTitle || '' }
							className={ `attachment-full size-full${ imageID ? ` wp-image-${ imageID }` : '' }` }
							style={ {
								objectPosition: focalPoint
									? `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%`
									: '50% 50%',
							} }
						/>
					</div>
				) }
				<InnerBlocks.Content />
			</div>
		);
	},
};

export default [ v1 ];
