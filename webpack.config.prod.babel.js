import webpack from 'webpack'
import path from 'path'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

let extractStyles = new ExtractTextPlugin('[name].css')

let config = {
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false
  },

  entry: path.resolve(__dirname, 'index.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[ext]'
            }
          }
        ],
        exclude: path.resolve(__dirname, 'assets/images'),
      },
      {
        test: /\.(jpg|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]'
            }
          }
        ],
        include: path.resolve(__dirname, 'assets/images'),
        exclude: path.resolve(__dirname, 'assets/fonts'),
      },
      {
        test: /\.svg/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: { extract: true },
          },
        ],
        include: path.resolve(__dirname, 'assets/images'),
      },
      {
        test: /\.pug$/,
        use:  ['html-loader', 'pug-html-loader?pretty&exports=true']
      },
      {
        test: /\.scss$/,
        use: extractStyles.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  path.join(__dirname, 'node_modules/bootstrap/scss'),
                ]
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new SpriteLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'index.html',
      inject: 'head',
      template: path.resolve(__dirname, './templates/index.pug'),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: true,
      options: {
        postcss: [
          autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
          })
        ],
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Tether: "tether",
      "window.Tether": "tether",
      Validation: path.resolve(__dirname, 'node_modules/jquery-validation/dist/jquery.validate.js'),
      Validation_methods: path.resolve(__dirname, 'node_modules/jquery-validation/dist/additional-methods.js'),
      Popper: ['popper.js', 'default'],
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
    extractStyles,
  ]
}

export default config
