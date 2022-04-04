import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';

fs.rmSync('./lib', { recursive: true, force: true });
const plugins = [
  commonjs(),
  typescript(),
  json(),
  resolve({
    preferBuiltins: true,
  }),
];

/** @type {import('rollup').RollupOptions} */
const config = {
  input: ['./scripts/start.ts', './scripts/build.ts', './src/index.ts'],

  output: {
    format: 'es',
    dir: 'lib',
    exports: 'named',
    preserveModules: true,
  },
  plugins,
  external: id => !/^[./]/.test(id),
};

module.exports = config;
