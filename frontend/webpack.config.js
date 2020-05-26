'use strict';

const webpack = require('webpack');
const path    = require('path');



const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src', 'index.html'),
    filename: 'index.html',
    inject: 'body'
});

const useDevelopmentMode = true;


const mode = useDevelopmentMode?'development':'production';

const config = {
    mode: mode, // https://stackoverflow.com/a/51163094/274677
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        historyApiFallback: true // https://stackoverflow.com/a/44810474/274677
    },
    entry: './src/main.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'src/'),
                use: 'babel-loader'
            },{
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },{
                test: /\.(png|jpg|jpeg|gif|woff)$/,
                loader: 'url-loader?limit=9999&name=[path][name].[ext]'
            },{
                test: /\.README$/, loader: 'null'
            },{
                test: /.*data\/.*\.zip/,
                loader: 'file-loader'
            },{ // https://github.com/bhovhannes/svg-url-loader
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000
                        }
                    },
                ]
            }
        ]
    },
    plugins: [HTMLWebpackPluginConfig],
    node: {
        fs: "empty" // This is to account for what appears to be a bug: https://github.com/josephsavona/valuable/issues/9`
    },

    optimization: {
        minimize: false // do not to minify the bundled code
    }
};

module.exports = config;
