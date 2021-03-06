import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import config from '../config/getConfig';

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath);
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

const resolveModule = (resolveFn: (path: string) => string, filePath: string) => {
  const extension = moduleFileExtensions.find(extension => fs.existsSync(resolveFn(`${filePath}.${extension}`)));

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const resolveHtmlTemplatePath = () => {
  const htmlPath = config.htmlTemplatePath ? resolveApp(config.htmlTemplatePath) : resolveApp('index.html');

  if (!fs.existsSync(htmlPath)) {
    if (config.htmlTemplatePath) {
      throw new Error(`${chalk.green('htmlTemplatePath')}: ${chalk.yellow.underline(htmlPath)} 目录不存在`);
    }

    throw new Error(
      `html 模板路径找不到，请检查 ${chalk.yellow.underline('index.html')} 是否存在，否则请提供 ${chalk.green(
        'htmlTemplatePath',
      )} 属性`,
    );
  }

  return htmlPath;
};

export default {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(config.buildDir),
  appHtml: resolveHtmlTemplatePath(),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  resolveApp,
};
