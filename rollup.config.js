import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import externals from 'rollup-plugin-node-externals';

fs.rmSync('./lib', { recursive: true, force: true });
const plugins = [
    externals(),
    commonjs(),
    typescript(),
    json(),
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
        preserveModules: true,
    },
    plugins,
};

module.exports = config;
