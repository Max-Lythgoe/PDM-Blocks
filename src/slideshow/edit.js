import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, InnerBlocks, InspectorControls, BlockControls, MediaUpload } from '@wordpress/block-editor';
import { ToolbarButton, Button } from '@wordpress/components';
import { seen } from '@wordpress/icons';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import './editor.scss';

// Dynamically import Splide assets in preview mode
import { useEffect, useRef } from 'react';

export default function Edit({ attributes, setAttributes, clientId }) {
    const ALLOWED_BLOCKS = [ 'pdm/slide' ];
    const TEMPLATE = [
        [ 'pdm/slide', {} ],
        [ 'pdm/slide', {} ]
    ];
    const blockProps = useBlockProps();
    const splideStyleRef = useRef(null);
    const splideInstanceRef = useRef(null);

	const { replaceInnerBlocks, removeBlocks } = useDispatch('core/block-editor');

	const childBlocks = useSelect(
        (select) => select('core/block-editor').getBlocksByClientId(clientId)[0]?.innerBlocks || [],
        [clientId]
    );

	// Handle adding images from gallery
	const onSelectImages = (images) => {
		const newSlides = images.map((image) => 
			createBlock('pdm/slide', {
				imageURL: image.url,
				imageID: image.id,
				defaultAlt: image.alt || '',
				defaultTitle: image.title || '',
				customAlt: '',
				customTitle: ''
			})
		);
		replaceInnerBlocks(clientId, newSlides, false);
	};

	// Handle clearing all slides
	const onClearSlides = () => {
		if (childBlocks.length > 0) {
			const childIds = childBlocks.map(block => block.clientId);
			removeBlocks(childIds, false);
		}
	};

    // Dynamically load Splide assets when preview is active
    useEffect(() => {
        if (attributes.isPreview) {
            // Load Splide CSS
            import('@splidejs/splide/css').then(module => {
            });
            
            setTimeout(() => {
                import('./index.js').then(mod => {
                    if (mod && typeof mod.initSplideEditorPreview === 'function') {
                        mod.initSplideEditorPreview();
                    }
                });
            }, 100);
        }
        
        // Cleanup when exiting preview or unmounting
        return () => {
            if (!attributes.isPreview) {
                const iframe = document.querySelector('iframe[name="editor-canvas"]');
                const doc = iframe ? iframe.contentDocument || iframe.contentWindow.document : document;
                const splides = doc.querySelectorAll('.wp-block-pdm-slideshow .splide');
                splides.forEach(splide => {
                    if (splide.splide) {
                        splide.splide.destroy(true); 
                    }
                });
            }
        };
    }, [
        attributes.isPreview,
        attributes.interval,
        attributes.autoplay,
        attributes.pauseOnHover,
        attributes.pagination,
        attributes.arrows,
        attributes.loop,
        attributes.slidesPerView,
        attributes.gap
    ]);

    return (
        <>
            <BlockControls>
                <ToolbarButton
                    icon={seen}
                    label={attributes.isPreview ? 'Show Editor' : 'Show Preview'}
                    isPressed={!!attributes.isPreview}
                    onClick={() => setAttributes({ isPreview: !attributes.isPreview })}
                />
            </BlockControls>
            {attributes.isPreview ? (
                <div {...blockProps}>
                    <div className="splide" 
                        data-interval={attributes.interval}
                        data-autoplay={attributes.autoplay}
                        data-pause-on-hover={attributes.pauseOnHover}
                        data-pagination={attributes.pagination}
                        data-arrows={attributes.arrows}
                        data-slides-per-view={attributes.slidesPerView}
                        data-gap={attributes.gap}
                        data-loop={attributes.loop}
                        data-slider-height={attributes.sliderHeight}
                        style={{ '--slider-height': attributes.sliderHeight ? `${attributes.sliderHeight}vh` : undefined }}
                    >
                        <div className="splide__track">
                            <ul className="splide__list">
                                {childBlocks.map((block) =>
                                    block.name === 'pdm/slide'
                                        ? wp.blocks.getBlockType(block.name).save({ attributes: block.attributes })
                                        : null
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div {...blockProps} key="editor-mode">
                    <div className="slideshow-editor-controls" style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                        <MediaUpload
                            onSelect={onSelectImages}
                            allowedTypes={['image']}
                            multiple={true}
                            gallery={true}
                            value={childBlocks.map(block => block.attributes.imageID).filter(Boolean)}
                            render={({ open }) => (
                                <Button variant="primary" onClick={open}>
                                    Add Images
                                </Button>
                            )}
                        />
                        {childBlocks.length > 0 && (
                            <Button variant="secondary" isDestructive onClick={onClearSlides}>
                                Clear Images
                            </Button>
                        )}
                    </div>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        orientation="horizontal"
                        renderAppender={InnerBlocks.ButtonBlockAppender}
                    />
                </div>
            )}
            <InspectorControls>
				<PanelBody title="Main Settings">
                    <ToggleControl
                        label="Show Pagination"
                        checked={!!attributes.pagination}
                        onChange={(val) => setAttributes({ pagination: val })}
                    />
                    <ToggleControl
                        label="Show Arrows"
                        checked={!!attributes.arrows}
                        onChange={(val) => setAttributes({ arrows: val })}
                    />
                    <ToggleControl
                        label="Loop Slides"
                        checked={!!attributes.loop}
                        onChange={(val) => setAttributes({ loop: val })}
                    />
					</PanelBody>
					<PanelBody title="Autoplay Settings" initialOpen={false}>
						<ToggleControl
							label="Autoplay"
							checked={!!attributes.autoplay}
							onChange={(val) => setAttributes({ autoplay: val })}
						/>
						{attributes.autoplay && (
							<>
							<RangeControl
								label="Slide Interval (secs)"
								help="Select how long each slide of the carousel is shown in seconds"
								max={12}
								min={1}
								step={1}
								value={attributes.interval}
								onChange={(val) => { setAttributes({ interval: val }) }}
							/>
							<ToggleControl
								label="Pause on Hover"
								checked={!!attributes.pauseOnHover}
								onChange={(val) => setAttributes({ pauseOnHover: val })}
							/>
							</>
						)}
					</PanelBody>
					<PanelBody title="Layout Settings" initialOpen={false}>
						<RangeControl
							label="Slides Per View"
							help="Number of slides visible at once"
							max={6}
							min={1}
							step={1}
							value={attributes.slidesPerView}
							onChange={(val) => setAttributes({ slidesPerView: val })}
						/>
						<RangeControl
							label="Gap Between Slides (px)"
							help="Space between slides in pixels"
							max={100}
							min={0}
							step={1}
							value={parseInt(attributes.gap) || 0}
							onChange={(val) => setAttributes({ gap: `${val}px` })}
						/>
						<RangeControl
							label="Slider Height (vh)"
							help="Set the height of the slider in viewport height units."
							min={20}
							max={100}
							step={1}
							value={parseInt(attributes.sliderHeight) || 50}
							onChange={(val) => setAttributes({ sliderHeight: String(val) })}
						/>
                </PanelBody>
            </InspectorControls>
        </>
    );
}