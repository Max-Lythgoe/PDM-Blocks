/**
 * Focus management for the script-created lightbox overlays.
 *
 * The overlays are appended to <body> at runtime, so they need their own
 * dialog semantics, focus trap and focus restore to be usable by keyboard.
 */

function getFocusable(container) {
	return Array.prototype.slice
		.call(
			container.querySelectorAll(
				'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		)
		.filter(function (el) {
			return el.offsetParent !== null || el === document.activeElement;
		});
}

/**
 * @param {HTMLElement} lightbox Overlay element.
 * @param {string}      label    Accessible name for the dialog.
 * @return {{onOpen: (trigger?: Element) => void, onClose: () => void}}
 */
export function setupLightboxA11y(lightbox, label) {
	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute('aria-label', label);

	let previouslyFocused = null;

	lightbox.addEventListener('keydown', function (event) {
		if (event.key !== 'Tab') return;

		const focusable = getFocusable(lightbox);
		if (!focusable.length) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	});

	return {
		onOpen(trigger) {
			previouslyFocused = trigger || document.activeElement;

			const focusTarget = lightbox.querySelector('button');
			if (focusTarget) {
				focusTarget.focus();
			}
		},
		onClose() {
			// Restoring focus is best-effort: the trigger may be gone, or may not
			// be focusable (e.g. a slide element).
			if (previouslyFocused && previouslyFocused.isConnected && typeof previouslyFocused.focus === 'function') {
				previouslyFocused.focus();
			}
			previouslyFocused = null;
		},
	};
}
