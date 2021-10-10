const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV == 'development'

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
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr:devMode,    //仅在dev mode起用 HMR
                        }
                    },
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
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.node', '.png' ],
        alias: {
            '@imgs': path.resolve(__dirname, '/src/renderer/assets/imgs/'),
            '@pages': path.resolve(__dirname, '/src/renderer/pages/'),
            '@config': path.resolve(__dirname,"/src/renderer/config/"),
            '@slice' : path.resolve(__dirname, '/src/renderer/store/slice'),
            '@components':path.resolve(__dirname, '/src/renderer/components/'),
        }
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode? 'css/[name].css': 'css/[name].[hash:8].css',
            chunkFilename: devMode? 'css/[id].css': 'css/[id].[hash:8].css'
        })
    ]
};
