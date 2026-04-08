/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { registerBlockVariation } from '@wordpress/blocks';
import { subscribe } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import icon from './icon';
import heroIcon from './hero-icon';
import { backgroundMediaAttributes } from '../../components/backgroundMediaAttributes';
import defaultHeroImage from '../../assets/img/default-forest.webp';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	...metadata,
	attributes: {
		...metadata.attributes,
		...backgroundMediaAttributes,
	},
	icon: icon.svg,
	edit: Edit,
	save,
	deprecated,
} );

/**
 * Register Hero block variation
 * This appears as its own block in the inserter but uses the Section block functionality
 */
registerBlockVariation( 'pdm/section', {
	name: 'hero',
	title: 'Hero',
	description: 'A hero section with background image and centered content',
	icon: heroIcon,
	scope: [ 'inserter' ],
	attributes: {
		useMinHeight: true,
		minHeight: 50,
		verticalAlignment: 'center',
		imageURL: defaultHeroImage,
		defaultTitle: '',
		imageID: 999999,
		opacity: 50,
		imageFit: 'cover',
		focalPoint: { x: 0.5, y: 0.5 },
		mixBlendMode: 'normal',
		backgroundColor: 'black',
		textColor: 'white',
		style: {
			elements: {
				link: {
					color: {
						text: 'var:preset|color|white'
					}
				}
			}
		},
		layout: {
			type: 'constrained',
			justifyContent: 'center'
		}
	},
	innerBlocks: [
		[ 'core/heading', {
			textAlign: 'center',
			level: 1,
			fontSize: 'xx-large',
			placeholder: 'Hero Title'
		} ]
	],
	isActive: ( blockAttributes, variationAttributes ) => {
		return blockAttributes.useMinHeight &&
			blockAttributes.verticalAlignment === 'center' &&
			blockAttributes.imageURL;
	}
} );

/**
 * Auto-rename section blocks based on their first heading
 * This filter intercepts blocks before they're saved and updates metadata
 */
addFilter(
	'blocks.getSaveContent.extraProps',
	'pdm-blocks/auto-rename-section',
	( props, blockType, attributes ) => {
		// Only process pdm/section blocks
		if ( blockType.name === 'pdm/section' ) {
			// Get the current block's inner blocks from the editor
			const blocks = wp.data.select( 'core/block-editor' )?.getBlocks();
			if ( ! blocks ) return props;
			
			// Find this specific block instance
			const findBlockById = ( blockList, searchAttributes ) => {
				for ( const block of blockList ) {
					// Match by attributes
					if ( block.name === 'pdm/section' && 
						 JSON.stringify( block.attributes ) === JSON.stringify( searchAttributes ) ) {
						return block;
					}
					if ( block.innerBlocks?.length > 0 ) {
						const found = findBlockById( block.innerBlocks, searchAttributes );
						if ( found ) return found;
					}
				}
				return null;
			};
			
			// Recursively find the first heading at any nesting level
			const findFirstHeading = ( blockList ) => {
				for ( const block of blockList ) {
					if ( block.name === 'core/heading' && block.attributes.content ) {
						return block;
					}
					// Recursively search in inner blocks
					if ( block.innerBlocks?.length > 0 ) {
						const found = findFirstHeading( block.innerBlocks );
						if ( found ) return found;
					}
				}
				return null;
			};
			
			const currentBlock = findBlockById( blocks, attributes );
			
			if ( currentBlock && currentBlock.innerBlocks?.length > 0 ) {
				// Find first heading at any nesting level
				const firstHeading = findFirstHeading( currentBlock.innerBlocks );
				
				if ( firstHeading && firstHeading.attributes.content ) {
					// Clean the heading text
					const headingText = firstHeading.attributes.content
						.replace( /<[^>]*>?/gm, '' )
						.trim();
					
					// Update metadata in the attributes that will be saved
					if ( headingText ) {
						// Modify the attributes directly for this save
						attributes.metadata = {
							...attributes.metadata,
							name: headingText,
						};
					}
				}
			}
		}
		
		return props;
	}
);
