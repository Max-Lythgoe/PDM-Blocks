import { InspectorControls, BlockControls, URLPopover } from '@wordpress/block-editor';
import { TextControl, FocalPointPicker, PanelBody, RangeControl, SelectControl, ToolbarDropdownMenu, ToolbarButton } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useRef } from '@wordpress/element';
import { video as videoIcon, image } from '@wordpress/icons';

import "./image-block-control.css";

export default function BackgroundMediaEdit({ attributes, setAttributes }) {
    const { imageID, imageURL, customAlt, customTitle, focalPoint, defaultAlt, defaultTitle, opacity, mixBlendMode, imageFit, videoURL, useFeaturedImage } = attributes;
    const [isVideoPopoverOpen, setIsVideoPopoverOpen] = useState(false);
    const videoButtonRef = useRef();

    // Retrieve the featured image URL and ID
    const featuredImage = useSelect((select) => {
        const postId = select('core/editor')?.getCurrentPostId();
        const postType = select('core/editor')?.getCurrentPostType();
        const featuredImageId = select('core/editor')?.getEditedPostAttribute('featured_media');
        const media = featuredImageId
            ? select('core')?.getMedia(featuredImageId)
            : null;

        return media ? { url: media.source_url, id: media.id } : null;
    }, []);

    // When useFeaturedImage is true and featuredImage exists, update imageURL
    if (useFeaturedImage && featuredImage && imageURL !== featuredImage.url) {
        setAttributes({
            imageURL: featuredImage.url,
            imageID: featuredImage.id,
        });
    }

    return (
        <>
            <BlockControls>
                <ToolbarDropdownMenu
                    icon={useFeaturedImage ? "star-filled" : image}
                    label={useFeaturedImage ? "Featured Image Selected" : "Image Options"}
                    controls={[
                        {
                            title: 'Select Image',
                            icon: !useFeaturedImage && imageURL ? 'saved' : undefined,
                            onClick: () => {
                                const mediaUpload = wp.media({
                                    title: 'Select Media',
                                    button: {
                                        text: 'Use this media',
                                    },
                                    multiple: false,
                                });

                                mediaUpload.on('select', () => {
                                    const attachment = mediaUpload.state().get('selection').first().toJSON();
                                    setAttributes({
                                        useFeaturedImage: false,
                                        imageURL: attachment.url,
                                        imageID: attachment.id,
                                        customAlt: '',
                                        customTitle: '',
                                        defaultAlt: attachment.alt || '',
                                        defaultTitle: attachment.title || '',
                                        focalPoint: { x: 0.5, y: 0.5 },
                                        videoURL: '', 
                                    });
                                });

                                mediaUpload.open();
                            },
                        },
                        {
                            title: 'Use Featured Image',
                            icon: useFeaturedImage ? 'saved' : undefined,
                            onClick: () => {
                                setAttributes({
                                    useFeaturedImage: true,
                                    imageURL: featuredImage?.url || '',
                                    imageID: featuredImage?.id || null,
                                    customAlt: '',
                                    customTitle: '',
                                    defaultAlt: featuredImage?.alt || '',
                                    defaultTitle: featuredImage?.title || '',
                                    focalPoint: { x: 0.5, y: 0.5 },
                                    videoURL: '', 
                                });
                            },
                        },
                        {
                            title: 'Remove Image',
                            onClick: () => {
                                setAttributes({
                                    useFeaturedImage: false,
                                    imageURL: '',
                                    imageID: null,
                                    customAlt: '',
                                    customTitle: '',
                                    defaultAlt: '',
                                    defaultTitle: '',
                                    focalPoint: { x: 0.5, y: 0.5 },
                                });
                            },
                        },
                    ]}
                />
                <ToolbarButton
                    ref={videoButtonRef}
                    icon={videoIcon}
                    label="Background Video"
                    onClick={() => setIsVideoPopoverOpen(!isVideoPopoverOpen)}
                    isPressed={!!videoURL}
                />
                {isVideoPopoverOpen && (
                    <URLPopover
                        anchor={videoButtonRef.current}
                        onClose={() => setIsVideoPopoverOpen(false)}
                    >
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                setIsVideoPopoverOpen(false);
                            }}
                            style={{ padding: '16px', minWidth: '300px' }}
                        >
                            <TextControl
                                label="Video URL"
                                value={videoURL || ''}
                                onChange={(value) => {
                                    setAttributes({ 
                                        videoURL: value,
                                        imageURL: value ? '' : imageURL,
                                        imageID: value ? null : imageID,
                                    });
                                }}
                                placeholder="https://example.com/video.mp4"
                                autoFocus
                            />
                            {videoURL && (
                                <button
                                    type="button"
                                    className="components-button is-secondary"
                                    onClick={() => {
                                        setAttributes({ videoURL: '' });
                                        setIsVideoPopoverOpen(false);
                                    }}
                                    style={{ marginTop: '8px' }}
                                >
                                    Remove Video
                                </button>
                            )}
                        </form>
                    </URLPopover>
                )}
            </BlockControls>

            {!!imageID && !!imageURL && (
                <InspectorControls>
                    <PanelBody title="Image Settings" initialOpen={false}>
                        <FocalPointPicker
                            url={imageURL}
                            value={focalPoint}
                            onChange={(fp) => setAttributes({ focalPoint: fp })}
                            label="Image Focal Point"
                            help="Choose the most important part of the image. Used for cropping."
                        />
                        <TextControl
                            label="Alt Text"
                            value={customAlt}
                            onChange={(newAlt) => setAttributes({ customAlt: newAlt })}
                            help="Describe the image for accessibility and SEO."
                        />
                        <TextControl
                            label="Title Text"
                            value={customTitle}
                            onChange={(newTitle) => setAttributes({ customTitle: newTitle })}
                            help="Image title text for SEO."
                        />
                    </PanelBody>
                </InspectorControls>
            )}

            {(!!imageURL || !!videoURL) && (
                <InspectorControls>
                    <PanelBody title="Background Settings" initialOpen={false}>
                        <RangeControl
                            label="Opacity (%)"
                            value={opacity}
                            onChange={(value) => setAttributes({ opacity: value })}
                            min={0}
                            max={100}
                            step={5}
                        />
                        <SelectControl
                            label="Mix Blend Mode"
                            value={mixBlendMode}
                            options={[
                                { label: 'Normal', value: 'normal' },
                                { label: 'Multiply', value: 'multiply' },
                                { label: 'Screen', value: 'screen' },
                            ]}
                            onChange={(value) => setAttributes({ mixBlendMode: value })}
                        />
                        <SelectControl
                            label={videoURL ? "Video Fit" : "Image Fit"}
                            value={imageFit}
                            options={[
                                { label: 'Cover', value: 'cover' },
                                { label: 'Contain', value: 'contain' },
                                { label: 'Fill', value: 'fill' },
                            ]}
                            onChange={(value) => setAttributes({ imageFit: value })}
                        />
                    </PanelBody>
                </InspectorControls>
            )}

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
                ) : (
                    !!imageID && !!imageURL && (
                        <img
                            className={`wp-image-${imageID}`}
                            src={imageURL}
                            alt={customAlt || defaultAlt || ''}
                            title={customTitle || defaultTitle || ''}
                            style={{
                                objectFit: imageFit || 'cover',
                                objectPosition: focalPoint
                                    ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
                                    : '50% 50%',
                                opacity: opacity / 100,
                                mixBlendMode: mixBlendMode,
                            }}
                        />
                    )
                )}
            </div>
        </>
    );
}
