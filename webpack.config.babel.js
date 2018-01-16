import webpack from 'webpack'
import path from 'path'
import autoprefixer from 'autoprefixer'
import HtmlWebpackPlugin from 'html-webpack-plugin'

var config = {
  devServer: {
    hot: true,
    inline: true,
  },

  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false,
  },

  entry: path.resolve(__dirname, 'index.js'),

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
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
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
        exclude: path.resolve(__dirname, 'assets/images'),
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        exclude: path.resolve(__dirname, 'assets/images'),
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader',
        include: path.resolve(__dirname, 'assets/images'),
        exclude: path.resolve(__dirname, 'assets/fonts'),
      },
      {
        test: /\.svg/,
        exclude: /node_modules/,
        use: {
          loader: 'svg-url-loader',
        }
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use:  ['html-loader', 'pug-html-loader?pretty&exports=false']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [{
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.join(__dirname, 'node_modules/bootstrap/scss'),
              ]
            }
          }
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: 'index.html',
      template: path.resolve(__dirname, './templates/index.pug'),
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
      Tooltip: "exports-loader?Tab!bootstrap/js/dist/tooltip",
      Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
  ],
};

module.exports = config;
