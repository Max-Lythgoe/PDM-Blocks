import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const ALLOWED_BLOCKS = [ 'pdm/full-scroll-item' ];
	const TEMPLATE = [
		['pdm/full-scroll-item', {}],
		['pdm/full-scroll-item', {}],
		['pdm/full-scroll-item', {}]
	];

	const blockProps = useBlockProps({
		className: `scroll-section${attributes.buttonAnimation ? ' has-button-animation' : ''}${attributes.switchSides ? ' is-switched' : ''}`,
		style: {
			'--scroll-aspect-ratio': attributes.aspectRatio !== 'auto' ? attributes.aspectRatio : 'auto',
			'--scroll-border-radius': `${attributes.borderRadius || 0}px`
		}
	});

	return (
		<>
		<InspectorControls>
			<PanelBody title={__('Settings', 'pdm-blocks')}>
				<p>{__('Add full scroll items inside the block to create a full scroll section.', 'pdm-blocks')}</p>
				<ToggleControl
					label={__('Switch Sides', 'pdm-blocks')}
					checked={attributes.switchSides}
					onChange={(value) => setAttributes({ switchSides: value })}
					help={__('Swap the image and content sides', 'pdm-blocks')}
				/>
				<ToggleControl
					label={__('Button Animation', 'pdm-blocks')}
					checked={attributes.buttonAnimation}
					onChange={(value) => setAttributes({ buttonAnimation: value })}
					help={__('Animate buttons when section becomes active', 'pdm-blocks')}
				/>
				<ToggleControl
					label={__('Enable Background Overlay', 'pdm-blocks')}
					checked={attributes.backgroundOverlay}
					onChange={(value) => setAttributes({ backgroundOverlay: value })}
				/>
				{ attributes.backgroundOverlay && (
					<>
						<RangeControl
							label={__('Overlay Opacity', 'pdm-blocks')}
							value={attributes.overlayOpacity}
							onChange={(value) => setAttributes({ overlayOpacity: value })}
							min={0}
							max={100}
							step={1}
						/>
						<RangeControl
							label={__('Blur Amount (px)', 'pdm-blocks')}
							value={attributes.blurAmount}
							onChange={(value) => setAttributes({ blurAmount: value })}
							min={0}
							max={50}
							step={1}
						/>
					</>
				) }
				<SelectControl
					label={__('Image Aspect Ratio', 'pdm-blocks')}
					value={attributes.aspectRatio}
					onChange={(value) => setAttributes({ aspectRatio: value })}
					options={[
						{ label: __('Square (1:1)', 'pdm-blocks'), value: '1/1' },
						{ label: __('Landscape (4:3)', 'pdm-blocks'), value: '4/3' },
						{ label: __('Landscape (16:9)', 'pdm-blocks'), value: '16/9' },
						{ label: __('Portrait (3:4)', 'pdm-blocks'), value: '3/4' },
						{ label: __('Portrait (9:16)', 'pdm-blocks'), value: '9/16' },
						{ label: __('Auto', 'pdm-blocks'), value: 'auto' }
					]}
				/>
				<RangeControl
					label={__('Border Radius (px)', 'pdm-blocks')}
					value={attributes.borderRadius}
					onChange={(value) => setAttributes({ borderRadius: value })}
					min={0}
					max={100}
					step={1}
				/>
			</PanelBody>
		</InspectorControls>
		<div {...blockProps}>
						<InnerBlocks 
							template={TEMPLATE} 
							allowedBlocks={ALLOWED_BLOCKS} 
							templateLock={false} 
							renderAppender={InnerBlocks.ButtonBlockAppender} 
						/>
		</div>
		</>
	);
}
