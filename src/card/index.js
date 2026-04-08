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
import deprecated from './deprecated';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import icon from './icon';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	icon: icon.svg,
	edit: Edit,
	deprecated,
	save: ({ attributes }) => {
		const { url, linkTarget, rel, verticalAlignment } = attributes;

		const blockProps = useBlockProps.save({
			className: `is-vertically-aligned-${verticalAlignment || 'top'}`
		});

		return (
			<div { ...blockProps }>
				{url && (
					<a
						className="pdm-card-link"
						href={url}
						{...(linkTarget && { target: linkTarget })}
						{...(rel && { rel: rel })}
						aria-hidden="true"
						tabIndex="-1"
					/>
				)}
				<InnerBlocks.Content />
			</div>
		);
	}
} );
