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
import { useBlockProps, InnerBlocks, InspectorControls, PanelColorSettings, __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, __experimentalBorderRadiusControl as BorderRadiusControl } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, } from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { DualIconEdit } from '../../components/IconEdit';


export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        maxWidth,
        cornerRadius,
        columns,
        iconPosition,
        toggleBg,
        toggleGradient,
        toggleColor,
        panelBg,
        panelGradient,
        panelColor,
        iconColor,
        bottomBorderEnabled,
        bottomBorderThickness,
        bottomBorderColor,
        shadowEnabled
    } = attributes;

    const style = {
        '--accordion-max-width': maxWidth + 'px',
        '--accordion-radius': typeof cornerRadius === 'object' 
            ? `${cornerRadius.topLeft || '0px'} ${cornerRadius.topRight || '0px'} ${cornerRadius.bottomRight || '0px'} ${cornerRadius.bottomLeft || '0px'}`
            : (cornerRadius || '20px'),
        '--pdm-shadow': shadowEnabled ? 'rgba(0,0,0,.5) 0px 3px 8px' : 'none'
    };
    

    const blockProps = useBlockProps({
        className: "pdm-accordions accord-columns-" + (columns || 1),
        style: style
    });

    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Layout" initialOpen={ true }>
                    <RangeControl
                        label="Max Width"
                        help="Select the maximum width for the accordion"
                        max={1500}
                        min={650}
                        step={50}
                        value={maxWidth}
                        onChange={(val) => { setAttributes({'maxWidth': val})}}
                    />
                    <ToggleGroupControl
                        __next40pxDefaultSize
                        isBlock
                        label="Columns"
                        help="Select the number of columns for the accordions"
                        value={String(columns)}
                        onChange={ ( value ) => setAttributes( { columns: value } ) }
                    >
                        <ToggleGroupControlOption value="1" label="1" />
                        <ToggleGroupControlOption value="2" label="2" />
                    </ToggleGroupControl>
                </PanelBody>

                <PanelBody title={__('Bottom Border Styles', 'pdm-blocks')} initialOpen={false}>
                    <ToggleControl
                        label={__('Enable Bottom Border', 'pdm-blocks')}
                        checked={bottomBorderEnabled}
                        onChange={(val) => setAttributes({ bottomBorderEnabled: val })}
                        help={__('Add a bottom border to accordion titles.', 'pdm-blocks')}
                    />
                    
                    {bottomBorderEnabled && (
                        <>
                            <RangeControl
                                label={__('Border Thickness (px)', 'pdm-blocks')}
                                value={bottomBorderThickness}
                                onChange={(val) => setAttributes({ bottomBorderThickness: val })}
                                min={1}
                                max={10}
                                step={1}
                                help={__('Set the thickness of the bottom border.', 'pdm-blocks')}
                            />
                            <PanelColorSettings
                                title={__('Border Color', 'pdm-blocks')}
                                colorSettings={[
                                    {
                                        value: bottomBorderColor,
                                        onChange: (color) => setAttributes({ bottomBorderColor: color }),
                                        label: __('Border Color', 'pdm-blocks'),
                                    },
                                ]}
                            />
                        </>
                    )}
                    
                    <ToggleControl
                        label={__('Enable Shadow', 'pdm-blocks')}
                        checked={shadowEnabled}
                        onChange={(val) => setAttributes({ shadowEnabled: val })}
                        help={__('Add a shadow to opened accordion items.', 'pdm-blocks')}
                    />
                </PanelBody>
                
                <PanelBody title={__('Border Radius', 'pdm-blocks')} initialOpen={false}>
                    <BorderRadiusControl
                        label={__('Accordion Item Corner Radius', 'pdm-blocks')}
                        values={cornerRadius}
                        onChange={(value) => setAttributes({ cornerRadius: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <DualIconEdit
                attributes={attributes}
                setAttributes={setAttributes}
				defaultIconSize="25px"
            />
                
            <InspectorControls group="color">
                <ColorGradientSettingsDropdown
                    panelId={clientId}
                    settings={[
                        {
                            label: __('Toggle Background', 'pdm-blocks'),
                            colorValue: toggleBg,
                            onColorChange: (color) => setAttributes({ toggleBg: color }),
                            gradientValue: toggleGradient,
                            onGradientChange: (gradient) => setAttributes({ toggleGradient: gradient }),
                        },
                        {
                            label: __('Toggle Text Color', 'pdm-blocks'),
                            colorValue: toggleColor,
                            onColorChange: (color) => setAttributes({ toggleColor: color }),
                        },
                        {
                            label: __('Panel Background', 'pdm-blocks'),
                            colorValue: panelBg,
                            onColorChange: (color) => setAttributes({ panelBg: color }),
                            gradientValue: panelGradient,
                            onGradientChange: (gradient) => setAttributes({ panelGradient: gradient }),
                        },
                        {
                            label: __('Panel Text Color', 'pdm-blocks'),
                            colorValue: panelColor,
                            onColorChange: (color) => setAttributes({ panelColor: color }),
                        },
                    ]}
                    {...colorGradientSettings}
                />
            </InspectorControls>

            <div className="accordion-container">
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={ [ 'pdm/accordion' ] }
                    template={ [ [ 'pdm/accordion' ] ] }
                    templateLock={ false }
                    renderAppender={ () => (
                    <InnerBlocks.ButtonBlockAppender />
                ) }
                />
            </div>
            </div>
        </>
    );
}
