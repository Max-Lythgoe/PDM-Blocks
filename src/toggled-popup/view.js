/**
 * Toggled Popup — front-end view script.
 *
 * The native Popover API handles nearly everything:
 *   - Buttons with popovertarget="id"  → open/close with zero JS
 *   - Escape key                        → close automatically
 *   - Click outside                     → close automatically (popover="auto")
 *
 * This script only adds support for anchor links (href="#id") as triggers,
 * and provides a fallback close-button handler for browsers where
 * popovertarget isn't yet supported.
 */
document.addEventListener( 'click', ( e ) => {
	// 1. Anchor link trigger: <a href="#popup-id">
	const link = e.target.closest( 'a[href^="#"]' );
	if ( link ) {
		const id = link.getAttribute( 'href' ).slice( 1 );
		if ( id ) {
			const target = document.getElementById( id );
			if ( target && target.hasAttribute( 'popover' ) ) {
				e.preventDefault();
				target.showPopover();
			}
		}
		return;
	}

	// 2. Close button fallback (for when popovertarget isn't supported natively)
	const closeBtn = e.target.closest( '.pdm-toggled-popup-close' );
	if ( closeBtn ) {
		const popup = closeBtn.closest( '[popover]' );
		if ( popup && typeof popup.hidePopover === 'function' ) {
			popup.hidePopover();
		}
	}
} );

// Reset reCAPTCHA v2 widgets when the popup opens, so the checkbox
// renders correctly after being hidden in the top layer.
document.addEventListener( 'toggle', ( e ) => {
	if ( e.newState !== 'open' || ! e.target.matches( '.wp-block-pdm-toggled-popup' ) ) return;
	if ( ! window.grecaptcha ) return;
	e.target.querySelectorAll( '.g-recaptcha' ).forEach( ( el ) => {
		const widgetId = el.dataset.recaptchaWidgetId;
		if ( widgetId !== undefined ) {
			grecaptcha.reset( widgetId );
		}
	} );
}, true );
