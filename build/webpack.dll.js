const path = require('path');
const webpack = require('webpack');

const { spa } = process.env;

const vendorMap = {
    react: [
        "prop-types",
        'react',
        'react-dom',
        'react-router',
        'react-router-dom',
        'redux',
        'react-redux',
        'redux-actions',
        'history'
    ],
    vue: [
        'vue'
    ]
}
module.exports = {
    context: __dirname,
    entry: {
        vendor: vendorMap[spa]
    },
    output: {
        path: path.join(__dirname, `../dist`),
        filename: `scripts/dll.${spa}.[name].js`,
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, `../dist/scripts/${spa}-[name]-manifest.json`),
            name: '[name]',
        })
    ]
}