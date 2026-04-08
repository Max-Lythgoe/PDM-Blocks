import { useBlockProps } from '@wordpress/block-editor';
import IconRender from '../../components/IconRender';

const v1 = {
	attributes: {
		iconAlign: { type: 'string', default: 'center' },
		url: { type: 'string' },
		linkTarget: { type: 'string' },
		rel: { type: 'string' },
	},
	save( { attributes } ) {
		const { iconAlign, url, linkTarget, rel } = attributes;

		const getJustifyContent = ( alignment ) => {
			switch ( alignment ) {
				case 'left':
					return 'flex-start';
				case 'right':
					return 'flex-end';
				case 'center':
				default:
					return 'center';
			}
		};

		const wrapperProps = useBlockProps.save( {
			style: {
				display: 'flex',
				justifyContent: getJustifyContent( iconAlign ),
			},
		} );

		const content = (
			<IconRender
				attributes={ attributes }
				defaultIcon="check"
				className="pdm-icon-display"
			/>
		);

		if ( url ) {
			const linkProps = {
				...wrapperProps,
				href: url,
				...( linkTarget && { target: linkTarget } ),
				...( rel && { rel: rel } ),
			};
			return <a { ...linkProps }>{ content }</a>;
		}

		return <div { ...wrapperProps }>{ content }</div>;
	},
};

export default [ v1 ];
