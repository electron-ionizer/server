const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';

// global css
loaders.push({
  test: /\.css$/,
  exclude: /[/\\]src[/\\]/,
  loaders: [
    'style-loader?sourceMap',
    'css-loader',
  ],
});
// local scss modules
loaders.push({
  test: /\.scss$/,
  exclude: /[/\\](node_modules|bower_components|public_out\/)[/\\]/,
  loaders: [
    'style-loader?sourceMap',
    'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]&sourceMap',
    'postcss-loader',
    'sass-loader',
  ],
});

// local css modules
loaders.push({
  test: /\.css$/,
  exclude: /[/\\](node_modules|bower_components|public_out\/)[/\\]/,
  loaders: [
    'style-loader?sourceMap',
    'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]&sourceMap'
  ],
});

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './public/index.tsx',
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public_out'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    loaders,
  },
  devServer: {
    contentBase: './public_out',
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST,
    proxy: {
      '/rest': `http://localhost:${require('./config.js').port}`
    }
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: './public/template.html',
    }),
  ],
};
