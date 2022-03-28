const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('../config/getConfig');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension => fs.existsSync(resolveFn(`${filePath}.${extension}`)));

    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }

    return resolveFn(`${filePath}.js`);
};

const resolveHtmlTemplatePath = (() => {
    const htmlPath = resolveApp(config.htmlTemplatePath || resolveApp('public/index.html'));

    if (!fs.existsSync(htmlPath)) {
        if (config.htmlTemplatePath) {
            throw new Error(
                `${chalk.green('htmlTemplatePath')}: ${chalk.yellow.underline(config.htmlTemplatePath)} 目录不存在`,
            );
        }
        throw new Error(
            `html 模板路径找不到，请检查 ${chalk.yellow.underline(
                'public/index.html',
            )} 是否存在，否则请提供 ${chalk.green('htmlTemplatePath')} 属性`,
        );
    }

    return htmlPath;
})();

module.exports = {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appBuild: resolveApp(config.buildDir),
    appHtml: resolveHtmlTemplatePath,
    appIndexJs: resolveModule(resolveApp, 'src/containers/index'),
    appPackageJson: resolveApp('package.json'),
    appPublic: resolveApp('public'),
    appSrc: resolveApp('src'),
    resolveApp,
};
