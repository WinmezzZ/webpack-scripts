import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import type { Configuration } from 'webpack-dev-server';
import paths from './paths';

export default (config: Configuration = {}): Configuration => {
    return {
        hot: true,
        historyApiFallback: true,
        clientLogLevel: 'none',
        quiet: true,
        overlay: false,
        contentBase: paths.appPublic,
        before(app, server) {
            app.use(evalSourceMapMiddleware(server));
            app.use(errorOverlayMiddleware());
        },
        ...config,
    };
};
