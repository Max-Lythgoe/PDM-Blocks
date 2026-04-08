import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		imageURL: { type: 'string' },
		imageID: { type: 'number' },
		customAlt: { type: 'string' },
		customTitle: { type: 'string' },
		focalPoint: { type: 'object' },
		url: { type: 'string' },
		linkTarget: { type: 'string' },
		rel: { type: 'string' },
	},
	save( { attributes } ) {
		const { imageURL, imageID, customAlt, customTitle, focalPoint, url, linkTarget, rel } = attributes;

		const Tag = url ? 'a' : 'div';
		const linkProps = url ? {
			href: url,
			target: linkTarget || '_self',
			rel: rel || undefined,
		} : {};

		const blockProps = useBlockProps.save( {
			className: 'scroll-list-item',
			'data-image-url': imageURL || '',
			'data-image-id': imageID || '',
			'data-image-alt': customAlt || '',
			'data-image-title': customTitle || '',
			'data-focal-point': focalPoint ? `${ focalPoint.x * 100 }% ${ focalPoint.y * 100 }%` : '50% 50%',
			...linkProps,
		} );

		return (
			<Tag { ...blockProps }>
				<InnerBlocks.Content />
			</Tag>
		);
	},
};

export default [ v1 ];
