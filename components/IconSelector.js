import { useState } from '@wordpress/element';
import { Button, __experimentalGrid as Grid, SearchControl } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { ICON_LIBRARY, getDefaultIcon } from './icon-library';
import './icon-selector.css';

export function IconSelector({ selectedIcon, customIconUrl, onIconSelect, onCustomIconSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('library');

    // search icons
    const filteredIcons = Object.entries(ICON_LIBRARY).filter(([name]) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="icon-selector">
            <div className="icon-selector-tabs">
                <Button
                    variant={activeTab === 'library' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('library')}
                >
                    Icon Library
                </Button>
                <Button
                    variant={activeTab === 'custom' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('custom')}
                >
                    Custom Upload
                </Button>
            </div>

            {activeTab === 'library' && (
                <>
                    <SearchControl
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search icons..."
                    />
                    <div className="icon-selector-grid-wrapper">
                        <Grid columns={6} gap={2} className="icon-selector-grid">
                            {filteredIcons.map(([name, svg]) => (
                                <Button
                                    key={name}
                                    className={`icon-selector-button ${selectedIcon === name && !customIconUrl ? 'is-selected' : ''}`}
                                    onClick={() => onIconSelect(name)}
                                    variant={selectedIcon === name && !customIconUrl ? 'primary' : 'secondary'}
                                >
                                    {svg}
                                </Button>
                            ))}
                        </Grid>
                    </div>
                </>
            )}

            {activeTab === 'custom' && (
                <div className="icon-selector-upload">
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={async (media) => {
                                if (media.url.toLowerCase().endsWith('.svg')) {
                                    try {
                                        const response = await fetch(media.url);
                                        const svgContent = await response.text();
                                        onCustomIconSelect(media.url, svgContent);
                                    } catch (error) {
                                        console.error('Failed to fetch SVG:', error);
                                        onCustomIconSelect(media.url);
                                    }
                                } else {
                                    onCustomIconSelect(media.url);
                                }
                            }}
                            allowedTypes={['image']}
                            value={customIconUrl}
                            render={({ open }) => (
                                <div>
                                    {customIconUrl ? (
                                        <div className="icon-selector-preview">
                                            <img src={customIconUrl} alt="Custom icon" />
                                            <Button onClick={open} variant="secondary">
                                                Change Icon
                                            </Button>
                                            <Button 
                                                onClick={() => onCustomIconSelect(null)} 
                                                variant="tertiary"
                                                isDestructive
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={open} variant="primary">
                                            Upload Custom Icon
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                </div>
            )}
        </div>
    );
}
