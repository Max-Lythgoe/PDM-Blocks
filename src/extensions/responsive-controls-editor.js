/**
 * Responsive Controls — Gutenberg Editor Integration
 * Migrated from PDM Accelerate theme.
 *
 * @package PDM_Blocks
 */

import { addFilter } from '@wordpress/hooks';
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextControl,
	Button,
	ButtonGroup,
	BaseControl,
	Icon,
	// eslint-disable-next-line camelcase
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	arrowRight,
	arrowDown,
	arrowLeft,
	arrowUp,
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	justifySpaceBetweenVertical,
	justifyStretch,
	justifyStretchVertical,
	justifyTop,
	justifyCenterVertical,
	justifyBottom,
	alignLeft,
	alignCenter,
	alignRight,
	mobile,
} from '@wordpress/icons';

/* ------------------------------------------------------------------ */
/*  Breakpoint data (injected by PHP)                                   */
/* ------------------------------------------------------------------ */
const RESPONSIVE_DATA   = window.PRC_RESPONSIVE_DATA || {};
const allBreakpoints    = RESPONSIVE_DATA.breakpoints || [];

function buildBreakpointOptions() {
	const opts = [ { label: __( 'Off', 'pdm-blocks' ), value: '' } ];
	allBreakpoints
		.filter( ( bp ) => bp.active )
		.forEach( ( bp ) => opts.push( { label: bp.name, value: bp.key } ) );
	opts.push( { label: __( 'Custom', 'pdm-blocks' ), value: 'custom' } );
	return opts;
}

/** Resolve a breakpoint key to its CSS width string (e.g. "480px") */
function getBreakpointWidth( bpKey, customValue ) {
	if ( bpKey === 'custom' ) return customValue || null;
	if ( ! bpKey ) return null;
	const found = allBreakpoints.find( ( bp ) => bp.key === bpKey );
	return found ? found.value : null;
}

/* ------------------------------------------------------------------ */
/*  Supported blocks                                                    */
/* ------------------------------------------------------------------ */
const RESPONSIVE_BLOCKS = [
	'core/group', 'core/columns', 'core/buttons',
	'core/heading', 'core/paragraph', 'core/post-title', 'core/post-excerpt',
];
const TEXT_BLOCKS = [
	'core/heading', 'core/paragraph', 'core/post-title', 'core/post-excerpt',
];

const isSupported = ( name ) => RESPONSIVE_BLOCKS.includes( name );

/* ------------------------------------------------------------------ */
/*  CSS value maps (editor preview)                                     */
/* ------------------------------------------------------------------ */
const justifyMap = {
	left: 'flex-start', center: 'center', right: 'flex-end',
	'space-between': 'space-between', stretch: 'stretch',
};
const vertAlignMap = {
	top: 'flex-start', center: 'center', bottom: 'flex-end',
	stretch: 'stretch', 'space-between': 'space-between',
};

/* ------------------------------------------------------------------ */
/*  Icon button-group option sets                                       */
/* ------------------------------------------------------------------ */
const OPT_ORIENTATION_ALL = [
	{ v: 'row',            icon: arrowRight, tip: __( 'Row →',             'pdm-blocks' ) },
	{ v: 'column',         icon: arrowDown,  tip: __( 'Column ↓',          'pdm-blocks' ) },
	{ v: 'row-reverse',    icon: arrowLeft,  tip: __( 'Row reversed ←',    'pdm-blocks' ) },
	{ v: 'column-reverse', icon: arrowUp,    tip: __( 'Column reversed ↑', 'pdm-blocks' ) },
];
const OPT_ORIENTATION_2 = OPT_ORIENTATION_ALL.slice( 0, 2 );

const OPT_JUSTIFY_FLEX = [
	{ v: 'left',          icon: justifyLeft,             tip: __( 'Left',          'pdm-blocks' ) },
	{ v: 'center',        icon: justifyCenter,           tip: __( 'Center',        'pdm-blocks' ) },
	{ v: 'right',         icon: justifyRight,            tip: __( 'Right',         'pdm-blocks' ) },
	{ v: 'space-between', icon: justifySpaceBetween,     tip: __( 'Space between', 'pdm-blocks' ) },
	{ v: 'stretch',       icon: justifyStretch,          tip: __( 'Stretch',       'pdm-blocks' ) },
];
const OPT_JUSTIFY_GROUP = OPT_JUSTIFY_FLEX.slice( 0, 3 );
const OPT_JUSTIFY_BTNS = [ ...OPT_JUSTIFY_FLEX.slice( 0, 3 ), OPT_JUSTIFY_FLEX[ 4 ] ];

const OPT_VERT_ALIGN = [
	{ v: 'top',           icon: justifyTop,                  tip: __( 'Top',           'pdm-blocks' ) },
	{ v: 'center',        icon: justifyCenterVertical,       tip: __( 'Center',        'pdm-blocks' ) },
	{ v: 'bottom',        icon: justifyBottom,               tip: __( 'Bottom',        'pdm-blocks' ) },
	{ v: 'stretch',       icon: justifyStretchVertical,      tip: __( 'Stretch',       'pdm-blocks' ) },
	{ v: 'space-between', icon: justifySpaceBetweenVertical, tip: __( 'Space between', 'pdm-blocks' ) },
];

const OPT_TEXT_ALIGN = [
	{ v: 'left',   icon: alignLeft,   tip: __( 'Align left',   'pdm-blocks' ) },
	{ v: 'center', icon: alignCenter, tip: __( 'Align center', 'pdm-blocks' ) },
	{ v: 'right',  icon: alignRight,  tip: __( 'Align right',  'pdm-blocks' ) },
];

/* ------------------------------------------------------------------ */
/*  Reusable icon button-group control                                  */
/* ------------------------------------------------------------------ */
function IconButtonGroup( { label, value, options, onChange, allowDeselect } ) {
	return (
		<BaseControl label={ label } __nextHasNoMarginBottom>
			<ButtonGroup>
				{ options.map( ( opt ) => (
					<Button
						key={ opt.v }
						icon={ opt.icon }
						label={ opt.tip }
						isPressed={ value === opt.v }
						size="compact"
						onClick={ () => {
							if ( allowDeselect && value === opt.v ) {
								onChange( '' );
							} else {
								onChange( opt.v );
							}
						} }
					/>
				) ) }
			</ButtonGroup>
		</BaseControl>
	);
}

/* ------------------------------------------------------------------ */
/*  Editor document helper (iframe-canvas aware)                        */
/* ------------------------------------------------------------------ */
function getEditorDoc() {
	const canvas = document.querySelector( 'iframe[name="editor-canvas"]' );
	if ( canvas ) {
		return ( canvas.contentDocument && canvas.contentDocument.head )
			? canvas.contentDocument
			: null;
	}
	return document;
}

/* ------------------------------------------------------------------ */
/*  Build preview CSS — wrapped in media query                           */
/* ------------------------------------------------------------------ */
function buildPreviewCss( clientId, name, attributes ) {
	const prc = attributes.prcResponsive || {};
	const s   = prc.settings || {};
	const sel = `[data-block="${ clientId }"]`;

	const globalCss = s.preventShrink
		? `${ sel }{flex-shrink:0 !important}`
		: '';

	if ( ! prc.breakpoint ) return globalCss;

	const switchWidth = getBreakpointWidth( prc.breakpoint, prc.breakpointCustomValue );
	if ( ! switchWidth ) return globalCss;

	const r = [];

	if ( TEXT_BLOCKS.includes( name ) ) {
		if ( s.alignment ) {
			r.push( `${ sel }{text-align:${ s.alignment } !important}` );
		}
	} else if ( name === 'core/columns' ) {
		r.push(
			`${ sel }.wp-block-columns,${ sel } .wp-block-columns{flex-direction:${ s.reverseOrder ? 'column-reverse' : 'column' } !important}`,
			`${ sel } .wp-block-column{flex-basis:auto !important;max-width:100% !important}`
		);
	} else if ( name === 'core/buttons' ) {
		const isColumn    = s.orientation === 'column';
		const justifyProp = isColumn ? 'align-items' : 'justify-content';
		r.push(
			`${ sel }.wp-block-buttons,${ sel } .wp-block-buttons{` +
			`flex-direction:${ s.orientation || 'row' } !important;` +
			`${ justifyProp }:${ justifyMap[ s.justification ] || 'flex-start' } !important}`
		);
	} else if ( name === 'core/group' ) {
		const lt = ( attributes.layout && attributes.layout.type ) || 'default';

		if ( lt === 'flex' ) {
			const ft = `${ sel }.is-layout-flex,${ sel } .is-layout-flex`;
			let fc = `flex-direction:${ s.orientation || 'row' } !important;` +
				`justify-content:${ justifyMap[ s.justification ] || 'flex-start' } !important;` +
				`align-items:${ vertAlignMap[ s.verticalAlignment ] || 'flex-start' } !important;`;
			if ( s.gap ) fc += `gap:${ s.gap } !important;`;
			r.push( `${ ft }{${ fc }}` );

		} else if ( lt === 'grid' ) {
			const gt = `${ sel }.is-layout-grid,${ sel } .is-layout-grid`;
			if ( s.stack ) r.push( `${ gt }{grid-template-columns:1fr !important}` );
			if ( s.gap )   r.push( `${ gt }{gap:${ s.gap } !important}` );

		} else {
			const gj  = s.justification || 'left';
			const gt2 = `${ sel }.wp-block-group,${ sel } .wp-block-group`;
			if ( gj === 'center' ) {
				r.push( `${ gt2 }{margin-left:auto !important;margin-right:auto !important}` );
			} else if ( gj === 'right' ) {
				r.push( `${ gt2 }{margin-left:auto !important;margin-right:0 !important}` );
			} else {
				r.push( `${ gt2 }{margin-left:0 !important;margin-right:auto !important}` );
			}
		}
	}

	if ( s.order !== null && s.order !== undefined && s.order !== '' ) {
		r.push( `${ sel }{order:${ s.order } !important}` );
	}

	const mediaCss = r.length > 0
		? `@media screen and (width <= ${ switchWidth }){${ r.join( '' ) }}`
		: '';

	return globalCss + mediaCss;
}

/* ================================================================== */
/*  1. Register prcResponsive attribute                                 */
/* ================================================================== */
addFilter(
	'blocks.registerBlockType',
	'pdm-accelerate/responsive-controls/add-attributes',
	( settings ) => {
		return {
			...settings,
			attributes: {
				...settings.attributes,
				prcResponsive: { type: 'object', default: {} },
			},
		};
	}
);

/* ================================================================== */
/*  2. BlockEdit HOC                                                    */
/* ================================================================== */
const withResponsiveControls = createHigherOrderComponent( ( BlockEdit ) => {

	return function EnhancedEdit( props ) {
		const { name, attributes, setAttributes, clientId } = props;
		const supported = isSupported( name );

		const prc      = attributes.prcResponsive || {};
		const settings = prc.settings || {};
		const bp       = prc.breakpoint || '';
		const isActive = bp !== '';

		/* ---- HOOKS MUST COME BEFORE ANY EARLY RETURNS ---- */

		const isInsideFlexGroup = useSelect( ( select ) => {
			const { getBlockParents, getBlock } = select( 'core/block-editor' );
			const parents = getBlockParents( clientId );
			if ( ! parents || ! parents.length ) return false;
			const parentId  = parents[ parents.length - 1 ];
			const parent    = getBlock( parentId );
			return parent?.name === 'core/group' &&
				parent?.attributes?.layout?.type === 'flex';
		}, [ clientId, name ] );

		useEffect( () => {
			const styleId = 'prc-preview-' + clientId.replace( /-/g, '' );
			let rafId;

			function inject() {
				const edDoc = getEditorDoc();

				if ( edDoc === null ) {
					rafId = requestAnimationFrame( inject );
					return;
				}

				const existing = edDoc.getElementById( styleId );
				if ( existing ) existing.remove();

				if ( edDoc.head ) {
					const css = buildPreviewCss( clientId, name, attributes );
					if ( css ) {
						const styleEl       = edDoc.createElement( 'style' );
						styleEl.id          = styleId;
						styleEl.textContent = css;
						edDoc.head.appendChild( styleEl );
					}
				}
			}

			inject();

			return () => {
				cancelAnimationFrame( rafId );
				[
					document,
					document.querySelector( 'iframe[name="editor-canvas"]' )?.contentDocument,
				].filter( Boolean ).forEach( ( d ) => {
					const s = d.getElementById( styleId );
					if ( s ) s.remove();
				} );
			};
		}, [ clientId, JSON.stringify( prc ), name ] );

		/* ---- Early return: not a supported block and not inside a flex group ---- */
		if ( ! supported && ! isInsideFlexGroup ) {
			return <BlockEdit { ...props } />;
		}

		/* ---- Shared attribute helpers ---- */
		const setSetting     = ( key, v ) => setAttributes( {
			prcResponsive: { ...prc, settings: { ...settings, [ key ]: v } },
		} );
		const getSetting     = ( key, fallback ) => settings[ key ] !== undefined ? settings[ key ] : fallback;
		const setBreakpoint  = ( v ) => setAttributes( { prcResponsive: { ...prc, breakpoint: v } } );
		const setCustomValue = ( v ) => setAttributes( { prcResponsive: { ...prc, breakpointCustomValue: v } } );

		const preventShrinkEnabled = getSetting( 'preventShrink', false );

		/* ---- Minimal panel: non-supported block inside a flex group ---- */
		if ( ! supported ) {
			return (
				<>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody
							title={
								<span style={ { display: 'inline-flex', alignItems: 'center', gap: '6px' } }>
									<Icon icon={ mobile } size={ 18 } />
									{ __( 'Responsive Controls', 'pdm-blocks' ) }
								</span>
							}
							initialOpen={ isActive || preventShrinkEnabled }
							className="prc-responsive-controls-panel"
						>
							<SelectControl
								label={ __( 'Activate at breakpoint', 'pdm-blocks' ) }
								value={ bp }
								options={ buildBreakpointOptions() }
								onChange={ setBreakpoint }
								help={ isActive ? null : __( 'Choose a breakpoint to enable responsive overrides.', 'pdm-blocks' ) }
							/>
							{ bp === 'custom' && (
								<TextControl
									label={ __( 'Custom breakpoint value', 'pdm-blocks' ) }
									value={ prc.breakpointCustomValue || '' }
									placeholder="600px"
									onChange={ setCustomValue }
									help={ __( 'Include the unit — e.g. 600px, 40em', 'pdm-blocks' ) }
								/>
							) }
							{ isActive && (
								<TextControl
									type="number"
									label={ __( 'Order', 'pdm-blocks' ) }
									value={ getSetting( 'order', '' ) }
									onChange={ ( v ) => setSetting( 'order', v !== '' ? parseInt( v, 10 ) : null ) }
									help={ __( 'Flex order override (e.g. -1 to move to front).', 'pdm-blocks' ) }
								/>
							) }
							<ToggleControl
								label={ __( 'Prevent Shrinking', 'pdm-blocks' ) }
								checked={ preventShrinkEnabled }
								onChange={ ( v ) => setSetting( 'preventShrink', v ) }
								help={ __( 'Prevents this block from shrinking inside the flex row.', 'pdm-blocks' ) }
							/>
						</PanelBody>
					</InspectorControls>
				</>
			);
		}

		/* ---- Full panel: supported block ---- */
		const renderRowControls = () => [
			<IconButtonGroup key="orientation"   label={ __( 'Orientation',        'pdm-blocks' ) } value={ getSetting( 'orientation',      'row'  ) } options={ OPT_ORIENTATION_ALL } onChange={ ( v ) => setSetting( 'orientation',      v ) } />,
			<IconButtonGroup key="justification" label={ __( 'Justification',      'pdm-blocks' ) } value={ getSetting( 'justification',    'left' ) } options={ OPT_JUSTIFY_FLEX   } onChange={ ( v ) => setSetting( 'justification',    v ) } />,
			<IconButtonGroup key="verticalAlign" label={ __( 'Vertical Alignment', 'pdm-blocks' ) } value={ getSetting( 'verticalAlignment', 'top'  ) } options={ OPT_VERT_ALIGN     } onChange={ ( v ) => setSetting( 'verticalAlignment', v ) } />,
			<UnitControl     key="gap"           label={ __( 'Gap',                'pdm-blocks' ) } value={ getSetting( 'gap', '' ) }                   onChange={ ( v ) => setSetting( 'gap', v || null ) } help={ __( 'Override gap between children.', 'pdm-blocks' ) } />,
		];

		const renderGroupControls = () => [
			<IconButtonGroup key="justification" label={ __( 'Justification', 'pdm-blocks' ) } value={ getSetting( 'justification', 'left' ) } options={ OPT_JUSTIFY_GROUP } onChange={ ( v ) => setSetting( 'justification', v ) } />,
		];

		const renderGridControls = () => [
			<ToggleControl key="stack" label={ __( 'Stack to single column', 'pdm-blocks' ) } checked={ getSetting( 'stack', false ) }  onChange={ ( v ) => setSetting( 'stack', v ) } />,
			<UnitControl   key="gap"   label={ __( 'Gap',                    'pdm-blocks' ) } value={ getSetting( 'gap', '' ) }          onChange={ ( v ) => setSetting( 'gap', v || null ) } help={ __( 'Override the grid gap.', 'pdm-blocks' ) } />,
		];

		const renderColumnsControls = () => [
			<ToggleControl key="reverse" label={ __( 'Reverse column order when stacked', 'pdm-blocks' ) } checked={ getSetting( 'reverseOrder', false ) } onChange={ ( v ) => setSetting( 'reverseOrder', v ) } />,
		];

		const renderButtonsControls = () => [
			<IconButtonGroup key="orientation"   label={ __( 'Orientation',   'pdm-blocks' ) } value={ getSetting( 'orientation',   'row'  ) } options={ OPT_ORIENTATION_2 } onChange={ ( v ) => setSetting( 'orientation',   v ) } />,
			<IconButtonGroup key="justification" label={ __( 'Justification', 'pdm-blocks' ) } value={ getSetting( 'justification', 'left' ) } options={ OPT_JUSTIFY_BTNS  } onChange={ ( v ) => setSetting( 'justification', v ) } />,
		];

		const renderTextControls = () => [
			<IconButtonGroup key="alignment" label={ __( 'Text Alignment', 'pdm-blocks' ) } value={ getSetting( 'alignment', '' ) } options={ OPT_TEXT_ALIGN } onChange={ ( v ) => setSetting( 'alignment', v || null ) } allowDeselect />,
		];

		const renderBlockControls = () => {
			if ( ! isActive ) return null;

			let blockSpecific = null;
			if ( TEXT_BLOCKS.includes( name ) )  blockSpecific = renderTextControls();
			else if ( name === 'core/columns' )   blockSpecific = renderColumnsControls();
			else if ( name === 'core/buttons' )   blockSpecific = renderButtonsControls();
			else if ( name === 'core/group' ) {
				const lt = ( attributes.layout && attributes.layout.type ) || 'default';
				if ( lt === 'flex' )      blockSpecific = renderRowControls();
				else if ( lt === 'grid' ) blockSpecific = renderGridControls();
				else                      blockSpecific = renderGroupControls();
			}

			return blockSpecific;
		};

		const showPanel = isActive || ( isInsideFlexGroup && preventShrinkEnabled );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={
							<span style={ { display: 'inline-flex', alignItems: 'center', gap: '6px' } }>
								<Icon icon={ mobile } size={ 18 } />
								{ __( 'Responsive Controls', 'pdm-blocks' ) }
							</span>
						}
						initialOpen={ showPanel }
						className="prc-responsive-controls-panel"
					>
						<SelectControl
							label={ __( 'Activate at breakpoint', 'pdm-blocks' ) }
							value={ bp }
							options={ buildBreakpointOptions() }
							onChange={ setBreakpoint }
							help={ isActive ? null : __( 'Choose a breakpoint to enable responsive overrides.', 'pdm-blocks' ) }
						/>
						{ bp === 'custom' && (
							<TextControl
								label={ __( 'Custom breakpoint value', 'pdm-blocks' ) }
								value={ prc.breakpointCustomValue || '' }
								placeholder="600px"
								onChange={ setCustomValue }
								help={ __( 'Include the unit — e.g. 600px, 40em', 'pdm-blocks' ) }
							/>
						) }
						{ renderBlockControls() }
						{ isInsideFlexGroup && (
							<ToggleControl
								label={ __( 'Prevent Shrinking', 'pdm-blocks' ) }
								checked={ preventShrinkEnabled }
								onChange={ ( v ) => setSetting( 'preventShrink', v ) }
								help={ __( 'Prevents this block from shrinking inside the flex row.', 'pdm-blocks' ) }
							/>
						) }
						{ isInsideFlexGroup && isActive && (
							<TextControl
								type="number"
								label={ __( 'Order', 'pdm-blocks' ) }
								value={ getSetting( 'order', '' ) }
								onChange={ ( v ) => setSetting( 'order', v !== '' ? parseInt( v, 10 ) : null ) }
								help={ __( 'Flex order override (e.g. -1 to move to front).', 'pdm-blocks' ) }
							/>
						) }
					</PanelBody>
				</InspectorControls>
			</>
		);
	};

}, 'withResponsiveControls' );

addFilter(
	'editor.BlockEdit',
	'pdm-accelerate/responsive-controls/inspector',
	withResponsiveControls
);

/* ================================================================== */
/*  3. BlockListBlock HOC                                               */
/* ================================================================== */
const withResponsiveIndicator = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const prc = props.attributes?.prcResponsive;
		if ( ! prc?.breakpoint || ! isSupported( props.name ) ) {
			return <BlockListBlock { ...props } />;
		}
		const wrapperProps = {
			...props.wrapperProps,
			className: [ props.wrapperProps?.className, 'prc-has-responsive-settings' ]
				.filter( Boolean ).join( ' ' ),
		};
		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'withResponsiveIndicator' );

addFilter(
	'editor.BlockListBlock',
	'pdm-accelerate/responsive-controls/indicator',
	withResponsiveIndicator
);
