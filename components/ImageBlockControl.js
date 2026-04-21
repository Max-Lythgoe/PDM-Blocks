import { MediaPlaceholder, MediaUpload, MediaUploadCheck, InspectorControls } from '@wordpress/block-editor';
import { TextControl, FocalPointPicker, PanelBody, Icon, Button, ToolbarGroup, ToolbarButton, Popover, __experimentalHStack as HStack, FlexBlock, __experimentalTruncate as Truncate } from '@wordpress/components';
import { useState, useRef } from '@wordpress/element';
import { trash, upload, image, starFilled } from '@wordpress/icons';

import "./image-block-control.css";

// flyout 
let pdmCloseFlyout = null;

function getFilename( url ) {
    if ( ! url ) return '';
    return decodeURIComponent( url.split( '/' ).pop().split( '?' )[ 0 ] );
}

export default function ImageBlockControl({ attributes, setAttributes }) {
    const { imageID, imageURL, customAlt, customTitle, focalPoint, defaultAlt, defaultTitle } = attributes;
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const imageButtonRef = useRef();
    const imgLabel = getFilename(imageURL);

    const onSelectImage = (selectedImage) => {
        setAttributes({
            imageURL: selectedImage.url,
            imageID: selectedImage.id,
            customAlt: '',
            customTitle: '',
            defaultAlt: selectedImage.alt || '',
            defaultTitle: selectedImage.title || '',
            focalPoint: { x: 0.5, y: 0.5 },
        });
    };

    const onRemoveImage = () => {
        setAttributes({
            imageURL: '',
            imageID: null,
            customAlt: '',
            customTitle: '',
            defaultAlt: '',
            defaultTitle: '',
            focalPoint: { x: 0.5, y: 0.5 },
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title="Image" initialOpen={true}>
                    <div className="block-library-utils__media-control">
                        <button
                            ref={imageButtonRef}
                            type="button"
                            className="components-button is-next-40px-default-size"
                            aria-expanded={isPopoverOpen}
                            aria-haspopup="true"
                            onClick={() => {
                                if (imageID && imageURL) {
                                    if (isPopoverOpen) {
                                        setIsPopoverOpen(false);
                                        pdmCloseFlyout = null;
                                    } else {
                                        if (pdmCloseFlyout) pdmCloseFlyout();
                                        pdmCloseFlyout = () => setIsPopoverOpen(false);
                                        setIsPopoverOpen(true);
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
                                            imageURL: media.url,
                                            imageID: media.id,
                                            customAlt: '',
                                            customTitle: '',
                                            defaultAlt: media.alt || '',
                                            defaultTitle: media.title || '',
                                            focalPoint: { x: 0.5, y: 0.5 },
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
                        {isPopoverOpen && !!imageID && !!imageURL && (
                            <Popover
                                anchor={imageButtonRef.current}
                                placement="left-start"
                                offset={36}
                                shift={true}
                                onClose={() => { setIsPopoverOpen(false); pdmCloseFlyout = null; }}
                                focusOnMount={false}
                                className="block-editor-global-styles-background-panel__popover"
                            >
                                <div className="pdm-media-flyout-content">
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
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
                                                        imageURL: media.url,
                                                        imageID: media.id,
                                                        customAlt: '',
                                                        customTitle: '',
                                                        defaultAlt: media.alt || '',
                                                        defaultTitle: media.title || '',
                                                        focalPoint: { x: 0.5, y: 0.5 },
                                                    });
                                                    setIsPopoverOpen(false);
                                                });
                                                picker.open();
                                            }}
                                        />
                                        <Button
                                            icon={trash}
                                            label="Remove Image"
                                            variant="secondary"
                                            size="compact"
                                            isDestructive
                                            showTooltip
                                            style={{ flex: 1, justifyContent: 'center' }}
                                            onClick={() => {
                                                onRemoveImage();
                                                setIsPopoverOpen(false);
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
                </PanelBody>
            </InspectorControls>
            <div className={`seo-image-container ${!imageID && !imageURL ? 'empty' : ''}`}>
                {!!imageID && !!imageURL ? (
                    <>
                        <img
                            className={`seo-image wp-image-${imageID}`}
                            src={imageURL}
                            alt={customAlt || defaultAlt || ''}
                            title={customTitle || defaultTitle || ''}
                            style={{
                                objectFit: 'cover',
                                objectPosition: focalPoint
                                    ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
                                    : '50% 50%',
                            }}
                        />
                        <div className="image-controls-overlay">
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={onSelectImage}
                                    allowedTypes={['image']}
                                    value={imageID}
                                    render={({ open }) => (
                                        <Button
                                            onClick={open}
                                            icon={image}
                                            label="Replace image"
                                            className="replace-image-button"
                                        />
                                    )}
                                />
                            </MediaUploadCheck>
                            <Button
                                onClick={onRemoveImage}
                                icon={trash}
                                label="Remove image"
                                className="remove-image-button"
                            />
                        </div>
                    </>
                ) : (
                    <MediaUploadCheck>
                        <MediaPlaceholder
                            icon={image}
                            labels={{
                                title: 'Image',
                                instructions: 'Drag an image, upload a new one or select a file from your library.',
                            }}
                            onSelect={onSelectImage}
                            accept="image/*"
                            allowedTypes={['image']}
                        />
                    </MediaUploadCheck>
                )}
            </div>
        </>
    );
}
