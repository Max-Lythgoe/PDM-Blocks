document.addEventListener('DOMContentLoaded', function() {
	const sliders = document.querySelectorAll('.comparison-slider');

	sliders.forEach(slider => {
		const container = slider.querySelector('.comparison-slider__container');
		const before = slider.querySelector('.comparison-slider__before');
		const beforeLabel = slider.querySelector('.comparison-slider__label--before');
		const afterLabel = slider.querySelector('.comparison-slider__label--after');
		const input = slider.querySelector('.comparison-slider__input');
		const handle = slider.querySelector('.comparison-slider__handle');

		if (!container || !before || !input || !handle) return;

		function updateSlider(value) {
			before.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
			handle.style.left = `${value}%`;
			
			// Hide before label when slider is less than 15% (near the left edge)
			if (beforeLabel) {
				beforeLabel.style.opacity = value < 15 ? '0' : '1';
			}
			
			// Hide after label when slider is greater than 85% (near the right edge)
			if (afterLabel) {
				afterLabel.style.opacity = value > 85 ? '0' : '1';
			}
		}

		// Update on input change
		input.addEventListener('input', (e) => {
			updateSlider(e.target.value);
		});

		// Initialize
		updateSlider(input.value);
	});
});
