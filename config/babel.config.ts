const hasJsxRuntime = (() => {
    try {
        require.resolve('react/jsx-runtime');
        return true;
    } catch (e) {
        return false;
    }
})();

export default {
    presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: hasJsxRuntime ? 'automatic' : 'classic' }],
        '@babel/preset-typescript',
    ],
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
