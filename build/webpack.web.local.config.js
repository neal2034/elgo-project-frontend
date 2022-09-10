/* eslint import/no-extraneous-dependencies:0 */
// 基于Web环境下的webpack配置
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');

const port = process.env.PORT || 8080;
const publicPath = `http://localhost:${port}/`;

const hot = ['react-hot-loader/patch', `webpack-dev-server/client?http://localhost:${port}/`, 'webpack/hot/only-dev-server'];

const entry = {
    index: hot.concat(require.resolve('../src/renderer/index.tsx')),
};

const htmlWebpackPlugin = Object.keys(entry).map(
    name =>
        new HtmlWebpackPlugin({
            inject: 'body',
            scriptLoading: 'defer',
            template: path.join(__dirname, '../resources/template/template.html'),
            minify: false,
            filename: `${name}.html`,
            chunks: [name],
        })
);

module.exports = merge.smart(webpackBaseConfig, {
    devtool: 'inline-source-map',
    mode: 'development',

    entry,
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom', // 开发模式下
        },
    },

    output: {
        publicPath,
        filename: '[name].dev.js',
    },

    module: {
        rules: [
            // 处理全局css样式
            {
                test: /\.global\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    },
                    { loader: 'resolve-url-loader' },
                ],
            },
            // 处理css样式，使用css模块
            {
                test: /^((?!\.global).)*\.css$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                            },
                            sourceMap: true,
                            importLoaders: 1,
                        },
                    },
                    { loader: 'resolve-url-loader' },
                ],
            },
            // 处理全局scss样式
            {
                test: /\.global\.(scss|sass)$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    },
                    { loader: 'resolve-url-loader' },
                    { loader: 'sass-loader' },
                ],
            },
            // 处理scss样式，使用css模块
            {
                test: /^((?!\.global).)*\.{scss|sass}$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]',
                            },
                            sourceMap: true,
                            importLoaders: 1,
                        },
                    },
                    { loader: 'resolve-url-loader' },
                    { loader: 'sass-loader' },
                ],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                RUN_ENV: JSON.stringify('browser'),
            },
        }),
        // webpack 模块热重载
        new webpack.HotModuleReplacementPlugin({
            multiStep: false,
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
        new ESLintPlugin({
            extensions: ['js', 'ts', 'tsx'],
        }),
        ...htmlWebpackPlugin,
    ],
    // webpack服务
    devServer: {
        port,
        publicPath,
        compress: true,
        noInfo: false,
        stats: 'errors-only',
        inline: true,
        lazy: false,
        hot: true,
        open: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentBase: path.join(__dirname, 'dist'),
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 100,
        },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false,
        },
        proxy: {
            // '/elgo/api': {
            //     target: 'http://localhost:8070',
            //     // target: 'https://www.elgo.cc',
            //     ws: false, // 是否代理 websocket
            //     changeOrigin: true,
            // },
            '/api': {
                target: 'http://localhost:3000/',
                // target: 'https://www.elgo.cc',
                ws: false, // 是否代理 websocket
                changeOrigin: true,
            },
        },
    },
});
