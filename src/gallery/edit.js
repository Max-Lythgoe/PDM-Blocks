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
import { useBlockProps, InspectorControls, MediaUpload, MediaPlaceholder } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, Button, SelectControl, TextControl } from '@wordpress/components';

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

	const { columns, borderRadius, enableLightbox, enableMasonry, aspectRatio, customAspectRatio, images } = attributes;

	// Handle adding images from gallery
	const onSelectImages = (selectedImages) => {
		const newImages = selectedImages.map((image) => ({
			id: image.id,
			url: image.url,
			alt: image.alt || '',
			title: image.title || ''
		}));
		setAttributes({ images: newImages });
	};

	// Handle clearing all images
	const onClearGallery = () => {
		setAttributes({ images: [] });
	};

	// Helper function to get effective aspect ratio
	const getEffectiveAspectRatio = () => {
		return aspectRatio === 'custom' && customAspectRatio ? customAspectRatio : aspectRatio;
	};

	const style = {
        '--gallery-columns': columns,
        '--gallery-radius': borderRadius + 'px',
		'--gallery-aspect': enableMasonry ? 'auto' : getEffectiveAspectRatio(),
    };

    const blockProps = useBlockProps({
        style: style,
		className: enableMasonry ? 'is-masonry' : ''
    });

	return (
		<>
		<InspectorControls>
			<PanelBody title={ __( 'Gallery Settings', 'pdm-blocks' ) }>
				<RangeControl
					label={ __( 'Columns', 'pdm-blocks' ) }
					value={ columns }
					onChange={ ( value ) => setAttributes( { columns: value } ) }
					min={ 1 }
					max={ 6 }
				/>
				<RangeControl
					label={ __( 'Border Radius', 'pdm-blocks' ) }
					value={ borderRadius }
					onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
					min={ 0 }
					max={ 50 }
				/>
				<ToggleControl
					label={ __( 'Enable Masonry Layout', 'pdm-blocks' ) }
					help={ __( 'Creates a Pinterest-style layout with varying heights', 'pdm-blocks' ) }
					checked={ enableMasonry }
					onChange={ ( value ) => setAttributes( { enableMasonry: value } ) }
				/>
				{ ! enableMasonry && (
					<>
						<SelectControl
							label={ __( 'Aspect Ratio', 'pdm-blocks' ) }
							value={ aspectRatio }
							options={ [
								{ label: 'Square (1:1)', value: '1/1' },
								{ label: 'Portrait (3:4)', value: '3/4' },
								{ label: 'Landscape (4:3)', value: '4/3' },
								{ label: 'Wide (16:9)', value: '16/9' },
								{ label: 'Auto', value: 'auto' },
								{ label: 'Custom', value: 'custom' },
							] }
							onChange={ ( value ) => setAttributes( { aspectRatio: value } ) }
						/>
						{ aspectRatio === 'custom' && (
							<TextControl
								label={ __( 'Custom Aspect Ratio', 'pdm-blocks' ) }
								help={ __( 'Enter aspect ratio (e.g., 21/9, 2/3)', 'pdm-blocks' ) }
								value={ customAspectRatio }
								onChange={ ( value ) => setAttributes( { customAspectRatio: value } ) }
								placeholder="21/9"
							/>
						) }
					</>
				) }
				<ToggleControl
					label={ __( 'Enable Lightbox', 'pdm-blocks' ) }
					checked={ enableLightbox }
					onChange={ ( value ) => setAttributes( { enableLightbox: value } ) }
				/>
			</PanelBody>
		</InspectorControls>

		<div { ...blockProps }>
			{ images.length > 0 && (
				<div className="gallery-editor-controls" style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
					<MediaUpload
						onSelect={ onSelectImages }
						allowedTypes={ ['image'] }
						multiple={ true }
						gallery={ true }
						value={ images.map(img => img.id) }
						render={ ({ open }) => (
							<Button variant="primary" onClick={ open }>
								{ __( 'Edit Gallery', 'pdm-blocks' ) }
							</Button>
						) }
					/>
					<Button variant="secondary" isDestructive onClick={ onClearGallery }>
						{ __( 'Clear Gallery', 'pdm-blocks' ) }
					</Button>
				</div>
			) }
			
			{ images.length > 0 ? (
				<div className="gallery-grid">
					{ images.map((image, index) => (
						<div key={ image.id } className="gallery-item">
							<img src={ image.url } alt={ image.alt } />
						</div>
					)) }
				</div>
			) : (
				<MediaPlaceholder
					icon="format-gallery"
					labels={ {
						title: __( 'Gallery', 'pdm-blocks' ),
						instructions: __( 'Drag images, upload new ones or select files from your library.', 'pdm-blocks' )
					} }
					onSelect={ onSelectImages }
					accept="image/*"
					allowedTypes={ ['image'] }
					multiple
				/>
			) }
		</div>
		</>
	);
}
