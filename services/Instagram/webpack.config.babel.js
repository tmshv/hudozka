import webpack from'webpack';
import HTML from 'html-webpack-plugin';

const env = process.env['NODE_ENV'] || 'production';
const isProduction = env === 'production';

// import autoprefixer from 'autoprefixer';

module.exports = {
    entry: './src/app.js',
    watch: !isProduction,
    //resolve: {
    //    modulesDirectories: [
    //        './node_modules'
    //    ]
    //},
    output: {
        path: './build',
        filename: 'app.js'
    },
    // devServer: {
    //     historyApiFallback: true,
    //     hot: true,
    //     inline: true,
    //     progress: true,
    //     host: 'localhost',
    //     port: 3000
    // },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        new HTML({
            filename: 'main.html',
            title: 'Instagram',
            template: 'src/templates/index.html',
            inject: 'body'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                // exclude: /node_modules/,
                //exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    // presets: ['react'],
                    cacheDirectory: true
                }
            }
        ]
    }
};