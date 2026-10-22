/**
 * Resolves a font size attribute value into a usable CSS font-size value.
 *
 * @param {string|number} value                                                       - A preset slug (e.g. "large"), a numeric px size, or an existing CSS value.
 * @param {string}        [fallback='var(--wp--preset--font-size--small, 1rem)'] - Value used when nothing is set.
 * @return {string} A valid CSS font-size value.
 */
export const resolveFontSizeValue = (
	value,
	fallback = 'var(--wp--preset--font-size--small, 1rem)'
) => {
	if ( typeof value === 'number' ) {
		return `${ value }px`;
	}

	if ( ! value ) {
		return fallback;
	}

	// WordPress style values, e.g. "var:preset|font-size|large".
	if ( value.startsWith( 'var:' ) ) {
		return `var(${ value
			.replace( 'var:', '--wp--' )
			.replace( /\|/g, '--' ) })`;
	}

	// Preset slug.
	if ( /^[a-z0-9-]+$/i.test( value ) ) {
		return `var(--wp--preset--font-size--${ value }, 1rem)`;
	}

	return value;
};
