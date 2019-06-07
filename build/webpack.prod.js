"use strict"
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');


const common = require('./webpack.common.js');

let webpackConfig = {
    devtool: false,
    optimization: {
        // minimize: true,//default true
        // usedExports: true,//default true
        // concatenateModules: true, //default true
        minimizer: [
            new TerserPlugin({
                cache: true,
                exclude: /\.min\.js$/,
                parallel: true,
                sourceMap: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                    compress: true,
                    warnings: false
                }
            })
        ],
    },
};
module.exports = merge(common, webpackConfig);

// [hash] - [chunkhash] - [name] - [id] - [query] / assets / scripts / [name].chunk.js
// a3f965f56d770e1bce5d - b3dfd9ab151f019d3dea - 0 - 0 - /assets/scripts / 0. chunk.js
