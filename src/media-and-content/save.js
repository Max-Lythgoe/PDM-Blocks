/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url) {
	if (!url) return null;
	
	const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|\w+\?v=)|youtu\.be\/|youtube\.com\/embed\/)([^"&?\/\s]{11})/i;
	const matches = url.match(regex);
	return matches ? matches[1] : null;
}

/**
 * Check if URL is a YouTube URL
 */
function isYouTubeUrl(url) {
	if (!url) return false;
	return /(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test(url);
}

/**
 * Check if URL is a direct video URL
 */
function isDirectVideoUrl(url) {
	if (!url) return false;
	// Check for common video file extensions or streaming services
	return /\.(mp4|webm|ogg|mov|avi|wmv|flv|m4v)(\?.*)?$/i.test(url) || 
		   /cloudflarestream\.com|vimeo\.com\/.*\/download|.*\.mp4|.*\.webm/i.test(url);
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
	   gap
   } = attributes;

   // Helper function to get the effective aspect ratio
   const getEffectiveAspectRatio = () => {
	   return aspectRatio === 'custom' && customAspectRatio ? customAspectRatio : aspectRatio;
   };

   const blockProps = useBlockProps.save({
	   className: 'mc-flex' + (mediaType ? ' mc-media-' + mediaType : '') + (verticalAlignment ? ` is-vertically-aligned-${verticalAlignment}` : ''),
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
			   ? `${mediaBorderRadius.topLeft || '0px'} ${mediaBorderRadius.topRight || '0px'} ${mediaBorderRadius.bottomRight || '0px'} ${mediaBorderRadius.bottomLeft || '0px'}`
			   : (mediaBorderRadius ? mediaBorderRadius + 'px' : '0px')
	   }
   });

   return (
	   <div {...blockProps}>
		   <div className="mc-media">
			   {mediaType === 'image' && attributes.imageURL && (
				   enableLightbox ? (
					   <button
						   className="mc-media-image-wrapper mc-lightbox-trigger"
						   data-lightbox-url={attributes.imageURL}
						   aria-label="Open image in lightbox"
					   >
						   <img
							   className={`mc-media-image wp-image-${attributes.imageID}`}
							   src={attributes.imageURL}
							   alt={attributes.customAlt || attributes.defaultAlt || ''}
							   title={attributes.customTitle || attributes.defaultTitle || ''}
							   style={{
								   objectFit: imageFit || 'cover',
								   objectPosition: attributes.focalPoint ? `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%` : '50% 50%'
							   }}
						   />
						   <div className="mc-lightbox-overlay-icon">
							   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
								   <path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z" fill="currentColor"/>
							   </svg>
						   </div>
					   </button>
				   ) : (
					   <img
						   className={`mc-media-image wp-image-${attributes.imageID}`}
						   src={attributes.imageURL}
						   alt={attributes.customAlt || attributes.defaultAlt || ''}
						   title={attributes.customTitle || attributes.defaultTitle || ''}
						   style={{
							   objectFit: imageFit || 'cover',
							   objectPosition: attributes.focalPoint ? `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%` : '50% 50%'
						   }}
					   />
				   )
			   )}
			   {mediaType === 'video' && videoURL && (() => {
				   if (isYouTubeUrl(videoURL)) {
					   // YouTube URLs
					   const videoId = extractYouTubeId(videoURL);
					   if (videoId) {
						   // Determine if facade should be used (facade enabled and not autoplay)
						   const useFacade = loadFacade && !videoAutoplay;
						   
						   if (useFacade) {
							   // Facade version
							   const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
							   return (
								   <button
									   className="mc-video-facade-trigger"
									   data-video-id={videoId}
									   aria-label="Play YouTube video"
									   type="button"
									   style={{
										   aspectRatio: getEffectiveAspectRatio(),
										   maxWidth: maxWidth + 'px'
									   }}
								   >
									   <img
										   src={thumbnailUrl}
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
							   // Regular iframe version
							   const embedUrl = `https://www.youtube.com/embed/${videoId}${videoAutoplay ? '?autoplay=1&mute=1' : ''}`;
							   return (
								   <iframe
									   width="100%"
									   height="100%"
									   src={embedUrl}
									   frameBorder="0"
									   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									   allowFullScreen
									   style={{
										   aspectRatio: getEffectiveAspectRatio(),
										   maxWidth: maxWidth + 'px'
									   }}
								   />
							   );
						   }
					   }
				   } else if (isDirectVideoUrl(videoURL)) {
					   // direct video URLs
					   return (
						   <video
							   width="100%"
							   height="100%"
							   src={videoURL}
							   controls
							   preload="metadata"
							   autoPlay={videoAutoplay}
							   muted={videoAutoplay}
							   style={{
								   aspectRatio: getEffectiveAspectRatio(),
								   maxWidth: maxWidth + 'px'
							   }}
						   />
					   );
				   }
				   return null;
			   })()}
			   {mediaType === 'custom' && customIframe && (
				   <div 
					   className="mc-custom-iframe" 
					   style={{
						   aspectRatio: getEffectiveAspectRatio(),
						   maxWidth: maxWidth + 'px'
					   }}
					   dangerouslySetInnerHTML={{ __html: customIframe }} 
				   />
			   )}
		   </div>
		   <div className="mc-content">
			   <InnerBlocks.Content />
		   </div>
	   </div>
   );
}
