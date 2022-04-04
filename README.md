# @winme/webpack-scripts

快速搭建 `webpack` `react` 环境的命令行脚本工具

## 安装

```bash
npm install @winme/webpack-scripts -D
```

然后在 `package.json` 修改启动与打包命令脚本

```bash
{
  "scripts" {
    "start": "winme start",
    "build": "winme build"
  }
}
```

## 特性

- 支持热更新，热模块替换
- 开发环境的输出信息简介明了，打包输出信息完整
- 开发环境的报错点击可以直接跳转到定位到编辑器对应的行与列
- 支持 `typescript`
- 封装了所有复杂的 `webpack，仅需通过配置文件修改少量的配置`
- 支持完全自定义 `webpack` 配置

## 说明

如果是老项目迁移，基本无需配置太多，该插件包含了所有主流用到的 `loader`, `plugin`，和一些通用 `webpack` 配置

如果是一个全新项目，只要遵循以下 2 个默认配置，即可快速创建一个 `react` 项目

> 记得安装 `react` 和 `react-dom`

- 入口文件: `src/index` 会自动检测是 js 文件还是 ts 文件
- html 模板文件：`index.html`

如果你没办法修改或者不喜欢上述默认配置路径，同样可以通过设置配置文件去修改它们以及更多定制化的需求

## 配置文件

可以在项目下创建 `winme-scripts.config.js`，使用 commonjs 语法导出配置对象

也可以通过 `const { defineConfig } = require('@winme/webpack-scripts');`，使用 `defineConfig` 函数包裹导出对象，这样能够获得属性提醒

## 参数

#### publicPath

- 类型: `string`
- 默认值: `/`

公共路径，等同于 `webpack` `output` 中的 `publicPath`

示例：

```js
const { defineConfig } = require('@winme/webpack-scripts');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/publicPath/' : '/',
});
```

#### buildDir

- 类型: `string`
- 默认值: `dist`

打包目录

#### htmlTemplatePath

- 类型: `string`
- 默认值: `/path/to/project/index.html`

html 模板路径，默认在 `index.html` 下，也可以自行设置

#### alias

- 类型: `object`
- 默认值: `{ @: path.join(__dirname, 'src') }`

webpack 路径别名，默认已处理 `@` 指向根目录 `src` 下

#### devServer

- 类型: `object`
- 默认值: `{ port: 3000 }`

开发服务器 server 配置

#### babel

- 类型: `object`
- 默认值: 见 https://github.com/WinmezzZ/webpack-scripts/blob/master/config/babel.config.ts

`babel` 配置，默认配置已经支持 `react + ts` 环境，如果需要额外配置，会自动合并

#### postcss

- 类型: `object`
- 默认值: 见 https://github.com/WinmezzZ/webpack-scripts/blob/master/config/postcss.config.ts

`postcss` 配置，默认配置了 `autoprefixer` 插件，如果需要额外配置，会自动合并

#### modifyVars

- 类型: `object`
- 默认值: `-`

less 变量

#### sourcemap

- 类型: `boolean`
- 默认值: `false`

是否生成生产环境 sourcemap

#### webpack

- 类型: `(config) => config`
- 默认值: `-`

自定义 webpack 配置，需返回新的完整配置

示例：

```js
const { defineConfig } = require('@winme/webpack-scripts');

module.exports = defineConfig({
  webpack: config => {
    config.output.path = 'build';
    config.plugins.push(new Webpack.definePlugin());

    return config;
  },
});
```

#### disabledBundleSize

- 类型: `boolean`
- 默认值: `false`

是否禁用打包文件 size 输出信息，禁用后，打包完成将不会在终端输出所有 js 文件的 size 信息
