'use strict';

const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const S3_BUCKET = 'https://s3-eu-west-1.amazonaws.com/foo-temp/';

module.exports = () => {
  return {
    entry: {
      'wpc-client': './scripts/main.js',
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
      new FaviconsWebpackPlugin(path.resolve('../assets/logo.png')),
      new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // cache assets and reuse them
            urlPattern: /.*\/rom\/.*|.*\/sound\/.*|.*\/foo-temp\/.*/,
            handler: 'cacheFirst',
            options: {
              cacheName: 'assets',
              expiration: {
                maxEntries: 48,
                maxAgeSeconds: 3600 * 24 * 90,
              },
            }
          },
          {
            // cache everything else
            urlPattern: /\//,
            handler: 'networkFirst',
            options: {
              cacheName: 'application',
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 3600 * 24 * 7,
              },
            }
          },
        ]
      }),
      new WebpackPwaManifest({
        name: 'WPC-emu',
        short_name: 'WPC-Emu',
        description: 'Williams Pinball Emulator',
        background_color: '#000000',
        theme_color: '#000000',
        orientation: 'landscape',
        display: 'standalone',
        inject: true,
        ios: true,
        icons: [
          {
            src: path.resolve('../assets/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
          },
        ]
      })
    ],
    optimization: {
      minimizer: [new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true,
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: true
        }
      })]
    },
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
