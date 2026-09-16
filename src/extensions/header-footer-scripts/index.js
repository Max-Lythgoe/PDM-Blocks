/**
 * Custom Code — per-post header & footer scripts.
 *
 * Block editor replacement for the removed "Custom Code - Page Scripts" meta
 * box. The values live in the `_hfs_header_scripts` / `_hfs_footer_scripts`
 * post meta keys, registered for the REST API in
 * includes/extensions/header-footer-scripts/includes/meta-registration.php and
 * stored as JSON strings.
 *
 * Legacy values written by the old meta box (serialized PHP arrays) are read
 * transparently here and normalised server-side, so existing scripts are never
 * lost.
 */

import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { Button, ExternalLink, TextControl, TextareaControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const LOCATIONS = [ 'header', 'footer' ];

const EMPTY_ROW = { name: '', code: '' };

const DEFAULT_ROWS = [ { ...EMPTY_ROW } ];

/**
 * Localised data from PHP (see pdm_hfs_enqueue_editor_assets()).
 */
const getData = () => window.pdmHfsData || {};

const getMetaKeys = () =>
	getData().metaKeys || {
		header: '_hfs_header_scripts',
		footer: '_hfs_footer_scripts',
	};

/**
 * Coerce a stored list into rows the UI can render.
 *
 * @param {Array} list Raw list of scripts.
 * @return {Array} Rows of `{ name, code }`.
 */
const toRows = ( list ) =>
	list.reduce( ( rows, item ) => {
		if ( typeof item === 'string' ) {
			rows.push( { name: '', code: item } );
		} else if ( item && typeof item === 'object' ) {
			rows.push( {
				name: typeof item.name === 'string' ? item.name : '',
				code: typeof item.code === 'string' ? item.code : '',
			} );
		}
		return rows;
	}, [] );

/**
 * Parse whatever the REST API handed back into rows.
 *
 * The meta is registered as a `string` holding JSON, but a post that has not
 * been re-saved since the meta box days still returns a PHP array, and a broken
 * value could even come back as plain text. All three cases are handled so no
 * script can be dropped by the panel.
 *
 * @param {*} value Meta value.
 * @return {Array|null} Rows, or null when there is nothing stored.
 */
const parseScripts = ( value ) => {
	if ( Array.isArray( value ) ) {
		return toRows( value );
	}

	if ( typeof value !== 'string' ) {
		return null;
	}

	const trimmed = value.trim();

	if ( trimmed === '' ) {
		return null;
	}

	try {
		const parsed = JSON.parse( trimmed );

		if ( Array.isArray( parsed ) ) {
			return toRows( parsed );
		}
	} catch ( error ) {
		// Not JSON: keep a raw legacy string as a single script.
		return [ { name: '', code: value } ];
	}

	return null;
};

/**
 * One list of scripts (either the header or the footer list).
 */
function ScriptSection( { location, title, rows, onChange, onAdd, onRemove } ) {
	const filled = rows.filter( ( row ) => row.code.trim() !== '' ).length;

	return (
		<div className="pdm-hfs-section" data-location={ location }>
			<h3 className="pdm-hfs-section__title">
				<span>{ title }</span>
				{ filled > 0 && <span className="pdm-hfs-section__count">{ filled }</span> }
			</h3>

			{ rows.length === 0 && (
				<p className="pdm-hfs-empty">{ __( 'No scripts yet.', 'pdm-blocks' ) }</p>
			) }

			{ rows.map( ( row, index ) => (
				// eslint-disable-next-line react/no-array-index-key
				<div className="pdm-hfs-row" key={ index }>
					<div className="pdm-hfs-row__header">
						<TextControl
							__nextHasNoMarginBottom
							label={ __( 'Script name', 'pdm-blocks' ) }
							hideLabelFromVision
							placeholder={ __( 'Script name (e.g. Google Analytics)', 'pdm-blocks' ) }
							value={ row.name }
							onChange={ ( value ) => onChange( index, 'name', value ) }
						/>
						<Button
							className="pdm-hfs-row__remove"
							icon="trash"
							isDestructive
							size="small"
							label={ __( 'Remove script', 'pdm-blocks' ) }
							onClick={ () => onRemove( index ) }
						/>
					</div>
					<TextareaControl
						__nextHasNoMarginBottom
						label={ __( 'Script code', 'pdm-blocks' ) }
						hideLabelFromVision
						placeholder={ __( '<script>…</script>', 'pdm-blocks' ) }
						value={ row.code }
						onChange={ ( value ) => onChange( index, 'code', value ) }
						rows={ 6 }
					/>
				</div>
			) ) }

			<div className="pdm-hfs-section__footer">
				<Button variant="secondary" size="small" onClick={ onAdd }>
					{ __( 'Add script', 'pdm-blocks' ) }
				</Button>
			</div>
		</div>
	);
}

/**
 * The sidebar panel itself.
 */
function CustomCodePanel() {
	const meta = useSelect(
		( select ) => select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
		[]
	);
	const postType = useSelect( ( select ) => select( 'core/editor' ).getCurrentPostType(), [] );
	const { editPost } = useDispatch( 'core/editor' );

	const [ headerRows, setHeaderRows ] = useState( DEFAULT_ROWS );
	const [ footerRows, setFooterRows ] = useState( DEFAULT_ROWS );

	// Hydrate from saved meta once, as soon as the editor exposes it.
	const hydrated = useRef( false );

	useEffect( () => {
		if ( hydrated.current || ! meta ) {
			return;
		}

		hydrated.current = true;

		const metaKeys = getMetaKeys();
		const storedHeader = parseScripts( meta[ metaKeys.header ] );
		const storedFooter = parseScripts( meta[ metaKeys.footer ] );

		if ( storedHeader ) {
			setHeaderRows( storedHeader );
		}

		if ( storedFooter ) {
			setFooterRows( storedFooter );
		}
	}, [ meta ] );

	const data = getData();
	const supportedPostTypes = Array.isArray( data.postTypes ) ? data.postTypes : [];

	// Nothing to edit on post types that don't support the feature.
	if ( supportedPostTypes.length > 0 && postType && ! supportedPostTypes.includes( postType ) ) {
		return null;
	}

	const rowsFor = ( location ) => ( location === 'header' ? headerRows : footerRows );

	/**
	 * Update the editor store. This is client-side only — nothing reaches the
	 * database until the post is saved, and the post is marked as dirty so the
	 * editor's save button is enabled.
	 */
	const applyChange = ( location, nextRows ) => {
		if ( location === 'header' ) {
			setHeaderRows( nextRows );
		} else {
			setFooterRows( nextRows );
		}

		editPost( {
			meta: { [ getMetaKeys()[ location ] ]: JSON.stringify( nextRows ) },
		} );
	};

	const handleChange = ( location, index, field, value ) => {
		applyChange(
			location,
			rowsFor( location ).map( ( row, i ) => ( i === index ? { ...row, [ field ]: value } : row ) )
		);
	};

	const handleAdd = ( location ) => {
		applyChange( location, [ ...rowsFor( location ), { ...EMPTY_ROW } ] );
	};

	const handleRemove = ( location, index ) => {
		const next = rowsFor( location ).filter( ( row, i ) => i !== index );

		// Always keep one row available so the panel never looks empty.
		applyChange( location, next.length > 0 ? next : [ { ...EMPTY_ROW } ] );
	};

	const scriptCount = LOCATIONS.reduce(
		( total, location ) =>
			total + rowsFor( location ).filter( ( row ) => row.code.trim() !== '' ).length,
		0
	);

	return (
		<PluginDocumentSettingPanel
			name="pdm-hfs-custom-code"
			title={ __( 'Custom Code', 'pdm-blocks' ) }
			className="pdm-hfs-panel"
		>
			<p className="pdm-hfs-panel__intro">
				{ __(
					'Scripts added here are printed on this page only, in addition to any global scripts.',
					'pdm-blocks'
				) }
			</p>

			{ scriptCount > 0 && (
				<p className="pdm-hfs-panel__notice">
					{ __(
						'This page has custom scripts — update the page to save changes.',
						'pdm-blocks'
					) }
				</p>
			) }

			<ScriptSection
				location="header"
				title={ __( 'Header scripts', 'pdm-blocks' ) }
				rows={ headerRows }
				onChange={ ( index, field, value ) => handleChange( 'header', index, field, value ) }
				onAdd={ () => handleAdd( 'header' ) }
				onRemove={ ( index ) => handleRemove( 'header', index ) }
			/>

			<ScriptSection
				location="footer"
				title={ __( 'Footer scripts', 'pdm-blocks' ) }
				rows={ footerRows }
				onChange={ ( index, field, value ) => handleChange( 'footer', index, field, value ) }
				onAdd={ () => handleAdd( 'footer' ) }
				onRemove={ ( index ) => handleRemove( 'footer', index ) }
			/>

			{ data.settingsUrl && (
				<ExternalLink className="pdm-hfs-global-link" href={ data.settingsUrl }>
					{ __( 'Manage global header & footer scripts', 'pdm-blocks' ) }
				</ExternalLink>
			) }
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'pdm-hfs-custom-code', {
	render: CustomCodePanel,
	icon: 'editor-code',
} );
