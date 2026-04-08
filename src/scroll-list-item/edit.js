import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, BlockControls, __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { ToolbarButton, Popover } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import './editor.scss';
import ImageBlockControl from '../../components/ImageBlockControl';

export default function Edit({ attributes, setAttributes }) {
	const { url, linkTarget, rel } = attributes;
	const [isEditingURL, setIsEditingURL] = useState(false);

	const blockProps = useBlockProps({
		className: 'pdm-scroll-list-item-editor'
	});

	const linkValue = {
		url: url || '',
		opensInNewTab: linkTarget === '_blank',
		...(rel && { rel })
	};

	const onLinkChange = (newLink) => {
		setAttributes({
			url: newLink?.url || '',
			linkTarget: newLink?.opensInNewTab ? '_blank' : '_self',
			rel: newLink?.rel || ''
		});
	};

	const onLinkRemove = () => {
		setAttributes({
			url: undefined,
			linkTarget: '_self',
			rel: undefined
		});
		setIsEditingURL(false);
	};

	return (
		<>
			<BlockControls group="block">
				{!url && (
					<ToolbarButton
						icon={link}
						label={__('Link', 'pdm-blocks')}
						onClick={() => setIsEditingURL(true)}
					/>
				)}
				{url && (
					<>
						<ToolbarButton
							icon={link}
							label={__('Edit link', 'pdm-blocks')}
							onClick={() => setIsEditingURL(true)}
							isActive={true}
						/>
						<ToolbarButton
							icon={linkOff}
							label={__('Remove link', 'pdm-blocks')}
							onClick={onLinkRemove}
						/>
					</>
				)}
			</BlockControls>
			{isEditingURL && (
				<Popover
					position="bottom center"
					onClose={() => setIsEditingURL(false)}
					anchor={document.querySelector('.pdm-scroll-list-item-editor')}
				>
					<LinkControl
						value={linkValue}
						onChange={onLinkChange}
						onRemove={onLinkRemove}
						forceIsEditingLink={true}
						hasRichPreviews={true}
						showInitialSuggestions={true}
					/>
				</Popover>
			)}
			<div {...blockProps}>
				<div className="editor-scroll-list-image-preview">
					<ImageBlockControl 
						attributes={attributes} 
						setAttributes={setAttributes} 
					/>
				</div>
				<div className="editor-scroll-list-content">
					<InnerBlocks 
						template={[
							['core/heading', { 
								level: 3, 
								placeholder: 'Add title...',
								className: 'scroll-item-title'
							}],
							['core/paragraph', { 
								placeholder: 'Add content...' ,
								margin: '0',
							}]
						]}
						templateLock={false}
					/>
				</div>
				{url && (
					<div className="editor-scroll-list-link-indicator">
						🔗 ...{url.slice(-16)}
					</div>
				)}
			</div>
		</>
	);
}
