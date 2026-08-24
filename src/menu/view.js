/**
 * Frontend JavaScript for the Menu block.
 */

(function () {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	function init() {
		initDesktopMenus();
		initMobileMenus();
	}

	/* ---------------------------------------------------------------------
	 * Desktop menu
	 * ------------------------------------------------------------------- */

	function initDesktopMenus() {
		document.querySelectorAll('.pdm-menu-desktop .menu-desktop').forEach(function (menu) {
			// Keep aria-expanded in sync with the hover/focus state (CSS driven).
			menu.querySelectorAll('.menu-item-has-children').forEach(function (item) {
				var link = item.querySelector(':scope > a');
				if (!link) return;

				var sync = function () {
					var isOpen =
						item.contains(document.activeElement) || // keyboard focus (works even mid-focus-event)
						item.matches(':hover');                  // mouse hover
					link.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
				};

				['mouseenter', 'mouseleave', 'focusin', 'focusout'].forEach(function (type) {
					item.addEventListener(type, sync);
				});
			});

			// Keyboard navigation across all desktop links.
			menu.querySelectorAll('a').forEach(function (link) {
				link.addEventListener('keydown', function (event) {
					onDesktopKeydown(link, event);
				});
			});
		});
	}

	function getTopLevelLinks(link) {
		var menu = link.closest('.menu-desktop');
		if (!menu) return [];
		return Array.prototype.slice.call(menu.querySelectorAll(':scope > .menu-item > a'));
	}

	function getSiblingSubmenuLinks(link) {
		var submenu = link.closest('.sub-menu');
		if (!submenu) return [];
		return Array.prototype.slice.call(submenu.querySelectorAll(':scope > .menu-item > a'));
	}

	function getChildSubmenuLinks(link) {
		var item = link.parentElement;
		if (!item) return [];
		var submenu = item.querySelector(':scope > .sub-menu');
		if (!submenu) return [];
		return Array.prototype.slice.call(submenu.querySelectorAll(':scope > .menu-item > a'));
	}

	function isTopLevelItem(link) {
		var item = link.parentElement;
		return !!item &&
			item.classList.contains('menu-item') &&
			item.parentElement &&
			item.parentElement.classList.contains('menu-desktop');
	}

	function getParentLink(link) {
		var item = link.parentElement;
		if (!item) return null;
		var parentItem = item.parentElement && item.parentElement.closest('.menu-item-has-children');
		return parentItem ? parentItem.querySelector(':scope > a') : null;
	}

	function onDesktopKeydown(link, event) {
		var key = event.key;
		var topLevelItem = isTopLevelItem(link);
		var parentLink = getParentLink(link);

		switch (key) {
			case 'Escape':
				if (parentLink && parentLink !== link) {
					// Return focus to the parent; the submenu closes via :focus-within.
					event.preventDefault();
					parentLink.focus();
				} else if (topLevelItem) {
					event.preventDefault();
					link.blur();
				}
				break;

			case 'ArrowDown': {
				if (topLevelItem) {
					var children = getChildSubmenuLinks(link);
					if (children.length) {
						// Opening happens automatically via :focus-within.
						event.preventDefault();
						children[0].focus();
					}
				} else {
					var siblings = getSiblingSubmenuLinks(link);
					if (siblings.length) {
						event.preventDefault();
						siblings[(siblings.indexOf(link) + 1) % siblings.length].focus();
					}
				}
				break;
			}

			case 'ArrowUp': {
				if (!topLevelItem) {
					var sibs = getSiblingSubmenuLinks(link);
					if (sibs.length) {
						event.preventDefault();
						var index = sibs.indexOf(link);
						if (index <= 0) {
							if (parentLink) parentLink.focus();
						} else {
							sibs[index - 1].focus();
						}
					}
				}
				break;
			}

			case 'ArrowRight': {
				if (topLevelItem) {
					var topLevel = getTopLevelLinks(link);
					if (topLevel.length) {
						event.preventDefault();
						topLevel[(topLevel.indexOf(link) + 1) % topLevel.length].focus();
					}
				}
				break;
			}

			case 'ArrowLeft': {
				if (topLevelItem) {
					var top = getTopLevelLinks(link);
					if (top.length) {
						event.preventDefault();
						top[(top.indexOf(link) - 1 + top.length) % top.length].focus();
					}
				}
				break;
			}
		}
	}

	/* ---------------------------------------------------------------------
	 * Mobile menu
	 * ------------------------------------------------------------------- */

	function initMobileMenus() {
		document.querySelectorAll('.pdm-menu-mobile').forEach(function (nav) {
			var openBtn = nav.querySelector('.menu-open-toggle');
			var closeBtn = nav.querySelector('.menu-close-toggle');
			var overlay = nav.querySelector('.menu-overlay-label');
			var slideout = nav.querySelector('.menu-slideout');
			if (!openBtn || !closeBtn || !slideout) return;

			var setMenuOpen = function (open) {
				nav.classList.toggle('is-open', open);
				[openBtn, closeBtn].forEach(function (btn) {
					btn.setAttribute('aria-expanded', open ? 'true' : 'false');
				});
				if (open) {
					closeBtn.focus();
				} else {
					openBtn.focus();
				}
			};

			openBtn.addEventListener('click', function () {
				setMenuOpen(true);
			});
			closeBtn.addEventListener('click', function () {
				setMenuOpen(false);
			});
			if (overlay) {
				overlay.addEventListener('click', function () {
					setMenuOpen(false);
				});
			}

			// Close the drawer when an in-page anchor link (#section) is activated.
			slideout.addEventListener('click', function (event) {
				if (event.target.closest('a[href^="#"]')) {
					setMenuOpen(false);
				}
			});

			// Escape closes the drawer; Tab is trapped inside while it's open.
			nav.addEventListener('keydown', function (event) {
				if (!nav.classList.contains('is-open')) return;
				if (event.key === 'Escape') {
					event.preventDefault();
					setMenuOpen(false);
					return;
				}
				if (event.key === 'Tab') {
					var focusables = getFocusable(slideout);
					if (!focusables.length) return;
					var first = focusables[0];
					var last = focusables[focusables.length - 1];
					if (event.shiftKey && document.activeElement === first) {
						event.preventDefault();
						last.focus();
					} else if (!event.shiftKey && document.activeElement === last) {
						event.preventDefault();
						first.focus();
					}
				}
			});

			// Mobile submenu toggles.
			slideout.querySelectorAll('.block-sub-menu-toggle').forEach(function (btn) {
				btn.addEventListener('click', function () {
					var item = btn.closest('.menu-item-has-children');
					if (!item) return;
					var isOpen = item.classList.toggle('is-open');
					btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
				});
			});
		});
	}

	function getFocusable(container) {
		return Array.prototype.slice.call(
			container.querySelectorAll(
				'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		).filter(function (el) {
			return el.offsetParent !== null || el === document.activeElement;
		});
	}
})();
