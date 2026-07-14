/**
 * Query Loop Drafts - Add showDrafts toggle to core/query block
 * Migrated from PDM Accelerate theme to PDM Blocks plugin
 */
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;
const { createElement, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl } = wp.components;
const { __ } = wp.i18n;

/**
 * Add showDrafts attribute to Query block
 */
function addShowDraftsAttribute( settings, name ) {
	if ( name !== 'core/query' ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			showDrafts: {
				type: 'boolean',
				default: false,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'accelerate/query-show-drafts-attribute',
	addShowDraftsAttribute
);

/**
 * Add toggle control to Query block sidebar
 */
const withShowDraftsControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== 'core/query' ) {
			return createElement( BlockEdit, props );
		}

		const { attributes, setAttributes } = props;
		const showDrafts = attributes.showDrafts || false;

		return createElement(
			Fragment,
			null,
			createElement( BlockEdit, props ),
			createElement(
				InspectorControls,
				null,
				createElement(
					PanelBody,
					{
						title: __( 'Draft Posts', 'pdm-blocks' ),
						initialOpen: false,
					},
					createElement( ToggleControl, {
						label: __( 'Show draft posts', 'pdm-blocks' ),
						help: showDrafts
							? __( 'Draft posts will be displayed without links', 'pdm-blocks' )
							: __( 'Only published posts will be displayed', 'pdm-blocks' ),
						checked: showDrafts,
						onChange: ( value ) => setAttributes( { showDrafts: value } ),
					} )
				)
			)
		);
	};
}, 'withShowDraftsControl' );

addFilter(
	'editor.BlockEdit',
	'accelerate/with-show-drafts-control',
	withShowDraftsControl
);
