import { useBlockProps } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		imageId: { type: 'number' },
		imageUrl: { type: 'string' },
		imageAlt: { type: 'string' },
		offsetX: { type: 'number', default: 0 },
		offsetY: { type: 'number', default: 0 },
		width: { type: 'number', default: 300 },
		hideAt: { type: 'number', default: 0 },
		responsiveBehavior: { type: 'string', default: 'hide' },
		blockMaxWidth: { type: 'number', default: 600 },
	},
	save( { attributes } ) {
		const { imageId, imageUrl, imageAlt, offsetX, offsetY, width, hideAt, responsiveBehavior, blockMaxWidth } = attributes;

		if ( ! imageUrl ) {
			return null;
		}

		const wpImageClass = imageId ? `wp-image-${ imageId }` : '';
		const containerCustomStyle = responsiveBehavior === 'block' && hideAt > 0
			? { '--block-max-width': `${ blockMaxWidth }px` }
			: {};
		const uniqueClass = hideAt > 0 ? `responsive-${ hideAt }-${ responsiveBehavior }` : '';

		const blockProps = useBlockProps.save( {
			className: `floating-image-block-wrapper ${ uniqueClass }`,
		} );

		return (
			<>
				{ hideAt > 0 && (
					<style dangerouslySetInnerHTML={ {
						__html: `
						@media (max-width: ${ hideAt }px) {
							.wp-block-pdm-floating-image.${ uniqueClass } {
								${ responsiveBehavior === 'hide' ? 'display: none !important;' : 'height: auto !important; padding: 20px;' }
							}
							${ responsiveBehavior === 'block' ? `
							.wp-block-pdm-floating-image.${ uniqueClass } .floating-image-overflow-container {
								overflow: visible !important;
								height: auto !important;
								position: static !important;
								max-width: var(--block-max-width, 600px) !important;
								margin: 0 auto !important;
							}
							.wp-block-pdm-floating-image.${ uniqueClass } .floating-image {
								position: static !important;
								display: block !important;
								width: 100% !important;
								left: auto !important;
								right: auto !important;
								top: auto !important;
								bottom: auto !important;
								pointer-events: auto !important;
							}` : '' }
						}
					`,
					} } />
				) }
				<div { ...blockProps }>
					<div
						className="floating-image-overflow-container"
						style={ containerCustomStyle }
					>
						<div
							className="floating-image"
							style={ {
								left: `${ offsetX }%`,
								top: `${ offsetY }px`,
								width: `${ width }px`,
							} }
						>
							<img src={ imageUrl } alt={ imageAlt } className={ wpImageClass } />
						</div>
					</div>
				</div>
			</>
		);
	},
};

export default [ v1 ];
