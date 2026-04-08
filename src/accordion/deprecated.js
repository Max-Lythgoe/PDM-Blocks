import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';
import { DualIconRender } from '../../components/IconRender';

const v1 = {
	attributes: {
		accordionTitle: { type: 'string' },
		iconPosition: { type: 'string', default: 'right' },
		iconOpen: { type: 'string', default: 'plus' },
		customIconUrlOpen: { type: 'string' },
		customIconSvgOpen: { type: 'string' },
		iconClose: { type: 'string', default: 'minus' },
		customIconUrlClose: { type: 'string' },
		customIconSvgClose: { type: 'string' },
		iconSize: { type: 'number', default: 25 },
		iconColor: { type: 'string', default: 'currentColor' },
		useCustomColor: { type: 'boolean', default: false },
	},
	save( { attributes } ) {
		const { openIcon, closeIcon } = DualIconRender( {
			attributes,
			openDefault: 'plus',
			closeDefault: 'minus',
		} );

		return (
			<details { ...useBlockProps.save( {
				style: {
					'--pdm-icon-size': `${ attributes.iconSize || 25 }px`,
					'--pdm-icon-color': attributes.iconColor || 'currentColor',
				},
			} ) } name="pdm-accordion">
				<summary className={ `accord-title icon-position-${ attributes.iconPosition || 'right' }` }>
					<RichText.Content
						tagName="span"
						className="accord-title-text"
						value={ attributes.accordionTitle }
					/>
					{ openIcon }
					{ closeIcon }
				</summary>
				<div className="accord-panel">
					<InnerBlocks.Content />
				</div>
			</details>
		);
	},
};

export default [ v1 ];
