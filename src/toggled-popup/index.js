import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import icon from './icon';

registerBlockType( metadata.name, {
	icon: icon.svg,
	edit: Edit,
	save,
	deprecated,
} );
