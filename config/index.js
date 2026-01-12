// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path')
const { login, target, port } = require('./login')
const bundleAnalyzerReport = process.argv.indexOf('--report') !== -1

const api = [
    '^/api',
    '^/gameBounscodeType',
    '^/login',
    '^/css',
    '^/js',
    '^/favicon.ico',
    '^/language',
    '^/redirection'
].join('|')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../../resources/views/gameClient.blade.php'),
        assetsRoot: path.resolve(__dirname, '../../public'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport
    },
    dev: {
        env: require('./dev.env'),
        port,
        login,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '*': {
                target,
                changeOrigin: true,
                filter: pathname => pathname.match(api)
                // secure: false
            }
        },
        cssSourceMap: true
    }
}

