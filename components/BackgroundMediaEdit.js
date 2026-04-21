import { InspectorControls, BlockControls, URLPopover, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, FocalPointPicker, PanelBody, RangeControl, SelectControl, ToolbarDropdownMenu, ToolbarButton, Popover, Button, __experimentalHStack as HStack, FlexBlock, __experimentalTruncate as Truncate, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useRef } from '@wordpress/element';
import { video as videoIcon, image, trash, postFeaturedImage } from '@wordpress/icons';

import "./image-block-control.css";

// flyout close
let pdmCloseFlyout = null;

function getFilename( url ) {
    if ( ! url ) return '';
    return decodeURIComponent( url.split( '/' ).pop().split( '?' )[ 0 ] );
}

export default function BackgroundMediaEdit({ attributes, setAttributes }) {
    const { imageID, imageURL, customAlt, customTitle, focalPoint, defaultAlt, defaultTitle, opacity, mixBlendMode, imageFit, videoURL, useFeaturedImage } = attributes;
    const [isVideoPopoverOpen, setIsVideoPopoverOpen] = useState(false);
    const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
    const imageButtonRef = useRef();
    const videoButtonRef = useRef();
    const imgLabel = getFilename(imageURL);

    // featured image id
    const featuredImage = useSelect((select) => {
        const postId = select('core/editor')?.getCurrentPostId();
        const postType = select('core/editor')?.getCurrentPostType();
        const featuredImageId = select('core/editor')?.getEditedPostAttribute('featured_media');
        const media = featuredImageId
            ? select('core')?.getMedia(featuredImageId)
            : null;

        return media ? { url: media.source_url, id: media.id } : null;
    }, []);

    // featured iamge udpate url
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
                    icon={useFeaturedImage ? postFeaturedImage : image}
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

            <InspectorControls>
                    <PanelBody title="Background Image" initialOpen={false}>
                        {!videoURL && (
                            <div className="block-library-utils__media-control">
                                <button
                                    ref={imageButtonRef}
                                    type="button"
                                    className="components-button is-next-40px-default-size"
                                    aria-expanded={isImagePopoverOpen}
                                    aria-haspopup="true"
                                    style={{ marginBottom: '16px' }}
                                    onClick={() => {
                                        if (imageID && imageURL) {
                                            if (isImagePopoverOpen) {
                                                setIsImagePopoverOpen(false);
                                                pdmCloseFlyout = null;
                                            } else {
                                                if (pdmCloseFlyout) pdmCloseFlyout();
                                                pdmCloseFlyout = () => setIsImagePopoverOpen(false);
                                                setIsImagePopoverOpen(true);
                                            }
                                        } else {
                                            const picker = wp.media({
                                                title: 'Select Image',
                                                button: { text: 'Use this image' },
                                                multiple: false,
                                            });
                                            picker.on('select', () => {
                                                const media = picker.state().get('selection').first().toJSON();
                                                setAttributes({
                                                    useFeaturedImage: false,
                                                    imageURL: media.url,
                                                    imageID: media.id,
                                                    customAlt: '',
                                                    customTitle: '',
                                                    defaultAlt: media.alt || '',
                                                    defaultTitle: media.title || '',
                                                    focalPoint: { x: 0.5, y: 0.5 },
                                                    videoURL: '',
                                                });
                                            });
                                            picker.open();
                                        }
                                    }}
                                >
                                    <HStack>
                                        {imageURL && (
                                            <span
                                                className="block-library-utils__media-control__inspector-image-indicator"
                                                style={{ backgroundImage: `url(${imageURL})` }}
                                            />
                                        )}
                                        <FlexBlock>
                                            <Truncate numberOfLines={1} className="block-library-utils__media-control__inspector-media-replace-title">
                                                {imgLabel || 'Add image'}
                                            </Truncate>
                                        </FlexBlock>
                                    </HStack>
                                </button>
                                {isImagePopoverOpen && !!imageID && !!imageURL && (
                                    <Popover
                                        anchor={imageButtonRef.current}
                                        placement="left-start"
                                        offset={36}
                                        shift={true}
                                        onClose={() => { setIsImagePopoverOpen(false); pdmCloseFlyout = null; }}
                                        focusOnMount={false}
                                        className="block-editor-global-styles-background-panel__popover"
                                    >
                                        <div className="pdm-media-flyout-content">
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                                                <MediaUploadCheck>
                                                    <Button
                                                        icon={image}
                                                        label="Replace Image"
                                                        variant="secondary"
                                                        size="compact"
                                                        showTooltip
                                                        style={{ flex: 1, justifyContent: 'center' }}
                                                        onClick={() => {
                                                            const picker = wp.media({
                                                                title: 'Select Image',
                                                                button: { text: 'Use this image' },
                                                                multiple: false,
                                                            });
                                                            picker.on('select', () => {
                                                                const media = picker.state().get('selection').first().toJSON();
                                                                setAttributes({
                                                                    useFeaturedImage: false,
                                                                    imageURL: media.url,
                                                                    imageID: media.id,
                                                                    customAlt: '',
                                                                    customTitle: '',
                                                                    defaultAlt: media.alt || '',
                                                                    defaultTitle: media.title || '',
                                                                    focalPoint: { x: 0.5, y: 0.5 },
                                                                    videoURL: '',
                                                                });
                                                                setIsImagePopoverOpen(false);
                                                            });
                                                            picker.open();
                                                        }}
                                                    />
                                                </MediaUploadCheck>
                                                {featuredImage && (
                                                    <Button
                                                        icon={postFeaturedImage}
                                                        label="Use Featured Image"
                                                        variant="secondary"
                                                        size="compact"
                                                        showTooltip
                                                        style={{ flex: 1, justifyContent: 'center' }}
                                                        onClick={() => {
                                                            setAttributes({
                                                                useFeaturedImage: true,
                                                                imageURL: featuredImage.url,
                                                                imageID: featuredImage.id,
                                                                customAlt: '',
                                                                customTitle: '',
                                                                defaultAlt: '',
                                                                defaultTitle: '',
                                                                focalPoint: { x: 0.5, y: 0.5 },
                                                                videoURL: '',
                                                            });
                                                            setIsImagePopoverOpen(false);
                                                        }}
                                                    />
                                                )}
                                                <Button
                                                    icon={trash}
                                                    label="Remove Image"
                                                    variant="secondary"
                                                    size="compact"
                                                    isDestructive
                                                    showTooltip
                                                    style={{ flex: 1, justifyContent: 'center' }}
                                                    onClick={() => {
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
                                                        setIsImagePopoverOpen(false);
                                                    }}
                                                />
                                            </div>
                                            <FocalPointPicker
                                                url={imageURL}
                                                value={focalPoint}
                                                onChange={(fp) => setAttributes({ focalPoint: fp })}
                                                label="Focal Point"
                                            />
                                            <TextControl
                                                label="Alt Text"
                                                value={customAlt}
                                                onChange={(newAlt) => setAttributes({ customAlt: newAlt })}
                                            />
                                            <TextControl
                                                label="Title Text"
                                                value={customTitle}
                                                onChange={(newTitle) => setAttributes({ customTitle: newTitle })}
                                            />
                                        </div>
                                    </Popover>
                                )}
                            </div>
                        )}
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
                        <ToggleGroupControl
                            label={videoURL ? 'Video Fit' : 'Image Fit'}
                            __next40pxDefaultSize
                            isBlock
                            value={imageFit || 'cover'}
                            onChange={(value) => setAttributes({ imageFit: value })}
                        >
                            <ToggleGroupControlOption value="cover" label="Cover" />
                            <ToggleGroupControlOption value="contain" label="Contain" />
                            <ToggleGroupControlOption value="fill" label="Fill" />
                        </ToggleGroupControl>
                    </PanelBody>
                </InspectorControls>

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
