const {override, disableEsLint, overrideDevServer, watchAll, addWebpackAlias} = require('customize-cra');
const path = require('path');
module.exports = {
    webpack: override(
        addWebpackAlias({
            '@utils': path.resolve(__dirname, './src/utils'),
            '@shape': path.resolve(__dirname, './src/shape'),
            '@hook': path.resolve(__dirname, './src/hook'),
            '@component': path.resolve(__dirname, './src/component'),
        }),
    ),
    // usual webpack plugin
    // disableEsLint(),
    devServer: overrideDevServer(),
    // dev server plugin
    // watchAll(),
};
