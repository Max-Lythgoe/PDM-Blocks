/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import { TabLogo } from '../components';

/**
 * Register the Tab block
 */
registerBlockType( metadata.name, {
	icon: TabLogo,
	edit: Edit,
	save,
	deprecated,
} );
