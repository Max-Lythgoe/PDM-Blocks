/**
 * Company Info Rich Text Format Extension
 * Adds toolbar to insert company information shortcodes at cursor position in paragraphs & list items
 * Migrated from PDM Accelerate theme to PDM Blocks plugin
 */
const { Fragment, useState, createElement } = wp.element;
const { BlockControls } = wp.blockEditor;
const { ToolbarGroup, ToolbarButton, Modal, Button, SelectControl } = wp.components;
const { __ } = wp.i18n;
const { registerFormatType, create, insert } = wp.richText;

// Building icon SVG
const BuildingIcon = () => createElement(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 640 640', width: '20', height: '20', fill: 'currentColor' },
    createElement('path', { d: 'M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 128C512 92.7 483.3 64 448 64L192 64zM304 416L336 416C353.7 416 368 430.3 368 448L368 528L272 528L272 448C272 430.3 286.3 416 304 416zM224 176C224 167.2 231.2 160 240 160L272 160C280.8 160 288 167.2 288 176L288 208C288 216.8 280.8 224 272 224L240 224C231.2 224 224 216.8 224 208L224 176zM368 160L400 160C408.8 160 416 167.2 416 176L416 208C416 216.8 408.8 224 400 224L368 224C359.2 224 352 216.8 352 208L352 176C352 167.2 359.2 160 368 160zM224 304C224 295.2 231.2 288 240 288L272 288C280.8 288 288 295.2 288 304L288 336C288 344.8 280.8 352 272 352L240 352C231.2 352 224 344.8 224 336L224 304zM368 288L400 288C408.8 288 416 295.2 416 304L416 336C416 344.8 408.8 352 400 352L368 352C359.2 352 352 344.8 352 336L352 304C352 295.2 359.2 288 368 288z' })
);

// Company Info Modal Component
function CompanyInfoModal({ isOpen, onClose, onSelect }) {
    const [selectedLocation, setSelectedLocation] = useState('1');
    const [selectedField, setSelectedField] = useState('phone');

    // Get company locations from localized data
    const locations = window.accelerateCompanyLocations || window.pdmCompanyData?.locations || [];

    if (!isOpen || locations.length === 0) return null;

    const locationOptions = locations.map((location, index) => {
        const locationName = location.name || `Location ${index + 1}`;
        return {
            label: locationName,
            value: String(index + 1)
        };
    });

    const fieldOptions = [
        { label: 'Phone', value: 'phone' },
        { label: 'Email', value: 'email' },
        { label: 'Address', value: 'address' },
        { label: 'Current Year', value: 'year' },
        { label: 'Site Name', value: 'sitename' },
        { label: 'Site URL', value: 'siteurl' }
    ];

    const handleInsert = () => {
        let shortcode;
        
        if (['year', 'sitename', 'siteurl'].includes(selectedField)) {
            shortcode = `[dynamic_content type="${selectedField}"]`;
        } else {
            shortcode = `[company_info type="${selectedField}" location="${selectedLocation}"]`;
        }
        
        onSelect(shortcode);
        onClose();
    };

    return createElement(
        Modal,
        {
            title: __('Insert Company Information', 'pdm-blocks'),
            onRequestClose: onClose,
            style: { maxWidth: '400px' },
        },
        createElement(
            'div',
            { style: { padding: '16px 0' } },
            createElement(SelectControl, {
                label: __('Select Information', 'pdm-blocks'),
                value: selectedField,
                options: fieldOptions,
                onChange: (value) => setSelectedField(value),
            }),
            !['year', 'sitename', 'siteurl'].includes(selectedField) && createElement(SelectControl, {
                label: __('Select Location', 'pdm-blocks'),
                value: selectedLocation,
                options: locationOptions,
                onChange: (value) => setSelectedLocation(value),
            }),
            createElement(
                'div',
                { style: { marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' } },
                createElement(Button, { variant: 'tertiary', onClick: onClose }, __('Cancel', 'pdm-blocks')),
                createElement(Button, { variant: 'primary', onClick: handleInsert }, __('Insert', 'pdm-blocks'))
            )
        )
    );
}

// Rich Text Format Edit Component
function Edit(props) {
    const { value, onChange } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShortcodeSelect = (shortcode) => {
        const shortcodeValue = create({ html: shortcode });
        const insertStartIndex = value.start || 0;
        const newValue = insert(value, shortcodeValue, insertStartIndex, insertStartIndex);
        onChange(newValue);
    };

    return createElement(
        Fragment,
        null,
        createElement(
            BlockControls,
            null,
            createElement(
                ToolbarGroup,
                null,
                createElement(ToolbarButton, {
                    icon: createElement(BuildingIcon),
                    title: __('Insert Company Info', 'pdm-blocks'),
                    onClick: () => setIsModalOpen(true),
                })
            )
        ),
        createElement(CompanyInfoModal, {
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            onSelect: handleShortcodeSelect,
        })
    );
}

// Register as Rich Text Format - using same name as theme to override
const formatName = 'accelerate/company-info';

registerFormatType(formatName, {
    name: formatName,
    title: __('Company Info', 'pdm-blocks'),
    tagName: 'span',
    className: 'accelerate-company-info-placeholder',
    edit: Edit,
});
