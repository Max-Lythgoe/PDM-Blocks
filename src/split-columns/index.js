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

const toGap = (val) => typeof val === 'number' ? val + 'px' : val;

const deprecatedSave = ({ attributes }) => {
    const style = {
        '--column-sizing': attributes.columnSizing + '%',
        '--h-gap': toGap(attributes.horizontalGap),
        '--v-gap': toGap(attributes.verticalGap),
        '--row-direction': attributes.rowDirection ? 'row-reverse' : 'row',
        '--stack-order': attributes.stackOrder ? 'column-reverse' : 'column',
    };
    const className = `pdm-split-columns stack-${attributes.verticalStack} ${attributes.verticalAlignment ? `is-vertically-aligned-${attributes.verticalAlignment}` : ''}`;
    const blockProps = useBlockProps.save({ className, style });
    return <div {...blockProps}><InnerBlocks.Content /></div>;
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
                horizontalGap: { type: 'number', default: 40 },
                verticalGap:   { type: 'number', default: 20 },
            },
            save: deprecatedSave,
        }
    ],
    save: ({ attributes }) => {
        const style = {
            '--column-sizing': attributes.columnSizing + '%',
			'--h-gap': attributes.horizontalGap,
			'--v-gap': attributes.verticalGap,
			'--row-direction': attributes.rowDirection ? 'row-reverse' : 'row',
			'--stack-order': attributes.stackOrder ? 'column-reverse' : 'column',
        };

        const className = `pdm-split-columns stack-${attributes.verticalStack} ${attributes.verticalAlignment ? `is-vertically-aligned-${attributes.verticalAlignment}` : ''}`;
		

        const blockProps = useBlockProps.save({
            className: className,
            style: style
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    }
} );
