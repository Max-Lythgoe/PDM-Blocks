import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

// v2: popupWidth was a number; save() appended 'px' manually
const v2 = {
	attributes: {
		triggerType: { type: 'string', default: 'on-load', enum: [ 'on-load', 'after-delay' ] },
		delayTime: { type: 'number', default: 3 },
		overlayBackgroundColor: { type: 'string', default: 'rgba(0, 0, 0, 0.5)' },
		popupWidth: { type: 'number', default: 400 },
		contentPosition: { type: 'string', default: 'center center' },
	},
	save( { attributes } ) {
		const style = {
			'--popup-width': attributes.popupWidth + 'px',
			'--overlay-bg': attributes.overlayBackgroundColor,
		};
		const alignmentClass = attributes.contentPosition
			? attributes.contentPosition.replace( / /g, '-' )
			: 'center-center';
		return (
			<>
				<div
					className="pdm-popup-overlay"
					style={ { background: attributes.overlayBackgroundColor } }
					data-trigger-type={ attributes.triggerType }
					data-delay-time={ attributes.delayTime }
					data-alignment={ attributes.contentPosition }
				></div>
				<div className={ `pdm-popup-modal popup-align-${ alignmentClass }` }>
					<div { ...useBlockProps.save( { style, className: 'wp-block-pdm-popup' } ) }>
						<button className="pdm-popup-close" aria-label="Close popup">
							<span aria-hidden="true">&times;</span>
						</button>
						<InnerBlocks.Content />
					</div>
				</div>
			</>
		);
	},
};

const v1 = {
	attributes: {
		popupWidth: { type: 'number', default: 600 },
		overlayBackgroundColor: { type: 'string', default: 'rgba(0,0,0,0.5)' },
		contentPosition: { type: 'string', default: 'center center' },
		triggerType: { type: 'string', default: 'delay' },
		delayTime: { type: 'number', default: 3 },
	},
	save( { attributes } ) {
		const style = {
			'--popup-width': attributes.popupWidth + 'px',
			'--overlay-bg': attributes.overlayBackgroundColor,
		};

		const alignmentClass = attributes.contentPosition
			? attributes.contentPosition.replace( / /g, '-' )
			: 'center-center';

		return (
			<>
				<div
					className="pdm-popup-overlay"
					style={ { background: attributes.overlayBackgroundColor } }
					data-trigger-type={ attributes.triggerType }
					data-delay-time={ attributes.delayTime }
					data-alignment={ attributes.contentPosition }
				></div>
				<div className={ `pdm-popup-modal popup-align-${ alignmentClass }` }>
					<div { ...useBlockProps.save( { style, className: 'wp-block-pdm-popup' } ) }>
						<button className="pdm-popup-close" aria-label="Close popup">
							<span aria-hidden="true">&times;</span>
						</button>
						<InnerBlocks.Content />
					</div>
				</div>
			</>
		);
	},
};

export default [ v2, v1 ];
