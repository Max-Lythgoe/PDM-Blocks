import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, SelectControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes, clientId }) {
	const blockProps = useBlockProps({
		className: `scroll-list-editor-preview${attributes.switchSides ? ' is-switched' : ''}`,
		style: {
			'--scroll-list-aspect-ratio': attributes.aspectRatio !== 'auto' ? attributes.aspectRatio : 'auto',
			'--scroll-list-border-radius': `${attributes.borderRadius || 0}px`
		}
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Scroll List Settings', 'pdm-blocks')}>
					<ToggleControl
						label={__('Switch Sides', 'pdm-blocks')}
						checked={attributes.switchSides}
						onChange={(value) => setAttributes({ switchSides: value })}
						help={__('Swap the sticky content and scrolling items sides', 'pdm-blocks')}
					/>
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
						label={__('Image Border Radius (px)', 'pdm-blocks')}
						value={attributes.borderRadius}
						onChange={(value) => setAttributes({ borderRadius: value })}
						min={0}
						max={100}
						step={1}
					/>
				</PanelBody>
				<PanelColorSettings
					title={__('Active Item Colors', 'pdm-blocks')}
					colorSettings={[
						{
							value: attributes.activeBackgroundColor,
							onChange: (value) => setAttributes({ activeBackgroundColor: value }),
							label: __('Active Background Color', 'pdm-blocks')
						},
						{
							value: attributes.activeTextColor,
							onChange: (value) => setAttributes({ activeTextColor: value }),
							label: __('Active Text Color', 'pdm-blocks')
						}
					]}
				/>
			</InspectorControls>
			<div {...blockProps}>
				<div className="scroll-list-editor-sticky">
					<div className="scroll-list-editor-image-placeholder">
						<svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 120 120" fill="none">
						<rect width="120" height="120" fill="#EFF1F3"/>
						<path fill-rule="evenodd" clip-rule="evenodd" d="M33.2503 38.4816C33.2603 37.0472 34.4199 35.8864 35.8543 35.875H83.1463C84.5848 35.875 85.7503 37.0431 85.7503 38.4816V80.5184C85.7403 81.9528 84.5807 83.1136 83.1463 83.125H35.8543C34.4158 83.1236 33.2503 81.957 33.2503 80.5184V38.4816ZM80.5006 41.1251H38.5006V77.8751L62.8921 53.4783C63.9172 52.4536 65.5788 52.4536 66.6039 53.4783L80.5006 67.4013V41.1251ZM43.75 51.6249C43.75 54.5244 46.1005 56.8749 49 56.8749C51.8995 56.8749 54.25 54.5244 54.25 51.6249C54.25 48.7254 51.8995 46.3749 49 46.3749C46.1005 46.3749 43.75 48.7254 43.75 51.6249Z" fill="#687787"/>
						</svg>
						<div className="image-placeholder-text">Dynamic Image</div>
					</div>
				</div>
				<div className="scroll-list-editor-items">
					<InnerBlocks
						allowedBlocks={['pdm/scroll-list-item']}
						template={[
							['pdm/scroll-list-item', {}],
							['pdm/scroll-list-item', {}],
							['pdm/scroll-list-item', {}]
						]}
						templateLock={false}
						renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
					/>
				</div>
			</div>
		</>
	);
}
