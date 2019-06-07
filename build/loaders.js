// webpack loader lists
// webpack loader lists
"use strict"

const path = require('path');
const misc = require('./misc');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const os = require('os');
const isWin = os.platform() === 'win32';

const postcssLoaderOptions = {
    plugins: () => [autoprefixer({
        browsers: misc.browsers
    })]
}

let styleLoader = [{
    loader: "style-loader"
}];

styleLoader = [...styleLoader, {
    loader: require("mini-css-extract-plugin").loader //window系统会有些问题
}];

let loaders = [{
        test: /\.(png|jpg|woff|woff2|eot|ttf|svg|gif)$/,
        exclude: /node_modules/,
        use: [{
            loader: "url-loader",
            options: {
                limit: 8129
            }
        }]
    },
    {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [...styleLoader, {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
            }
        }, {
            loader: 'postcss-loader',
            options: postcssLoaderOptions
        }]
    }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [...styleLoader, {
            loader: "css-loader",
        }, {
            loader: 'postcss-loader',
            options: postcssLoaderOptions
        }, {
            loader: "sass-loader",
        }]
    }
];

let myloader = []

myloader.push({
    test: /\.vue$/,
    include: [path.resolve(__dirname, '..', 'src')],
    exclude: /node_modules/,
    use: [{
        loader: 'vue-loader',
        options: {
            cacheDirectory: true
        }
    }]
});

myloader.push({
    test: /\.(js|jsx)$/,
    include: [path.resolve(__dirname, '..', 'src')],
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
        }
    }
});

module.exports = loaders.concat(myloader);