import type { Configuration as WebpackConfig } from 'webpack';
import type { Configuration as DevServerConfig } from 'webpack-dev-server';

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
     * 入口文件路径
     * @default 'src/containers/index'
     */
    entry?: string;
    /**
     * 自定义 webpack 配置，需返回
     */
    webpack?: (config: WebpackConfig) => WebpackConfig;
    /**
     * 开发服务器 server 配置
     */
    devServer?: DevServerConfig;
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
}

export function defineConfig(config: CaibeikeScriptsConfig): void;
