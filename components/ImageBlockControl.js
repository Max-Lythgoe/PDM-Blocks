import { MediaPlaceholder, MediaUpload, MediaUploadCheck, InspectorControls } from '@wordpress/block-editor';
import { TextControl, FocalPointPicker, PanelBody, Icon, Button, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { trash, upload, image } from '@wordpress/icons';

import "./image-block-control.css";

export default function ImageBlockControl({ attributes, setAttributes }) {
    const { imageID, imageURL, customAlt, customTitle, focalPoint, defaultAlt, defaultTitle } = attributes;

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
            {(!!imageID && !!imageURL) && (
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
