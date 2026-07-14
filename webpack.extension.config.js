/**
 * Webpack config for building extensions outside of WP_EXPERIMENTAL_MODULES.
 * Does NOT clean the output directory so block builds are preserved.
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { resolve } = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'responsive-controls-editor': resolve(__dirname, 'src/extensions/responsive-controls-editor.js'),
    },
    output: {
        ...defaultConfig.output,
        clean: false,
    },
};
