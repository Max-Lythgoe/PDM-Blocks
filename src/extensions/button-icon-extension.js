// button-icon-extension.js - Rich text format for inserting SVG icons into button blocks
// Migrated from PDM Accelerate theme - identical implementation

import { ICON_LIBRARY } from '../../components/icon-library';

const { Fragment, useState, renderToString, createElement, cloneElement, useEffect } = wp.element;
const { Button, Modal, Popover, ToolbarButton, ToolbarGroup, SearchControl, ColorPalette, FontSizePicker } = wp.components;
const { __ } = wp.i18n;
const { create, insert, registerFormatType, useAnchor, applyFormat, removeFormat } = wp.richText;
const { BlockControls, MediaUpload } = wp.blockEditor;
const { useSelect } = wp.data;

// Constants
const ICON_CLASS = 'wp-rich-text-accelerate-icon';
const ICON_TAG_NAME = 'span';
const ZERO_WIDTH_SPACE = '\u200b';
const name = 'accelerate/button-icon';
const title = __('Insert Icon', 'pdm-blocks');

// Redesigned Icon picker modal - consistent WordPress-style attribute editor
// Custom icon management using media attachment IDs
const getCustomIconFromAttachment = async (attachmentId) => {
    try {
        const attachment = await wp.data.resolveSelect('core').getEntityRecord('postType', 'attachment', attachmentId);
        if (!attachment || !attachment.source_url || !attachment.source_url.endsWith('.svg')) {
            return null;
        }
        
        const response = await fetch(attachment.source_url);
        const svgContent = await response.text();
        
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        
        if (svgElement.tagName !== 'svg') return null;
        
        const svgProps = {
            viewBox: svgElement.getAttribute('viewBox') || '0 0 24 24',
            xmlns: 'http://www.w3.org/2000/svg'
        };
        
        const paths = Array.from(svgElement.querySelectorAll('path')).map(path => ({
            d: path.getAttribute('d'),
            fill: path.getAttribute('fill') || 'currentColor'
        }));
        
        return createElement('svg', svgProps, 
            ...paths.map((path, index) => 
                createElement('path', { 
                    key: index, 
                    d: path.d, 
                    fill: path.fill 
                })
            )
        );
    } catch (error) {
        console.error('Error loading custom icon:', error);
        return null;
    }
};

// Modal component for selecting icons and colors - WordPress style
function IconPickerModal({ isOpen, onClose, onSelect, currentIconName = '', currentColor = 'currentColor', currentFontSize = '1.25em', customIcons: externalCustomIcons = {}, onCustomIconsChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIconName, setSelectedIconName] = useState('');
    const [selectedColor, setSelectedColor] = useState('currentColor');
    const [selectedFontSize, setSelectedFontSize] = useState('1.25em');
    const [customIcons, setCustomIcons] = useState(externalCustomIcons);
    const [loadingCustomIcons, setLoadingCustomIcons] = useState(false);
    
    // Load custom SVG icons from media library
    const loadCustomIcons = async () => {
        setLoadingCustomIcons(true);
        try {
            const attachments = await wp.data.resolveSelect('core').getEntityRecords('postType', 'attachment', {
                media_type: 'image',
                mime_type: 'image/svg+xml',
                per_page: 100
            }) || [];
            
            const customIconsMap = {};
            
            for (const attachment of attachments) {
                const iconElement = await getCustomIconFromAttachment(attachment.id);
                if (iconElement) {
                    customIconsMap[`media_${attachment.id}`] = {
                        element: iconElement,
                        title: attachment.title?.rendered || `Custom Icon ${attachment.id}`,
                        id: attachment.id
                    };
                }
            }
            
            setCustomIcons(customIconsMap);
            if (onCustomIconsChange) {
                onCustomIconsChange(customIconsMap);
            }
        } catch (error) {
            console.error('Error loading custom icons:', error);
        } finally {
            setLoadingCustomIcons(false);
        }
    };

    // Update state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedIconName(currentIconName || '');
            setSelectedColor(currentColor || 'currentColor');
            setSelectedFontSize(currentFontSize || '1.25em');
            // Use external custom icons if available, otherwise load fresh
            if (Object.keys(externalCustomIcons).length > 0) {
                setCustomIcons(externalCustomIcons);
            } else {
                loadCustomIcons();
            }
        }
    }, [isOpen, currentIconName, currentColor, currentFontSize]);
    
    // Get theme colors
    const { colors } = useSelect(select => {
        const settings = select('core/block-editor').getSettings();
        return {
            colors: settings.colors || []
        };
    });
    
    // Combine built-in and custom icons for filtering
    const allIcons = { 
        ...ICON_LIBRARY, 
        ...Object.fromEntries(
            Object.entries(customIcons).map(([key, { element }]) => [key, element])
        )
    };
    const filteredIcons = Object.keys(allIcons).filter(iconName =>
        iconName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customIcons[iconName]?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleIconClick = (iconName) => {
        setSelectedIconName(iconName);
    };

    const handleColorChange = (color) => {
        const newColor = color || 'currentColor';
        setSelectedColor(newColor);
    };

    const handleFontSizeChange = (fontSize) => {
        setSelectedFontSize(fontSize || '1.25em');
    };

    const handleSVGUpload = async (media) => {
        if (!media || !media.url || !media.url.endsWith('.svg')) {
            alert(__('Please select a valid SVG file.', 'pdm-blocks'));
            return;
        }
        
        const iconId = `media_${media.id}`;
        const iconElement = await getCustomIconFromAttachment(media.id);
        
        if (iconElement) {
            const newIconData = {
                element: iconElement,
                title: media.title || `Custom Icon ${media.id}`,
                id: media.id
            };
            const updatedCustomIcons = {
                ...customIcons,
                [iconId]: newIconData
            };
            setCustomIcons(updatedCustomIcons);
            if (onCustomIconsChange) {
                onCustomIconsChange(updatedCustomIcons);
            }
            setSelectedIconName(iconId);
        } else {
            alert(__('Error processing SVG file.', 'pdm-blocks'));
        }
    };

    const handleDeleteCustomIcon = async (iconId) => {
        const iconData = customIcons[iconId];
        if (iconData && window.confirm(__('Delete this custom icon? This will remove it from the media library.', 'pdm-blocks'))) {
            try {
                await wp.data.dispatch('core').deleteEntityRecord('postType', 'attachment', iconData.id);
                const updatedCustomIcons = { ...customIcons };
                delete updatedCustomIcons[iconId];
                setCustomIcons(updatedCustomIcons);
                if (onCustomIconsChange) {
                    onCustomIconsChange(updatedCustomIcons);
                }
                if (selectedIconName === iconId) {
                    setSelectedIconName('');
                }
            } catch (error) {
                alert(__('Error deleting custom icon.', 'pdm-blocks'));
            }
        }
    };

    const handleApply = () => {
        if (selectedIconName) {
            onSelect(selectedIconName, selectedColor, selectedFontSize);
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return createElement(Modal, {
        title: __('Icon Settings', 'pdm-blocks'),
        onRequestClose: handleCancel,
        className: 'accelerate-icon-picker-modal',
        style: { maxWidth: '700px' },
        shouldCloseOnClickOutside: false,
        shouldCloseOnEsc: true,
        focusOnMount: false
    }, [
        createElement('div', { 
            key: 'content',
            style: { padding: '16px' }
        }, [
            // Search
            createElement(SearchControl, {
                key: 'search',
                value: searchTerm,
                onChange: setSearchTerm,
                placeholder: __('Search icons...', 'pdm-blocks'),
                style: { marginBottom: '16px' }
            }),
            
            // Custom icon upload section
            createElement('div', {
                key: 'upload-section',
                style: { marginBottom: '16px' }
            }, [
                createElement('div', {
                    key: 'upload-header',
                    style: { 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '10px'
                    }
                }, [
                    createElement('h4', {
                        key: 'upload-label',
                        style: { margin: '0', fontSize: '14px', fontWeight: '600' }
                    }, __('Upload Custom Icon', 'pdm-blocks')),
                    createElement(MediaUpload, {
                        key: 'upload-button',
                        onSelect: handleSVGUpload,
                        allowedTypes: ['image/svg+xml'],
                        render: ({ open }) => createElement(Button, {
                            variant: 'secondary',
                            size: 'small',
                            onClick: open
                        }, __('Upload SVG', 'pdm-blocks'))
                    })
                ])
            ]),

            // Color picker
            createElement('div', {
                key: 'color-section',
                style: { marginBottom: '20px' }
            }, [
                createElement('h4', {
                    key: 'color-label',
                    style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }
                }, __('Icon Color', 'pdm-blocks')),
                createElement(ColorPalette, {
                    key: 'color-palette',
                    colors: [
                        { name: __('Inherit from text', 'pdm-blocks'), color: 'currentColor' },
                        ...colors
                    ],
                    value: selectedColor,
                    onChange: handleColorChange,
                    clearable: true
                })
            ]),

            // Font size picker
            createElement('div', {
                key: 'fontsize-section',
                style: { marginBottom: '20px' }
            }, [
                createElement('h4', {
                    key: 'fontsize-label',
                    style: { margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }
                }, __('Icon Size', 'pdm-blocks')),
                createElement(FontSizePicker, {
                    key: 'fontsize-picker',
                    value: selectedFontSize,
                    onChange: handleFontSizeChange,
                    fontSizes: [
                        { name: __('Small', 'pdm-blocks'), slug: 'small', size: '0.875em' },
                        { name: __('Normal', 'pdm-blocks'), slug: 'normal', size: '1em' },
                        { name: __('Medium', 'pdm-blocks'), slug: 'medium', size: '1.25em' },
                        { name: __('Large', 'pdm-blocks'), slug: 'large', size: '1.5em' },
                        { name: __('Extra Large', 'pdm-blocks'), slug: 'extra-large', size: '2em' }
                    ],
                    fallbackFontSize: '1.25em',
                    withSlider: true
                })
            ]),
            
            // Icon grid
            createElement('div', {
                key: 'grid',
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                    gap: '10px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '15px',
                    marginBottom: '20px'
                }
            }, filteredIcons.map(iconName => {
                const iconElement = allIcons[iconName];
                const isSelected = iconName === selectedIconName;
                const isCustom = !ICON_LIBRARY[iconName];
                
                return createElement('button', {
                    key: iconName,
                    type: 'button',
                    onClick: () => handleIconClick(iconName),
                    style: {
                        padding: '15px',
                        border: isSelected ? '2px solid #007cba' : '1px solid #ddd',
                        borderRadius: '4px',
                        background: isSelected ? '#e6f3ff' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50px',
                        transition: 'all 0.2s ease'
                    },
                    title: customIcons[iconName] ? customIcons[iconName].title : iconName
                }, createElement('span', {
                    style: { 
                        width: '24px', 
                        height: '24px', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: '#000'
                    }
                }, cloneElement(iconElement, { 
                    style: { 
                        width: '24px', 
                        height: '24px'
                    } 
                })));
            })),

            // Action buttons
            createElement('div', {
                key: 'actions',
                style: { 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '8px',
                    paddingTop: '16px',
                    borderTop: '1px solid #ddd'
                }
            }, [
                createElement(Button, {
                    key: 'cancel',
                    variant: 'tertiary',
                    onClick: handleCancel
                }, __('Cancel', 'pdm-blocks')),
                createElement(Button, {
                    key: 'apply',
                    variant: 'primary',
                    onClick: handleApply,
                    disabled: !selectedIconName
                }, __('Apply', 'pdm-blocks'))
            ])
        ])
    ]);
}

// Font Awesome's exact inline UI pattern
function InlineIconControls({ value, onChange, contentRef, customIcons = {}, onCustomIconsChange }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Font Awesome's deriveAttributes pattern - extract from replacement attributes
    const deriveAttributes = (richTextValue) => {
        if (!richTextValue.replacements || !richTextValue.replacements[richTextValue.start]) {
            return null;
        }
        
        const replacement = richTextValue.replacements[richTextValue.start];
        
        // Extract data from replacement attributes instead of innerHTML
        if (replacement && replacement.type === name) {
            const iconName = replacement.attributes?.['data-icon'] || replacement.unregisteredAttributes?.['data-icon'];
            
            // Extract color and fontSize from style string more reliably
            let color = 'currentColor';
            let fontSize = '1.25em';
            if (replacement.attributes?.style && typeof replacement.attributes.style === 'string') {
                const styleString = replacement.attributes.style;
                const colorMatch = styleString.match(/color:\s*([^;]+)/);
                if (colorMatch && colorMatch[1]) {
                    color = colorMatch[1].trim();
                }
                const fontSizeMatch = styleString.match(/font-size:\s*([^;]+)/);
                if (fontSizeMatch && fontSizeMatch[1]) {
                    fontSize = fontSizeMatch[1].trim();
                }
            }
            
            const result = {
                iconName,
                color,
                fontSize
            };
            return result;
        }
        
        return null;
    };

    // Font Awesome's local state pattern
    const [attributes, setAttributes] = useState(deriveAttributes(value));
    
    const popoverAnchor = useAnchor({
        editableContentElement: contentRef.current,
        settings: {
            tagName: ICON_TAG_NAME,
            className: ICON_CLASS
        }
    });

    // Font Awesome's changeValue pattern
    const changeValue = (newAttributes) => {
        if (!newAttributes || !newAttributes.iconName) {
            return;
        }
        
        // Handle both built-in and custom icons
        let iconElement;
        if (newAttributes.iconName.startsWith('media_')) {
            // For custom icons during editing, get from current customIcons state
            const iconData = customIcons[newAttributes.iconName];
            iconElement = iconData?.element;
        } else {
            iconElement = ICON_LIBRARY[newAttributes.iconName];
        }
        
        if (!iconElement) {
            return;
        }
        
        const styledIcon = cloneElement(iconElement, {
            style: {
                height: '1em',
                boxSizing: 'content-box', 
                display: 'inline-block',
                verticalAlign: 'middle'
            }
        });
        
        // Build style object with color and fontSize
        const styleObj = {};
        if (newAttributes.color !== 'currentColor') {
            styleObj.color = newAttributes.color;
        }
        if (newAttributes.fontSize && newAttributes.fontSize !== '1em') {
            styleObj.fontSize = newAttributes.fontSize;
        }
        
        const iconSvg = renderToString(
            createElement('span', {
                className: ICON_CLASS,
                contentEditable: false,
                'data-icon': newAttributes.iconName,
                style: Object.keys(styleObj).length > 0 ? styleObj : {}
            }, styledIcon)
        );

        // Font Awesome's direct rich text replacement
        let iconValue = create({ html: iconSvg });
        
        const newValue = insert(value, iconValue, value.start, value.start + 1);
        onChange(newValue);
    };

    const handleIconSelect = (iconName, color = 'currentColor', fontSize = '1.25em') => {
        const newAttributes = { iconName, color, fontSize };
        setAttributes(newAttributes);
        changeValue(newAttributes);
    };

    const removeIcon = () => {
        const newValue = insert(value, '', value.start, value.start + 1);
        onChange(newValue);
    };

    return createElement(Fragment, {}, [
        createElement(Popover, {
            key: 'popover',
            placement: 'bottom',
            focusOnMount: false,
            anchor: popoverAnchor,
            className: 'accelerate-icon-inline-popover'
        }, createElement('div', {
            style: { 
                display: 'flex', 
                gap: '8px', 
                padding: '8px',
                alignItems: 'center'
            }
        }, [
            createElement(Button, {
                key: 'change',
                variant: 'secondary',
                size: 'small',
                onClick: () => {
                    const currentAttrs = deriveAttributes(value);
                    setAttributes(currentAttrs);
                    setIsModalOpen(true);
                }
            }, __('Edit', 'pdm-blocks')),
            createElement(Button, {
                key: 'remove',
                variant: 'secondary',
                size: 'small',
                onClick: removeIcon,
                isDestructive: true
            }, __('Remove', 'pdm-blocks'))
        ])),
        
        createElement(IconPickerModal, {
            key: 'modal',
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            onSelect: handleIconSelect,
            currentIconName: attributes?.iconName,
            currentColor: attributes?.color,
            currentFontSize: attributes?.fontSize,
            customIcons: customIcons,
            onCustomIconsChange: onCustomIconsChange
        })
    ]);
}

// Main edit component
function Edit(props) {
    const { value, onChange, contentRef, isObjectActive } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customIcons, setCustomIcons] = useState({});
    
    // Try to determine block type from DOM context if useSelect fails
    const getBlockTypeFromDOM = () => {
        try {
            if (!contentRef.current) return null;
            
            const blockElement = contentRef.current.closest('[data-type]');
            if (blockElement) {
                return blockElement.getAttribute('data-type');
            }
            
            // Fallback checks based on element classes/structure
            const parentClasses = contentRef.current.parentElement?.className || '';
            if (parentClasses.includes('wp-block-button__link')) return 'core/button';
            if (parentClasses.includes('wp-block-paragraph')) return 'core/paragraph';
            if (contentRef.current.closest('h1, h2, h3, h4, h5, h6')) return 'core/heading';
            if (contentRef.current.closest('li')) return 'core/list-item';
            
            return null;
        } catch (error) {
            return null;
        }
    };
    
    // Get current block information to limit icon insertion to specific block types
    const { currentBlockName } = useSelect((select) => {
        try {
            const blockEditorSelect = select('core/block-editor');
            if (!blockEditorSelect || !blockEditorSelect.getSelectedBlockName) {
                return { currentBlockName: getBlockTypeFromDOM() };
            }
            return {
                currentBlockName: blockEditorSelect.getSelectedBlockName()
            };
        } catch (error) {
            return { currentBlockName: getBlockTypeFromDOM() };
        }
    }, []);
    
    // Only allow icon insertion in specific block types
    const allowedBlockTypes = ['core/paragraph', 'core/button', 'core/heading', 'core/list-item'];
    const isAllowedBlockType = currentBlockName ? allowedBlockTypes.includes(currentBlockName) : true;
    
    // Don't render anything if not in an allowed block type
    if (!isAllowedBlockType) {
        return null;
    }

    const handleIconSelect = async (iconName, color = 'currentColor', fontSize = '1.25em') => {
        let iconElement;
        
        if (iconName.startsWith('media_')) {
            const attachmentId = iconName.replace('media_', '');
            iconElement = await getCustomIconFromAttachment(parseInt(attachmentId));
        } else {
            iconElement = ICON_LIBRARY[iconName];
        }
        
        if (!iconElement) return;
        const styledIcon = cloneElement(iconElement, {
            style: {
                height: '1em',
                boxSizing: 'content-box', 
                display: 'inline-block',
                verticalAlign: 'middle'
            }
        });
        
        const styleObj = {};
        if (color !== 'currentColor') {
            styleObj.color = color;
        }
        if (fontSize && fontSize !== '1em') {
            styleObj.fontSize = fontSize;
        }
        
        const iconSvg = renderToString(
            createElement('span', {
                className: ICON_CLASS,
                contentEditable: false,
                'data-icon': iconName,
                style: Object.keys(styleObj).length > 0 ? styleObj : {}
            }, styledIcon)
        );

        const iconWithSpaces = ZERO_WIDTH_SPACE + iconSvg + ZERO_WIDTH_SPACE;
        let iconValue = create({ html: iconWithSpaces });
        iconValue.start = 0;
        iconValue.end = iconValue.text.length;

        const insertStartIndex = value.start;
        const newValue = insert(value, iconValue, insertStartIndex, insertStartIndex);
        onChange(newValue);
    };

    return createElement(Fragment, {}, [
        createElement(BlockControls, { key: 'controls' }, 
            createElement(ToolbarGroup, {}, 
                createElement(ToolbarButton, {
                    icon: createElement('svg', { 
                        viewBox: '0 0 24 24', 
                        width: '24', 
                        height: '24' 
                    }, createElement('path', { 
                        fill: 'currentColor', 
                        d: 'M12 2l-2 7h-7l5.5 4.5-2.5 7.5 6-4.5 6 4.5-2.5-7.5 5.5-4.5h-7z' 
                    })),
                    title: title,
                    onClick: () => setIsModalOpen(true),
                    isActive: isObjectActive
                })
            )
        ),
        
        createElement(IconPickerModal, {
            key: 'modal',
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            onSelect: handleIconSelect,
            currentIconName: '',
            currentColor: 'currentColor',
            onCustomIconsChange: setCustomIcons
        }),
        
        isObjectActive && createElement(InlineIconControls, {
            key: 'inline',
            value: value,
            onChange: onChange,
            contentRef: contentRef,
            customIcons: customIcons,
            onCustomIconsChange: setCustomIcons
        })
    ]);
}

// Format settings
const settings = {
    name,
    title,
    tagName: ICON_TAG_NAME,
    className: ICON_CLASS,
    contentEditable: false,
    attributes: {
        'data-icon': 'data-icon',
        'style': 'style'
    },
    edit: Edit
};

// Register the format
registerFormatType(name, settings);
