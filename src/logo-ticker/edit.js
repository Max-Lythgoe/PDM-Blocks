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
import { useBlockProps, InspectorControls, BlockControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, RangeControl, Button, ToolbarButton, ToggleControl } from '@wordpress/components';
import { seen } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { logos, logoSize, speed, grayscale, pauseOnHover, showFade, isPreview } = attributes;

	// Handle adding images
	const onSelectImages = (selectedImages) => {
		const newLogos = selectedImages.map((image) => ({
			id: image.id,
			url: image.url,
			alt: image.alt || ''
		}));
		setAttributes({ logos: newLogos });
	};

	// Handle clearing all logos
	const onClearTicker = () => {
		setAttributes({ logos: [] });
	};

	const style = {
		'--logo-size': logoSize + 'px',
		'--ticker-speed': speed + 's',
	};

	const blockClasses = [];
	if (grayscale) blockClasses.push('is-grayscale');
	if (pauseOnHover) blockClasses.push('pause-on-hover');
	if (showFade) blockClasses.push('has-fade');

	const blockProps = useBlockProps({
		style: style,
		className: blockClasses.join(' ')
	});

	// Initialize ticker animation in preview mode
	useEffect(() => {
		if (isPreview && logos.length > 0) {
			const ticker = document.querySelector('.logo-ticker-preview .logo-ticker-track');
			if (ticker) {
				// Clone logos for seamless loop
				const clone = ticker.cloneNode(true);
				clone.setAttribute('aria-hidden', 'true');
				ticker.parentNode.appendChild(clone);
			}
		}
	}, [isPreview, logos, speed]);

	return (
		<>
			<BlockControls>
				<ToolbarButton
					icon={seen}
					label={isPreview ? 'Show Editor' : 'Show Preview'}
					isPressed={!!isPreview}
					onClick={() => setAttributes({ isPreview: !isPreview })}
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Ticker Settings', 'pdm-blocks' ) }>
					<RangeControl
						label={ __( 'Logo Size (px)', 'pdm-blocks' ) }
						help={ __( 'Set the height of logos in pixels', 'pdm-blocks' ) }
						value={ logoSize }
						onChange={ ( value ) => setAttributes( { logoSize: value } ) }
						min={ 40 }
						max={ 500 }
						step={ 10 }
					/>
					<RangeControl
						label={ __( 'Animation Speed (seconds)', 'pdm-blocks' ) }
						help={ __( 'Time for one complete scroll cycle', 'pdm-blocks' ) }
						value={ speed }
						onChange={ ( value ) => setAttributes( { speed: value } ) }
						min={ 10 }
						max={ 120 }
						step={ 5 }
					/>
					<ToggleControl
						label={ __( 'Grayscale Effect', 'pdm-blocks' ) }
						help={ __( 'Convert logos to black and white', 'pdm-blocks' ) }
						checked={ grayscale }
						onChange={ ( value ) => setAttributes( { grayscale: value } ) }
					/>
					<ToggleControl
						label={ __( 'Pause on Hover', 'pdm-blocks' ) }
						help={ __( 'Pause animation when hovering over ticker', 'pdm-blocks' ) }
						checked={ pauseOnHover }
						onChange={ ( value ) => setAttributes( { pauseOnHover: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Edge Fade', 'pdm-blocks' ) }
						help={ __( 'Add fade effect on edges for smooth appearance', 'pdm-blocks' ) }
						checked={ showFade }
						onChange={ ( value ) => setAttributes( { showFade: value } ) }
					/>
				</PanelBody>
			</InspectorControls>

			{isPreview ? (
				<div { ...blockProps }>
					{logos.length > 0 ? (
						<div className="logo-ticker-preview">
							<div className="logo-ticker-wrapper">
								<div className="logo-ticker-track">
									{/* Render logos 3 times for seamless infinite loop */}
									{[...Array(3)].map((_, setIndex) => (
										logos.map((logo, index) => (
											<div key={`${logo.id}-${setIndex}-${index}`} className="logo-ticker-item" aria-hidden={setIndex > 0 ? "true" : undefined}>
												<img src={logo.url} alt={logo.alt} />
											</div>
										))
									))}
								</div>
							</div>
						</div>
					) : (
						<p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>
							{ __( 'Add logos to see preview', 'pdm-blocks' ) }
						</p>
					)}
				</div>
			) : (
				<div { ...blockProps }>
					<div className="ticker-editor-controls" style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
						<MediaUpload
							onSelect={ onSelectImages }
							allowedTypes={ ['image'] }
							multiple={ true }
							gallery={ true }
							value={ logos.map(logo => logo.id) }
							render={ ({ open }) => (
								<Button variant="primary" onClick={ open }>
									{ __( 'Add to Ticker', 'pdm-blocks' ) }
								</Button>
							) }
						/>
						{ logos.length > 0 && (
							<Button variant="secondary" isDestructive onClick={ onClearTicker }>
								{ __( 'Clear Ticker', 'pdm-blocks' ) }
							</Button>
						) }
					</div>
					
					{ logos.length > 0 ? (
						<div className="ticker-logos-preview">
							{ logos.map((logo) => (
								<div key={ logo.id } className="ticker-logo-item">
									<img src={ logo.url } alt={ logo.alt } />
								</div>
							)) }
						</div>
					) : (
						<p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>
							{ __( 'Click "Add to Ticker" to select logos', 'pdm-blocks' ) }
						</p>
					) }
				</div>
			)}
		</>
	);
}
