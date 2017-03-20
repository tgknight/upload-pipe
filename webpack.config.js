const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const ROOT_PATH = path.resolve(__dirname)

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    path.resolve(ROOT_PATH, 'app/src/index')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.resolve(ROOT_PATH, 'app/build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    //contentBase: path.resolve(ROOT_PATH, 'app/build'),
    port: 9090,
    historyApiFallback: true,
    // hot: true,
    inline: true,
    progress: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Upload-pipe',
      template: path.resolve(ROOT_PATH, 'app/src/index.html'),
      inject: 'body'
    })
  ]
}
