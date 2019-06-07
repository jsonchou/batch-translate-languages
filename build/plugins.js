// webpack plugin lists
const os = require('os');
const path = require('path');
const misc = require('./misc');
const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPluginPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const spa = 'vue'

let {
    env,
    version,
    name,
    webpackCfg
} = misc;

let plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require(`../dist/scripts/${spa}-vendor-manifest.json`)
    })
];


plugins.push(new MiniCssExtractPlugin({
    path: path.resolve(__dirname, '..'),
    publicPath: path.resolve(__dirname, '..', 'dist'),
    filename: 'styles/page.css'
}));

if (spa == 'vue') {
    plugins.push(new VueLoaderPlugin())
}

if (env == 'p') {

    plugins.push(new webpack.BannerPlugin({
        banner: `/**
                * skeleton app v${version}
                * (c) ${new Date().getFullYear()} ZA TEAM
                */`,
        raw: true,
        entryOnly: true
    }))

    // do not support in windows
    if (os.platform() !== 'win32') {
        plugins.push(new WebpackBuildNotifierPlugin({
            title: name.toUpperCase(),
            suppressSuccess: false,
            suppressCompileStart: false,
            suppressWarning: false,
            activateTerminalOnError: true
        }));
    }

    if (process.env.ANALYZER === 'stats') {
        plugins.push(new BundleAnalyzerPluginPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8889,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
        }))
    }

    plugins.push(new OptimizeCSSAssetsPlugin());

} else {
    //开发
    plugins.push(
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(), // 防止webpack遇到错误退出
        new webpack.ProgressPlugin(),
        new webpack.WatchIgnorePlugin([ // webpack 默认会监听从node_modules文件夹中引入的模块
            /node_modules/
        ]),
    )
}
module.exports = plugins;