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
    devtool: 'inline-source-map', // changed that due to https://webpack.js.org/guides/typescript/
//    devtool: 'source-map',
    devServer: {
        contentBase: './dist'
        /* NB. Both the following:
         *     a) `historyApiFallback: true` (or, equivalently, `historyApiFallback: {index: '/'}`)
         *     - AND -
         *     b) publicPath: "/" cf. SSE-1591357301
         *
         *     ... are necessary. See:
         * 
         * See:
         *    https://stackoverflow.com/a/39985334/274677
         *    https://stackoverflow.com/a/50179280/274677
         */
        , historyApiFallback: true
        //        , historyApiFallback: {index: '/'}
    },
    entry: './src/main.tsx',
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, 'dist'), // SSE-1591357301
        filename: 'bundle.js'
    },
    resolve: { /*
                * I am not sure why this is needed but I got it from here:
                *     https://webpack.js.org/guides/typescript/
                *
                */
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
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
