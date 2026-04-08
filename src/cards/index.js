/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import icon from './icon';

// Save without --align-bottom (before alignBottom attribute was added)
const deprecatedSave = ({ attributes }) => {
    const style = {
        '--desktop-columns': `${attributes.desktopColumns}`,
        '--tablet-columns': `${attributes.tabletColumns}`,
        '--mobile-columns': `${attributes.mobileColumns}`,
        '--desktop-gap': typeof attributes.desktopGap === 'number' ? attributes.desktopGap + 'px' : attributes.desktopGap,
        '--tablet-gap': typeof attributes.tabletGap === 'number' ? attributes.tabletGap + 'px' : attributes.tabletGap,
        '--mobile-gap': typeof attributes.mobileGap === 'number' ? attributes.mobileGap + 'px' : attributes.mobileGap,
    };

    const verticalAlignClass = attributes.verticalAlignment
        ? `is-vertically-aligned-${attributes.verticalAlignment}`
        : '';

    const justificationClass = attributes.justifyContent 
        ? `is-justified-${attributes.justifyContent.replace('flex-', '').replace('space-between', 'space-between')}` 
        : '';

    const blockProps = useBlockProps.save({
        className: `pdm-cards ${verticalAlignClass} ${justificationClass}`.trim(),
        style: style
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
};

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
    icon: icon.svg,
    edit: Edit,
    deprecated: [
        {
            attributes: {
                ...metadata.attributes,
                desktopGap: { type: 'number', default: 20 },
                tabletGap:  { type: 'number', default: 20 },
                mobileGap:  { type: 'number', default: 20 },
            },
            save: deprecatedSave,
        }
    ],
    save: ({ attributes }) => {
        const style = {
            '--desktop-columns': `${attributes.desktopColumns}`,
            '--tablet-columns': `${attributes.tabletColumns}`,
            '--mobile-columns': `${attributes.mobileColumns}`,
            '--desktop-gap': attributes.desktopGap,
            '--tablet-gap': attributes.tabletGap,
            '--mobile-gap': attributes.mobileGap,
            '--align-bottom': attributes.alignBottom ? 'auto' : 'initial'
        };

        const verticalAlignClass = attributes.verticalAlignment
            ? `is-vertically-aligned-${attributes.verticalAlignment}`
            : '';

        // Map justifyContent values to class names
        const justificationClass = attributes.justifyContent 
            ? `is-justified-${attributes.justifyContent.replace('flex-', '').replace('space-between', 'space-between')}` 
            : '';

        const blockProps = useBlockProps.save({
            className: `pdm-cards ${verticalAlignClass} ${justificationClass}`.trim(),
            style: style
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    }
} );
