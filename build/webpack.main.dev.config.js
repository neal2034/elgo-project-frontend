const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require('webpack-node-externals');
const webpackBaseConfig = require('./webpack.base.config');

module.exports = merge.smart(webpackBaseConfig, {
    devtool: 'none',

    mode: 'development',

    target: 'node',

    entry: path.join(__dirname, '../src/main/index.ts'),

    output: {
        path: path.join(__dirname, '../dist/main'),
        filename: 'main.dev.js',
    },

    externals: [nodeExternals()],

    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),
    ],
    node: {
        __dirname: false,
        __filename: false,
    },
});
