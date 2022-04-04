import type { Configuration as WebpackConfig } from 'webpack';
import type { Configuration as DevServerConfig } from 'webpack-dev-server';
import type { TransformOptions as BabelOption } from '@babel/core';
import type { ProcessOptions as PostcssProcessOptions, Plugin as PostcssPlugin } from 'postcss';

interface MultiEntryItemOptions {
  /** 入口文件路径 */
  entry: string;
  /** 入口文件对应的 html 模板 */
  htmlTemplatePath: string;
}

export interface WinmeScriptsConfig {
  /**
   * 入口文件路径
   *
   * !!! 无论什么格式，都会自动为每个入口添加 @babel/polyfill，请勿手动添加
   *
   * 如果传入的是字符串或者数组，代表单入口
   *
   * 如果传入的是对象，代表多入口打包
   *
   * 默认多入口使用同一个 html 模板
   *
   * 如果对象属性的值为对象，则可以提供 htmlTemplatePath，为每个入口配置不同的 html 模板（自动生成 htmlWebpackPlugin）
   * @default 'src/index.(j|t)sx?'
   */
  entry?: string | string[] | Record<string, string | string[] | MultiEntryItemOptions>;
  /**
   * html 模板路径，默认在 `index.html` 中
   * @default 'index.html'
   */
  htmlTemplatePath?: string;
  /**
   * 打包目录名
   * @default 'dist'
   */
  buildDir?: string;
  /**
   * 公共路径
   * @default '/'
   */
  publicPath?: string;
  /**
   * 是否开启生产环境 sourcemap
   * @default false
   */
  sourcemap?: boolean;
  /**
   * 开发服务器 server 配置
   */
  devServer?: DevServerConfig;
  /**
   * babel 配置，默认配置已经支持 react + ts 环境，如果需要额外配置，会自动合并
   */
  babel?: BabelOption;
  /**
   * postcss 配置，默认配置了 autoprefixer 插件，如果需要额外配置，会自动合并
   */
  postcss?: PostcssProcessOptions & {
    plugins?: PostcssPlugin[];
  };
  /**
   * 是否禁用打包文件 size 输出信息
   * @default false
   */
  disabledBundleSize?: boolean;
  /**
   * 路径别名
   */
  alias?: { [key: string]: string };
  /**
   * less 变量
   */
  modifyVars?: { [key: string]: string };
  /**
   * 自定义 webpack 配置，需返回新的完整配置
   */
  webpack?: (config: WebpackConfig) => WebpackConfig;
  /**
   * 是否为 react-router 3.x 或者更早的版本
   *
   * 如果是，react-refresh 与 v3 版本不兼容会导致热更新会失效
   *
   * 指定此字段为 true 后，将使用 webpack 原生的热更新代替
   * @default false
   */
  reactRouter3?: boolean;
}

export function defineConfig(config: WinmeScriptsConfig): WinmeScriptsConfig;
