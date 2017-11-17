const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const SWPrecachePlugin = require('sw-precache-webpack-plugin')

console.log('[webpack.config] NODE_ENV is ', process.env.NODE_ENV)
const PORT = 1801

const isDev = process.env.NODE_ENV !== 'production'

const DIR_ROOT = path.join(__dirname)
const DIR_SRC = path.join(DIR_ROOT, 'src')
const DIR_DIST = path.join(DIR_ROOT, 'dist')

const DEV = {
    devServer: {
        contentBase: [path.join(DIR_ROOT, 'static')],
    },
    output: {
        path: DIR_DIST,
        publicPath: '',
    },
    htmlFileName: path.join(DIR_DIST, 'index.html')
}
const PROD = {
    output: {
        path: DIR_DIST,
        publicPath: './',
    },
    htmlFileName: path.join(DIR_DIST, 'index.html')
}
const BUILD = Object.assign({}, isDev ? DEV : PROD, {
    htmlTemplateName: path.join(DIR_SRC, 'index.template.html')
})
const pkg = require('./package.json')
const PATH_TO_INDEX_FILE = path.join(DIR_SRC, 'index.ts')


const config = {
    // watch: true,
    // stats: {
    //   chunks: false
    // },
    stats: 'minimal',
    watchOptions: {
        poll: true
    },
    devServer: {
        // hot: true,
        // inline: true,
        stats: 'errors-only',
        contentBase: DEV.devServer.contentBase,
        compress: true,
        host: '0.0.0.0',
        port: PORT,
        // proxy: [{
        //     context: ["/auth", "/api", "/mjpeg", "/hls"],
        //     target: SERVICE_HOST
        //     // target: "http://localhost:3004",
        // }],
        staticOptions: {
            // redirect: false,
            extensions: ['html']
        }
    },
    devtool: isDev ? 'source-map' : false,
    // devtool: '#cheap-module-eval-source-map',
    entry: {
        app: [
            PATH_TO_INDEX_FILE
        ]
        // vendor: [
        //   'vue',
        //   'vue-router',
        //   'vuex',
        //   'vuex-router-sync'
        // ]
    },
    output: {
        path: BUILD.output.path,
        publicPath: BUILD.output.publicPath,
        filename: '[name].js?[hash]',
        chunkFilename: '[name].[chunkhash].js'
    },
    resolve: {
        alias: {
            'vue': path.join(DIR_ROOT, './node_modules/vue'),
            'src': path.join(DIR_SRC)
        },
        modules: ['node_modules', 'node-modules'],
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
        noParse: /es6-promise\.js$/, // avoid webpack shimming process
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                loaders: 'buble-loader',
                include: [
                    path.join(DIR_ROOT, 'src'),
                    // path.join(DIR_ROOT, 'webpack.config.ts'),
                ],
                options: {
                    objectAssign: 'Object.assign'
                }
            },
            { test: /\.(ts|tsx)$/, loader: 'ts-loader', options: { appendTsSuffixTo: [/\.vue$/] } },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true,
                    preserveWhitespace: false,
                    buble: {
                        objectAssign: 'Object.assign',
                    },
                    loaders: {
                        scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                        sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax', // <style lang="sass">,
                        styl: 'vue-style-loader!css-loader!stylus-loader'
                    }
                }
            },
            // {
            //   test: /\.tsx?$/,
            //   include: [path.join(__dirname, '..')],
            //   loader: 'ts-loader',
            //   // options: {
            //   //   appendTsSuffixTo: [/\.vue$/]
            //   // }
            // },
            // {
            //   test: /\.vue$/,
            //   loader: 'vue-loader',
            //   options: vueConfig
            // },
            {
                test: /\.styl$/,
                loader: 'vue-loader',
                options: {
                    preserveWhitespace: false,
                    postcss: [
                        require('autoprefixer')({
                            browsers: ['last 3 versions']
                        })
                    ],
                    buble: {
                        objectAssign: 'Object.assign',
                    },
                    loaders: {
                        styl: 'vue-style-loader!css-loader!stylus-loader'
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.woff(2)?(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]',
                    mimeType: 'application/font-woff'
                }
            },
            {
                test: /\.(eot|ttf|wav|mp3)(\?.*)?$/,
                loader: 'file-loader',
            }
        ]
    },
    plugins: [
        // strip comments in Vue code
        new ExtractTextPlugin('styles.[hash].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        // extract vendor chunks for better caching
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: 'vendor'
        // }),
        // generate output HTML
        new HTMLPlugin({
            filename: BUILD.htmlFileName,
            template: BUILD.htmlTemplateName
        }),
        new webpack.DefinePlugin({
            _VERSION_: JSON.stringify(pkg.version),
            _RELEASE_DATE_: JSON.stringify('recently ^)'),  // WARNING : do not forget JSON.strinfiy, otw parser error
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        })
    ]
}
if (process.env.NODE_ENV === 'production') {

    // Use ExtractTextPlugin to extract CSS into a single file
    // so it's applied on initial render.
    // vueConfig is already included in the config via LoaderOptionsPlugin
    // here we overwrite the loader config for <style lang="stylus">
    // so they are extracted.
    // vueConfig.loaders = {
    //   stylus: ExtractTextPlugin.extract({
    //     loader: 'css-loader!stylus-loader',
    //     fallbackLoader: 'vue-style-loader' // <- this is a dep of vue-loader
    //   })
    // }

    config.plugins.push(
        // new ExtractTextPlugin('styles.[hash].css'),
        // this is needed in webpack 2 for minifying CSS
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        // minify JS
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
        // new SWPrecachePlugin({
        //   cacheId: 'vue-hn',
        //   filename: 'service-worker.js',
        //   dontCacheBustUrlsMatching: /./,
        //   staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
        // })
    )
}
module.exports = config;
