import { useBlockProps } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		columns: { type: 'number', default: 3 },
		borderRadius: { type: 'number', default: 0 },
		enableLightbox: { type: 'boolean', default: false },
		enableMasonry: { type: 'boolean', default: false },
		aspectRatio: { type: 'string', default: '1/1' },
		customAspectRatio: { type: 'string' },
		images: { type: 'array', default: [] },
	},
	save( { attributes } ) {
		const { columns, borderRadius, enableLightbox, enableMasonry, aspectRatio, customAspectRatio, images } = attributes;

		const getEffectiveAspectRatio = () => {
			return aspectRatio === 'custom' && customAspectRatio ? customAspectRatio : aspectRatio;
		};

		const style = {
			'--gallery-columns': columns,
			'--gallery-radius': borderRadius + 'px',
			'--gallery-aspect': enableMasonry ? 'auto' : getEffectiveAspectRatio(),
		};

		const blockProps = useBlockProps.save( {
			style: style,
			className: enableMasonry ? 'is-masonry' : '',
		} );

		return (
			<div { ...blockProps }>
				{ images && images.length > 0 ? (
					<div className="gallery-grid">
						{ images.map( ( image, index ) =>
							enableLightbox ? (
								<button
									key={ image.id }
									className="gallery-item gallery-lightbox-trigger"
									data-lightbox-url={ image.url }
									data-lightbox-index={ index }
									aria-label={ `Open image ${ index + 1 } in lightbox` }
								>
									<img
										src={ image.url }
										alt={ image.alt }
										className={ `wp-image-${ image.id }` }
									/>
									<span className="gallery-lightbox-overlay-icon" aria-hidden="true">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z"/></svg>
									</span>
								</button>
							) : (
								<div key={ image.id } className="gallery-item">
									<img
										src={ image.url }
										alt={ image.alt }
										className={ `wp-image-${ image.id }` }
									/>
								</div>
							)
						) }
					</div>
				) : (
					<p>No images in gallery</p>
				) }
			</div>
		);
	},
};

export default [ v1 ];
