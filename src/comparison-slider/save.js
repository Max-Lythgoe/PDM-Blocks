import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const {
		beforeImageID,
		beforeImageURL,
		beforeCustomAlt,
		beforeCustomTitle,
		beforeDefaultAlt,
		beforeDefaultTitle,
		beforeFocalPoint,
		afterImageID,
		afterImageURL,
		afterCustomAlt,
		afterCustomTitle,
		afterDefaultAlt,
		afterDefaultTitle,
		afterFocalPoint,
		showLabels,
		aspectRatio,
		maxWidth
	} = attributes;

	const blockProps = useBlockProps.save({
		className: 'comparison-slider',
		style: {
			maxWidth: `${maxWidth}px`,
			aspectRatio: aspectRatio,
			margin: '0 auto'
		}
	});

	return (
		<div { ...blockProps }>
			<div className="comparison-slider__container">
				<figure className="comparison-slider__before">
					{beforeImageURL && (
						<img
							className={`wp-image-${beforeImageID}`}
							src={beforeImageURL}
							alt={beforeCustomAlt || beforeDefaultAlt || ''}
							title={beforeCustomTitle || beforeDefaultTitle || ''}
							style={{
								objectPosition: beforeFocalPoint
									? `${beforeFocalPoint.x * 100}% ${beforeFocalPoint.y * 100}%`
									: '50% 50%'
							}}
						/>
					)}
					{showLabels && <span className="comparison-slider__label comparison-slider__label--before">Before</span>}
				</figure>
				<figure className="comparison-slider__after">
					{afterImageURL && (
						<img
							className={`wp-image-${afterImageID}`}
							src={afterImageURL}
							alt={afterCustomAlt || afterDefaultAlt || ''}
							title={afterCustomTitle || afterDefaultTitle || ''}
							style={{
								objectPosition: afterFocalPoint
									? `${afterFocalPoint.x * 100}% ${afterFocalPoint.y * 100}%`
									: '50% 50%'
							}}
						/>
					)}
					{showLabels && <span className="comparison-slider__label comparison-slider__label--after">After</span>}
				</figure>
				<input
					type="range"
					min="0"
					max="100"
					defaultValue="50"
					className="comparison-slider__input"
					aria-label="Comparison slider"
				/>
				<div className="comparison-slider__handle" aria-hidden="true"></div>
			</div>
		</div>
	);
}
