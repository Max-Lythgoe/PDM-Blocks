import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
	BlockControls
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	ToolbarGroup,
	ToolbarButton
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { 
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween
} from '@wordpress/icons';
import { DualIconEdit } from '../../components/IconEdit';
import { DualIconRender } from '../../components/IconRender';

/**
 * The edit function describes the structure of your block in the context of the
 * Gutenberg editor.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		menuId = 0,
		menuJustify = 'flex-start',
		maxWidth = 1200,
		menuRadius = '0px',
		mobileBreakpoint = 1024,
		menuItemImageMaxWidth = 100,
		mobileImageFirst = true,
		submenuBackgroundColor,
		submenuBackgroundGradient,
		submenuHoverBackgroundColor,
		submenuHoverBackgroundGradient,
		submenuTextColor,
		submenuHoverTextColor
	} = attributes;

	// Get menu data
	const { allMenus, selectedMenuItems } = useSelect((select) => {
		const { getMenus, getMenuItems } = select('core');
		
		const menus = getMenus() || [];
		
		let menuItems = [];
		if (menuId && menuId > 0) {
			// Get all menu items and filter only those belonging to the selected menu
			const allItems = getMenuItems({ menus: menuId, per_page: -1 }) || [];
			// Filter to ensure we only get items for this specific menu
			menuItems = allItems.filter(item => item.menus === menuId || (Array.isArray(item.menus) && item.menus.includes(menuId)));
		}

		// Build hierarchical menu structure
		const buildMenuHierarchy = (items) => {
			const itemMap = {};
			const rootItems = [];

			// First pass: create item map
			items.forEach(item => {
				itemMap[item.id] = { ...item, children: [] };
			});

			// Second pass: build hierarchy
			items.forEach(item => {
				if (item.parent && itemMap[item.parent]) {
					itemMap[item.parent].children.push(itemMap[item.id]);
				} else {
					rootItems.push(itemMap[item.id]);
				}
			});

			return rootItems;
		};

		const hierarchicalMenuItems = menuItems.length > 0 ? buildMenuHierarchy(menuItems) : [];
		
		return {
			allMenus: menus,
			selectedMenuItems: hierarchicalMenuItems
		};
	}, [menuId]);

	// Create menu options
	const menuOptions = [
		{ label: __('Select a menu', 'pdm-blocks'), value: 0 },
		...allMenus.map(menu => ({
			label: menu.name,
			value: menu.id,
		})),
	];

	// Function to decode HTML entities
	const decodeHTMLEntities = (text) => {
		const textarea = document.createElement('textarea');
		textarea.innerHTML = text;
		return textarea.value;
	};

	// Render menu items
	const renderMenuItems = (items, isSubmenu = false) => {
		if (!items?.length) return null;
		
		return (
			<ul className={isSubmenu ? "sub-menu" : "menu-desktop"}>
				{items.map((item) => {
					const hasChildren = item.children?.length > 0;
					const imageUrl = item.meta?._menu_item_image || '';
					const itemClasses = [
						'menu-item',
						hasChildren ? 'menu-item-has-children' : '',
						imageUrl ? 'menu-item-has-image' : ''
					].filter(Boolean).join(' ');
					
					// Extract title safely
					let itemTitle = 'Menu Item';
					if (typeof item.title === 'string') {
						itemTitle = item.title;
					} else if (item.title?.rendered) {
						itemTitle = item.title.rendered;
					} else if (item.title?.raw) {
						itemTitle = item.title.raw;
					} else if (item.post_title) {
						itemTitle = item.post_title;
					}

					// Decode HTML entities for proper display in editor
					const decodedTitle = decodeHTMLEntities(itemTitle);

					return (
						<li key={item.ID || Math.random().toString(36).substr(2, 9)} className={itemClasses}>
							<a href={item.url || '#'} onClick={(e) => e.preventDefault()}>
								{imageUrl
									? <img src={imageUrl} alt={decodedTitle} style={{ maxWidth: `${menuItemImageMaxWidth}px`, height: 'auto', display: 'block' }} />
									: decodedTitle
								}
							</a>
							{hasChildren && renderMenuItems(item.children, true)}
						</li>
					);
				})}
			</ul>
		);
	};

	// Alignment options for toolbar
	const alignmentOptions = [
		{
			icon: justifyLeft,
			title: __('Align left', 'pdm-blocks'),
			isActive: menuJustify === 'flex-start',
			onClick: () => setAttributes({ menuJustify: 'flex-start' })
		},
		{
			icon: justifyCenter,
			title: __('Align center', 'pdm-blocks'),
			isActive: menuJustify === 'center',
			onClick: () => setAttributes({ menuJustify: 'center' })
		},
		{
			icon: justifyRight,
			title: __('Align right', 'pdm-blocks'),
			isActive: menuJustify === 'flex-end',
			onClick: () => setAttributes({ menuJustify: 'flex-end' })
		},
		{
			icon: justifySpaceBetween,
			title: __('Space between', 'pdm-blocks'),
			isActive: menuJustify === 'space-between',
			onClick: () => setAttributes({ menuJustify: 'space-between' })
		}
	];

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	// CSS variables for submenu colors
	const submenuStyles = {
		'--submenu-bg-color': submenuBackgroundGradient || submenuBackgroundColor,
		'--submenu-hover-bg-color': submenuHoverBackgroundGradient || submenuHoverBackgroundColor,
		'--submenu-text-color': submenuTextColor,
		'--submenu-hover-text-color': submenuHoverTextColor,
		'--max-width': `${maxWidth}px`,
		'--menu-alignment': menuJustify,
		'--menu-radius': menuRadius || '0px',
		'--menu-item-image-max-width': `${menuItemImageMaxWidth}px`
	};

		const blockProps = useBlockProps({ className: 'menu-block pdm-block', style: submenuStyles });

		return (
		<>
			<BlockControls>
				<ToolbarGroup>
					{alignmentOptions.map((option) => (
						<ToolbarButton
							key={option.title}
							icon={option.icon}
							title={option.title}
							isActive={option.isActive}
							onClick={option.onClick}
						/>
					))}
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Menu Settings', 'pdm-blocks')}>
					<SelectControl
						label={__('Select Menu', 'pdm-blocks')}
						value={menuId}
						options={menuOptions}
						onChange={(value) => setAttributes({ menuId: parseInt(value, 10) })}
						help={__('Select which menu to display.', 'pdm-blocks')}
					/>

					<RangeControl
						label={__('Max Width (px)', 'pdm-blocks')}
						value={maxWidth}
						onChange={(value) => setAttributes({ maxWidth: value })}
						min={200}
						max={2000}
						step={50}
						help={__('Maximum width for the menu container.', 'pdm-blocks')}
					/>

					<NumberControl
						label={__('Mobile Breakpoint (px)', 'pdm-blocks')}
						value={mobileBreakpoint}
						onChange={(value) => setAttributes({ mobileBreakpoint: parseInt(value, 10) || 1024 })}
						min={320}
						max={1920}
						help={__('Screen width at which the menu switches to mobile layout.', 'pdm-blocks')}
					/>
				</PanelBody>

				<PanelBody title={__('Border Radius', 'pdm-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Submenu Dropdown Corner Radius', 'pdm-blocks')}
						value={parseInt(menuRadius) || 0}
						onChange={(value) => setAttributes({ menuRadius: value + 'px' })}
						min={0}
						max={50}
						step={1}
						help={__('Set the corner radius for submenu dropdowns.', 'pdm-blocks')}
					/>
				</PanelBody>

		<PanelBody title={__('Mobile Menu Icons', 'pdm-blocks')} initialOpen={false}>
			<DualIconEdit
				attributes={attributes}
				setAttributes={setAttributes}
				openLabel="Open Menu Icon"
				closeLabel="Close Menu Icon"
			/>
		</PanelBody>

		<PanelBody title={__('Menu Item Images', 'pdm-blocks')} initialOpen={false}>
				<RangeControl
						label={__('Menu Item Image Max Width (px)', 'pdm-blocks')}
						value={menuItemImageMaxWidth}
						onChange={(value) => setAttributes({ menuItemImageMaxWidth: value })}
						min={20}
						max={700}
						step={5}
						help={__('Max width for images added to menu items (e.g. a logo).', 'pdm-blocks')}
					/>

					<ToggleControl
						label={__('Image item first on mobile', 'pdm-blocks')}
						checked={mobileImageFirst}
						onChange={(value) => setAttributes({ mobileImageFirst: value })}
						help={__('Move image menu items to the top of the mobile slide-out menu.', 'pdm-blocks')}
					/>
		</PanelBody>

	</InspectorControls>

	<InspectorControls group="color">
		<ColorGradientSettingsDropdown
			panelId={clientId}
			settings={[
				{
					label: __('Submenu Background', 'pdm-blocks'),
					colorValue: submenuBackgroundColor,
					onColorChange: (color) => setAttributes({ submenuBackgroundColor: color }),
					gradientValue: submenuBackgroundGradient,
					onGradientChange: (gradient) => setAttributes({ submenuBackgroundGradient: gradient }),
				},
				{
					label: __('Submenu Text Color', 'pdm-blocks'),
					colorValue: submenuTextColor,
					onColorChange: (color) => setAttributes({ submenuTextColor: color }),
				},
				{
					label: __('Submenu Hover Background', 'pdm-blocks'),
					colorValue: submenuHoverBackgroundColor,
					onColorChange: (color) => setAttributes({ submenuHoverBackgroundColor: color }),
					gradientValue: submenuHoverBackgroundGradient,
					onGradientChange: (gradient) => setAttributes({ submenuHoverBackgroundGradient: gradient }),
				},
				{
					label: __('Submenu Hover Text Color', 'pdm-blocks'),
					colorValue: submenuHoverTextColor,
					onColorChange: (color) => setAttributes({ submenuHoverTextColor: color }),
				},
			]}
			{...colorGradientSettings}
		/>
	</InspectorControls>

		<div {...blockProps}>
			<style dangerouslySetInnerHTML={{ __html: `
				@media (max-width: ${mobileBreakpoint}px) {
					.pdm-menu-mobile {
					--iconSize: ${attributes.iconSize || 25}px;
				    }
					[data-block="${clientId}"] .pdm-menu-desktop { display: none !important; }
					[data-block="${clientId}"] .pdm-menu-mobile { display: flex !important; }
					[data-block="${clientId}"] .block-menu-toggle { display: flex !important; margin-inline: auto; }
				}
			` }} />
			{menuId && selectedMenuItems.length > 0 ? (
				<>
					<nav className="pdm-menu pdm-menu-desktop" style={{ justifyContent: menuJustify, maxWidth: `${maxWidth}px`, margin: '0 auto', display: 'flex', alignItems: 'center' }}>
						<div className="menu-desktop" style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, width: '100%', justifyContent: menuJustify }}>
							{renderMenuItems(selectedMenuItems)}
						</div>
					</nav>
					<nav className="pdm-menu pdm-menu-mobile">
						<div className="block-menu-toggle" style={{ display: 'flex' }}>
							{ DualIconRender({ attributes, openDefault: 'bars', closeDefault: 'xmark' }).openIcon }
						</div>
					</nav>
				</>
			) : (
					<div className="menu-preview">
						{!menuId ? (
							<p className="menu-location-warning">
								{__('Please select a menu in the block settings.', 'pdm-blocks')}
							</p>
						) : (
							<p className="menu-location-warning">
								{__('Selected menu is empty.', 'pdm-blocks')}
							</p>
						)}
					</div>
				)}
			</div>
		</>
	);
}
