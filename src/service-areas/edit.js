import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { showIcons, markerColor, groupByCounty, linkCounties } = attributes;

	const serviceAreas = useSelect((select) => {
		return select('core').getEntityRecords('postType', 'service-areas', {
			per_page: -1,
			status: ['publish', 'draft'],
			orderby: 'title',
			order: 'asc',
		});
	}, []);

	const counties = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'county', {
			per_page: -1,
			orderby: 'name',
			order: 'asc',
		});
	}, []);

	const blockProps = useBlockProps();

	const renderServiceArea = (area) => (
		<div key={area.id} className={`service-area-item`}>
			{showIcons && (
				<svg 
					xmlns="http://www.w3.org/2000/svg" 
					viewBox="0 0 640 640"
					className="location-marker"
					style={{ fill: markerColor }}
				>
					<path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 403.4 320 592 320 592C320 592 128 403.4 128 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z"/>
				</svg>
			)}
			{area.status === 'publish' ? (
				<a href="#" onClick={(e) => e.preventDefault()}>
					{area.title.rendered || __('(No title)', 'service-areas')}
				</a>
			) : (
				<span className="draft">
					{area.title.rendered || __('(No title)', 'service-areas')}
				</span>
			)}
		</div>
	);

	const renderContent = () => {
		if (!serviceAreas) {
			return <p>{__('Loading service areas...', 'service-areas')}</p>;
		}

		if (serviceAreas.length === 0) {
			return <p>{__('No service areas found.', 'service-areas')}</p>;
		}

		if (groupByCounty) {
			if (!counties || counties.length === 0) {
				return <p>{__('No counties found.', 'service-areas')}</p>;
			}

			return counties.map((county) => {
				const areasInCounty = serviceAreas.filter(
					(area) => area.county && area.county.includes(county.id)
				);

				if (areasInCounty.length === 0) return null;

				return (
					<div key={county.id} className="county-group">
						<h3 className="county-title">
							{linkCounties ? (
								<a href="#" onClick={(e) => e.preventDefault()}>
									{county.name}
								</a>
							) : (
								county.name
							)}
						</h3>
						<div className="service-areas-grid">
							{areasInCounty.map(renderServiceArea)}
						</div>
					</div>
				);
			});
		}

		return (
			<div className="service-areas-grid">
				{serviceAreas.map(renderServiceArea)}
			</div>
		);
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'service-areas')}>
					<ToggleControl
						label={__('Show Location Icons', 'service-areas')}
						checked={showIcons}
						onChange={(value) => setAttributes({ showIcons: value })}
					/>
					<ToggleControl
						label={__('Group by County', 'service-areas')}
						checked={groupByCounty}
						onChange={(value) => setAttributes({ groupByCounty: value })}
					/>
					{groupByCounty && (
						<ToggleControl
							label={__('Link Counties', 'service-areas')}
							checked={linkCounties}
							onChange={(value) => setAttributes({ linkCounties: value })}
							help={__('Make county names clickable links to their archive pages.', 'service-areas')}
						/>
					)}
					<ToggleControl
						label={__('Pill Style', 'service-areas')}
						checked={attributes.pillStyle}
						onChange={(value) => setAttributes({ pillStyle: value })}
					/>
				</PanelBody>
				{showIcons && (
					<PanelColorSettings
						title={__('Color Settings', 'service-areas')}
						colorSettings={[
							{
								value: markerColor,
								onChange: (value) => setAttributes({ markerColor: value }),
								label: __('Icon Color', 'service-areas'),
							},
						]}
					/>
				)}
			</InspectorControls>
			<div {...blockProps}>
				<div className={`service-areas-container style-${attributes.pillStyle ? 'pill' : 'default'}`}>
					{renderContent()}
				</div>
			</div>
		</>
	);
}
