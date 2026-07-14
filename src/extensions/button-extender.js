/**
 * Button Extender - Company Phone for core/button block
 * Adds phone link/text toggles and location selection to button blocks
 * Migrated from PDM Accelerate theme to PDM Blocks plugin
 */

const { addFilter } = wp.hooks;
const { createElement, Fragment } = wp.element;
const { ToggleControl, PanelBody, SelectControl } = wp.components;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;

// 1. Add new attributes to the core/button block
function accelerateAddButtonAttributes( settings, name ) {
    if ( name !== 'core/button' ) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            accelerateIsPhoneLink: {
                type: 'boolean',
                default: false,
            },
            accelerateIsPhoneText: {
                type: 'boolean',
                default: false,
            },
            acceleratePhoneLocation: {
                type: 'number',
                default: 0,
            },
        },
    };
}
addFilter(
    'blocks.registerBlockType',
    'accelerate/add-button-attributes',
    accelerateAddButtonAttributes
);


// 2. Add custom controls and editor-time link/text replacement
const accelerateButtonEdit = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const { name, attributes, setAttributes } = props;
    const { url, text, accelerateIsPhoneLink, accelerateIsPhoneText, acceleratePhoneLocation } = attributes;
        
        // Only target the core Button block
        if ( name !== 'core/button' ) {
            return createElement(BlockEdit, props);
        }
        
    // The locations data passed from PHP (localized). Use locations[0] as default when present.
    const locations = Array.isArray(accelerateButtonData.locations) ? accelerateButtonData.locations : [];
    const defaultLocation = locations.length > 0 ? locations[0] : null;
    const defaultPhoneLink = defaultLocation ? defaultLocation.phoneLink : '';
    const defaultPhoneText = defaultLocation ? defaultLocation.phone : '';
    const selectedIndex = Number.isFinite(Number(acceleratePhoneLocation)) ? Number(acceleratePhoneLocation) : 0;
        
        // --- LOGIC TO DYNAMICALLY UPDATE ATTRIBUTES IN EDITOR ---
        
        let newUrl = url;
        let newText = text;

        if ( accelerateIsPhoneLink ) {
            if (locations.length > 0) {
                const sel = locations.find(l => l.index === selectedIndex);
                if (sel && sel.phoneLink) {
                    newUrl = sel.phoneLink;
                } else if (defaultPhoneLink) {
                    newUrl = defaultPhoneLink;
                }
            } else if (defaultPhoneLink) {
                newUrl = defaultPhoneLink;
            }
        }
        
        if ( accelerateIsPhoneText ) {
            if (locations.length > 0) {
                const sel = locations.find(l => l.index === selectedIndex);
                if (sel && sel.phone) {
                    newText = sel.phone;
                } else if (defaultPhoneText) {
                    newText = defaultPhoneText;
                }
            } else if (defaultPhoneText) {
                newText = defaultPhoneText;
            }
        }

        const modifiedProps = {
            ...props,
            attributes: {
                ...attributes,
                url: newUrl,
                text: newText
            }
        };

        return createElement(
            Fragment,
            null,
            createElement(BlockEdit, modifiedProps),
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    {
                        title: wp.i18n.__('Company Phone Settings', 'pdm-blocks'),
                        initialOpen: false,
                    },
                    locations.length > 1 && createElement(SelectControl, {
                        label: wp.i18n.__('Select Location', 'pdm-blocks'),
                        value: selectedIndex,
                        options: locations.map(function(l){ return { label: l.label || `Location ${l.index + 1}`, value: l.index }; }),
                        onChange: (val) => setAttributes({ acceleratePhoneLocation: parseInt(val, 10) }),
                    }),
                    createElement(ToggleControl, {
                        label: wp.i18n.__('Use Company Phone for Link (tel:)', 'pdm-blocks'),
                        checked: accelerateIsPhoneLink,
                        onChange: (value) => setAttributes({ accelerateIsPhoneLink: value }),
                        help: accelerateIsPhoneLink ? `Link will be: ${ locations.length > 0 ? ((locations.find(l=>l.index===selectedIndex)||{}).phoneLink || defaultPhoneLink) : defaultPhoneLink }` : '',
                    }),
                    createElement(ToggleControl, {
                        label: wp.i18n.__('Use Company Phone for Button Text', 'pdm-blocks'),
                        checked: accelerateIsPhoneText,
                        onChange: (value) => setAttributes({ accelerateIsPhoneText: value }),
                        help: accelerateIsPhoneText ? `Text will be: ${ locations.length > 0 ? ((locations.find(l=>l.index===selectedIndex)||{}).phone || defaultPhoneText) : defaultPhoneText }` : '',
                    })
                )
            )
        );
    };
}, 'accelerateButtonEdit' );

addFilter(
    'editor.BlockEdit',
    'accelerate/accelerate-button-edit',
    accelerateButtonEdit
);
