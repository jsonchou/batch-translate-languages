"use strict"
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

let webpackConfig = {
    devtool: 'cheap-module-eval-source-map',
};

module.exports = merge(common, webpackConfig); 