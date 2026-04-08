import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import './editor.scss';
import ImageBlockControl from '../../components/ImageBlockControl';

export default function Edit({ attributes, setAttributes, context }) {
	const { imageURL, imageID, customAlt, customTitle, focalPoint } = attributes;
	const overlayEnabled = context['pdm/full-scroll/backgroundOverlay'];
	const overlayOpacity = context['pdm/full-scroll/overlayOpacity'] ?? 50;
	const blurAmount = context['pdm/full-scroll/blurAmount'] ?? 10;

	const blockProps = useBlockProps({
		className: 'pdm-full-scroll-item'
	});

	return (
		<div {...blockProps}>
			<div className="editor-scroll-image-wrap">
				{overlayEnabled && imageURL && (
					<div 
						key={`overlay-${overlayOpacity}-${blurAmount}`}
						className="background-overlay" 
						style={{ 
							opacity: overlayOpacity / 100,
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							pointerEvents: 'none',
							zIndex: 0,
							filter: `blur(${blurAmount}px)`
						}}
					>
						<img 
							src={imageURL} 
							alt="" 
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								objectPosition: focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : '50% 50%'
							}}
						/>  
					</div>
				)}
				<div style={{ 
					position: 'relative', 
					zIndex: 1
				}}>
					<ImageBlockControl 
						attributes={attributes} 
						setAttributes={setAttributes} 
					/>
				</div>
			</div>
			<InnerBlocks 
				template={[
					['core/heading', { 
						level: 3, 
						placeholder: 'Add title...',
						className: 'scroll-title'
					}],
					['core/paragraph', { 
						placeholder: 'Add content...' 
					}],
					['core/paragraph', { 
						placeholder: 'Add link...',
						className: 'scroll-link'
					}]
				]}
				templateLock={false}
			/>
		</div>
	);
}
