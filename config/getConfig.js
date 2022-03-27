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
    webpack: () => {},
    disabledBundleSize: false,
    // alias: {},
    // modifyVars: {}
};

const configPath = path.resolve(process.cwd(), 'caibeike-scripts.config.js');

/** @type {import('../typings/index').CaibeikeScriptsConfig} */
let finalConfig = {};
if (fs.readFileSync(configPath)) {
    /** @type {import('../typings/index').CaibeikeScriptsConfig} */
    const userConfig = require(configPath);

    userConfig.devServer.port = parseInt(userConfig.devServer.port, 10);
    finalConfig = merge(defaultconfig, userConfig);
} else {
    finalConfig = defaultconfig;
}

module.exports = finalConfig;
