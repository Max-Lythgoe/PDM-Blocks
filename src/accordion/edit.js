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

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { DualIconRender } from '../../components/IconRender';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { useEffect } from 'react';

export default function Edit({ attributes, setAttributes, context, clientId }) {
    // Prevent spacebar from toggling details while typing
    const handleSummaryKeyUp = (event) => {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    };

    // sync context with attributes
    useEffect(() => {
        const updates = {};
        if (context['pdm/iconPosition'] && context['pdm/iconPosition'] !== attributes.iconPosition) {
            updates.iconPosition = context['pdm/iconPosition'];
        }
        if (context['pdm/iconOpen'] && context['pdm/iconOpen'] !== attributes.iconOpen) {
            updates.iconOpen = context['pdm/iconOpen'];
        }
        if (context['pdm/customIconUrlOpen'] !== attributes.customIconUrlOpen) {
            updates.customIconUrlOpen = context['pdm/customIconUrlOpen'];
        }
        if (context['pdm/customIconSvgOpen'] !== attributes.customIconSvgOpen) {
            updates.customIconSvgOpen = context['pdm/customIconSvgOpen'];
        }
        if (context['pdm/iconClose'] && context['pdm/iconClose'] !== attributes.iconClose) {
            updates.iconClose = context['pdm/iconClose'];
        }
        if (context['pdm/customIconUrlClose'] !== attributes.customIconUrlClose) {
            updates.customIconUrlClose = context['pdm/customIconUrlClose'];
        }
        if (context['pdm/customIconSvgClose'] !== attributes.customIconSvgClose) {
            updates.customIconSvgClose = context['pdm/customIconSvgClose'];
        }
        if (context['pdm/iconSize'] && context['pdm/iconSize'] !== attributes.iconSize) {
            updates.iconSize = context['pdm/iconSize'];
        }
        if (context['pdm/iconColor'] && context['pdm/iconColor'] !== attributes.iconColor) {
            updates.iconColor = context['pdm/iconColor'];
        }
        if (context['pdm/useCustomColor'] !== undefined && context['pdm/useCustomColor'] !== attributes.useCustomColor) {
            updates.useCustomColor = context['pdm/useCustomColor'];
        }
        if (Object.keys(updates).length > 0) {
            setAttributes(updates);
        }
    }, [context, attributes, setAttributes]);

    // Get icon elements using DualIconRender
    const { openIcon, closeIcon } = DualIconRender({
        attributes,
        openDefault: 'plus',
        closeDefault: 'minus'
    });

    return (
        <details { ...useBlockProps({
            style: {
                '--pdm-icon-size': `${attributes.iconSize || 25}px`,
                '--pdm-icon-color': attributes.iconColor || 'currentColor'
            }
        }) } name="pdm-accordion">
            <summary
                className={`accord-title icon-position-${attributes.iconPosition || 'right'}`}
                onKeyUp={handleSummaryKeyUp}
                style={{
                    background: context['pdm/toggleGradient'] || context['pdm/toggleBg'] || '#000000',
                    color: context['pdm/toggleColor'] || '#ffffff',
                    borderBottom: context['pdm/bottomBorderEnabled'] ? 
                        `${context['pdm/bottomBorderThickness'] || 1}px solid ${context['pdm/bottomBorderColor'] || 'var(--wp--preset--color--contrast)'}` : 
                        'none'
                }}
            >
                <RichText
                    tagName="span"
                    className="accord-title-text"
                    value={ attributes.accordionTitle }
                    onChange={ ( title ) => setAttributes( { accordionTitle: title } ) }
                    placeholder={ __( 'Accordion Title', 'pdm-blocks' ) }
                />
                {openIcon}
                {closeIcon}
            </summary>
            <div
                className="accord-panel"
                style={{
                    background: context['pdm/panelGradient'] || context['pdm/panelBg'] || '#ffffff',
                    color: context['pdm/panelColor'] || '#000000'
                }}
            >
                <InnerBlocks
					template={ [ [ 'core/paragraph', { placeholder: 'Accordion Content' } ] ] }
				/>
            </div>
        </details>
    );
}
