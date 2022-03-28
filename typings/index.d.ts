import type { Configuration as WebpackConfig } from 'webpack';
import type { Configuration as DevServerConfig } from 'webpack-dev-server';
import type { TransformOptions as BabelOption } from '@babel/core';

export interface CaibeikeScriptsConfig {
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
}

export function defineConfig(config: CaibeikeScriptsConfig): void;
