'use strict';

const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = () => {
  return {
    entry: './client/scripts/main.js',
    plugins: [
      new MinifyPlugin()
    ],
    output: {
      filename: 'wpc-client.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [{
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: true,
          collapseWhitespace: true
        }
      }]
    }
  };
};
