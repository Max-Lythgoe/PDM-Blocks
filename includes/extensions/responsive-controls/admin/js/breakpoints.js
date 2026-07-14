// @ts-nocheck
// PRC_BREAKPOINT_SETTINGS is injected as an inline script before this file.

/**
 * Responsive Controls — Admin Breakpoints Settings UI
 *
 * Renders breakpoint rows dynamically, supports adding/removing custom breakpoints,
 * and keeps the default Mobile/Tablet breakpoints protected from deletion.
 */
( () => {
	const TBODY_ID = 'prc-breakpoint-list';

	const {
		BREAKPOINT_LIST = new Map(),
		ALLOWED_SIZE_UNITS = [],
		WP_OPTION_NAME = '',
		I18N_TRANSLATIONS = {},
	} = ( typeof PRC_BREAKPOINT_SETTINGS !== 'undefined' ? PRC_BREAKPOINT_SETTINGS : {} );

	/**
	 * Build the HTML for a single breakpoint table row.
	 *
	 * @param {string}      identifier  Breakpoint key (e.g. 'mobile', 'tablet', or random).
	 * @param {object|null} option      Existing breakpoint data, or null for a new row.
	 * @returns {string}
	 */
	function getRowTemplate( identifier, option ) {
		const key   = identifier || window.crypto.getRandomValues( new Uint32Array( 3 ) ).join( '-' );
		const name  = option?.name  || '';
		const value = option?.value || '';
		const unit  = option?.unit  || 'px';

		const unitSelect =
			`<select name="${ WP_OPTION_NAME }[${ key }][unit]" style="width:100%;">` +
			ALLOWED_SIZE_UNITS.map(
				( u ) => `<option value="${ u }"${ u === unit ? ' selected' : '' }>${ u }</option>`
			).join( '' ) +
			'</select>';

		const isDefault = [ 'tablet', 'mobile' ].includes( key );

		const removeCell = isDefault
			? '<td></td>'
			: `<td style="text-align:center;">
				<span
					class="dashicons dashicons-trash"
					role="button"
					tabindex="0"
					style="cursor:pointer; color:#b32d2e; font-size:1.3em; vertical-align:middle;"
					title="${ I18N_TRANSLATIONS.remove_breakpoint_button_title || 'Remove' }"
					onclick="if(window.confirm('${ I18N_TRANSLATIONS.remove_breakpoint_confirm_message || 'Remove this breakpoint?' }')){this.closest('tr').remove();} return false;"
					onkeydown="if(event.key==='Enter'||event.key===' '){this.onclick(event);}"
				></span>
			  </td>`;

		return `
		<tr class="prc-breakpoint-row">
			<td>
				<input
					type="text"
					name="${ WP_OPTION_NAME }[${ key }][name]"
					value="${ name }"
					required
					maxlength="20"
					placeholder="e.g. Laptop"
					style="width:100%;"
				/>
			</td>
			<td>
				<input
					type="number"
					name="${ WP_OPTION_NAME }[${ key }][value]"
					value="${ value }"
					required
					min="0"
					max="9999"
					step="1"
					class="small-text"
					style="width:100%;"
				/>
			</td>
			<td>${ unitSelect }</td>
			${ removeCell }
		</tr>`;
	}

	// Expose globally so the inline onclick in the PHP template can call it
	window.prcSettingsAddBreakpoint = function ( event ) {
		event.stopPropagation();
		event.preventDefault();
		document
			.getElementById( TBODY_ID )
			?.insertAdjacentHTML( 'beforeend', getRowTemplate( null, null ) );
	};

	// Render existing active breakpoints on page load
	document.addEventListener( 'DOMContentLoaded', () => {
		const tbody = document.getElementById( TBODY_ID );
		if ( ! tbody ) return;

		// Clear the placeholder comment
		tbody.innerHTML = '';

		BREAKPOINT_LIST.forEach( ( option, key ) => {
			tbody.insertAdjacentHTML( 'beforeend', getRowTemplate( key, {
				name:  option.name,
				value: option.value,
				unit:  option.unit,
			} ) );
		} );
	} );
} )();
