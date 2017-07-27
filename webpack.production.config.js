
const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

// local css modules
loaders.push({
  test: /[/\\]public[/\\].*\.css/,
  exclude: /(node_modules|bower_components|public_out\/)/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});

// local scss modules
loaders.push({
  test: /[/\\]public[/\\].*\.scss/,
  exclude: /(node_modules|bower_components|public_out\/)/,
  loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader')
});
// global css files
loaders.push({
  test: /[/\\](node_modules|global)[/\\].*\.css$/,
  loader: ExtractTextPlugin.extract('style-loader', 'css'),
});

module.exports = {
  entry: [
    './public/index.tsx',
  ],
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public_out'),
    filename: '[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    loaders,
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true,
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[contenthash].css', {
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: './public/template.html',
      title: 'Webpack App',
    }),
    new webpack.optimize.DedupePlugin(),
  ],
};
