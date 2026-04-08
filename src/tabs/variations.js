/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { TabsLogo, TabsVerticalLogo } from '../components';

/**
 * Template option choices for predefined tabs layouts.
 */
const variations = [
	{
		name: 'horizontal-tabs',
		title: __( 'Horizontal', 'pdm-blocks' ),
		description: __( 'Horizontal', 'pdm-blocks' ),
		icon: TabsLogo,
		attributes: {
			orientation: 'horizontal',
		},
		innerBlocks: [ [ 'pdm/tab' ], [ 'pdm/tab' ] ],
		scope: [ 'block' ],
	},
	{
		name: 'vertical-tabs',
		title: __( 'Vertical', 'pdm-blocks' ),
		description: __( 'Vertical', 'pdm-blocks' ),
		icon: TabsVerticalLogo,
		attributes: {
			orientation: 'vertical',
		},
		innerBlocks: [ [ 'pdm/tab' ], [ 'pdm/tab' ] ],
		scope: [ 'block' ],
	},
];

export default variations;
