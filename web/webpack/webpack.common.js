const path = require('path');
const webpack = require('webpack');
const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  entry: ['./js/LightFever440.js'],
  module: {
    rules: [
      loaders.JSLoader,
      loaders.CSSLoader
    ]
  },
  output: {
    filename: 'LightFever440.bundle.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'LightFever440', // We set a library name to bundle the export default of the class
    libraryTarget: 'window', // Make it globally available
    libraryExport: 'default' // Make Kom.default become Kom
  },
  plugins: [
    new webpack.ProgressPlugin(),
    plugins.CleanWebpackPlugin,
    //plugins.ESLintPlugin,
    plugins.StyleLintPlugin,
    plugins.MiniCssExtractPlugin
  ]
};
