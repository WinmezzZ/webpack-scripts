import esbuild from 'rollup-plugin-esbuild';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import fs from 'fs';

fs.rmSync('./lib', { recursive: true, force: true });
const external = Object.keys(pkg.dependencies);
const plugins = [
    commonjs(),
    json(),
    esbuild(),
    resolve({
        preferBuiltins: true,
    }),
];

/** @type {import('rollup').RollupOptions} */
const config = {
    input: ['scripts/start.ts', 'scripts/build.ts', 'src/index.ts'],

    output: {
        format: 'cjs',
        dir: 'lib',
        exports: 'named',
    },
    plugins,
    external,
};

module.exports = config;
