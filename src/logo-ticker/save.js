/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const { logos, logoSize, speed, grayscale, pauseOnHover, showFade } = attributes;

	const style = {
		'--logo-size': logoSize + 'px',
		'--ticker-speed': speed + 's',
	};

	const blockClasses = [];
	if (grayscale) blockClasses.push('is-grayscale');
	if (pauseOnHover) blockClasses.push('pause-on-hover');
	if (showFade) blockClasses.push('has-fade');

	const blockProps = useBlockProps.save({
		style: style,
		className: blockClasses.join(' ')
	});

	return (
		<div { ...blockProps }>
			{ logos && logos.length > 0 ? (
				<div className="logo-ticker-wrapper">
					<div className="logo-ticker-track">
						{/* Render logos 3 times for seamless infinite loop */}
						{[...Array(3)].map((_, setIndex) => (
							logos.map((logo, index) => (
								<div key={`${logo.id}-${setIndex}-${index}`} className="logo-ticker-item" aria-hidden={setIndex > 0 ? "true" : undefined}>
									<img 
										src={logo.url} 
										alt={logo.alt}
										className={`wp-image-${logo.id}`}
									/>
								</div>
							))
						))}
					</div>
				</div>
			) : (
				<p>No logos added</p>
			)}
		</div>
	);
}
