const typescript = require('@rollup/plugin-typescript');

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'scripts/start.js',
    output: {
        format: 'cjs',
        file: 'lib/index.js',
    },
    plugins: [typescript()],
};

export default config;
