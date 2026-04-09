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
import { useBlockProps, InnerBlocks, InspectorControls, BlockVerticalAlignmentToolbar, BlockControls, __experimentalBorderRadiusControl as BorderRadiusControl } from '@wordpress/block-editor';
import ImageBlockControl from '../../components/ImageBlockControl';
import { PanelBody, ToggleControl, SelectControl, TextControl, RangeControl, TextareaControl, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption, Icon, __experimentalToolsPanel as ToolsPanel, __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { aspectRatio as aspectRatioIcon, image as imageIcon } from '@wordpress/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url) {
	if (!url) return null;
	
	// Updated regex to handle youtube.com/shorts/, watch?v=, embed/, and youtu.be/ URLs
	const regex = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
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
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
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


	const blockProps = useBlockProps({
		className: 'mc-flex' + (mediaType ? ' mc-media-' + mediaType : '') + (verticalAlignment ? ` is-vertically-aligned-${verticalAlignment}` : ''),
		style: {
			'--mediaSide': mediaSide,
			'--mediaStack': mediaStack,
			'--imageFit': imageFit,
			'--aspect': getEffectiveAspectRatio(),
			'--itaGap': gap || '0px',
			'--max-width': maxWidth + 'px',
			'--imageAspect': imageAspectRatio !== 'auto' ? imageAspectRatio : 'auto',
			'--imageMaxHeight': verticalAlignment === 'stretch' ? '100%' : imageMaxHeight + 'px',
			'--mediaBorderRadius': typeof mediaBorderRadius === 'object' 
				? `${mediaBorderRadius.topLeft || '0px'} ${mediaBorderRadius.topRight || '0px'} ${mediaBorderRadius.bottomRight || '0px'} ${mediaBorderRadius.bottomLeft || '0px'}`
				: (mediaBorderRadius || '0px')
		}
	});

	const template = [
		['core/heading', {
			level: 2,
			fontSize: 'm-large',
			placeholder: __('Heading (h2)', 'media-and-content')
		}],
		['core/paragraph', {
			placeholder: __('Lorem ipsum dolor sit amet consectetur. Tincidunt vel ornare duis ac posuere sed tempus leo viverra. Donec integer in in justo felis. Tristique in massa ut ut aliquet quisque aliquet urna. Arcu feugiat odio duis diam faucibus massa. Pulvinar donec in massa tincidunt tellus. Diam nec iaculis ut cras ornare. Neque semper et vestibulum quis hendrerit vulputate. Cum porta arcu fermentum maecenas. Quis nulla pretium convallis egestas pellentesque fusce scelerisque.', 'media-and-content')
		}],
	];

	return (
		<>
		<InspectorControls>
			<PanelBody title={ __( 'Media Settings', 'media-and-content' ) }>
				<ToggleGroupControl
					__next40pxDefaultSize
					isBlock
					label={ __( 'Media Type', 'media-and-content' ) }
					value={ mediaType }
					onChange={ ( value ) => setAttributes( { mediaType: value } ) }
				>
					<ToggleGroupControlOption value="image" label={ __( 'Image', 'media-and-content' ) } />
					<ToggleGroupControlOption value="video" label={ __( 'Video', 'media-and-content' ) } />
					<ToggleGroupControlOption value="custom" label={ __( 'Custom', 'media-and-content' ) } />
				</ToggleGroupControl>
				<ToggleGroupControl
					__next40pxDefaultSize
					isBlock
					label={ __( 'Media Side', 'media-and-content' ) }
					value={ mediaSide }
					onChange={ ( value ) => setAttributes( { mediaSide: value } ) }
				>
					<ToggleGroupControlOption value="row" label={ __( 'Left', 'media-and-content' ) } />
					<ToggleGroupControlOption value="row-reverse" label={ __( 'Right', 'media-and-content' ) } />
				</ToggleGroupControl>
				{mediaType === 'image' && (
					<>
						<ToggleGroupControl
							label={ __( 'Image Fit', 'media-and-content' ) }
							__next40pxDefaultSize
							isBlock
							value={ imageFit }
							onChange={ ( value ) => setAttributes( { imageFit: value } ) }
						>
							<ToggleGroupControlOption value="cover" label={ __( 'Cover', 'media-and-content' ) } />
							<ToggleGroupControlOption value="contain" label={ __( 'Contain', 'media-and-content' ) } />
						</ToggleGroupControl>
						<SelectControl
							label={
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<Icon icon={aspectRatioIcon} />
									<span>{ __( 'Image Aspect Ratio', 'media-and-content' ) }</span>
								</div>
							}
							value={ imageAspectRatio }
							__next40pxDefaultSize
							options={ [
								{ label: 'Auto', value: 'auto' },
								{ label: '16:9', value: '16/9' },
								{ label: '4:3', value: '4/3' },
								{ label: '1:1', value: '1/1' },
								{ label: '3:4', value: '3/4' },
								{ label: '9:16', value: '9/16' },
								{ label: '21:9', value: '21/9' }
							] }
							onChange={ ( value ) => setAttributes( { imageAspectRatio: value } ) }
						/>
					</>
				)}
				{mediaType === 'video' && (
					<>
						<TextControl
							label={ __( 'Video URL', 'media-and-content' ) }
							value={ videoURL }
							onChange={ ( value ) => setAttributes( { videoURL: value } ) }
							help={ __( 'Enter a YouTube URL or direct video link (.mp4, .webm, etc.)', 'media-and-content' ) }
						/>
						<SelectControl
							label={
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<Icon icon={aspectRatioIcon} />
									<span>{ __( 'Aspect Ratio', 'media-and-content' ) }</span>
								</div>
							}
							value={ aspectRatio }
							options={ [
								{ label: '16:9', value: '16/9' },
								{ label: '4:3', value: '4/3' },
								{ label: '1:1', value: '1/1' },
								{ label: '9:16', value: '9/16' },
								{ label: '21:9', value: '21/9' },
								{ label: 'Custom', value: 'custom' }
							] }
							onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
						/>
						{aspectRatio === 'custom' && (
							<TextControl
								label={ __( 'Custom Aspect Ratio', 'media-and-content' ) }
								value={ customAspectRatio }
								onChange={ ( value ) => setAttributes( { customAspectRatio: value } ) }
								help={ __( 'Enter aspect ratio (e.g., 2/1, 3/2, 5/4)', 'media-and-content' ) }
								placeholder="16/9"
							/>
						)}
						<RangeControl
							label={ __( 'Max Width (px)', 'media-and-content' ) }
							value={ maxWidth }
							onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
							min={ 300 }
							max={ 1200 }
							step={ 50 }
						/>
						{videoURL && (
							<>
								<ToggleControl
									label={ __( 'Autoplay Video', 'media-and-content' ) }
									checked={ videoAutoplay }
									onChange={ ( value ) => setAttributes( { videoAutoplay: value } ) }
								/>
								{isYouTubeUrl(videoURL) && (
									<ToggleControl
										label={ __( 'Load Facade', 'media-and-content' ) }
										checked={ loadFacade && !videoAutoplay }
										disabled={ videoAutoplay }
										onChange={ ( value ) => setAttributes( { loadFacade: value } ) }
										help={ videoAutoplay ? __( 'Facade is disabled when autoplay is enabled', 'media-and-content' ) : __( 'Show thumbnail with play button instead of full embed for better performance (YouTube only)', 'media-and-content' ) }
									/>
								)}
							</>
						)}
					</>
				)}
				{mediaType === 'custom' && (
					<>
						<TextareaControl
							label={ __( 'Custom Iframe Code', 'media-and-content' ) }
							value={ customIframe }
							onChange={ ( value ) => setAttributes( { customIframe: value } ) }
							help={ __( 'Paste your iframe code here (e.g., Google Maps, YouTube, etc.)', 'media-and-content' ) }
							rows={ 6 }
						/>
						<SelectControl
							label={
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<Icon icon={aspectRatioIcon} />
									<span>{ __( 'Aspect Ratio', 'media-and-content' ) }</span>
								</div>
							}
							value={ aspectRatio }
							options={ [
								{ label: '16:9', value: '16/9' },
								{ label: '4:3', value: '4/3' },
								{ label: '1:1', value: '1/1' },
								{ label: '9:16', value: '9/16' },
								{ label: '21:9', value: '21/9' },
								{ label: 'Custom', value: 'custom' }
							] }
							onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
						/>
						{aspectRatio === 'custom' && (
							<TextControl
								label={ __( 'Custom Aspect Ratio', 'media-and-content' ) }
								value={ customAspectRatio }
								onChange={ ( value ) => setAttributes( { customAspectRatio: value } ) }
								help={ __( 'Enter aspect ratio (e.g., 2/1, 3/2, 5/4)', 'media-and-content' ) }
								placeholder="16/9"
							/>
						)}
						<RangeControl
							label={ __( 'Max Width (px)', 'media-and-content' ) }
							value={ maxWidth }
							onChange={ ( value ) => setAttributes( { maxWidth: value } ) }
							min={ 300 }
							max={ 1500 }
							step={ 50 }
						/>
					</>
				)}
			</PanelBody>
			<ToolsPanel
				label={ __( 'Additional Settings', 'media-and-content' ) }
				resetAll={ () => setAttributes( { imageMaxHeight: 500, enableLightbox: false, mediaStack: 'column', gap: '40px', mediaBorderRadius: { topLeft: '0px', topRight: '0px', bottomLeft: '0px', bottomRight: '0px' } } ) }
			>
				{ mediaType === 'image' && verticalAlignment !== 'stretch' && (
					<ToolsPanelItem
						hasValue={ () => imageMaxHeight !== 500 }
						label={ __( 'Image Max Height', 'media-and-content' ) }
						onDeselect={ () => setAttributes( { imageMaxHeight: 500 } ) }
						isShownByDefault={ false }
					>
						<RangeControl
							label={ __( 'Image Max Height (px)', 'media-and-content' ) }
							value={ imageMaxHeight }
							onChange={ ( value ) => setAttributes( { imageMaxHeight: value } ) }
							min={ 200 }
							max={ 1200 }
							step={ 50 }
						/>
					</ToolsPanelItem>
				) }
				{ mediaType === 'image' && (
					<ToolsPanelItem
						hasValue={ () => enableLightbox !== false }
						label={ __( 'Enable Lightbox', 'media-and-content' ) }
						onDeselect={ () => setAttributes( { enableLightbox: false } ) }
						isShownByDefault={ false }
					>
						<ToggleControl
							label={ __( 'Enable Lightbox', 'media-and-content' ) }
							checked={ enableLightbox }
							onChange={ ( value ) => setAttributes( { enableLightbox: value } ) }
						/>
					</ToolsPanelItem>
				) }
				<ToolsPanelItem
					hasValue={ () => mediaStack !== 'column' }
					label={ __( 'Stack Media on Bottom', 'media-and-content' ) }
					onDeselect={ () => setAttributes( { mediaStack: 'column' } ) }
					isShownByDefault={ false }
				>
					<ToggleControl
						label={ __( 'Stack Media on Bottom', 'media-and-content' ) }
						checked={ mediaStack === 'column-reverse' }
						onChange={ ( value ) => setAttributes( { mediaStack: value ? 'column-reverse' : 'column' } ) }
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => gap !== '40px' }
					label={ __( 'Gap', 'media-and-content' ) }
					onDeselect={ () => setAttributes( { gap: '40px' } ) }
					isShownByDefault={ false }
				>
					<UnitControl
						label={ __( 'Gap', 'media-and-content' ) }
						__next40pxDefaultSize
						value={ gap }
						onChange={ ( value ) => setAttributes( { gap: value } ) }
						size="__unstable-large"
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'em', label: 'em' },
							{ value: 'rem', label: 'rem' },
							{ value: '%', label: '%' }
						] }
					/>
				</ToolsPanelItem>
				<ToolsPanelItem
					hasValue={ () => {
						const r = mediaBorderRadius;
						return r && ( r.topLeft !== '0px' || r.topRight !== '0px' || r.bottomLeft !== '0px' || r.bottomRight !== '0px' );
					} }
					label={ __( 'Media Border Radius', 'media-and-content' ) }
					onDeselect={ () => setAttributes( { mediaBorderRadius: { topLeft: '0px', topRight: '0px', bottomLeft: '0px', bottomRight: '0px' } } ) }
					isShownByDefault={ false }
				>
					<BorderRadiusControl
						label={ __( 'Media Border Radius', 'media-and-content' ) }
						values={ mediaBorderRadius }
						onChange={ ( value ) => setAttributes( { mediaBorderRadius: value } ) }
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
		<BlockControls>
                <BlockVerticalAlignmentToolbar
                    value={verticalAlignment}
                    onChange={(newAlignment) => setAttributes({ verticalAlignment: newAlignment })}
					controls={['top', 'center', 'bottom', 'stretch']}
                />
            </BlockControls>

		<div { ...blockProps }>
			<div className="mc-media">
				{ mediaType === 'image' && (
					<ImageBlockControl attributes={attributes} setAttributes={setAttributes} />
				) }
				{ mediaType === 'video' && (
					<div className="mc-video-container">
						{ videoURL ? (
							(() => {
								if (isYouTubeUrl(videoURL)) {
									// Handle YouTube URLs
									const videoId = extractYouTubeId(videoURL);
									if (videoId) {
										const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
									return (
										<div 
											className="mc-video-preview"
											style={{
												aspectRatio: getEffectiveAspectRatio(),
												maxWidth: maxWidth + 'px'
											}}
										>
											<img 
												src={thumbnailUrl} 
												alt="YouTube video thumbnail"
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover'
												}}
											/>
											<div className="mc-video-overlay">
												<div className="mc-video-play-button">
													<svg width="68" height="48" viewBox="0 0 68 48">
														<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
														<path d="M 45,24 27,14 27,34" fill="#fff"></path>
													</svg>
												</div>
												<div className="mc-video-label">
													{ __( 'YouTube Video Preview', 'media-and-content' ) }
												</div>
											</div>
										</div>
									);
									} else {
										return (
											<div className="mc-video-error">
												<p style={{ color: 'red' }}>⚠️ Invalid YouTube URL provided.</p>
											</div>
										);
									}
								} else if (isDirectVideoUrl(videoURL)) {
									// Handle direct video URLs
									return (
										<div 
											className="mc-video-preview mc-direct-video"
											style={{
												aspectRatio: getEffectiveAspectRatio(),
												maxWidth: maxWidth + 'px'
											}}
										>
											<video 
												src={videoURL}
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover'
												}}
												controls
												preload="metadata"
											/>
											<div className="mc-video-overlay">
												<div className="mc-video-label">
													{ __( 'Direct Video Preview', 'media-and-content' ) }
												</div>
											</div>
										</div>
									);
								} else {
									return (
										<div className="mc-video-error">
											<p style={{ color: 'red' }}>⚠️ Invalid video URL. Please provide a YouTube URL or direct video link.</p>
										</div>
									);
								}
							})()
						) : (
							<div className="mc-video-placeholder">
								<p>{ __( 'Enter a video URL in the settings to display the video.', 'media-and-content' ) }</p>
							</div>
						) }
					</div>
				) }
				{ mediaType === 'custom' && (
					<div className="mc-custom-iframe">
						{ customIframe ? (
							<div 
								style={{
									aspectRatio: getEffectiveAspectRatio(),
									maxWidth: maxWidth + 'px'
								}}
								dangerouslySetInnerHTML={{ __html: customIframe }} 
							/>
						) : (
							<div 
								className="mc-custom-placeholder"
								style={{
									aspectRatio: getEffectiveAspectRatio(),
									maxWidth: maxWidth + 'px'
								}}
							>
								<p>{ __( 'Enter your custom iframe code in the settings to display content.', 'media-and-content' ) }</p>
							</div>
						) }
					</div>
				) }
			</div>

			<div className="mc-content">
				<InnerBlocks template={template} templateLock={false} />
			</div>
		</div>
		</>
	);
}
