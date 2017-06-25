const webpack = require('webpack');
const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dev = process.env.NODE_ENV == 'development';

const getPlugins = () => {
    var plugins = [];
    plugins.push(new webpack.EnvironmentPlugin({NODE_ENV: process.env.NODE_ENV, DEBUG: dev}));
    if (!dev) {
        plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false
            }
        }));
        plugins.push(new ZipPlugin());
    }
    return plugins;
}

export default[
    {
        entry : [
            path.resolve(__dirname, './src/background'),
            path.resolve(__dirname, './src/content')
        ],
        devtool : 'hidden-source-map',
        resolve : {
            modules: ['src'],
            extensions: ['.js', '.json']
        },
        output : {
            filename: 'beemark.zip',
            path: __dirname + '/dist'
        },
        module : {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                }, {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loaders: ['babel-loader']
                }
            ]
        },
        plugins : getPlugins()
    }
];