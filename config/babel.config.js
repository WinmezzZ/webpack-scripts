module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
        '@babel/plugin-transform-block-scoping',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-optional-chaining', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
        '@babel/plugin-syntax-dynamic-import',
    ],
    env: {
        dev: {
            plugins: ['react-refresh/babel'],
        },
    },
};
