import { useBlockProps } from '@wordpress/block-editor';

const v1 = {
	attributes: {
		logos: { type: 'array', default: [] },
		logoSize: { type: 'number', default: 120 },
		speed: { type: 'number', default: 20 },
		grayscale: { type: 'boolean', default: false },
		pauseOnHover: { type: 'boolean', default: true },
		showFade: { type: 'boolean', default: true },
	},
	save( { attributes } ) {
		const { logos, logoSize, speed, grayscale, pauseOnHover, showFade } = attributes;

		const style = {
			'--logo-size': logoSize + 'px',
			'--ticker-speed': speed + 's',
		};

		const blockClasses = [];
		if ( grayscale ) blockClasses.push( 'is-grayscale' );
		if ( pauseOnHover ) blockClasses.push( 'pause-on-hover' );
		if ( showFade ) blockClasses.push( 'has-fade' );

		const blockProps = useBlockProps.save( {
			style: style,
			className: blockClasses.join( ' ' ),
		} );

		return (
			<div { ...blockProps }>
				{ logos && logos.length > 0 ? (
					<div className="logo-ticker-wrapper">
						<div className="logo-ticker-track">
							{ [ ...Array( 3 ) ].map( ( _, setIndex ) =>
								logos.map( ( logo, index ) => (
									<div key={ `${ logo.id }-${ setIndex }-${ index }` } className="logo-ticker-item" aria-hidden={ setIndex > 0 ? 'true' : undefined }>
										<img
											src={ logo.url }
											alt={ logo.alt }
											className={ `wp-image-${ logo.id }` }
										/>
									</div>
								) )
							) }
						</div>
					</div>
				) : (
					<p>No logos added</p>
				) }
			</div>
		);
	},
};

export default [ v1 ];
