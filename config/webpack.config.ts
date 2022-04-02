import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ErrorOverlayPlugin from '@winme/react-overlay-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FilterWarningsPlugin from 'webpack-filter-warnings-plugin';
import OptimizeCSSPlugin from 'optimize-css-assets-webpack-plugin';
import safePostCssParser from 'postcss-safe-parser';
import clearConsole from 'react-dev-utils/clearConsole';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import babelMerge from 'babel-merge';
import merge from '../utils/merge';
import postcssConfig from './postcss.config';
import babelConfig from './babel.config';
import getIPAdress from '../scripts/utils';
import getClientEnvironment from './env';
import paths from './paths';
import config from '../config/getConfig';
import type { Configuration } from 'webpack';

const {
    devServer: DEV_SERVSER,
    publicPath: PUBLIC_PATH,
    sourcemap: SOURCEMAP,
    modifyVars: MODIFY_VARS,
    alias: ALIAS,
    babel: BABEL,
    postcss: POSTCSS,
    webpack: WEBPACK,
    reactRouter3: REACT_ROUTER3,
} = config;
const { port: DEFAULT_PORT, https: HTTPS } = DEV_SERVSER;

const ENTRY = config.entry || paths.appIndexJs;

const env = getClientEnvironment();
const protocol = HTTPS === 'true' ? 'https' : 'http';
const resolve = (absPath: any) => path.resolve(process.cwd(), absPath);
const checkEntryExist = (entryPath: string) => {
    const userEntryAbsPath = resolve(entryPath);

    if (!fs.existsSync(entryPath ? userEntryAbsPath : paths.appIndexJs)) {
        if (entryPath) {
            console.error(`${chalk.green('entry')}: ${chalk.yellow.underline(userEntryAbsPath)} 目录不存在`);
        } else {
            console.error(
                `默认入口文件路径 ${chalk.green('src/index')} 不存在，或重新配置 ${chalk.cyan('entry')} 属性`,
            );
        }
        process.exit(1);
    }
};

export default (webpackEnv: NodeJS.ProcessEnv['NODE_ENV']): Configuration => {
    const isProd = webpackEnv === 'production';

    const HtmlWebpackPluginOptions = {
        template: paths.appHtml,
        ...(isProd
            ? {
                  minify: {
                      removeComments: true,
                      collapseWhitespace: true,
                      removeRedundantAttributes: true,
                      useShortDoctype: true,
                      removeEmptyAttributes: true,
                      removeStyleLinkTypeAttributes: true,
                      keepClosingSlash: true,
                      minifyJS: true,
                      minifyCSS: true,
                      minifyURLs: true,
                  },
              }
            : undefined),
    };

    const webpackConfig: Configuration = {
        mode: process.env.NODE_ENV as Configuration['mode'],
        entry: [],
        output: {
            path: isProd ? paths.appBuild : undefined,
            publicPath: PUBLIC_PATH,
            filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
            chunkFilename: isProd ? 'js/[name].chunk.[chunkhash:8].js' : 'js/[name].chunk.js',
            devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
        },
        devtool: isProd ? (SOURCEMAP ? 'source-map' : false) : 'cheap-module-source-map',
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto',
                },
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                babelrc: false,
                                ...babelMerge(babelConfig, BABEL),
                            },
                        },
                    ],
                },
                {
                    test: /\.(c|le)ss$/,
                    use: [
                        isProd
                            ? {
                                  loader: MiniCssExtractPlugin.loader,
                                  options: {
                                      ignoreOrder: true,
                                  },
                              }
                            : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isProd ? SOURCEMAP : true,
                                modules: true,
                                importLoaders: 2,
                                localIdentName: '[local]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: isProd ? SOURCEMAP : true,
                                ...merge(postcssConfig, POSTCSS),
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                modifyVars: MODIFY_VARS,
                                javascriptEnabled: true,
                                sourceMap: isProd ? SOURCEMAP : true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|eot|ttf)\??.*$/,
                    use: 'file-loader?limit=5000&name=font/font.[name].[ext]',
                },
                {
                    test: /\.(png|jpg|jpeg|svg|gif)$/,
                    use: 'url-loader?limit=5000&name=images/[name].[ext]',
                },
            ],
        },
        plugins: [
            !isProd && new webpack.HotModuleReplacementPlugin(),
            !isProd && new ErrorOverlayPlugin(),
            !isProd &&
                !REACT_ROUTER3 &&
                new ReactRefreshWebpackPlugin({
                    overlay: false,
                }),
            !isProd &&
                new ProgressBarPlugin({
                    format: '  编译中 [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed 秒)',
                    summary: false,
                    customSummary(second: string) {
                        console.log(chalk.white.bgGreen('编译完成') + ` 耗时 ${second.replace('s', '')} 秒`);
                    },
                    callback() {
                        clearConsole();
                        console.log(`开发服务器地址：\n`);
                        console.log(`> 本地: ` + chalk.cyan.underline(`${protocol}://localhost:${DEFAULT_PORT}/`));
                        console.log(
                            `> 内网: ` + chalk.cyan.underline(`${protocol}://${getIPAdress()}:${DEFAULT_PORT}/\n`),
                        );
                    },
                }),
            isProd &&
                new MiniCssExtractPlugin({
                    filename: 'css/[name].[contenthash:10].css',
                    chunkFilename: 'css/[name].[contenthash:10].css',
                }),
            isProd &&
                new FilterWarningsPlugin({
                    exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
                }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    NODE_LOCATION: JSON.stringify(process.env.NODE_ENV),
                    ...env.stringified['process.env'],
                },
            }),
            new InterpolateHtmlPlugin(HtmlWebpackPlugin as any, env.raw),
            // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
            }),
            new HtmlWebpackPlugin(HtmlWebpackPluginOptions),
        ].filter(Boolean),
        resolve: {
            modules: [paths.appSrc, 'node_modules'],
            extensions: [
                '.web.tsx',
                '.web.ts',
                '.web.jsx',
                '.web.js',
                '.ts',
                '.tsx',
                '.js',
                '.jsx',
                '.json',
                '.less',
                '.css',
            ],
            alias: {
                '@': resolve('src'),
                '@base': resolve(''),
                '~': resolve('assets'),
                assets: resolve('assets'),
                location: resolve('location.js'),
                ...ALIAS,
            },
        },
        performance: {
            hints: false,
        },
        stats: 'minimal', // 清除控制台 webpack 杂乱信息，仅在警告、错误和重新编译时输出
        optimization: {
            minimize: isProd,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        ecma: 8,
                        warnings: false,
                        compress: {
                            drop_console: false,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                }),
                new OptimizeCSSPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: false,
                    },
                    cssProcessorPluginOptions: {
                        preset: ['default', { minifyFontValues: { removeQuotes: false } }],
                    },
                }),
            ],
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                minChunks: 2,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                name: true,
                cacheGroups: {
                    vendor: {
                        // node_modules内的依赖库
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                    },
                    styles: {
                        name: 'styles',
                        test: /(\.css|\.less)$/,
                        chunks: 'all',
                    },
                },
            },
        },
    };

    if (typeof config.entry === 'string') {
        checkEntryExist(config.entry);
    }

    // 允许外部配置文件二次配置 webpack
    let mergedWebpackConfig;

    if (typeof WEBPACK === 'function') {
        mergedWebpackConfig = WEBPACK(webpackConfig);
        if (!mergedWebpackConfig) {
            console.error('请在 webpack 属性函数中 return 出新的 webpack 配置!');
            process.exit(1);
        }
    } else {
        mergedWebpackConfig = webpackConfig;
    }

    // react-router3 将使用 webpack 原生热更新（react-refresh 不支持 router 3）
    const entites = REACT_ROUTER3
        ? ['@babel/polyfill', 'webpack-dev-server/client' + '?/', 'webpack/hot/dev-server']
        : ['@babel/polyfill'];
    let entry: any;
    // 处理不同类型的 entry
    if (typeof ENTRY === 'string') {
        entry = [...entites, resolve(ENTRY)];
    } else if (Array.isArray(ENTRY)) {
        entry = [...entites, ...ENTRY.map(e => resolve(e))];
    } else if (typeof ENTRY === 'object' && !Array.isArray(ENTRY)) {
        entry = {};
        // 对象模式 entry， 多入口打包
        for (const key in ENTRY) {
            const value = ENTRY[key];
            if (typeof value === 'string') {
                entry[key] = [...entites, resolve(ENTRY[key])];
            } else if (Array.isArray(value)) {
                entry[key] = [...entites, value.map(e => resolve(e))];
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                entry[key] = [...entites, resolve(value.entry)];

                // 删除掉原本的 HtmlWebpackPlugin
                const sourceHtmlPluginIndex = webpackConfig.plugins?.findIndex(
                    ({ constructor }) => constructor && constructor.name === 'HtmlWebpackPlugin',
                );
                if (sourceHtmlPluginIndex && sourceHtmlPluginIndex >= 0) {
                    webpackConfig.plugins?.splice(sourceHtmlPluginIndex, 1);
                }

                // 为多入口的每个入口单独设置 html 模板
                webpackConfig.plugins?.push(
                    new HtmlWebpackPlugin({
                        ...HtmlWebpackPluginOptions,
                        template: value.htmlTemplatePath,
                    }) as any,
                );
            } else {
                console.error('暂不支持的 entry 类型');
                process.exit(1);
            }
        }
    } else {
        console.error('暂不支持的 entry 类型');
        process.exit(1);
    }

    webpackConfig.entry = entry;

    return mergedWebpackConfig;
};
