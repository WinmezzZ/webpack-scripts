const fs = require('fs');
const path = require('path');

let defaultconfig = {
    port: 3100,
    host: '0.0.0.0',
    https: false,
    buildDir: 'dist',
    publicPath: '/',
    sourcemap: false,
    entry: 'src/containers/index',
    webpack: () => {},
    disabledBundleSize: false,
    // alias: {},
    // proxy: {},
    // modifyVars: {}
}

const configPath = path.resolve(process.cwd(), 'caibeike-scripts.config.js')

if (fs.readFileSync(configPath)) {
    const userConfig = require(configPath)
    Object.assign(defaultconfig, userConfig)
}

defaultconfig.port = parseInt(defaultconfig.port, 10)

module.exports = defaultconfig