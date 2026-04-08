import { __ } from '@wordpress/i18n';
import { useBlockProps, BlockControls, __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { JustifyContentControl } from '@wordpress/block-editor';
import { ToolbarButton, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { link } from '@wordpress/icons';
import IconEdit from '../../components/IconEdit';
import IconRender from '../../components/IconRender';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { iconAlign, url, linkTarget, rel } = attributes;
	const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(false);

	const getJustifyContent = (alignment) => {
		switch (alignment) {
			case 'left':
				return 'flex-start';
			case 'right':
				return 'flex-end';
			case 'center':
			default:
				return 'center';
		}
	};

	const blockProps = useBlockProps({
		style: {
			display: 'flex',
			justifyContent: getJustifyContent(iconAlign)
		}
	});

	return (
		<>
			<BlockControls>
				<JustifyContentControl
					value={iconAlign}
					onChange={(value) => setAttributes({ iconAlign: value })}
					allowedControls={['left', 'center', 'right']}
				/>
				<ToolbarButton
					icon={link}
					title={__('Link', 'pdm-blocks')}
					onClick={() => setIsLinkPickerVisible(true)}
					isActive={!!url}
				/>
			</BlockControls>

			{isLinkPickerVisible && (
				<Popover
					position="bottom center"
					onClose={() => setIsLinkPickerVisible(false)}
				>
					<LinkControl
						value={{
							url: url,
							opensInNewTab: linkTarget === '_blank'
						}}
						onChange={(newValue) => {
							const updates = {
								url: newValue.url
							};
							
							// Explicitly set or clear linkTarget and rel based on opensInNewTab
							if (newValue.opensInNewTab) {
								updates.linkTarget = '_blank';
								updates.rel = 'noopener noreferrer';
							} else {
								updates.linkTarget = undefined;
								updates.rel = undefined;
							}
							
							setAttributes(updates);
						}}
						onChangeSettings={(newSettings) => {
							const updates = {};
							
							// Explicitly set or clear linkTarget and rel based on opensInNewTab
							if (newSettings.opensInNewTab) {
								updates.linkTarget = '_blank';
								updates.rel = 'noopener noreferrer';
							} else {
								updates.linkTarget = undefined;
								updates.rel = undefined;
							}
							
							setAttributes(updates);
						}}
						onRemove={() => {
							setAttributes({ url: undefined, linkTarget: undefined, rel: undefined });
							setIsLinkPickerVisible(false);
						}}
					/>
				</Popover>
			)}

			<IconEdit
				attributes={attributes}
				setAttributes={setAttributes}
				label={__('Icon Settings', 'pdm-blocks')}
				initialOpen={true}
			/>

			<div {...blockProps}>
				<IconRender
					attributes={attributes}
					defaultIcon="check"
					className="pdm-icon-display"
				/>
			</div>
		</>
	);
}
