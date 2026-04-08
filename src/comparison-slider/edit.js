import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, RangeControl } from '@wordpress/components';
import ImageBlockControl from '../../components/ImageBlockControl';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps({
		className: 'comparison-slider-editor',
		style: {
			maxWidth: `${attributes.maxWidth}px`,
			aspectRatio: attributes.aspectRatio,
			margin: '0 auto'
		}
	});

	// Create wrapper functions to map attributes for before image
	const beforeAttributes = {
		imageID: attributes.beforeImageID,
		imageURL: attributes.beforeImageURL,
		customAlt: attributes.beforeCustomAlt,
		customTitle: attributes.beforeCustomTitle,
		defaultAlt: attributes.beforeDefaultAlt,
		defaultTitle: attributes.beforeDefaultTitle,
		focalPoint: attributes.beforeFocalPoint
	};

	const setBeforeAttributes = (newAttrs) => {
		const mappedAttrs = {};
		if (newAttrs.imageID !== undefined) mappedAttrs.beforeImageID = newAttrs.imageID;
		if (newAttrs.imageURL !== undefined) mappedAttrs.beforeImageURL = newAttrs.imageURL;
		if (newAttrs.customAlt !== undefined) mappedAttrs.beforeCustomAlt = newAttrs.customAlt;
		if (newAttrs.customTitle !== undefined) mappedAttrs.beforeCustomTitle = newAttrs.customTitle;
		if (newAttrs.defaultAlt !== undefined) mappedAttrs.beforeDefaultAlt = newAttrs.defaultAlt;
		if (newAttrs.defaultTitle !== undefined) mappedAttrs.beforeDefaultTitle = newAttrs.defaultTitle;
		if (newAttrs.focalPoint !== undefined) mappedAttrs.beforeFocalPoint = newAttrs.focalPoint;
		setAttributes(mappedAttrs);
	};

	// Create wrapper functions to map attributes for after image
	const afterAttributes = {
		imageID: attributes.afterImageID,
		imageURL: attributes.afterImageURL,
		customAlt: attributes.afterCustomAlt,
		customTitle: attributes.afterCustomTitle,
		defaultAlt: attributes.afterDefaultAlt,
		defaultTitle: attributes.afterDefaultTitle,
		focalPoint: attributes.afterFocalPoint
	};

	const setAfterAttributes = (newAttrs) => {
		const mappedAttrs = {};
		if (newAttrs.imageID !== undefined) mappedAttrs.afterImageID = newAttrs.imageID;
		if (newAttrs.imageURL !== undefined) mappedAttrs.afterImageURL = newAttrs.imageURL;
		if (newAttrs.customAlt !== undefined) mappedAttrs.afterCustomAlt = newAttrs.customAlt;
		if (newAttrs.customTitle !== undefined) mappedAttrs.afterCustomTitle = newAttrs.customTitle;
		if (newAttrs.defaultAlt !== undefined) mappedAttrs.afterDefaultAlt = newAttrs.defaultAlt;
		if (newAttrs.defaultTitle !== undefined) mappedAttrs.afterDefaultTitle = newAttrs.defaultTitle;
		if (newAttrs.focalPoint !== undefined) mappedAttrs.afterFocalPoint = newAttrs.focalPoint;
		setAttributes(mappedAttrs);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Slider Settings', 'comparison-slider')} initialOpen={true}>
					<ToggleControl
						label={__('Show Labels', 'comparison-slider')}
						checked={attributes.showLabels}
						onChange={(value) => setAttributes({ showLabels: value })}
						help={__('Display "Before" and "After" labels on the slider', 'comparison-slider')}
					/>
					<SelectControl
						label={__('Aspect Ratio', 'comparison-slider')}
						value={attributes.aspectRatio}
						onChange={(value) => setAttributes({ aspectRatio: value })}
						options={[
							{ label: '16:9', value: '16/9' },
							{ label: '4:3', value: '4/3' },
							{ label: '3:2', value: '3/2' },
							{ label: '1:1', value: '1/1' },
							{ label: '21:9', value: '21/9' },
							{ label: '9:16', value: '9/16' },
						]}
					/>
					<RangeControl
						label={__('Max Width (px)', 'comparison-slider')}
						value={attributes.maxWidth}
						onChange={(value) => setAttributes({ maxWidth: value })}
						min={350}
						max={2000}
						step={10}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="comparison-slider-preview">
					<div className="comparison-slider-side">
						{attributes.showLabels && <h4>{__('Before', 'comparison-slider')}</h4>}
						<ImageBlockControl 
							attributes={beforeAttributes}
							setAttributes={setBeforeAttributes}
						/>
					</div>
					<div className="comparison-slider-side">
						{attributes.showLabels && <h4>{__('After', 'comparison-slider')}</h4>}
						<ImageBlockControl 
							attributes={afterAttributes}
							setAttributes={setAfterAttributes}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
