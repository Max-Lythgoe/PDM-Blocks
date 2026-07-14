/**
 * Custom Code Panel - Block Editor side panel for per-page header/footer scripts
 * Migrated from PDM Accelerate theme.
 */
const { registerPlugin } = wp.plugins;
const { PluginDocumentSettingPanel } = wp.editPost;
const { useSelect, useDispatch } = wp.data;
const { TextControl, TextareaControl, Button } = wp.components;
const { useState, useEffect, createElement, Fragment } = wp.element;

const CustomCodePanel = () => {
    const meta = useSelect((select) => ({
        meta: select('core/editor').getEditedPostAttribute('meta'),
    }));

    const { editPost } = useDispatch('core/editor');

    const [headerScripts, setHeaderScripts] = useState([{ name: '', code: '' }]);
    const [footerScripts, setFooterScripts] = useState([{ name: '', code: '' }]);

    useEffect(() => {
        if (meta.meta && meta.meta._hfs_header_scripts) {
            try {
                const parsed = JSON.parse(meta.meta._hfs_header_scripts);
                if (parsed && parsed.length > 0) {
                    setHeaderScripts(parsed);
                }
            } catch (e) {}
        }

        if (meta.meta && meta.meta._hfs_footer_scripts) {
            try {
                const parsed = JSON.parse(meta.meta._hfs_footer_scripts);
                if (parsed && parsed.length > 0) {
                    setFooterScripts(parsed);
                }
            } catch (e) {}
        }
    }, []);

    const updateHeaderScript = (index, field, value) => {
        const newScripts = [...headerScripts];
        newScripts[index][field] = value;
        setHeaderScripts(newScripts);
        editPost({ meta: { _hfs_header_scripts: JSON.stringify(newScripts) } });
    };

    const updateFooterScript = (index, field, value) => {
        const newScripts = [...footerScripts];
        newScripts[index][field] = value;
        setFooterScripts(newScripts);
        editPost({ meta: { _hfs_footer_scripts: JSON.stringify(newScripts) } });
    };

    const addHeaderScript = () => {
        const newScripts = [...headerScripts, { name: '', code: '' }];
        setHeaderScripts(newScripts);
        editPost({ meta: { _hfs_header_scripts: JSON.stringify(newScripts) } });
    };

    const addFooterScript = () => {
        const newScripts = [...footerScripts, { name: '', code: '' }];
        setFooterScripts(newScripts);
        editPost({ meta: { _hfs_footer_scripts: JSON.stringify(newScripts) } });
    };

    const removeHeaderScript = (index) => {
        const newScripts = headerScripts.filter((_, i) => i !== index);
        setHeaderScripts(newScripts.length > 0 ? newScripts : [{ name: '', code: '' }]);
        editPost({ meta: { _hfs_header_scripts: JSON.stringify(newScripts) } });
    };

    const removeFooterScript = (index) => {
        const newScripts = footerScripts.filter((_, i) => i !== index);
        setFooterScripts(newScripts.length > 0 ? newScripts : [{ name: '', code: '' }]);
        editPost({ meta: { _hfs_footer_scripts: JSON.stringify(newScripts) } });
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
