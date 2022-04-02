import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware';
import type { Configuration } from 'webpack-dev-server';
import paths from './paths';

export default (config: Configuration = {}): Configuration => {
    const { before, ...rest } = config;
    return {
        hot: true,
        historyApiFallback: true,
        clientLogLevel: 'error',
        quiet: true,
        overlay: false,
        contentBase: paths.appPublic,
        before(app, server, compiler) {
            app.use(evalSourceMapMiddleware(server as any));
            app.use(errorOverlayMiddleware());
            before?.(app, server, compiler);
        },
        ...rest,
    };
};
