const path = require('node:path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const S3_BUCKET = 'https://s3-eu-west-1.amazonaws.com/foo-temp/';

module.exports = () => ({
  entry: {
    'wpc-client': './scripts/main.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      FETCHURL: process.env.SERVEURL
        ? JSON.stringify(process.env.SERVEURL)
        : JSON.stringify(S3_BUCKET),
      RELEASE_VERSION: JSON.stringify(require('./package.json').version),
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: true,
    }),
    new FaviconsWebpackPlugin(path.resolve('../assets/logo.png')),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          // cache assets and reuse them
          urlPattern: /.*\/rom\/.*|.*\.woff2|.*\/sound\/.*|.*\/foo-temp\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'assets',
            expiration: {
              maxEntries: 64,
              maxAgeSeconds: 3600 * 24 * 90,
            },
          },
        },
        {
          // cache everything else
          urlPattern: /\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'application',
            expiration: {
              maxEntries: 32,
              maxAgeSeconds: 1,
            },
          },
        },
      ],
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
      ],
    }),
    new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, '');
    }),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false,
        },
        safari10: true,
      },
      extractComments: false,
    })],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.tpl/,
        type: 'asset/source',
      },
    ],
  },
  performance: {
    maxEntrypointSize: 1024 * 1024,
    maxAssetSize: 1024 * 1024,
  },
});
