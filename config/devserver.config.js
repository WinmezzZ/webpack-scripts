const path = require('path');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const { appPublic } = require('./paths');

/** 
 * @param config {import('webpack-dev-server').Configuration} 
 * @return {import('webpack-dev-server').Configuration} 
 */
module.exports = (config = {}) => {
    return {
        hot: true,
        historyApiFallback: true,
        clientLogLevel: 'none',
        quiet: true,
        overlay: false,
        contentBase: appPublic,
        before(app, server) {
            app.use(evalSourceMapMiddleware(server));
            app.use(errorOverlayMiddleware());
        },
        ...config,
    };
};
