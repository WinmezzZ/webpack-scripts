import fs from 'fs';
import path from 'path';

const NODE_ENV = process.env.NODE_ENV;

if (!NODE_ENV) {
  throw new Error('无效的 NODE_ENV');
}

const envPath = path.join(__dirname, '..', '.env');

const dotenvFiles = [`${envPath}.${NODE_ENV}.local`, `${envPath}.${NODE_ENV}`, envPath];

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    );
  }
});

// REACT_APP_开头的环境变量为自定义环境变量
const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment() {
  // 取所有的环境变量，然后过滤出以REACT_APP_开头的环境变量
  // 返回一个环境变量配置对象，提供给webpack InterpolateHtmlPlugin插件
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env: any, key) => {
        env[key] = process.env[key];

        return env;
      },
      {
        // 再合并一些自定义的前端环境变量
        NODE_ENV: process.env.NODE_ENV || 'development',
        PUBLIC_PATH: process.env.PUBLIC_PATH || '/ops/p/res/',
      },
    );

  // 字符串形式的process.env  提供给webpack DefinePlugin使用
  // 可以将前端代码中的process.env.XXX替换为对应的实际环境变量值
  const stringified = {
    'process.env': Object.keys(raw).reduce((env: any, key) => {
      env[key] = JSON.stringify(raw[key]);

      return env;
    }, {}),
  };

  return { raw, stringified };
}

export default getClientEnvironment;
