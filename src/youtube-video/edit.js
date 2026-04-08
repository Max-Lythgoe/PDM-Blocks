/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InspectorControls 
} from '@wordpress/block-editor';

import {
	PanelBody,
	TextControl,
	SelectControl,
	RangeControl,
	ToggleControl,
	Placeholder
} from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

// Helper function to check if URL is a YouTube URL
function isYouTubeUrl(url) {
	if (!url) return false;
	return /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i.test(url);
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
	if (!url) return null;
	// Updated regex to handle youtube.com/shorts/, watch?v=, embed/, and youtu.be/ URLs
	const regex = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
	const matches = url.match(regex);
	return matches ? matches[1] : null;
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
// Probe a YouTube thumbnail URL and resolve with the URL if the image is real (>120px wide)
// maxresdefault/sddefault return a 120x90 grey placeholder when unavailable, not a 404
function probeThumbnail(url) {
	return new Promise((resolve) => {
		const img = new window.Image();
		img.onload = () => resolve(img.naturalWidth > 120 ? url : null);
		img.onerror = () => resolve(null);
		img.src = url;
	});
}

async function getBestThumbnailUrl(videoId) {
	const sizes = ['maxresdefault', 'sddefault', 'hqdefault'];
	for (const size of sizes) {
		const url = `https://img.youtube.com/vi/${videoId}/${size}.jpg`;
		const result = await probeThumbnail(url);
		if (result) return result;
	}
	// hqdefault (480x360) is virtually always present; use as hard fallback
	return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export default function Edit({ attributes, setAttributes }) {
	const { 
		videoURL, 
		aspectRatio, 
		customAspectRatio, 
		videoAutoplay, 
		maxWidth,
		useFullWidth,
		enableLightbox,
		loadFacade
	} = attributes;

	const [thumbnailUrl, setThumbnailUrl] = useState(attributes.thumbnailUrl || '');

	// When videoURL changes, probe for the best available thumbnail and persist it
	useEffect(() => {
		if (!videoURL || !isYouTubeUrl(videoURL)) {
			setThumbnailUrl('');
			return;
		}
		const videoId = extractYouTubeId(videoURL);
		if (!videoId) return;

		let cancelled = false;
		getBestThumbnailUrl(videoId).then((url) => {
			if (!cancelled) {
				setThumbnailUrl(url);
				setAttributes({ thumbnailUrl: url });
			}
		});
		return () => { cancelled = true; };
	}, [videoURL]);

	// Get the effective aspect ratio
	const effectiveAspectRatio = aspectRatio === 'custom' && customAspectRatio 
		? customAspectRatio 
		: aspectRatio;

	const blockProps = useBlockProps({
		className: 'youtube-video-block',
		style: {
			maxWidth: useFullWidth ? '100%' : (maxWidth ? `${maxWidth}px` : '100%'),
			aspectRatio: effectiveAspectRatio
		}
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Video Settings', 'youtube-video')} initialOpen={true}>
					<TextControl
						label={__('YouTube URL', 'youtube-video')}
						value={videoURL}
						onChange={(value) => setAttributes({ videoURL: value })}
						placeholder={__('Enter YouTube video URL...', 'youtube-video')}
						help={__('Paste any YouTube URL (youtube.com, youtu.be, etc.)', 'youtube-video')}
					/>

					<SelectControl
						label={__('Aspect Ratio', 'youtube-video')}
						value={aspectRatio}
						options={[
							{ label: __('16:9 (Widescreen)', 'youtube-video'), value: '16/9' },
							{ label: __('4:3 (Standard)', 'youtube-video'), value: '4/3' },
							{ label: __('1:1 (Square)', 'youtube-video'), value: '1/1' },
							{ label: __('21:9 (Ultra-wide)', 'youtube-video'), value: '21/9' },
							{ label: __('9:16 (Vertical)', 'youtube-video'), value: '9/16' },
							{ label: __('Custom', 'youtube-video'), value: 'custom' }
						]}
						onChange={(value) => setAttributes({ aspectRatio: value })}
					/>

					{aspectRatio === 'custom' && (
						<TextControl
							label={__('Custom Aspect Ratio', 'youtube-video')}
							value={customAspectRatio}
							onChange={(value) => setAttributes({ customAspectRatio: value })}
							placeholder={__('e.g., 3/2 or 2.5/1', 'youtube-video')}
							help={__('Enter aspect ratio as width/height (e.g., 3/2)', 'youtube-video')}
						/>
					)}

					<ToggleControl
						label={__('Use Full Width', 'youtube-video')}
						checked={useFullWidth}
						onChange={(value) => setAttributes({ useFullWidth: value })}
						help={__('Expand video to full container width', 'youtube-video')}
					/>

					{!useFullWidth && (
						<RangeControl
							label={__('Max Width (px)', 'youtube-video')}
							value={maxWidth}
							onChange={(value) => setAttributes({ maxWidth: value })}
							min={200}
							max={2000}
							step={50}
							help={__('Maximum width of the video player', 'youtube-video')}
						/>
					)}

					<ToggleControl
						label={__('Autoplay Video', 'youtube-video')}
						checked={videoAutoplay}
						onChange={(value) => setAttributes({ videoAutoplay: value })}
						help={__('Video will autoplay when page loads (muted for browser compatibility)', 'youtube-video')}
					/>

					<ToggleControl
						label={__('Enable Lightbox', 'youtube-video')}
						checked={enableLightbox}
						onChange={(value) => setAttributes({ enableLightbox: value })}
						help={__('Open video in fullscreen lightbox when clicked', 'youtube-video')}
					/>

					<ToggleControl
						label={__('Load Facade', 'youtube-video')}
						checked={loadFacade && !videoAutoplay}
						disabled={videoAutoplay}
						onChange={(value) => setAttributes({ loadFacade: value })}
						help={videoAutoplay ? __('Facade is disabled when autoplay is enabled', 'youtube-video') : __('Show thumbnail with play button instead of full embed for better performance', 'youtube-video')}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!videoURL ? (
					<Placeholder
						icon="video-alt3"
						label={__('YouTube Video', 'youtube-video')}
						instructions={__('Enter a YouTube URL in the block settings to get started.', 'youtube-video')}
						className="youtube-video-placeholder"
					/>
				) : !isYouTubeUrl(videoURL) ? (
					<Placeholder
						icon="warning"
						label={__('Invalid YouTube URL', 'youtube-video')}
						instructions={__('Please enter a valid YouTube URL (youtube.com, youtu.be, etc.)', 'youtube-video')}
						className="youtube-video-placeholder youtube-video-placeholder--error"
					/>
				) : (
					<div className="youtube-video-container">{thumbnailUrl ? (
							<div className="youtube-video-preview">
								<img 
									src={thumbnailUrl} 
									alt={__('YouTube video thumbnail', 'youtube-video')}
									className="youtube-thumbnail"
								/>
								<div className="youtube-play-button">
									<svg width="68" height="48" viewBox="0 0 68 48">
										<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#FF0000"/>
										<path d="M 45,24 27,14 27,34" fill="white"/>
									</svg>
								</div>
								<div className="youtube-video-info">
									<div className="video-settings">
										<span>Aspect: {effectiveAspectRatio}</span>
										<span>{useFullWidth ? 'Full Width' : `Max Width: ${maxWidth}px`}</span>
										{videoAutoplay && <span>Autoplay: On</span>}
										{enableLightbox && <span>Lightbox: On</span>}
										{loadFacade && !videoAutoplay && <span>Facade: On</span>}
									</div>
								</div>
							</div>
						) : (
							<div className="youtube-video-loading">
								{__('Loading video preview...', 'youtube-video')}
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}
