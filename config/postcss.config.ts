export default {
    plugins: [
        require('autoprefixer')({
            overrideBrowserslist: ['last 7 iOS versions', 'last 3 versions', '> 1%'],
        }),
    ],
};
