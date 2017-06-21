var path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
    devtool: 'cheap-module-source-map',
    entry: [             
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
        new CopyWebpackPlugin([
            {
                from: 'public/react-big-calendar.css',
                to: 'react-big-calendar.css'
            },
            {
                from: 'public/react-datepicker.css',
                to: 'react-datepicker.css'
            },
        ], {}),
    ]
};

module.exports = config;