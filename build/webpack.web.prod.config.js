// 基于Web环境下的webpack配置
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');


const port = process.env.PORT || 8080;
const publicPath = `http://localhost:${port}/dist`;

const hot = [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${port}/`,
    'webpack/hot/only-dev-server',
];

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
    mode: 'development',

    entry,
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom' // 开发模式下
        }
    },

    output: {
        publicPath: './',
        filename: 'index.js'
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
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 'postcss-loader',
                    {
                        loader:'less-loader',
                        options:{
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    },
                    // 'less-loader',
                    {
                        loader: 'style-resources-loader',
                        options: {
                            patterns: [path.resolve(__dirname,'../resources/style/reset.global.less'),
                                path.resolve(__dirname,'../resources/style/flex.global.less'),
                                path.resolve(__dirname,'../resources/style/ant.design.global.less'),
                                path.resolve(__dirname,'../resources/style/normal.global.less')]
                        }
                    }
                ],
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
            // 处理字体 WOFF
            {
                test: /\.woff(\?v=\d+\.\d+\/\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        mimetype: 'application/font-woff'
                    }
                }
            },
            // 处理字体 WOFF2
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        mimetype: 'application/font-woff'
                    }
                }
            },
            // 处理字体 TTF
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000,
                        mimetype: 'application/octet-stream'
                    }
                }
            },
            // 处理字体 EOT
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader'
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
        // webpack 模块热重载
        new webpack.HotModuleReplacementPlugin({
            multiStep: false
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development'
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        ...htmlWebpackPlugin
    ],
    // webpack服务
    devServer: {
        port,
        disableHostCheck:true,
        compress: true,
        noInfo: false,
        stats: 'errors-only',
        inline: true,
        lazy: false,
        hot: true,
        headers: {'Access-Control-Allow-Origin': '*'},
        contentBase: path.join(__dirname, 'dist'),
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 100
        },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false
        },
    }
});
