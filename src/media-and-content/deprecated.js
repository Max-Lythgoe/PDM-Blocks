import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

function extractYouTubeId( url ) {
	if ( ! url ) return null;
	const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|\w+\?v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/i;
	const matches = url.match( regex );
	return matches ? matches[ 1 ] : null;
}

function isYouTubeUrl( url ) {
	if ( ! url ) return false;
	return /(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test( url );
}

function isDirectVideoUrl( url ) {
	if ( ! url ) return false;
	return /\.(mp4|webm|ogg|mov|avi|wmv|flv|m4v)(\?.*)?$/i.test( url ) ||
		/cloudflarestream\.com|vimeo\.com\/.*\/download|.*\.mp4|.*\.webm/i.test( url );
}

const v1 = {
	attributes: {
		verticalAlignment: { type: 'string' },
		mediaType: { type: 'string', default: 'image' },
		mediaSide: { type: 'string', default: '40%' },
		mediaStack: { type: 'string', default: '768px' },
		imageFit: { type: 'string', default: 'cover' },
		imageURL: { type: 'string' },
		imageID: { type: 'number' },
		customAlt: { type: 'string' },
		defaultAlt: { type: 'string' },
		customTitle: { type: 'string' },
		defaultTitle: { type: 'string' },
		focalPoint: { type: 'object' },
		videoURL: { type: 'string' },
		aspectRatio: { type: 'string', default: '16/9' },
		maxWidth: { type: 'number', default: 800 },
		customIframe: { type: 'string' },
		customAspectRatio: { type: 'string' },
		videoAutoplay: { type: 'boolean', default: false },
		imageAspectRatio: { type: 'string', default: 'auto' },
		imageMaxHeight: { type: 'number', default: 500 },
		mediaBorderRadius: { type: 'object' },
		enableLightbox: { type: 'boolean', default: false },
		loadFacade: { type: 'boolean', default: false },
		gap: { type: 'string', default: '0px' },
	},
	save( { attributes } ) {
		const {
			verticalAlignment,
			mediaType,
			mediaSide,
			mediaStack,
			imageFit,
			videoURL,
			aspectRatio,
			maxWidth,
			customIframe,
			customAspectRatio,
			videoAutoplay,
			imageAspectRatio,
			imageMaxHeight,
			mediaBorderRadius,
			enableLightbox,
			loadFacade,
			gap,
		} = attributes;

		const getEffectiveAspectRatio = () => {
			return aspectRatio === 'custom' && customAspectRatio ? customAspectRatio : aspectRatio;
		};

		const blockProps = useBlockProps.save( {
			className: 'mc-flex' + ( mediaType ? ' mc-media-' + mediaType : '' ) + ( verticalAlignment ? ` is-vertically-aligned-${ verticalAlignment }` : '' ),
			style: {
				'--mediaSide': mediaSide,
				'--mediaStack': mediaStack,
				'--imageFit': imageFit,
				'--aspect': getEffectiveAspectRatio(),
				'--max-width': maxWidth + 'px',
				'--itaGap': gap || '0px',
				'--imageAspect': imageAspectRatio !== 'auto' ? imageAspectRatio : 'auto',
				'--imageMaxHeight': verticalAlignment === 'stretch' ? '100%' : imageMaxHeight + 'px',
				'--mediaBorderRadius': typeof mediaBorderRadius === 'object'
					? `${ mediaBorderRadius.topLeft || '0px' } ${ mediaBorderRadius.topRight || '0px' } ${ mediaBorderRadius.bottomRight || '0px' } ${ mediaBorderRadius.bottomLeft || '0px' }`
					: ( mediaBorderRadius ? mediaBorderRadius + 'px' : '0px' ),
			},
		} );

		return (
			<div { ...blockProps }>
				<div className="mc-media">
					{ mediaType === 'image' && attributes.imageURL && (
						enableLightbox ? (
							<button
								className="mc-media-image-wrapper mc-lightbox-trigger"
								data-lightbox-url={ attributes.imageURL }
								aria-label="Open image in lightbox"
							>
								<img
									className={ `mc-media-image wp-image-${ attributes.imageID }` }
									src={ attributes.imageURL }
									alt={ attributes.customAlt || attributes.defaultAlt || '' }
									title={ attributes.customTitle || attributes.defaultTitle || '' }
									style={ {
										objectFit: imageFit || 'cover',
										objectPosition: attributes.focalPoint ? `${ attributes.focalPoint.x * 100 }% ${ attributes.focalPoint.y * 100 }%` : '50% 50%',
									} }
								/>
								<div className="mc-lightbox-overlay-icon">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
										<path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z" fill="currentColor"/>
									</svg>
								</div>
							</button>
						) : (
							<img
								className={ `mc-media-image wp-image-${ attributes.imageID }` }
								src={ attributes.imageURL }
								alt={ attributes.customAlt || attributes.defaultAlt || '' }
								title={ attributes.customTitle || attributes.defaultTitle || '' }
								style={ {
									objectFit: imageFit || 'cover',
									objectPosition: attributes.focalPoint ? `${ attributes.focalPoint.x * 100 }% ${ attributes.focalPoint.y * 100 }%` : '50% 50%',
								} }
							/>
						)
					) }
					{ mediaType === 'video' && videoURL && ( () => {
						if ( isYouTubeUrl( videoURL ) ) {
							const videoId = extractYouTubeId( videoURL );
							if ( videoId ) {
								const useFacade = loadFacade && ! videoAutoplay;
								if ( useFacade ) {
									const thumbnailUrl = `https://img.youtube.com/vi/${ videoId }/maxresdefault.jpg`;
									return (
										<button
											className="mc-video-facade-trigger"
											data-video-id={ videoId }
											aria-label="Play YouTube video"
											type="button"
											style={ {
												aspectRatio: getEffectiveAspectRatio(),
												maxWidth: maxWidth + 'px',
											} }
										>
											<img
												src={ thumbnailUrl }
												alt="YouTube video thumbnail"
												className="mc-video-facade-thumbnail"
												loading="lazy"
											/>
											<div className="mc-video-facade-play-button">
												<svg width="68" height="48" viewBox="0 0 68 48">
													<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000"/>
													<path d="M 45,24 27,14 27,34" fill="white"/>
												</svg>
											</div>
										</button>
									);
								} else {
									const embedUrl = `https://www.youtube.com/embed/${ videoId }${ videoAutoplay ? '?autoplay=1&mute=1' : '' }`;
									return (
										<iframe
											width="100%"
											height="100%"
											src={ embedUrl }
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
											style={ {
												aspectRatio: getEffectiveAspectRatio(),
												maxWidth: maxWidth + 'px',
											} }
										/>
									);
								}
							}
						} else if ( isDirectVideoUrl( videoURL ) ) {
							return (
								<video
									width="100%"
									height="100%"
									src={ videoURL }
									controls
									preload="metadata"
									autoPlay={ videoAutoplay }
									muted={ videoAutoplay }
									style={ {
										aspectRatio: getEffectiveAspectRatio(),
										maxWidth: maxWidth + 'px',
									} }
								/>
							);
						}
						return null;
					} )() }
					{ mediaType === 'custom' && customIframe && (
						<div
							className="mc-custom-iframe"
							style={ {
								aspectRatio: getEffectiveAspectRatio(),
								maxWidth: maxWidth + 'px',
							} }
							dangerouslySetInnerHTML={ { __html: customIframe } }
						/>
					) }
				</div>
				<div className="mc-content">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

export default [ v1 ];
