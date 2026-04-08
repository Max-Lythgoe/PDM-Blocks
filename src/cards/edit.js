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
import { useBlockProps, InnerBlocks, BlockControls, InspectorControls, BlockVerticalAlignmentToolbar, JustifyContentControl } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl,  __experimentalUnitControl as UnitControl } from '@wordpress/components';
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

export default function Edit({attributes, setAttributes, clientId}) {
    const ALLOWED_BLOCKS = [ 'pdm/card' ];

    const TEMPLATE = Array.from({ length: attributes.desktopColumns }, () => ['pdm/card', {}]);

    const style = {
        '--desktop-columns': attributes.desktopColumns,
        '--tablet-columns': attributes.tabletColumns,
        '--mobile-columns': attributes.mobileColumns,
        '--desktop-gap': attributes.desktopGap,
        '--tablet-gap': attributes.tabletGap,
        '--mobile-gap': attributes.mobileGap,
        '--align-bottom': attributes.alignBottom ? 'auto' : 'initial'
    };

    // Map justifyContent values to class names
    const justificationClass = attributes.justifyContent ? `is-justified-${attributes.justifyContent.replace('flex-', '').replace('space-between', 'space-between')}` : '';
    
    const blockProps = useBlockProps({
        className: [
            attributes.verticalAlignment ? `is-vertically-aligned-${attributes.verticalAlignment}` : '',
            justificationClass
        ].filter(Boolean).join(' '),
        style: style
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Desktop">
                    <RangeControl
                        label="Desktop Columns"
                        help="Select the number of columns to display on desktop"
                        max={6}
                        min={1}
                        step={1}
                        value={attributes.desktopColumns}
                        onChange={(val) => { setAttributes({'desktopColumns': val})}}
                    />
                    <UnitControl
                        __next40pxDefaultSize
                        label="Desktop Column Gap"
                        help="Select the gap between columns on desktop"
                        value={attributes.desktopGap}
                        onChange={(val) => { setAttributes({ desktopGap: val }) }}
                    />
                    <ToggleControl
                        label="Align last block to the bottom"
                        help="Align the last block to the bottom of the card, useful for buttons at the bottom of the card. This only affects the frontend and has no effect in the editor to allow for easier editing."
                        checked={attributes.alignBottom}
                        onChange={(val) => { setAttributes({'alignBottom': val})}}
                    />
					</PanelBody>
					<PanelBody title="Tablet & Mobile" initialOpen={false}>			
                    <RangeControl
                        label="Tablet Columns"
                        help="Select the number of columns to display on tablet"
                        max={4}
                        min={1}
                        step={1}
                        value={attributes.tabletColumns}
                        onChange={(val) => { setAttributes({'tabletColumns': val})}}
                    />
                    <UnitControl
                        __next40pxDefaultSize
                        label="Tablet Column Gap"
                        help="Select the gap between columns on tablet"
                        value={attributes.tabletGap}
                        onChange={(val) => { setAttributes({ tabletGap: val }) }}
                    />
                    <RangeControl
                        label="Mobile Columns"
                        help="Select the number of columns to display on mobile"
                        max={2}
                        min={1}
                        step={1}
                        value={attributes.mobileColumns}
                        onChange={(val) => { setAttributes({'mobileColumns': val})}}
                    />
                    <UnitControl
                        __next40pxDefaultSize
                        label="Mobile Column Gap"
                        help="Select the gap between columns on mobile"
                        value={attributes.mobileGap}
                        onChange={(val) => { setAttributes({ mobileGap: val }) }}
                    />
                </PanelBody>
            </InspectorControls>
			<BlockControls>
                <BlockVerticalAlignmentToolbar
                    value={attributes.verticalAlignment}
                    onChange={(newAlignment) => setAttributes({ verticalAlignment: newAlignment })}
					controls={['top', 'center', 'bottom', 'stretch']}
                />
				<JustifyContentControl
					value={attributes.justifyContent}
					onChange={(value) => setAttributes({ justifyContent: value })}
				/>
            </BlockControls>
            <div {...blockProps}>
                <InnerBlocks template={TEMPLATE} allowedBlocks={ALLOWED_BLOCKS} orientation="horizontal" templateLock={false} renderAppender={InnerBlocks.ButtonBlockAppender} />
            </div>
        </>
    );
}