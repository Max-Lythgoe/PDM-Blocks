/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { formatListNumbered, formatListBullets, close } from '@wordpress/icons';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { listStyle } = attributes;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ formatListNumbered }
						label="Numbered"
						isPressed={ listStyle === 'numbers' }
						onClick={ () => setAttributes( { listStyle: 'numbers' } ) }
					/>
					<ToolbarButton
						icon={ formatListBullets }
						label="Bullets"
						isPressed={ listStyle === 'bullets' }
						onClick={ () => setAttributes( { listStyle: 'bullets' } ) }
					/>
					<ToolbarButton
						icon={ close }
						label="No bullets"
						isPressed={ listStyle === 'none' }
						onClick={ () => setAttributes( { listStyle: 'none' } ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<div { ...useBlockProps( { className: listStyle ? `toc-list-style-${ listStyle }` : '' } ) }>
				<ServerSideRender
					block="pdm/table-of-contents"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
