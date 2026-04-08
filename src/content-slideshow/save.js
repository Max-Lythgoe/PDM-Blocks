import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const sliderHeightValue = attributes.sliderHeight || 50;
    
    return (
        <div 
            {...useBlockProps.save()}
            style={{ 
                ['--slider-height']: `${sliderHeightValue}vh`
            }}
        >
            <div
                className="splide"
                data-interval={attributes.interval}
                data-autoplay={attributes.autoplay}
                data-pause-on-hover={attributes.pauseOnHover}
                data-pagination={attributes.pagination}
                data-arrows={attributes.arrows}
                data-loop={attributes.loop}
                data-slider-height={sliderHeightValue}
            >
                <div className="splide__track">
                    <ul className="splide__list">
                        <InnerBlocks.Content />
                    </ul>
                </div>
            </div>
        </div>
    );
}
