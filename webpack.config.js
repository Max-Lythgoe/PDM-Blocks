/**
 * Webpack config extension for PDM Blocks
 * Adds extension JS entry points alongside auto-discovered blocks.
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { resolve } = require('path');

const extensionEntries = {
    'company-info-extension': resolve(__dirname, 'src/extensions/company-info-extension.js'),
    'button-extender': resolve(__dirname, 'src/extensions/button-extender.js'),
    'button-icon-extension': resolve(__dirname, 'src/extensions/button-icon-extension.js'),
    'heading-balance': resolve(__dirname, 'src/extensions/heading-balance.js'),
    'query-loop-drafts': resolve(__dirname, 'src/extensions/query-loop-drafts.js'),
    'header-footer-scripts': resolve(__dirname, 'src/extensions/header-footer-scripts/index.js'),
};

function mergeConfig(cfg) {
    const origEntry = cfg.entry;
    const externals = cfg.externals;
    const newExternals = externals
        ? Array.isArray(externals)
            ? [...externals, { 'react/jsx-runtime': 'React' }]
            : [externals, { 'react/jsx-runtime': 'React' }]
        : { 'react/jsx-runtime': 'React' };
    return {
        ...cfg,
        entry: () => {
            const entries = typeof origEntry === 'function' ? origEntry() : origEntry;
            return { ...entries, ...extensionEntries };
        },
        externals: newExternals,
    };
}

if (Array.isArray(defaultConfig)) {
    module.exports = defaultConfig.map(mergeConfig);
} else {
    module.exports = mergeConfig(defaultConfig);
}
