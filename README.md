# caibeike-scripts

彩贝壳前端项目 webpack 启动器

### 使用

```bash
npm install @cbk/webpack-scripts
```

然后在 `package.json` 修改启动与打包命令脚本

```bash
{
  "scripts" {
    "start": "cbk start",
    "build": "cbk build"
  }
}
```

以下为基本默认配置信息

#### 入口文件

`src/containers/index`

> 会自动检测是 js 文件还是 ts 文件

#### 别名

### 配置文件

可以在项目下创建 `caibeike-scripts.config.js`，使用 commonjs 语法导出配置对象

也可以通过 `const { defineConfig } = require('@cbk/webpack-scripts');`，使用 `defineConfig` 函数包裹导出对象，这样能够获得属性提醒

### 参数

#### publicPath

-   类型: `string`
-   默认值: `/`

公共路径，等同于 `webpack` `output` 中的 `publicPath`

#### buildDir

-   类型: `string`
-   默认值: `dist`

打包目录

#### htmlTemplatePath

-   类型: `string`
-   默认值: `/path/to/project/public/index.html`

html 模板路径，默认在 `public/index.html` 下，如果要覆盖，请设置绝对路径

#### alias

-   类型: `object`
-   默认值: `{ @: path.join(__dirname, 'src') }`

webpack 路径别名，默认已处理 `@` 指向 根目录 `src` 下

#### devServer

-   类型: `object`
-   默认值: `{ port: 3100 }`

开发服务器 server 配置

#### babel

-   类型: `object`
-   默认值: 见 https://git.caibeike.net/lib/caibeike-scripts/blob/master/config/babel.config.js

`babel` 配置，默认配置已经支持 `react + ts` 环境，如果需要额外配置，会自动合并

#### postcss

-   类型: `object`
-   默认值: 见 https://git.caibeike.net/lib/caibeike-scripts/blob/master/config/postcss.config.js

`postcss` 配置，默认配置了 `autoprefixer` 插件，如果需要额外配置，会自动合并

#### modifyVars

-   类型: `object`
-   默认值: `-`

less 变量

#### sourcemap

-   类型: `boolean`
-   默认值: `false`

是否生成生产环境 sourcemap

#### webpack

-   类型: `(config) => config`
-   默认值: `-`

自定义 webpack 配置，需返回新的完整配置

示例：

```js
const { defineConfig } = require('@cbk/webpack-scripts');

module.exports = defineConfig({
    webpack: config => {
        config.output.path = 'build';

        return config;
    },
});
```

#### disabledBundleSize

-   类型: `boolean`
-   默认值: `false`

是否禁用打包文件 size 输出信息，禁用后，打包完成将不会在终端输出所有 js 文件的 size 信息
