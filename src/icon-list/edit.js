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
import { 
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	InnerBlocks,
	BlockVerticalAlignmentToolbar
} from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import IconEdit from '../../components/IconEdit';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {

	const ALLOWED_BLOCKS = ['pdm/icon-list-item'];

	const blockProps = useBlockProps({
		className: 'pdm-icon-list' + (attributes.verticalAlignment ? ` is-vertically-aligned-${attributes.verticalAlignment}` : '')
	});

	const innerBlocksProps = useInnerBlocksProps(blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		template: [
			['pdm/icon-list-item'],
			['pdm/icon-list-item'],
			['pdm/icon-list-item'],
		],
		renderAppender: InnerBlocks.ButtonBlockAppender
	});

	return (
		<>
			<IconEdit 
				attributes={attributes}
				setAttributes={setAttributes}
				label="Icon Settings"
				initialOpen={true}
			/>
			<BlockControls>
                <BlockVerticalAlignmentToolbar
                    value={attributes.verticalAlignment}
                    onChange={(newAlignment) => setAttributes({ verticalAlignment: newAlignment })}
					controls={['top', 'center', 'bottom', 'stretch']}
                />
			</BlockControls>

			<div {...innerBlocksProps} />
		</>
	);
}
