import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import IconRender from '../../components/IconRender';

const v1 = {
	attributes: {
		iconSize: { type: 'number', default: 30 },
		iconColor: { type: 'string', default: 'currentColor' },
	},
	save( { attributes } ) {
		const blockProps = useBlockProps.save( {
			className: 'pdm-icon-list-item',
			style: {
				'--icon-size': `${ attributes.iconSize || 30 }px`,
				'--icon-color': attributes.iconColor || 'currentColor',
			},
		} );

		return (
			<div { ...blockProps }>
				<div className="pdm-icon-list-item__icon">
					<IconRender
						attributes={ attributes }
						defaultIcon="check"
						className="pdm-icon-list-item__icon-svg"
					/>
				</div>
				<div className="pdm-icon-list-item__content">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
};

export default [ v1 ];
