var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var VisualizerPlugin = require('webpack-visualizer-plugin')

var config = {
    devtool: 'eval',
    entry: [     
        'webpack-dev-server/client?http://localhost:3000',
        './src/app.tsx'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'        
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {
               test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
               loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
            },
            {
                test: /\.less$/,
                loaders: ['style-loader', 'css-loader', 'less-loader']
            },            
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.tsx?$/,
                loaders: ['babel-loader?presets[]=es2015', 'awesome-typescript-loader'],
                include: path.join(__dirname, 'src')                
            }            
        ]
    },
    plugins: [                
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        }),
        new VisualizerPlugin()        
    ],
    devServer: {
        port: 3000,
        contentBase: path.join(__dirname, "build")
    }

};

module.exports = config;