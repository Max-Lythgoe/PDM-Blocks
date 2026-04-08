/**
 * Reusable component for rendering background images/videos on the frontend
 * Use this in your save.js functions to avoid repeating code
 */

export default function BackgroundMediaRender({ attributes }) {
	const {
		opacity,
		mixBlendMode,
		imageFit,
		imageURL,
		focalPoint,
		imageID,
		defaultAlt,
		defaultTitle,
		customAlt,
		customTitle,
		videoURL,
		useFeaturedImage,
	} = attributes;

	const focal_x = focalPoint?.x ? focalPoint.x * 100 : 50;
	const focal_y = focalPoint?.y ? focalPoint.y * 100 : 50;
	const object_position = `${focal_x}% ${focal_y}%`;
	const alt = customAlt || defaultAlt || '';
	const title = customTitle || defaultTitle || '';
	const hasBackground = videoURL || imageURL || useFeaturedImage;

	if (!hasBackground) {
		return null;
	}

	// If using featured image, add a data attribute for PHP to replace
	if (useFeaturedImage) {
		return (
			<div 
				className="section-background" 
				data-use-featured-image="true"
				data-opacity={opacity}
				data-mix-blend-mode={mixBlendMode}
				data-image-fit={imageFit || 'cover'}
				data-focal-x={focal_x}
				data-focal-y={focal_y}
			>
				{imageURL && (
					<img
						src={imageURL}
						alt={alt}
						title={title}
						style={{
							objectFit: imageFit || 'cover',
							objectPosition: object_position,
							opacity: opacity / 100,
							mixBlendMode: mixBlendMode,
						}}
					/>
				)}
			</div>
		);
	}

	return (
		<div className="section-background">
			{videoURL ? (
				<video
					autoPlay
					muted
					loop
					playsInline
					style={{
						objectFit: imageFit || 'cover',
						opacity: opacity / 100,
						mixBlendMode: mixBlendMode,
					}}
				>
					<source src={videoURL} type="video/mp4" />
				</video>
			) : imageURL ? (
				<img
					className={`wp-image-${imageID}`}
					src={imageURL}
					alt={alt}
					title={title}
					style={{
						objectFit: imageFit,
						objectPosition: object_position,
						opacity: opacity / 100,
						mixBlendMode: mixBlendMode,
					}}
				/>
			) : null}
		</div>
	);
}
