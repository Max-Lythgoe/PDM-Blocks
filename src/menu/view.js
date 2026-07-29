/**
 * Frontend JavaScript for the Menu block.
 * 
 * This handles any interactive functionality needed for the menu.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile menu accessibility
    const menuToggles = document.querySelectorAll('.menu-toggle');
    
    menuToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const slideout = this.nextElementSibling?.nextElementSibling?.querySelector('.menu-slideout');
            if (slideout) {
                // Update aria-expanded for accessibility
                const isExpanded = this.checked;
                this.setAttribute('aria-expanded', isExpanded);
                
                // Trap focus when menu is open
                if (isExpanded) {
                    slideout.focus();
                }
            }
        });
    });

    // Close mobile menu when clicking overlay
    const overlayLabels = document.querySelectorAll('.menu-overlay-label');
    overlayLabels.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const toggle = this.previousElementSibling;
            if (toggle && toggle.classList.contains('menu-toggle')) {
                toggle.checked = false;
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close mobile menu when clicking anchor links (#section)
    const slideoutMenus = document.querySelectorAll('.menu-slideout');
    slideoutMenus.forEach(slideout => {
        slideout.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            // Find the associated menu toggle checkbox
            const mobileNav = slideout.closest('.pdm-menu-mobile');
            if (mobileNav) {
                const toggle = mobileNav.querySelector('.menu-toggle');
                if (toggle) {
                    toggle.checked = false;
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
});
