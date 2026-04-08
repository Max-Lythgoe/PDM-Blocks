/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { DualIconRender } from '../../components/IconRender';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */

export default function save( { attributes } ) {
    // Get icon elements using DualIconRender
    const { openIcon, closeIcon } = DualIconRender({
        attributes,
        openDefault: 'plus',
        closeDefault: 'minus'
    });
    
    return (
        <details { ...useBlockProps.save({
            style: {
                '--pdm-icon-size': `${attributes.iconSize || 25}px`,
                '--pdm-icon-color': attributes.iconColor || 'currentColor'
            }
        }) } name="pdm-accordion">
            <summary className={`accord-title icon-position-${attributes.iconPosition || 'right'}`}>
                <RichText.Content
                    tagName="span"
                    className="accord-title-text"
                    value={attributes.accordionTitle}
                />
                {openIcon}
                {closeIcon}
            </summary>
            <div className="accord-panel">
                <InnerBlocks.Content />
            </div>
        </details>
    );
}
