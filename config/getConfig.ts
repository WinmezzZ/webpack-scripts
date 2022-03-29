import fs from 'fs';
import path from 'path';
import { CaibeikeScriptsConfig } from '../typings';
import merge from '../utils/merge';

const defaultconfig = {
    devServer: {
        port: 3100,
        host: '0.0.0.0',
    },
    buildDir: 'dist',
    publicPath: '/',
    htmlTemplatePath: '',
    sourcemap: false,
    // webpack: () => {},
    disabledBundleSize: false,
    alias: {},
    modifyVars: {},
    babel: {},
    postcss: {},
};

const configPath = path.resolve(process.cwd(), 'caibeike-scripts.config.js');

const config = fs.readFileSync(configPath)
    ? merge(defaultconfig, require(configPath) as CaibeikeScriptsConfig)
    : merge(defaultconfig, {} as CaibeikeScriptsConfig);

config.devServer.port = parseInt(config.devServer.port.toString(), 10);

export default config;
