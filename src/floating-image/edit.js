/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, Button, RangeControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, isSelected }) {
	const { imageId, imageUrl, imageAlt, offsetX, offsetY, width, hideAt, responsiveBehavior, showOutline, blockMaxWidth } = attributes;
	
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [dragOffsetX, setDragOffsetX] = useState(0);
	const [dragOffsetY, setDragOffsetY] = useState(0);
	const imageRef = useRef(null);
	const lineRef = useRef(null);

	// Handle image drag start
	const handleMouseDown = (e) => {
		if (e.target.classList.contains('resize-handle')) return;
		e.preventDefault();
		e.stopPropagation();
		
		const imageRect = imageRef.current.getBoundingClientRect();
		
		// Store where user clicked within the image
		setDragOffsetX(e.clientX - imageRect.left);
		setDragOffsetY(e.clientY - imageRect.top);
		setIsDragging(true);
	};

	// Handle resize drag start
	const handleResizeMouseDown = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsResizing(true);
		
		if (imageRef.current) {
			const imageRect = imageRef.current.getBoundingClientRect();
			setDragOffsetX(e.clientX);
			setDragOffsetY(imageRect.width); // Store current pixel width
		}
	};

	useEffect(() => {
		const handleMouseMove = (e) => {
			// Safety: stop if no mouse button pressed
			if (e.buttons === 0) {
				setIsDragging(false);
				setIsResizing(false);
				return;
			}
			
			if (isDragging && imageRef.current && lineRef.current) {
				e.preventDefault();
				e.stopPropagation();
				
				const lineRect = lineRef.current.getBoundingClientRect();
				
				// Calculate where the top-left of the image should be relative to the line
				const newLeft = e.clientX - dragOffsetX;
				const newTop = e.clientY - dragOffsetY;
				
				// Convert to offsets from the line
				const newOffsetXPx = newLeft - lineRect.left;
				const newOffsetYPx = newTop - lineRect.top;
				
				// Convert X to percentage, keep Y in pixels
				const newOffsetX = (newOffsetXPx / lineRect.width) * 100;
				
				setAttributes({ 
					offsetX: parseFloat(newOffsetX.toFixed(2)), 
					offsetY: Math.round(newOffsetYPx) 
				});
				
			} else if (isResizing && lineRef.current) {
				e.preventDefault();
				e.stopPropagation();
				
				const delta = e.clientX - dragOffsetX;
				const newWidthPx = Math.max(50, dragOffsetY + delta);
				setAttributes({ width: Math.round(newWidthPx) });
			}
		};

		const handleMouseUp = (e) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			setIsResizing(false);
		};
		
		const handleClick = (e) => {
			if (isDragging || isResizing) {
				e.preventDefault();
				e.stopPropagation();
				setIsDragging(false);
				setIsResizing(false);
			}
		};

		if (isDragging || isResizing) {
			document.addEventListener('mousemove', handleMouseMove, true);
			document.addEventListener('mouseup', handleMouseUp, true);
			document.addEventListener('mousedown', handleMouseUp, true);
			document.addEventListener('click', handleClick, true);
			window.addEventListener('blur', handleMouseUp);
			
			document.body.style.userSelect = 'none';
			document.body.style.pointerEvents = 'none';
			document.body.style.cursor = isDragging ? 'move !important' : 'ew-resize !important';
			
			if (imageRef.current) {
				imageRef.current.style.pointerEvents = 'auto';
			}
			
			return () => {
				document.removeEventListener('mousemove', handleMouseMove, true);
				document.removeEventListener('mouseup', handleMouseUp, true);
				document.removeEventListener('mousedown', handleMouseUp, true);
				document.removeEventListener('click', handleClick, true);
				window.removeEventListener('blur', handleMouseUp);
				document.body.style.userSelect = '';
				document.body.style.pointerEvents = '';
				document.body.style.cursor = '';
				if (imageRef.current) {
					imageRef.current.style.pointerEvents = '';
				}
			};
		}
	}, [isDragging, isResizing, dragOffsetX, dragOffsetY]);

	const onSelectImage = (media) => {
		setAttributes({
			imageId: media.id,
			imageUrl: media.url,
			imageAlt: media.alt
		});
	};

	const blockProps = useBlockProps({
		className: `floating-image-block-wrapper ${hideAt > 0 ? `responsive-at-${hideAt} responsive-${responsiveBehavior}` : ''}`
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Image Settings', 'floating-image')}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={['image']}
							value={imageId}
							render={({ open }) => (
								<Button
									onClick={open}
									variant="secondary"
									style={{ marginBottom: '10px', width: '100%' }}
								>
									{imageId ? __('Replace Image', 'floating-image') : __('Select Image', 'floating-image')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{imageId && (
						<Button
							onClick={() => setAttributes({ imageId: 0, imageUrl: '', imageAlt: '' })}
							variant="secondary"
							isDestructive
							style={{ width: '100%' }}
						>
							{__('Remove Image', 'floating-image')}
						</Button>
					)}
				</PanelBody>

				<PanelBody title={__('Position Settings', 'floating-image')}>
					<RangeControl
						label={__('Horizontal Offset (%)', 'floating-image')}
						value={offsetX}
						onChange={(value) => setAttributes({ offsetX: value })}
						min={-100}
						max={200}
						step={0.5}
						help={__('Horizontal offset from the left edge (percentage of width)', 'floating-image')}
					/>
					
					<RangeControl
						label={__('Vertical Offset (px)', 'floating-image')}
						value={offsetY}
						onChange={(value) => setAttributes({ offsetY: value })}
						min={-1000}
						max={2000}
						step={1}
						help={__('Vertical offset from the anchor line in pixels', 'floating-image')}
					/>
					
					<RangeControl
						label={__('Width (px)', 'floating-image')}
						value={width}
						onChange={(value) => setAttributes({ width: value })}
						min={50}
						max={1200}
						step={1}
						help={__('Width in pixels', 'floating-image')}
					/>
				</PanelBody>

				<PanelBody title={__('Responsive Settings', 'floating-image')}>
					<ToggleControl
						label={__('Enable Responsive Breakpoint', 'floating-image')}
						checked={hideAt > 0}
						onChange={(enabled) => setAttributes({ hideAt: enabled ? 1024 : 0 })}
						help={__('Enable responsive behavior at a specific screen width', 'floating-image')}
					/>
					
					{hideAt > 0 && (
						<>
							<NumberControl
								label={__('Breakpoint (px)', 'floating-image')}
								value={hideAt}
								onChange={(value) => setAttributes({ hideAt: parseInt(value) || 0 })}
								min={320}
								max={2560}
								step={1}
								help={__('Screen width (in pixels) below which to change the image behavior', 'floating-image')}
							/>
							
							<SelectControl
								label={__('Responsive Behavior', 'floating-image')}
								value={responsiveBehavior}
								options={[
									{ label: __('Hide Image', 'floating-image'), value: 'hide' },
									{ label: __('Display as Block (centered)', 'floating-image'), value: 'block' },
								]}
								onChange={(value) => setAttributes({ responsiveBehavior: value })}
								help={__('Choose whether to hide the image or display it as a centered block', 'floating-image')}
							/>
							
							{responsiveBehavior === 'block' && (
								<RangeControl
									label={__('Block Mode Max Width', 'floating-image')}
									value={blockMaxWidth}
									onChange={(value) => setAttributes({ blockMaxWidth: value })}
									min={100}
									max={1200}
									help={__('Maximum width when displayed as a centered block', 'floating-image')}
								/>
							)}
						</>
					)}
					
					<ToggleControl
						label={__('Show Outline (Editor Only)', 'floating-image')}
						checked={showOutline}
						onChange={(value) => setAttributes({ showOutline: value })}
						help={__('Display a red outline in the editor to see the image bounds', 'floating-image')}
					/>
				</PanelBody>
			</InspectorControls>

			<div 
				{...blockProps} 
				ref={lineRef}
				className={`${blockProps.className} ${isSelected ? 'is-selected' : ''}`}
			>
				{!imageUrl ? (
					<div className="floating-image-placeholder">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={onSelectImage}
								allowedTypes={['image']}
								value={imageId}
								render={({ open }) => (
									<Button onClick={open} variant="primary">
										{__('Select Image', 'floating-image')}
									</Button>
								)}
							/>
						</MediaUploadCheck>
						<p>{__('Choose an image to position absolutely', 'floating-image')}</p>
					</div>
				) : (
					<div className="floating-image-overflow-container">
						<div
							ref={imageRef}
							className={`floating-image-container ${isDragging ? 'is-dragging' : ''} ${isResizing ? 'is-resizing' : ''} ${showOutline ? 'show-outline' : ''}`}
							style={{
								left: `${offsetX}%`,
								top: `${offsetY}px`,
								width: `${width}px`
							}}
							onMouseDown={handleMouseDown}
						>
							<img 
								src={imageUrl} 
								alt={imageAlt}
								draggable={false}
							/>
							<div className="floating-image-controls">
								<div className="position-indicator">
									X:{offsetX.toFixed(1)}% Y:{offsetY}px W:{width}px
								</div>
								<div 
									className="resize-handle"
									onMouseDown={handleResizeMouseDown}
									title={__('Drag to resize', 'floating-image')}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
