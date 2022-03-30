import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ErrorOverlayPlugin from 'react-error-overlay-webpack-plugin';
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
    devServer: { port: DEFAULT_PORT, https: HTTPS },
    publicPath: PUBLIC_PATH,
    sourcemap: SOURCEMAP,
    modifyVars: MODIFY_VARS,
    alias: ALIAS,
    babel: BABEL,
    postcss: POSTCSS,
    webpack: WEBPACK,
} = config;

const env = getClientEnvironment();
const protocol = HTTPS === 'true' ? 'https' : 'http';

export default (webpackEnv: NodeJS.ProcessEnv['NODE_ENV']): Configuration => {
    const isProd = webpackEnv === 'production';

    const webpackConfig: Configuration = {
        mode: process.env.NODE_ENV as Configuration['mode'],
        entry: {
            index: ['@babel/polyfill', paths.appIndexJs],
        },
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
            new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
            // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
            }),
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

    if (webpackConfig.entry && Object.keys(webpackConfig.entry).length === 1) {
        webpackConfig.plugins?.push(
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
            }) as any,
        );
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

    return mergedWebpackConfig;
};
