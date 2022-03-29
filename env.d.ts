declare module 'progress-bar-webpack-plugin';
declare module 'react-error-overlay-webpack-plugin';
declare module 'terser-webpack-plugin';
declare module 'mini-css-extract-plugin';
declare module 'webpack-filter-warnings-plugin';
declare module 'optimize-css-assets-webpack-plugin';
declare module 'postcss-safe-parser';
declare module 'babel-merge';

declare interface ObjectConstructor {
    keys<T>(o: T): any[];
}

declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
    }
}
