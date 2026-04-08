import { useBlockProps } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		imageURL: { type: 'string' },
		imageID: { type: 'number' },
		defaultAlt: { type: 'string' },
		customAlt: { type: 'string' },
		defaultTitle: { type: 'string' },
		customTitle: { type: 'string' },
		focalPoint: { type: 'object' },
	},
	save( { attributes } ) {
		const focal_x = attributes.focalPoint?.x ? attributes.focalPoint.x * 100 : 50;
		const focal_y = attributes.focalPoint?.y ? attributes.focalPoint.y * 100 : 50;
		const object_position = `${ focal_x }% ${ focal_y }%`;
		const alt = attributes.customAlt || attributes.defaultAlt || '';
		const title = attributes.customTitle || attributes.defaultTitle || '';

		const blockProps = useBlockProps.save( {
			className: 'splide__slide',
		} );

		return (
			<li { ...blockProps }>
				{ attributes.imageURL && (
					<img
						className={ `splide__slide-image wp-image-${ attributes.imageID }` }
						src={ attributes.imageURL }
						alt={ alt }
						{ ...( title ? { title } : {} ) }
						style={ {
							objectFit: 'cover',
							objectPosition: object_position,
						} }
					/>
				) }
			</li>
		);
	},
};

export default [ v1 ];
