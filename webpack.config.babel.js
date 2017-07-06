const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dev = process.env.NODE_ENV == 'development';

const getPlugins = () => {
    var plugins = [];
    plugins.push(new CopyWebpackPlugin([ 
        { from: path.resolve(__dirname, './src/manifest.json') },
        { from: path.resolve(__dirname, './src/images'), to: path.resolve(__dirname, './dist/images') }
    ]));
    if (!dev) {
        plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }));
    }
    return plugins;
}

export default[
    {
        entry : {
            background: path.resolve(__dirname, './src/background'),
            content: path.resolve(__dirname, './src/content')
        },
        resolve : {
            modules: ['src'],
            extensions: ['.js', '.json']
        },
        output : {
            path: path.resolve(__dirname, './dist'),
            filename: '[name].js'
        },
        module : {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                }, {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    loaders: ['babel-loader']
                }
            ]
        },
        plugins : getPlugins()
    }
];