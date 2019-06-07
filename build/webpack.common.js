"use strict"
const path = require('path');
const childProcess = require('child_process');
const misc = require('./misc');

const loaders = require('./loaders');
const entry = require('./entry');
const alias = require('./alias');
const plugins = require('./plugins');

const {
    env,
    ip
} = misc;

console.log('---------------------------');
console.log(process.env.NODE_ENV);
console.log('---------------------------\n');

let webpackConfig = {
    mode: process.env.NODE_ENV,
    context: __dirname,
    node: {
        __dirname: false,
        __filename: false,
    },
    entry: {
        ...entry,
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: 'dist',
        filename: 'scripts/[name].js'
    },
    resolve: {
        alias: alias,
        extensions: ['.js', '.json', '.jsx'],
        modules: ['node_modules']
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    module: {
        rules: loaders
    },
    performance: {
        hints: false,
        maxAssetSize: 350000
    },
    devServer: {
        host: ip,
        "hot": true,
        "hotOnly": true,
        "contentBase": "./",
        "historyApiFallback": false,
        "port": 8083,
        "open": false,
        "quiet": false,
        "noInfo": false,
        "useLocalIp": false,
        // "https": {
        //     key: fs.readFileSync("/Users/jsonchou/ssl/192.168.32.251-key.pem"),
        //     cert: fs.readFileSync("/Users/jsonchou/ssl/192.168.32.251.pem"),
        //     ca: fs.readFileSync("/Users/jsonchou/Library/Application Support/mkcert/rootCA-key.pem")
        // },
        "lazy": false,
        "stats": {
            "colors": true,
            "hash": true,
            "version": true,
            "timings": true,
            "assets": true,
            "chunks": false,
            "modules": false,
            "reasons": false,
            "children": false,
            "source": false,
            "errors": true,
            "errorDetails": true,
            "warnings": true,
            "publicPath": true
        },
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        "watchOptions": {
            "aggregateTimeout": 300,
            "ignored": {}
        }
    },
    plugins,
};

module.exports = webpackConfig;