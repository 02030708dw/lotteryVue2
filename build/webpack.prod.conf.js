var path = require('path')
var utils = require('./utils')
var config = require('../config')
var merge = require('webpack-merge')
const webpack = require('webpack')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

var webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios',
        'moment': 'moment'
    },
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        publicPath: '{{$CDN}}',
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash:8].js'),
        chunkFilename: utils.assetsPath('js/[name].[chunkhash:8].js')
    },
    optimization: {
        splitChunks: {
            automaticNameDelimiter: '_',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    name: 'vendor'
                },
                common: {
                    minChunks: 6,
                    chunks: 'async',
                    name: 'common'
                }
            }
        },
        runtimeChunk: { name: 'manifest' },
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    // remove warning, debugger, console
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true,
                    }
                }
            })
        ]
    },
    plugins: [
        // extract css into its own file
        // new ExtractTextPlugin({
        //     filename: utils.assetsPath('css/[name].[contenthash:8].css')
        // }),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].css'),
            chunkFilename: utils.assetsPath('css/[name].[contenthash:8].css')
        }),
        new webpack.HashedModuleIdsPlugin(),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true,
                discardComments: { removeAll: true }
            }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename:
                process.env.NODE_ENV === 'testing'
                    ? 'index.html'
                    : config.build.index,
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            // chunksSortMode: 'dependency'
            chunksSortMode: 'none'
        }),
        // split vendor js into its own file
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     minChunks: function({ resource }, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         return (
        //             resource &&
        //             /\.js$/.test(resource) &&
        //             resource.indexOf(
        //                 path.join(__dirname, '../node_modules')
        //             ) === 0
        //         )
        //     }
        // }),
        // // extract webpack runtime and module manifest to its own file in order to
        // // prevent vendor hash from being updated whenever app bundle is updated
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest',
        //     chunks: ['vendor']
        // }),
        // // new webpack.optimize.CommonsChunkPlugin({
        // //     name: 'vue',
        // //     chunks: ['vendor'],
        // //     minChunks: function({ resource }, count) {
        // //         // any required modules inside node_modules are extracted to vendor
        // //         const targets = ['vue', 'vuex', 'vue-router']
        // //         return resource && targets.find(t => resource.indexOf(`node_modules\\${t}`) !== -1)
        // //     }
        // // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     // name: 'Video',
        //     chunks: ['Video320', 'Video980'],
        //     async: 'Video',
        //     minChunks: function({ resource }, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         const targets = ['video']
        //         return resource && targets.find(t => resource.indexOf(`node_modules\\${t}`) !== -1)
        //     }
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     // name: 'GameData',
        //     async: 'GameData',
        //     minChunks: function({ resource }, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         const targets = [
        //             'games\\GameBalls',
        //             'games\\GameCredit',
        //             'games\\GameDanshi',
        //             'modules\\GamePlayer',
        //             'lzma'
        //         ]
        //         return resource && targets.find(t => resource.indexOf(t) !== -1)
        //     }
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     // name: 'HeaderNav',
        //     async: 'HeaderNav',
        //     minChunks: function({ resource }, count) {
        //         // any required modules inside node_modules are extracted to vendor
        //         const targets = ['HeaderNav']
        //         return resource && targets.find(t => resource.indexOf(t) !== -1)
        //     }
        // }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),
        new WorkboxPlugin.InjectManifest({
            swSrc: './src/sw.js',
            swDest: path.resolve(__dirname, '../../public/', 'sw.js'),
            importWorkboxFrom: 'disabled',
        })
    ]
})

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
