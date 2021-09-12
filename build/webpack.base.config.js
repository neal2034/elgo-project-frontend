const path = require('path');
// 基础的webpack配置
module.exports = {
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // babel-loader处理jsx或tsx文件
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.node$/,
                exclude: /node_modules/,
                use: 'node-loader' // node-loader处理.node文件
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.node', '.png' ],
        alias: {
            '@imgs': path.resolve(__dirname, '/src/renderer/assets/imgs/'),
            '@config': path.resolve(__dirname,"/src/renderer/config/"),
            '@slice' : path.resolve(__dirname, '/src/renderer/store/slice'),
            '@components':path.resolve(__dirname, '/src/renderer/components/'),
        }
    },
    devtool: 'source-map',
    plugins: []
};
