const path = require('node:path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const S3_BUCKET = 'https://s3-eu-west-1.amazonaws.com/foo-temp/';

const skipAnalyze = process.env.NO_ANALYZE && process.env.NO_ANALYZE === 'true';

module.exports = () => {
  return {
    entry: {
      'wpc-example': './scripts/main.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        FETCHURL: process.env.SERVEURL ?
          JSON.stringify(process.env.SERVEURL) :
          JSON.stringify(S3_BUCKET)
      }),
      new HtmlWebpackPlugin({
        template: 'index.html',
        minify: true
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: skipAnalyze ? 'disabled' : 'server'
      }),
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    ],
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './dist')
    },
    target: 'web',
    resolve: {
      fallback: {
        "process": false,
      },
    },
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        }
      ]
    }
  };
};
