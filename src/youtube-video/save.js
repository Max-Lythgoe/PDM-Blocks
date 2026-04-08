/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

// Helper function to check if URL is a YouTube URL
function isYouTubeUrl(url) {
	if (!url) return false;
	return /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|\w+\?v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/i.test(url);
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
	if (!url) return null;
	const matches = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|\w+\?v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/i);
	return matches ? matches[1] : null;
}

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const { 
		videoURL, 
		aspectRatio, 
		customAspectRatio, 
		videoAutoplay, 
		maxWidth,
		useFullWidth,
		enableLightbox,
		loadFacade,
		thumbnailUrl: savedThumbnailUrl
	} = attributes;

	// Get the effective aspect ratio
	const effectiveAspectRatio = aspectRatio === 'custom' && customAspectRatio 
		? customAspectRatio 
		: aspectRatio;

	const blockProps = useBlockProps.save({
		className: 'youtube-video-block',
		style: {
			maxWidth: useFullWidth ? '100%' : (maxWidth ? `${maxWidth}px` : '100%'),
			aspectRatio: effectiveAspectRatio
		}
	});

	// Don't render anything if no URL is provided
	if (!videoURL || !isYouTubeUrl(videoURL)) {
		return null;
	}

	const videoId = extractYouTubeId(videoURL);
	if (!videoId) {
		return null;
	}

	// Determine if facade should be used (facade enabled, not autoplay, not lightbox)
	const useFacade = loadFacade && !videoAutoplay && !enableLightbox;
	
	// Use the thumbnail URL resolved at edit-time; fall back to hqdefault (480x360, virtually always available)
	const thumbnailUrl = savedThumbnailUrl || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

	// Build YouTube embed URL with autoplay parameter
	const autoplayParam = videoAutoplay ? '&autoplay=1&mute=1' : '';
	const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0${autoplayParam}`;

	return (
		<div {...blockProps}>
			{enableLightbox ? (
				<button
					className="youtube-lightbox-trigger"
					data-video-id={videoId}
					data-autoplay={videoAutoplay ? '1' : '0'}
					aria-label="Open video in lightbox"
				>
					<iframe
						src={embedUrl}
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
						className="youtube-iframe"
					/>
					<div className="youtube-lightbox-overlay-icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
							<path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z" fill="currentColor"/>
						</svg>
					</div>
				</button>
			) : useFacade ? (
				<button
					className="youtube-facade-trigger"
					data-video-id={videoId}
					aria-label="Play YouTube video"
					type="button"
				>
					<img
						src={thumbnailUrl}
						alt="YouTube video thumbnail"
						className="youtube-facade-thumbnail"
						loading="lazy"
					/>
					<div className="youtube-facade-play-button">
						<svg width="68" height="48" viewBox="0 0 68 48">
							<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000"/>
							<path d="M 45,24 27,14 27,34" fill="white"/>
						</svg>
					</div>
				</button>
			) : (
				<iframe
					src={embedUrl}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
					className="youtube-iframe"
				/>
			)}
		</div>
	);
}
