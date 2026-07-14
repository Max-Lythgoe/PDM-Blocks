/**
 * Balance Text - Add text-wrap: balance toggle to heading and paragraph blocks
 * Migrated from PDM Accelerate theme to PDM Blocks plugin
 */
const TARGET_BLOCKS = ['core/heading', 'core/paragraph'];

const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { createElement, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;
const { __ } = wp.i18n;

/**
 * Add text balance toggle to heading and paragraph blocks
 */

// Add the attribute to store the balance state
const addBalanceAttribute = (settings, name) => {
    if (!TARGET_BLOCKS.includes(name)) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            textBalance: {
                type: 'boolean',
                default: false,
            },
        },
    };
};

addFilter(
    'blocks.registerBlockType',
    'accelerate/heading-balance-attribute',
    addBalanceAttribute
);

// Add the control in the Styles tab
const withBalanceControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes, name } = props;
        
        if (!TARGET_BLOCKS.includes(name)) {
            return createElement(BlockEdit, props);
        }

        const { textBalance } = attributes;

        // Apply the style directly to the block wrapper props
        if (textBalance) {
            const existingStyle = props.style || {};
            props = {
                ...props,
                style: {
                    ...existingStyle,
                    textWrap: 'balance'
                },
                className: `${props.className || ''} has-text-balance`.trim()
            };
        }

        return createElement(
            Fragment,
            null,
            createElement(BlockEdit, props),
            createElement(
                InspectorControls,
                { group: 'styles' },
                createElement(
                    PanelBody,
                    {
                        title: __('Balance Text', 'pdm-blocks'),
                        initialOpen: false,
                    },
                    createElement(ToggleControl, {
                        label: __('Balance Text', 'pdm-blocks'),
                        help: __('Apply text-wrap: balance for better line breaking.', 'pdm-blocks'),
                        checked: textBalance,
                        onChange: (value) => setAttributes({ textBalance: value }),
                    })
                )
            )
        );
    };
}, 'withBalanceControl');

addFilter(
    'editor.BlockEdit',
    'accelerate/heading-balance-control',
    withBalanceControl
);

// Add the CSS class and inline style to both editor and save
const addBalanceProps = (extraProps, blockType, attributes) => {
    if (!TARGET_BLOCKS.includes(blockType.name)) {
        return extraProps;
    }

    const { textBalance } = attributes;

    if (textBalance) {
        const existingStyle = extraProps.style || {};
        
        return {
            ...extraProps,
            className: `${extraProps.className || ''} has-text-balance`.trim(),
            style: {
                ...existingStyle,
                textWrap: 'balance'
            }
        };
    }

    return extraProps;
};

// Apply to both editor and save - this ensures it works everywhere
addFilter(
    'blocks.getBlockProps',
    'accelerate/heading-balance-props',
    addBalanceProps
);

addFilter(
    'blocks.getSaveContent.extraProps',
    'accelerate/heading-balance-save-props',
    addBalanceProps
);
