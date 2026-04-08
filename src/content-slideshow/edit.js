import { useSelect } from '@wordpress/data';
import { useBlockProps, InnerBlocks, InspectorControls, BlockControls } from '@wordpress/block-editor';
import { ToolbarButton } from '@wordpress/components';
import { seen } from '@wordpress/icons';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import './editor.scss';
import BackgroundMediaRender from '../../components/BackgroundMediaRender';

// Dynamically import Splide assets in preview mode
import { useEffect, useMemo } from 'react';

export default function Edit({ attributes, setAttributes, clientId }) {
    const ALLOWED_BLOCKS = [ 'pdm/content-slide' ];
    const TEMPLATE = [
        [ 'pdm/content-slide', {} ],
        [ 'pdm/content-slide', {} ]
    ];
    const blockProps = useBlockProps();

	const childBlocks = useSelect(
        (select) => select('core/block-editor').getBlocksByClientId(clientId)[0]?.innerBlocks || [],
        [clientId]
    );

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
                const splides = doc.querySelectorAll('.wp-block-pdm-content-slideshow .splide');
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
        attributes.sliderHeight
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
                        data-loop={attributes.loop}
                        data-slider-height={attributes.sliderHeight}
                        style={{ '--slider-height': attributes.sliderHeight ? `${attributes.sliderHeight}vh` : undefined }}
                    >
                        <div className="splide__track">
                            <ul 
                                className="splide__list"
                                dangerouslySetInnerHTML={{ 
                                    __html: childBlocks
                                        .filter(block => block.name === 'pdm/content-slide')
                                        .map(block => {
                                            // Serialize and strip block comments
                                            const serialized = wp.blocks.serialize([block]);
                                            const cleanHTML = serialized.replace(/<!--[^>]*-->/g, '').trim();
                                            
                                            // Get layout type from block attributes
                                            const layout = block.attributes?.layout || { type: 'constrained' };
                                            const layoutType = layout.type || 'constrained';
                                            
                                            // Add layout classes to content-wrapper
                                            const layoutClass = `is-layout-${layoutType}`;
                                            const wpBlockClass = 'wp-block-pdm-content-slide';
                                            
                                            // Replace content-wrapper opening tag with layout-enhanced version
                                            // This regex handles both class="content-wrapper" and class='content-wrapper'
                                            return cleanHTML.replace(
                                                /<div([^>]*?\s+)?class=["']content-wrapper["']([^>]*)>/i,
                                                `<div$1class="content-wrapper ${layoutClass} ${wpBlockClass}-inner-container"$2>`
                                            );
                                        })
                                        .join('')
                                }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div {...blockProps} key="editor-mode" style={{ '--slider-height': attributes.sliderHeight ? `${attributes.sliderHeight}vh` : '50vh' }}>
                    <InnerBlocks
                        allowedBlocks={ALLOWED_BLOCKS}
                        template={TEMPLATE}
                        renderAppender={false}
                    />
                    <div className="content-slideshow-appender">
                        <InnerBlocks.ButtonBlockAppender />
                    </div>
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
							label="Slider Height (vh)"
							help="Set the height of the slider in viewport height units."
							min={20}
							max={100}
							step={1}
							value={attributes.sliderHeight || 50}
							onChange={(val) => setAttributes({ sliderHeight: val })}
						/>
                </PanelBody>
            </InspectorControls>
        </>
    );
}
