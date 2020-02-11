'use strict';
const path = require('path');


const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src', 'index.html'),
    filename: 'index.html',
    inject: 'body'
});

const config = {
    mode: 'production',
    devtool: 'eval-source-map',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
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
