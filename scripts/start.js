process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const openBrowser = require('react-dev-utils/openBrowser');
const { prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const clearConsole = require('react-dev-utils/clearConsole');
const devserverConfig = require('../config/devserver.config');
const webpackConfig = require('../config/webpack.config');
const config = require('../config/getConfig');

const env = process.env.NODE_ENV;
const {
    port: DEFAULT_PORT,
    host: HOST,
    https: HTTPS,
    proxy: PROXY
} = config

const protocol = HTTPS === true ? 'https' : 'http';
const urls = prepareUrls(protocol, HOST, DEFAULT_PORT);
const compiler = webpack(webpackConfig(env));
const serverConfig = devserverConfig({
    port: DEFAULT_PORT,
    host: HOST,
    https: protocol === 'https',
    proxy: PROXY,
});
const devServer = new WebpackDevServer(compiler, serverConfig);

devServer.listen(DEFAULT_PORT, HOST, err => {
    if (err) {
        return console.log(err);
    }
    clearConsole();
    console.log(chalk.cyan('正在启动开发服务器...\n'));
    openBrowser(urls.localUrlForBrowser);
});
