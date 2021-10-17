const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');

const webpackDevConfig = require('./webpack.main.dev.config');

module.exports = merge.smart(webpackDevConfig, {
    devtool: 'none',

    mode: 'production',

    output: {
        path: path.join(__dirname, '../dist/main'),
        filename: 'main.prod.js',
    },

    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
        }),
    ],
});
