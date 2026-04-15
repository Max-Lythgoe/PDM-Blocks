import { useBlockProps } from '@wordpress/block-editor';
import IconRender from '../../components/IconRender';

// v2: iconSize stored as number — migrated to string with unit
const v2 = {
	attributes: {
		selectedIcon: { type: 'string', default: 'check' },
		customIconUrl: { type: 'string' },
		customIconSvg: { type: 'string' },
		iconSize: { type: 'number', default: 75 },
		iconColor: { type: 'string', default: 'currentColor' },
		useCustomColor: { type: 'boolean', default: false },
		iconAlign: { type: 'string', default: 'center' },
		url: { type: 'string', source: 'attribute', selector: 'a', attribute: 'href' },
		linkTarget: { type: 'string', source: 'attribute', selector: 'a', attribute: 'target' },
		rel: { type: 'string', source: 'attribute', selector: 'a', attribute: 'rel' },
	},
	migrate( attributes ) {
		const { iconSize, ...rest } = attributes;
		return {
			...rest,
			iconSize: iconSize != null ? `${iconSize}px` : '75px',
		};
	},
	save( { attributes } ) {
		const { iconAlign, url, linkTarget, rel } = attributes;

		const getJustifyContent = ( alignment ) => {
			switch ( alignment ) {
				case 'left': return 'flex-start';
				case 'right': return 'flex-end';
				case 'center':
				default: return 'center';
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

export default [ v2, v1 ];
