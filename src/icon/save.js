import { useBlockProps } from '@wordpress/block-editor';
import IconRender from '../../components/IconRender';

export default function save({ attributes }) {
	const { iconAlign, url, linkTarget, rel } = attributes;

	const getJustifyContent = (alignment) => {
		switch (alignment) {
			case 'left':
				return 'flex-start';
			case 'right':
				return 'flex-end';
			case 'center':
			default:
				return 'center';
		}
	};

	const wrapperProps = useBlockProps.save({
		style: {
			display: 'flex',
			justifyContent: getJustifyContent(iconAlign)
		}
	});

	const content = (
		<IconRender
			attributes={attributes}
			defaultIcon="check"
			className="pdm-icon-display"
		/>
	);

	if (url) {
		const linkProps = {
			...wrapperProps,
			href: url,
			...(linkTarget && { target: linkTarget }),
			...(rel && { rel: rel })
		};
		return <a {...linkProps}>{content}</a>;
	}

	return <div {...wrapperProps}>{content}</div>;
}
