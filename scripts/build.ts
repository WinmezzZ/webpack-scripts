import '../config/env';
import chalk from 'chalk';
import fs from 'fs';
import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import FileSizeReporter from 'react-dev-utils/FileSizeReporter';
import printBuildError from 'react-dev-utils/printBuildError';
import webpackConfig from '../config/webpack.config';
import config from '../config/getConfig';
import paths from '../config/paths';

const { publicPath, buildDir, disabledBundleSize } = config;
const env: any = process.env.NODE_ENV;
const buildPath = paths.appBuild;

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// 超过以下尺寸的包会发出警告。
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const build = (previousFileSizes: any) => {
    console.log('开始打包...');
    const compiler = webpack(webpackConfig(env));
    return new Promise((resolve, reject) => {
        compiler.run((err: any, stats) => {
            let messages;
            if (err) {
                if (!err.message) {
                    return reject(err);
                }

                let errMessage = err.message;

                if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
                    errMessage += '\n编译错误: CSS 选择器 ' + err['postcssNode'].selector;
                }

                messages = formatWebpackMessages({
                    errors: [errMessage],
                    warnings: [],
                    _showErrors: true,
                    _showWarnings: true,
                });
            } else {
                messages = formatWebpackMessages(stats.toJson({ warnings: true, errors: true }));
            }
            if (messages.errors.length) {
                // 只取第一个错误
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }
            const resolveArgs = {
                stats,
                previousFileSizes,
                warnings: messages.warnings,
            };

            return resolve(resolveArgs);
        });
    });
};

measureFileSizesBeforeBuild(buildPath)
    .then(previousFileSizes => {
        fs.rmSync(buildPath, { recursive: true, force: true });
        return build(previousFileSizes);
    })
    .then(
        ({ stats, previousFileSizes, warnings }: any) => {
            if (warnings.length) {
                console.log(chalk.yellow('警告：\n'));
                console.log(warnings.join('\n\n'));
            } else {
                console.log(chalk.green('编译成功。\n'));
            }

            if (!disabledBundleSize) {
                console.log('gzip 压缩后大小:\n');
                printFileSizesAfterBuild(
                    stats,
                    previousFileSizes,
                    buildPath,
                    WARN_AFTER_BUNDLE_GZIP_SIZE,
                    WARN_AFTER_CHUNK_GZIP_SIZE,
                );
            }

            console.log('\n');
            console.log(chalk.bgGreen('构建完成\n'));

            console.log(`该项目将会托管于 ${chalk.yellow(publicPath)} 下\n`);
            console.log(`${chalk.cyan(buildDir)} 目录已经可以部署了\n`);

            console.log(`更多构建配置可以看这里：\n`);
            console.log(
                chalk.underline(
                    `  https://git.caibeike.net/static/caibeike-ops-static/tree/feature_npm_run_serve#%E9%85%8D%E7%BD%AE\n`,
                ),
            );
        },
        err => {
            console.log(chalk.yellow('以下类型错误编译（请检查 ts 语法，或忽略）:\n'));
            printBuildError(err);
        },
    )
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });
