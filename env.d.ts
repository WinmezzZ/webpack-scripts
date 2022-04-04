declare module 'progress-bar-webpack-plugin';
declare module '@winme/react-overlay-webpack-plugin';
declare module 'terser-webpack-plugin';
declare module 'mini-css-extract-plugin';
declare module 'optimize-css-assets-webpack-plugin';
declare module 'babel-merge';

declare interface ObjectConstructor {
  keys<T>(o: T): any[];
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
  }
}
