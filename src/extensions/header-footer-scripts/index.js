/**
 * Custom Code Panel - Block Editor side panel for per-page header/footer scripts
 * Migrated from PDM Accelerate theme.
 */
const { registerPlugin } = wp.plugins;
// Not deprecated since WP 6.6: the edit-post export moved to wp.editor.
const { PluginDocumentSettingPanel } = wp.editor;
const { useSelect, useDispatch } = wp.data;
const { TextControl, TextareaControl, Button } = wp.components;
const { useState, useEffect, useRef, createElement } = wp.element;

const DEFAULT_SCRIPTS = [{ name: '', code: '' }];

const parseScripts = (value) => {
    if (!value) return null;
    try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((script) => ({
                name: typeof script.name === 'string' ? script.name : '',
                code: typeof script.code === 'string' ? script.code : '',
            }));
        }
    } catch (e) {}
    return null;
};

const CustomCodePanel = () => {
    const meta = useSelect((select) =>
        select('core/editor').getEditedPostAttribute('meta')
    );
    const { editPost } = useDispatch('core/editor');

    const [headerScripts, setHeaderScripts] = useState(DEFAULT_SCRIPTS);
    const [footerScripts, setFooterScripts] = useState(DEFAULT_SCRIPTS);

    // Load saved scripts into the panel once the editor has hydrated the meta.
    const initializedRef = useRef(false);
    useEffect(() => {
        if (initializedRef.current || !meta) {
            return;
        }
        initializedRef.current = true;
        const header = parseScripts(meta._hfs_header_scripts);
        const footer = parseScripts(meta._hfs_footer_scripts);
        if (header) {
            setHeaderScripts(header);
        }
        if (footer) {
            setFooterScripts(footer);
        }
    }, [meta]);

    // Persist to the editor store on every change. This is a client-side store
    // update only (no database writes until the post is saved), and it marks
    // the post "dirty" so the editor's Update button is enabled.
    const updateHeaderScript = (index, field, value) => {
        const next = headerScripts.map((script, i) =>
            i === index ? { ...script, [field]: value } : script
        );
        setHeaderScripts(next);
        editPost({ meta: { _hfs_header_scripts: JSON.stringify(next) } });
    };

    const updateFooterScript = (index, field, value) => {
        const next = footerScripts.map((script, i) =>
            i === index ? { ...script, [field]: value } : script
        );
        setFooterScripts(next);
        editPost({ meta: { _hfs_footer_scripts: JSON.stringify(next) } });
    };

    const addHeaderScript = () => {
        const next = [...headerScripts, { name: '', code: '' }];
        setHeaderScripts(next);
        editPost({ meta: { _hfs_header_scripts: JSON.stringify(next) } });
    };

    const addFooterScript = () => {
        const next = [...footerScripts, { name: '', code: '' }];
        setFooterScripts(next);
        editPost({ meta: { _hfs_footer_scripts: JSON.stringify(next) } });
    };

    const removeHeaderScript = (index) => {
        const next = headerScripts.filter((_, i) => i !== index);
        const result = next.length > 0 ? next : DEFAULT_SCRIPTS;
        setHeaderScripts(result);
        editPost({ meta: { _hfs_header_scripts: JSON.stringify(result) } });
    };

    const removeFooterScript = (index) => {
        const next = footerScripts.filter((_, i) => i !== index);
        const result = next.length > 0 ? next : DEFAULT_SCRIPTS;
        setFooterScripts(result);
        editPost({ meta: { _hfs_footer_scripts: JSON.stringify(result) } });
    };

    return createElement(
        PluginDocumentSettingPanel,
        {
            name: 'custom-code-panel',
            title: 'Custom Code',
            className: 'custom-code-panel',
        },
        createElement(
            'div',
            { style: { marginBottom: '20px' } },
            createElement('p', {
                style: { fontSize: '12px', color: '#757575', marginTop: 0 }
            }, 'Add custom scripts specific to this page.'),

            createElement('h4', { style: { marginTop: '16px', marginBottom: '12px' } }, 'Header Scripts'),
            headerScripts.map((script, index) =>
                createElement(
                    'div',
                    { key: index, style: { marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' } },
                    createElement(
                        'div',
                        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                        createElement(TextControl, {
                            placeholder: 'Script Name',
                            value: script.name,
                            onChange: (value) => updateHeaderScript(index, 'name', value),
                            style: { flex: 1, marginRight: '8px' },
                        }),
                        createElement(Button, {
                            isDestructive: true,
                            isSmall: true,
                            icon: 'trash',
                            onClick: () => removeHeaderScript(index),
                        })
                    ),
                    createElement(TextareaControl, {
                        placeholder: 'Enter script code...',
                        value: script.code,
                        onChange: (value) => updateHeaderScript(index, 'code', value),
                        rows: 4,
                    })
                )
            ),
            createElement(Button, { variant: 'secondary', isSmall: true, onClick: addHeaderScript }, 'Add Header Script'),

            createElement('h4', { style: { marginTop: '24px', marginBottom: '12px' } }, 'Footer Scripts'),
            footerScripts.map((script, index) =>
                createElement(
                    'div',
                    { key: index, style: { marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px' } },
                    createElement(
                        'div',
                        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                        createElement(TextControl, {
                            placeholder: 'Script Name',
                            value: script.name,
                            onChange: (value) => updateFooterScript(index, 'name', value),
                            style: { flex: 1, marginRight: '8px' },
                        }),
                        createElement(Button, {
                            isDestructive: true,
                            isSmall: true,
                            icon: 'trash',
                            onClick: () => removeFooterScript(index),
                        })
                    ),
                    createElement(TextareaControl, {
                        placeholder: 'Enter script code...',
                        value: script.code,
                        onChange: (value) => updateFooterScript(index, 'code', value),
                        rows: 4,
                    })
                )
            ),
            createElement(Button, { variant: 'secondary', isSmall: true, onClick: addFooterScript }, 'Add Footer Script')
        )
    );
};

registerPlugin('custom-code-plugin', {
    render: CustomCodePanel,
    icon: 'editor-code',
});
