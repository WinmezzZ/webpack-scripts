import '../config/env';
import chalk from 'chalk';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import openBrowser from 'react-dev-utils/openBrowser';
import { prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import clearConsole from 'react-dev-utils/clearConsole';
import devserverConfig from '../config/devserver.config';
import webpackConfig from '../config/webpack.config';
import config from '../config/getConfig';

const env = process.env.NODE_ENV;
const {
    devServer: { port: DEFAULT_PORT, host: HOST, https: HTTPS, proxy: PROXY },
} = config;

const protocol = HTTPS === true ? 'https' : 'http';
const urls = prepareUrls(protocol, HOST, DEFAULT_PORT);
const compiler: any = webpack(webpackConfig(env));
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
