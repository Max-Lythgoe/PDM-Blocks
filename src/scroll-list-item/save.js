import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { imageURL, imageID, customAlt, customTitle, focalPoint, url, linkTarget, rel } = attributes;
	
	const Tag = url ? 'a' : 'div';
	const linkProps = url ? {
		href: url,
		target: linkTarget || '_self',
		rel: rel || undefined
	} : {};
	
	const blockProps = useBlockProps.save({
		className: 'scroll-list-item',
		'data-image-url': imageURL || '',
		'data-image-id': imageID || '',
		'data-image-alt': customAlt || '',
		'data-image-title': customTitle || '',
		'data-focal-point': focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : '50% 50%',
		...linkProps
	});

	return (
		<Tag {...blockProps}>
			<InnerBlocks.Content />
		</Tag>
	);
}
