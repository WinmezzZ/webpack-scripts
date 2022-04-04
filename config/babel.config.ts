const hasJsxRuntime = (() => {
  try {
    require.resolve('react/jsx-runtime.js');

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
  plugins: ['@babel/plugin-transform-block-scoping'],
  env: {
    dev: {
      plugins: ['react-refresh/babel'],
    },
  },
};
