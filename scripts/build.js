process.env.NODE_ENV = 'production';

require('../config/env');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const webpackConfig = require('../config/webpack.config');
const config = require('../config/getConfig');
const { appBuild } = require('../config/paths')

const {
   publicPath,
   buildDir,
   disabledBundleSize
} = config
const env = process.env.NODE_ENV;
const buildPath = appBuild;

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// 超过以下尺寸的包会发出警告。
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const build = previousFileSizes => {
    console.log('开始打包...');
    const compiler = webpack(webpackConfig(env));
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
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
                });
            } else {
                messages = formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }));
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
        ({ stats, previousFileSizes, warnings }) => {
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
                `  https://git.caibeike.net/static/caibeike-ops-static/tree/feature_npm_run_serve#%E9%85%8D%E7%BD%AE\n`
                )
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
