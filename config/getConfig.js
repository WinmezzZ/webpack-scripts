const fs = require('fs');
const path = require('path');
const merge = require('../utils/merge');

/** @type {import('../typings/index').CaibeikeScriptsConfig} */
const defaultconfig = {
    devServer: {
        port: 3100,
        host: '0.0.0.0',
    },
    buildDir: 'dist',
    publicPath: '/',
    sourcemap: false,
    entry: 'src/containers/index',
    // webpack: () => {},
    disabledBundleSize: false,
    alias: {},
    modifyVars: {},
    babel: {},
};

const configPath = path.resolve(process.cwd(), 'caibeike-scripts.config.js');

/** @type {import('../typings/index').CaibeikeScriptsConfig} */
let finalConfig = {};
if (fs.readFileSync(configPath)) {
    /** @type {import('../typings/index').CaibeikeScriptsConfig} */
    const userConfig = require(configPath);

    finalConfig = merge(defaultconfig, userConfig);
} else {
    finalConfig = defaultconfig;
}

finalConfig.devServer.port = parseInt(finalConfig.devServer.port, 10);

module.exports = finalConfig;
