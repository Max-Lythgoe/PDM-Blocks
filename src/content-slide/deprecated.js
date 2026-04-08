import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import BackgroundMediaRender from '../../components/BackgroundMediaRender';

const v1 = {
	attributes: {
		imageURL: { type: 'string' },
		imageID: { type: 'number' },
		videoURL: { type: 'string' },
		verticalAlignment: { type: 'string' },
		layout: { type: 'string' },
	},
	save( { attributes } ) {
		const { imageURL, videoURL, verticalAlignment } = attributes;

		const hasBackground = videoURL || imageURL;

		const blockProps = useBlockProps.save( {
			className: `splide__slide ${ hasBackground ? 'has-bg-image' : '' } ${ verticalAlignment ? `is-vertically-aligned-${ verticalAlignment }` : '' }`.trim(),
		} );

		const innerBlocksProps = useInnerBlocksProps.save( {
			className: 'content-wrapper',
		} );

		return (
			<li { ...blockProps }>
				<BackgroundMediaRender attributes={ attributes } />
				<div { ...innerBlocksProps } />
			</li>
		);
	},
};

export default [ v1 ];
