/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls, BlockControls, BlockVerticalAlignmentControl } from '@wordpress/block-editor';
import { ToggleControl, RangeControl, SelectControl, __experimentalNumberControl as NumberControl, __experimentalToolsPanel as ToolsPanel, __experimentalToolsPanelItem as ToolsPanelItem } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import BackgroundMediaEdit from '../../components/BackgroundMediaEdit';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { imgURL, useMinHeight, minHeight, imageURL, videoURL, moveBehindHeader, verticalAlignment, layout, responsiveBreakpoint, backgroundAspectRatio, contentOrder, responsiveIgnoreHeader } = attributes;

	// Ensure layout attribute is explicitly set on block creation
	useEffect(() => {
		if (!layout) {
			setAttributes({ 
				layout: { 
					type: 'constrained' 
				} 
			});
		}
	}, []);

	const blockProps = useBlockProps({
		className: `${(imageURL || videoURL) ? 'has-bg-image' : ''} ${verticalAlignment ? `is-vertically-aligned-${verticalAlignment}` : ''} ${responsiveBreakpoint > 0 ? `responsive-at-${responsiveBreakpoint} responsive-block` : ''} ${contentOrder === 'above' ? 'content-above' : ''} ${moveBehindHeader && responsiveIgnoreHeader ? 'responsive-ignore-header' : ''}`.trim(),
		style: useMinHeight ? { minHeight: `${minHeight}vh` } : {},
	})

    return (
        <div { ...blockProps }>
            <BlockControls group="block">
                <BlockVerticalAlignmentControl
                    value={ verticalAlignment }
                    onChange={ ( value ) => setAttributes( { verticalAlignment: value } ) }
                />
            </BlockControls>
            <InspectorControls>
                <ToolsPanel
                    className="pdm-section-tools-panel"
                    label={ __( 'Additional Settings', 'pdm-blocks' ) }
                    resetAll={ () => setAttributes( { useMinHeight: false, minHeight: 50, moveBehindHeader: false, responsiveIgnoreHeader: true, responsiveBreakpoint: 0, backgroundAspectRatio: '16/9', contentOrder: 'below' } ) }
                >
                    <ToolsPanelItem
                        hasValue={ () => useMinHeight !== false }
                        label={ __( 'Minimum Height', 'pdm-blocks' ) }
                        onDeselect={ () => setAttributes( { useMinHeight: false, minHeight: 50 } ) }
                        isShownByDefault={ false }
                    >
                        <ToggleControl
                            label={ __( 'Use Minimum Height', 'pdm-blocks' ) }
                            checked={ useMinHeight }
                            onChange={ ( value ) => setAttributes( { useMinHeight: value } ) }
                        />
                        { useMinHeight && (
                            <RangeControl
                                label={ __( 'Minimum Height (vh)', 'pdm-blocks' ) }
                                value={ minHeight }
                                onChange={ ( value ) => setAttributes( { minHeight: value } ) }
                                min={ 10 }
                                max={ 100 }
                                step={ 5 }
                            />
                        ) }
                    </ToolsPanelItem>
                    <ToolsPanelItem
                        hasValue={ () => moveBehindHeader !== false }
                        label={ __( 'Move Behind Header', 'pdm-blocks' ) }
                        onDeselect={ () => setAttributes( { moveBehindHeader: false, responsiveIgnoreHeader: true } ) }
                        isShownByDefault={ false }
                    >
                        <ToggleControl
                            label={ __( 'Move Behind Header', 'pdm-blocks' ) }
                            checked={ moveBehindHeader }
                            onChange={ ( value ) => setAttributes( { moveBehindHeader: value } ) }
                        />
                        { moveBehindHeader && (
                            <ToggleControl
                                label={ __( 'Ignore Header in Responsive Mode', 'pdm-blocks' ) }
                                checked={ responsiveIgnoreHeader }
                                onChange={ ( value ) => setAttributes( { responsiveIgnoreHeader: value } ) }
                            />
                        ) }
                    </ToolsPanelItem>
                    <ToolsPanelItem
                        hasValue={ () => responsiveBreakpoint > 0 }
                        label={ __( 'Responsive Breakpoint', 'pdm-blocks' ) }
                        onDeselect={ () => setAttributes( { responsiveBreakpoint: 0, backgroundAspectRatio: '16/9', contentOrder: 'below' } ) }
                        isShownByDefault={ false }
                    >
                        <ToggleControl
                            label={ __( 'Enable Responsive Breakpoint', 'pdm-blocks' ) }
                            checked={ responsiveBreakpoint > 0 }
                            onChange={ ( enabled ) => setAttributes( { responsiveBreakpoint: enabled ? 1024 : 0 } ) }
                        />
                        { responsiveBreakpoint > 0 && (
                            <>
                                <NumberControl
                                    label={ __( 'Breakpoint (px)', 'pdm-blocks' ) }
                                    value={ responsiveBreakpoint }
                                    onChange={ ( value ) => setAttributes( { responsiveBreakpoint: parseInt( value ) || 0 } ) }
                                    min={ 320 }
                                    max={ 2560 }
                                    step={ 1 }
                                />
                                <SelectControl
                                    label={ __( 'Background Aspect Ratio', 'pdm-blocks' ) }
                                    value={ backgroundAspectRatio }
                                    options={ [
                                        { label: __( '16:9 (Widescreen)', 'pdm-blocks' ), value: '16/9' },
                                        { label: __( '4:3 (Traditional)', 'pdm-blocks' ), value: '4/3' },
                                        { label: __( '1:1 (Square)', 'pdm-blocks' ), value: '1/1' },
                                        { label: __( '3:2 (Photo)', 'pdm-blocks' ), value: '3/2' },
                                        { label: __( '21:9 (Ultra Wide)', 'pdm-blocks' ), value: '21/9' },
                                    ] }
                                    onChange={ ( value ) => setAttributes( { backgroundAspectRatio: value } ) }
                                />
                                <SelectControl
                                    label={ __( 'Content Order', 'pdm-blocks' ) }
                                    value={ contentOrder }
                                    options={ [
                                        { label: __( 'Content Below Background', 'pdm-blocks' ), value: 'below' },
                                        { label: __( 'Content Above Background', 'pdm-blocks' ), value: 'above' },
                                    ] }
                                    onChange={ ( value ) => setAttributes( { contentOrder: value } ) }
                                />
                            </>
                        ) }
                    </ToolsPanelItem>
                </ToolsPanel>
            </InspectorControls>
            
            <div className={`section-flex-container ${contentOrder === 'above' ? 'content-first' : 'content-last'}`}>
                <BackgroundMediaEdit
                    attributes={ attributes }
                    setAttributes={ setAttributes }
                />

                <div className="content-wrapper">
                    <InnerBlocks templateLock={false} />
                </div>
            </div>
        </div>
    );
}
