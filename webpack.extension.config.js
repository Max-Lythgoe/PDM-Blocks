/**
 * Webpack config for building extensions outside of WP_EXPERIMENTAL_MODULES.
 * Does NOT clean the output directory so block builds are preserved.
 *
 * Entries here use classic `@wordpress/*` imports; the dependency extraction
 * plugin turns them into `wp-*` script handles in the generated .asset.php.
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { resolve } = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'responsive-controls-editor': resolve(__dirname, 'src/extensions/responsive-controls-editor.js'),
        'header-footer-scripts': resolve(__dirname, 'src/extensions/header-footer-scripts/index.js'),
    },
    output: {
        ...defaultConfig.output,
        clean: false,
    },
};
