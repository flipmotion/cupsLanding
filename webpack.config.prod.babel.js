import webpack from 'webpack'
import path from 'path'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

let extractStyles = new ExtractTextPlugin('[name].css')
let extractHtml = new ExtractTextPlugin('[name].html')

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

  entry: {
    payture: [
      path.resolve(__dirname, 'index.js')
    ]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {}
        }
      },
      {
        test: /\.pug$/,
        use: extractHtml.extract({
          use: ['file-loader?name=[name].html', 'pug-html-loader?pretty&exports=true']
        }),
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
    extractStyles,
    extractHtml,
  ]
}

export default config
