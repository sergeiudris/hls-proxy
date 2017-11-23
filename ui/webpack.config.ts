
const path = require('path')
// const webpack = require('webpack')
import * as webpack from 'webpack'
const HTMLPlugin = require('html-webpack-plugin')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const babelPluginImport = require('babel-plugin-import')
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;


console.log('> NODE_ENV : ', process.env.NODE_ENV)
const PORT = 1811
const isDevelopment = process.env.NODE_ENV !== 'production'

const DIR_ROOT = path.join(__dirname)
const DIR_APP_SRC = path.join(DIR_ROOT, 'src')
const DIR_APP_DIST = path.join(DIR_ROOT, 'dist')

const pkg = require(path.join(DIR_ROOT, 'package.json'))

const PATH_TO_INDEX_FILE = path.join(DIR_APP_SRC, 'index.tsx')


const DEV = {
  devServer: {
    contentBase: [path.join(DIR_ROOT, 'static')],
  },
  output: {
    path: DIR_APP_DIST,
    publicPath: '',
  },
  htmlFileName: path.join(DIR_APP_DIST, 'index.html')
}

const PROD = {
  output: {
    path: DIR_APP_DIST,
    publicPath: './',
  },
  htmlFileName: path.join(DIR_APP_DIST, 'index.html')
}

const BUILD = Object.assign({}, isDevelopment ? DEV : PROD, {
  htmlTemplateName: path.join(DIR_APP_SRC, 'index.template.html')
})


const babelOptions = {
  // presets: ['env'],
  plugins: [
    ['import', [
      {
        "libraryName": "antd",
        "libraryDirectory": "lib",   // default: lib
        "style": true
      },
    ]]
  ]
}

const config: webpack.Configuration = {
  stats: 'minimal',
  devServer: {
    hot: true,
    inline: true,
    stats: 'errors-only',
    contentBase: DEV.devServer.contentBase,
    compress: true,
    port: PORT,
    // proxy: {
    //   "/api": {
    //     target: SERVER_HOST
    //   },
    // '/**': {  //catch all requests
    //   target: DEV.htmlFileName,  //default target
    //   secure: false,
    //   bypass: function (req, res, opt) {
    //     //your custom code to check for any exceptions
    //     //console.log('bypass check', {req: req, res:res, opt: opt});
    //     // if (req.path.indexOf('/img/') !== -1 || req.path.indexOf('/public/') !== -1) {
    //     //   return '/'
    //     // }

    //     if (req.headers.accept.indexOf('html') !== -1) {
    //       return './index.html';
    //     }
    //   }
    // }
    // },
    // historyApiFallback: true,
    staticOptions: {
      // redirect: false,
      extensions: ['html']
    }
  },
  // watchOptions: {
  //   poll: true
  // },
  // watch: true,
  devtool: isDevelopment ? 'source-map' : false,
  // devtool: '#cheap-module-eval-source-map',
  entry: isDevelopment ? [
    'react-hot-loader/patch',
    // 'babel-polyfill',
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',
    PATH_TO_INDEX_FILE
  ] : [
      'babel-polyfill',
      PATH_TO_INDEX_FILE
    ],
  output: {
    path: BUILD.output.path,
    publicPath: BUILD.output.publicPath,
    filename: '[name].js?[hash]',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'mobx': path.resolve('./node_modules/mobx'),
      //'public': path.resolve(__dirname, '../../public')
    },
    modules: ['node_modules', 'node-modules', __dirname],
    extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.tsx'],
  },
  module: {
    // noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      // {
      //   test: /\.(js|jsx)$/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: babelOptions
      //     }
      //   ],
      //   include: [
      //     path.join(DIR_ROOT, 'src'),
      //   ],
      //   exclude: /(node_modules|bower_components)/,
      // },
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        include: [
          path.join(DIR_ROOT, 'src'),
        ],
        use: [
          {
            loader: 'react-hot-loader/webpack'
          },
          // {
          //   loader: 'babel-loader',
          //   options: babelOptions
          // },
          {
            loader: 'ts-loader'
          }
        ]
      },
      // {
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract({
      //     fallbackLoader: 'style-loader',
      //     loader: ['css-loader', 'postcss-loader'],
      //   }),
      // }, {
      //   test: /\.less$/,
      //   loader: ExtractTextPlugin.extract({
      //     fallbackLoader: 'style-loader',
      //     loader: ['css-loader', 'less-loader'],
      //   }),
      // },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     plugins: function () {
          //       return [
          //         // require('precss'),
          //         require('autoprefixer')
          //       ];
          //     }
          //   }
          // },
        ]
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "less-loader" // compiles Less to CSS
        }]
      },
      // {
      //   test: /\.less$/,
      //   use: [
      //     {
      //       loader: ExtractTextPlugin.extract({
      //         fallbackLoader: 'style-loader',
      //         loader: "css-loader!less-loader",
      //       })
      //     }
      //   ]

      // },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              minimize: true || {/* CSSNano Options */ },
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          // {
          //   loader: 'postcss-loader',
          //   options: {
          //     plugins: function () {
          //       return [
          //         // require('precss'),
          //         require('autoprefixer')
          //       ];
          //     }
          //   }
          // },
          {
            loader: 'stylus-loader',
            options: {
              use: [],
            },
          },

        ],
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
      },
      {
        test: /\.(json|geojson)$/,
        use: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.(styl|css)$/,
      options: {
        postcss: {
          plugins: [require('autoprefixer')]
        }
      }
    }),

    // strip comments in Vue code

    // generate output HTML
    new HTMLPlugin({
      filename: BUILD.htmlFileName,
      template: BUILD.htmlTemplateName
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__DEV__': JSON.stringify(process.env.NODE_ENV || 'development'),
      _VERSION_: JSON.stringify(pkg.version),
      _RELEASE_DATE_: JSON.stringify(pkg.releaseDate),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   parallel: {
    //     cache: false,
    //     workers: 2 // for e.g
    //   },
    //   beautify: false,
    //   mangle: {
    //     screw_ie8: true,
    //     keep_fnames: false
    //   },
    //   compress: {
    //     dead_code: false,
    //     screw_ie8: true,
    //     warnings: false
    //   },
    //   comments: false
    // })
  ]
}

if (process.env.NODE_ENV === 'production') {

  config.plugins.push(
    new ExtractTextPlugin('styles.[hash].css'),
    // this is needed in webpack 2 for minifying CSS
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      parallel: {
        cache: false,
        workers: 2 // for e.g
      },
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: false
      },
      compress: {
        dead_code: false,
        screw_ie8: true,
        warnings: false
      },
      comments: false
    }),
    // new StatsWriterPlugin({
    //   filename: "stats.json", // Default,
    //   fields: null,
    //   stats: { chunkModules: true }
    // })
  )
}

module.exports = config
