import fs from 'fs';
import path from 'path';
import { WinmeScriptsConfig } from '../typings';
import merge from '../utils/merge';

const defaultconfig = {
  // entry: 'src/index',
  devServer: {
    port: 3000,
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
  reactRouter3: false,
};

const configPath = path.resolve(process.cwd(), 'winme-scripts.config.js');

const config = fs.readFileSync(configPath)
  ? merge(defaultconfig, require(configPath) as WinmeScriptsConfig)
  : merge(defaultconfig, {} as WinmeScriptsConfig);

config.devServer.port = parseInt(config.devServer.port.toString(), 10);

export default config;
