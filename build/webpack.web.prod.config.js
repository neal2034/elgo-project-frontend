// 基于Web环境下的webpack配置
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')


const hot = [];

const entry = {
    index: hot.concat(require.resolve('../src/renderer/index.tsx')),
};

const htmlWebpackPlugin = Object.keys(entry).map(name => new HtmlWebpackPlugin({
    inject: 'body',
    scriptLoading: 'defer',
    template: path.join(__dirname, '../resources/template/template.html'),
    minify: false,
    filename: `${name}.html`,
    chunks: [name]
}));

module.exports = merge.smart(webpackBaseConfig, {
    devtool: 'none',
    mode: 'production',
    entry,
    output: {
        publicPath: './',
        filename: '[name].js'
    },

    module: {
        rules: [
            // 处理全局css样式
            {
                test: /\.global\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {loader: 'resolve-url-loader'},
                ]
            },
            // 处理css样式，使用css模块
            {
                test: /^((?!\.global).)*\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]'
                            },
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {loader: 'resolve-url-loader'}
                ]
            },
            // 处理全局scss样式
            {
                test: /\.global\.(scss|sass)$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {loader: 'resolve-url-loader'},
                    {loader: 'sass-loader'}
                ]
            },
            // 处理scss样式，使用css模块
            {
                test: /^((?!\.global).)*\.(scss|sass)$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]__[hash:base64:5]'
                            },
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {loader: 'resolve-url-loader'},
                    {loader: 'sass-loader'}
                ]
            },

            // 处理图片
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000
                    }
                }
            },



            // 处理SVG
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        mimetype: 'image/svg+xml'
                    }
                }
            }
        ]
    },


    plugins: [
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,

        }),
        ...htmlWebpackPlugin
    ],
    optimization:{
        splitChunks:{
            cacheGroups:{
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }

});
