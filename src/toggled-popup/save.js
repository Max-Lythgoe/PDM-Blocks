import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const alignmentClass = attributes.contentPosition
		? attributes.contentPosition.replace( / /g, '-' )
		: 'center-center';

	const blockProps = useBlockProps.save( {
		id: attributes.popupId || undefined,
		popover: 'auto',
		className: `popup-align-${ alignmentClass }`,
		style: {
			'--popup-width': attributes.popupWidth,
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
}
