import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

// v1: popupWidth was a number; save() appended 'px' manually
const v1 = {
	attributes: {
		popupId: { type: 'string', default: '' },
		overlayBackgroundColor: { type: 'string', default: 'rgba(0, 0, 0, 0.5)' },
		popupWidth: { type: 'number', default: 400 },
		contentPosition: { type: 'string', default: 'center center' },
	},
	save( { attributes } ) {
		const alignmentClass = attributes.contentPosition
			? attributes.contentPosition.replace( / /g, '-' )
			: 'center-center';

		const blockProps = useBlockProps.save( {
			id: attributes.popupId || undefined,
			popover: 'auto',
			className: `popup-align-${ alignmentClass }`,
			style: {
				'--popup-width': attributes.popupWidth + 'px',
				'--overlay-bg': attributes.overlayBackgroundColor,
			},
		} );

		return (
			<div { ...blockProps }>
				<button
					className="pdm-toggled-popup-close"
					{ ...( attributes.popupId
						? {
								popovertarget: attributes.popupId,
								popovertargetaction: 'hide',
						  }
						: {} ) }
					aria-label="Close popup"
				>
					<span aria-hidden="true">&times;</span>
				</button>
				<InnerBlocks.Content />
			</div>
		);
	},
};

export default [ v1 ];
