'use strict';

const webpack = require('webpack');
const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    entry: './scripts/main.js',
    plugins: [
      new webpack.DefinePlugin({
        FETCHURL: process.env.SERVEURL ?
          JSON.stringify(process.env.SERVEURL) :
          JSON.stringify('https://s3-eu-west-1.amazonaws.com/foo-temp/')
      }),
      new MinifyPlugin(),
      new HtmlWebpackPlugin({
        template: 'index.html',
        minify: true
      })
    ],
    output: {
      filename: 'wpc-client.js',
      path: path.resolve(__dirname, '../dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }]
        },
        {
          test: /\.tpl/,
          use: 'raw-loader'
        }
      ]
    }
  };
};
