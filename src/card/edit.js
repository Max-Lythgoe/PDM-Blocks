import { __ } from '@wordpress/i18n';
import { 
    useBlockProps, 
    InnerBlocks, 
    BlockControls, 
    __experimentalLinkControl as LinkControl, 
    BlockVerticalAlignmentToolbar 
} from '@wordpress/block-editor';
import { ToolbarButton, Popover, ToolbarGroup } from '@wordpress/components';
import { useState, useRef, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { link } from '@wordpress/icons';
import './editor.scss';

// Recursively check if any inner block has an actual link set on it.
// Handles: core/button (url attr), linked images/files (href attr),
// and rich-text blocks (paragraph, heading, etc.) where links are stored as
// RichTextValue objects with a formats array rather than plain HTML strings.
function hasLinkedBlock(blocks) {
    return blocks.some((block) => {
        const attrs = block.attributes || {};
        const hasLink =
            // core/button stores its link in `url`
            (block.name === 'core/button' && !!attrs.url) ||
            // linked images, files, navigation links etc. use `href`
            (!!attrs.href) ||
            // scan all attribute values for links
            Object.values(attrs).some((val) => {
                // Plain HTML string (older/custom blocks)
                if (typeof val === 'string') {
                    return /<a\s[^>]*href/i.test(val);
                }
                // RichTextValue object (core/paragraph, core/heading, etc.)
                // formats is a sparse array where each position is an array of active formats
                if (val && Array.isArray(val.formats)) {
                    return val.formats.some(
                        (pos) => Array.isArray(pos) && pos.some(
                            (fmt) => fmt && fmt.type === 'core/link'
                        )
                    );
                }
                return false;
            });
        return hasLink || hasLinkedBlock(block.innerBlocks || []);
    });
}

export default function Edit({ attributes, setAttributes, clientId }) {
    const { url, linkTarget, rel, verticalAlignment } = attributes;
    const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(false);
    const linkButtonRef = useRef();

    const innerBlocks = useSelect(
        (select) => select('core/block-editor').getBlocks(clientId),
        [clientId]
    );

    const innerBlocksHaveLink = hasLinkedBlock(innerBlocks);

    // When a linked inner block is added, clear the card-level link and hide the picker
    useEffect(() => {
        if (innerBlocksHaveLink) {
            if (url) {
                setAttributes({ url: undefined, linkTarget: undefined, rel: undefined });
            }
            setIsLinkPickerVisible(false);
        }
    }, [innerBlocksHaveLink]);

    const getAlignItems = (alignment) => {
        switch (alignment) {
            case 'top': return 'flex-start';
            case 'bottom': return 'flex-end';
            case 'center': return 'center';
            case 'stretch': return 'stretch';
            default: return 'flex-start';
        }
    };

    const TEMPLATE = [
        [ 'core/image', { align: 'center', aspectRatio: '16/9', scale: 'cover', className: 'pdm-card-image' } ],
        [ 'core/heading', { level: 3, placeholder: 'Card Title', textAlign: 'center' } ],
        [ 'core/paragraph', { placeholder: 'Enter description...' } ]
    ];
    
    return (
        <>
            <BlockControls>
                <BlockVerticalAlignmentToolbar
                    value={verticalAlignment}
                    onChange={(value) => setAttributes({ verticalAlignment: value })}
                    controls={['top', 'center', 'bottom', 'stretch']}
                />
            </BlockControls>

            <BlockControls group="block">
                {!innerBlocksHaveLink && (
                    <ToolbarGroup>
                        <ToolbarButton
                            icon={link}
                            title={__('Link', 'pdm-blocks')}
                            onClick={() => setIsLinkPickerVisible(!isLinkPickerVisible)}
                            isActive={!!url || isLinkPickerVisible}
                            ref={linkButtonRef}
                        />
                    </ToolbarGroup>
                )}
            </BlockControls>

            {isLinkPickerVisible && (
                <Popover
                    onClose={() => setIsLinkPickerVisible(false)}
                    anchor={linkButtonRef.current}
                    focusOnMount={true} // Changed to true for core-like focus behavior
                    placement="bottom-center"
                >
                    <LinkControl
                        value={{
                            url: url,
                            opensInNewTab: linkTarget === '_blank'
                        }}
                        onChange={(newValue) => {
                            setAttributes({
                                url: newValue.url,
                                linkTarget: newValue.opensInNewTab ? '_blank' : undefined,
                                rel: newValue.opensInNewTab ? 'noopener noreferrer' : undefined,
                            });
                        }}
                        onRemove={() => {
                            setAttributes({ url: undefined, linkTarget: undefined, rel: undefined });
                            setIsLinkPickerVisible(false);
                        }}
                        // This property helps it feel like the native link UI
                        forceIsEditingLink={!url} 
                    />
                </Popover>
            )}

            <div { ...useBlockProps({
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: getAlignItems(verticalAlignment)
                },
                className: `is-vertically-aligned-${verticalAlignment}`
            }) }>
                <InnerBlocks 
                    template={TEMPLATE} 
                    templateLock={false} 
                    renderAppender={InnerBlocks.ButtonBlockAppender} 
                />
            </div>
        </>
    );
}