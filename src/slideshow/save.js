import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    return (
        <div {...useBlockProps.save()}>
            <div
                className="splide"
                data-interval={attributes.interval}
                data-autoplay={attributes.autoplay}
                data-pause-on-hover={attributes.pauseOnHover}
                data-pagination={attributes.pagination}
                data-arrows={attributes.arrows}
                data-slides-per-view={attributes.slidesPerView}
                data-gap={attributes.gap}
                data-loop={attributes.loop}
                data-slide-radius={typeof attributes.slideRadius === 'object' ? `${attributes.slideRadius.topLeft || '0px'} ${attributes.slideRadius.topRight || '0px'} ${attributes.slideRadius.bottomRight || '0px'} ${attributes.slideRadius.bottomLeft || '0px'}` : attributes.slideRadius}
                style={{ '--slider-height': attributes.sliderHeight ? `${attributes.sliderHeight}vh` : undefined, '--slide-radius': typeof attributes.slideRadius === 'object' ? `${attributes.slideRadius.topLeft || '0px'} ${attributes.slideRadius.topRight || '0px'} ${attributes.slideRadius.bottomRight || '0px'} ${attributes.slideRadius.bottomLeft || '0px'}` : (attributes.slideRadius || undefined) }}
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
