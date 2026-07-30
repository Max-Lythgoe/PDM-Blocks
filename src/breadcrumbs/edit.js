import { useBlockProps } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit() {
	return (
		<nav { ...useBlockProps() }>
			<span className="breadcrumb-preview">
				<a href="#" className="breadcrumb-preview__item" style={ { pointerEvents: 'none', textDecoration: 'none' } }>Home</a>
				<span className="breadcrumb-preview__separator">&nbsp;/&nbsp;</span>
				<a href="#" className="breadcrumb-preview__item" style={ { pointerEvents: 'none', textDecoration: 'none' } }>Parent Page</a>
				<span className="breadcrumb-preview__separator">&nbsp;/&nbsp;</span>
				<span className="breadcrumb-preview__item breadcrumb-preview__item--current">Current Page</span>
			</span>
		</nav>
	);
}
