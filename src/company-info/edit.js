/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		infoType,
		locationIndex,
		mapWidth,
		customText,
		customLink,
		showLocationName
	} = attributes;

	// Get company locations from localized data
	const companyData = useSelect((select) => {
		const editorSettings = select('core/block-editor').getSettings();
		// Try multiple ways to get the data
		const settingsData = editorSettings.companyData || {};
		const windowData = window.pdmCompanyData || {};
		
		// Use window fallback if settings data is empty
		return settingsData.locations ? settingsData : windowData;
	}, []);

	const locations = companyData.locations || [];

	// Location options for dropdown
	const locationOptions = locations.map((location, index) => ({
		label: location.name || `Location ${index + 1}`,
		value: index
	}));

	// Info type options
	const infoTypeOptions = [
		{ label: 'Address', value: 'address' },
		{ label: 'Phone', value: 'phone' },
		{ label: 'Email', value: 'email' },
		{ label: 'Hours', value: 'hours' },
		{ label: 'Map', value: 'map' }
	];

	// Map width options
	const mapWidthOptions = [
		{ label: 'Default', value: 'map-default' },
		{ label: 'Full Width', value: 'map-full' }
	];



	// Render preview based on info type
	const renderPreview = () => {
		if (!locations.length) {
			return <p>{__('No company locations configured.', 'company-info')}</p>;
		}

		const currentLocation = locations[locationIndex] || locations[0];

		switch (infoType) {
			case 'address':
				const addressLocationName = currentLocation.name || `Location ${locationIndex + 1}`;
				return (
					<>
						{showLocationName && (
							<div style={{ marginBottom: '8px', fontWeight: 'bold', display: 'block' }}>
								{addressLocationName}
							</div>
						)}
						<div>{currentLocation.address || ''}</div>
					</>
				);

			case 'phone':
				return currentLocation.phone ? (
					<a href={`tel:${currentLocation.phone.replace(/[^\d+]/g, '')}`} className="company-phone">
						{currentLocation.phone}
					</a>
				) : '';

			case 'email':
				return currentLocation.email ? (
					<a href={`mailto:${currentLocation.email}`} className="company-email">
						{currentLocation.email}
					</a>
				) : '';

			case 'hours':
				if (!currentLocation.hours || !Array.isArray(currentLocation.hours) || currentLocation.hours.length === 0) {
					return <p>{__('No hours configured for this location.', 'company-info')}</p>;
				}
				const hoursLocationName = currentLocation.name || `Location ${locationIndex + 1}`;

				return (
					<>
						{showLocationName && (
							<div style={{ marginBottom: '8px', fontWeight: 'bold', display: 'block' }}>
								{hoursLocationName}
							</div>
						)}
						<table className="company-hours-table" style={{ width: '100%', borderSpacing: '0 8px' }}>
							<tbody>
							{currentLocation.hours.map((hourRow, index) => {
								if (!hourRow || (!hourRow.label && !hourRow.hours)) return null;
								return (
									<tr key={index}>
										<td style={{ paddingRight: '20px' }}>
											<strong>{hourRow.label || ''}</strong>
										</td>
										<td>{hourRow.hours || ''}</td>
									</tr>
								);
							})}
							</tbody>
						</table>
					</>
				);

			case 'map':
				return (
					<div className={`company-map ${mapWidth}`}>
						{currentLocation.map ? (
							<div dangerouslySetInnerHTML={{ __html: currentLocation.map }} />
						) : (
							<p>{__('No map configured for this location.', 'company-info')}</p>
						)}
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title={__('Company Info Settings', 'company-info')}>
					<SelectControl
						label={__('Info Type', 'company-info')}
						value={infoType}
						options={infoTypeOptions}
						onChange={(value) => setAttributes({ infoType: value })}
					/>

					{locations.length > 0 && (
						<SelectControl
							label={__('Location', 'company-info')}
							value={locationIndex}
							options={locationOptions}
							onChange={(value) => setAttributes({ locationIndex: parseInt(value) })}
						/>
					)}

					{infoType === 'map' && (
						<SelectControl
							label={__('Map Width', 'company-info')}
							value={mapWidth}
							options={mapWidthOptions}
							onChange={(value) => setAttributes({ mapWidth: value })}
						/>
					)}

					{(infoType === 'address' || infoType === 'hours') && (
						<ToggleControl
							label={__('Show Location Name', 'company-info')}
							checked={showLocationName}
							onChange={(value) => setAttributes({ showLocationName: value })}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			{/* For full-width maps, render differently to avoid container constraints */}
			{infoType === 'map' && mapWidth === 'map-full' ? (
				renderPreview()
			) : (
			<div className="company-info-flex">
				<div className="company-info-item">
					{renderPreview()}
				</div>
			</div>
			)}
		</div>
	);
}
