const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ErrorOverlayPlugin = require('react-error-overlay-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const clearConsole = require('react-dev-utils/clearConsole');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const babelConfig = require('./babel.config');
const babelMerge = require('../utils/babel-merge');
const { getIPAdress } = require('../scripts/utils');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const config = require('../config/getConfig');

const {
    devServer: { port: DEFAULT_PORT, https: HTTPS },
    publicPath,
    sourcemap: shouldUseSourceMap,
    modifyVars: MODIFY_VARS,
    alias: ALIAS,
} = config;

const env = getClientEnvironment();
const protocol = HTTPS === 'true' ? 'https' : 'http';

/**
 * @param webpackEnv {'devolopment' | 'production'}
 * @return {import('webpack').Configuration}
 */
module.exports = webpackEnv => {
    const isProd = webpackEnv === 'production';

    /** @type {import('webpack').Configuration} */
    const webpackConfig = {
        mode: process.env.NODE_ENV,
        entry: {
            index: ['@babel/polyfill', paths.appIndexJs],
        },
        output: {
            path: isProd ? paths.appBuild : undefined,
            publicPath: publicPath,
            filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
            chunkFilename: isProd ? 'js/[name].chunk.[chunkhash:8].js' : 'js/[name].chunk.js',
            devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
        },
        devtool: isProd ? (shouldUseSourceMap ? 'source-map' : false) : 'cheap-module-source-map',
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
                                ...babelMerge(babelConfig, config.babel),
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
                                sourceMap: isProd ? shouldUseSourceMap : true,
                                modules: true,
                                importLoaders: 2,
                                localIdentName: '[local]',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: isProd ? shouldUseSourceMap : true,
                                config: {
                                    path: 'postcss.config.js',
                                },
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                modifyVars: MODIFY_VARS,
                                javascriptEnabled: true,
                                sourceMap: isProd ? shouldUseSourceMap : true,
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
                new ReactRefreshWebpackPlugin({
                    overlay: false,
                }),
            !isProd &&
                new ProgressBarPlugin({
                    format: '  编译中 [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed 秒)',
                    summary: false,
                    customSummary(second) {
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
            new HtmlWebpackPlugin({
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
            }),
            new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
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
                '@': path.resolve(process.cwd(), 'src'),
                '@base': path.resolve(process.cwd()),
                '~': path.resolve(process.cwd(), 'assets'),
                assets: path.resolve(process.cwd(), 'assets'),
                location: path.resolve(process.cwd(), 'location.js'),
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
                automaticNameDelimiter: '~',
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

    // 允许外部配置文件二次配置 webpack
    const mergedWebpackConfig = typeof config.webpack === 'function' && config.webpack(webpackConfig);

    if (!mergedWebpackConfig) {
        throw new Error('请在 webpack 属性函数中 return 出新的 webpack 配置!');
    }

    return mergedWebpackConfig;
};
