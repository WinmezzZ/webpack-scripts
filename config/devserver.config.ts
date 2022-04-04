import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import type { Configuration } from 'webpack-dev-server';

export default (config: Configuration = {}): Configuration => {
  const { onBeforeSetupMiddleware, ...rest } = config;

  return {
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    onBeforeSetupMiddleware(devServer) {
      devServer.app!.use(evalSourceMapMiddleware(devServer));
      onBeforeSetupMiddleware && onBeforeSetupMiddleware(devServer);
    },
    ...rest,
  };
};
