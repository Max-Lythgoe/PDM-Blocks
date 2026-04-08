/**
 * Use this file for JavaScript code that you want to run in the front-end 
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
	// Initialize full scroll sections
	document.querySelectorAll(".scroll-section").forEach((section) => {
		let childTriggers = section.querySelectorAll(".scroll-content-item");
		let scrollImgList = section.querySelector(".scroll-img-list");
		let scrollVisual = section.querySelector(".scroll-visual");
		
		// Get overlay settings from parent section
		const overlayEnabled = section.getAttribute('data-overlay-enabled') === 'true';
		const overlayOpacity = section.getAttribute('data-overlay-opacity') ?? 50;
		const blurAmount = section.getAttribute('data-blur-amount') ?? 10;
		const aspectRatio = section.getAttribute('data-aspect-ratio') || '1/1';
		const borderRadius = section.getAttribute('data-border-radius') ?? 0;
		
		// Apply styles to scroll-img-wrap
		const scrollImgWrap = section.querySelector('.scroll-img-wrap');
		if (scrollImgWrap) {
			if (aspectRatio !== 'auto') {
				scrollImgWrap.style.aspectRatio = aspectRatio;
			}
			scrollImgWrap.style.borderRadius = `${borderRadius}px`;
			scrollImgWrap.style.overflow = 'hidden';
		}
		
		// Create overlay container if needed
		let overlayList = null;
		if (overlayEnabled && scrollVisual) {
			overlayList = document.createElement('div');
			overlayList.classList.add('scroll-overlay-list');
			scrollVisual.insertBefore(overlayList, scrollVisual.firstChild);
		}
		
		// Create image elements from content items
		let imageElements = [];
		let overlayElements = [];
		childTriggers.forEach((trigger, index) => {
			const imageUrl = trigger.getAttribute('data-image-url');
			const imageAlt = trigger.getAttribute('data-image-alt');
			const imageTitle = trigger.getAttribute('data-image-title');
			const focalPoint = trigger.getAttribute('data-focal-point');
			const imageId = trigger.getAttribute('data-image-id');
			
			if (imageUrl && scrollImgList) {
				// Create overlay image if enabled
				if (overlayEnabled && overlayList) {
					const overlayDiv = document.createElement('div');
					overlayDiv.classList.add('background-overlay');
					if (index === 0) overlayDiv.classList.add('is-active');
					overlayDiv.style.opacity = overlayOpacity / 100;
					overlayDiv.style.filter = `blur(${blurAmount}px)`;
					
					const overlayImg = document.createElement('img');
					overlayImg.src = imageUrl;
					overlayImg.alt = '';
					if (imageId) overlayImg.classList.add(`wp-image-${imageId}`);
					overlayImg.classList.add('attachment-full', 'size-full');
					overlayImg.style.objectPosition = focalPoint || '50% 50%';
					
					overlayDiv.appendChild(overlayImg);
					overlayList.appendChild(overlayDiv);
					overlayElements.push(overlayDiv);
				}
				
				// Create main image
				const imgItem = document.createElement('div');
				imgItem.classList.add('scroll-img-item');
				if (index === 0) imgItem.classList.add('is-active');
				
				const img = document.createElement('img');
				img.src = imageUrl;
				img.alt = imageAlt || '';
				img.title = imageTitle || '';
				if (imageId) img.classList.add(`wp-image-${imageId}`);
				img.classList.add('attachment-full', 'size-full');
				img.style.objectPosition = focalPoint || '50% 50%';
				
				imgItem.appendChild(img);
				scrollImgList.appendChild(imgItem);
				imageElements.push(imgItem);
			}
		});

		let childTargets = imageElements;

		// switch active class
		function makeItemActive(index) {
			childTriggers.forEach(trigger => trigger.classList.remove("is-active"));
			childTargets.forEach(target => target.classList.remove("is-active"));
			overlayElements.forEach(overlay => overlay.classList.remove("is-active"));
			if (childTriggers[index]) childTriggers[index].classList.add("is-active");
			if (childTargets[index]) childTargets[index].classList.add("is-active");
			if (overlayElements[index]) overlayElements[index].classList.add("is-active");
		}

		// Set first item as active
		if (childTriggers.length > 0) {
			makeItemActive(0);
		}

		// create ScrollTrigger instances
		childTriggers.forEach((trigger, index) => {
			ScrollTrigger.create({
				trigger: trigger,
				start: "top center",
				end: "bottom center",
				onToggle: ({isActive}) => {
					if (isActive) {
						makeItemActive(index);
					}
				}
			});
		});
	});
});
