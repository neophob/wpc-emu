'use strict';

const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = () => {
  return {
    entry: './lib/emulator.js',
    plugins: [
      new MinifyPlugin()
    ],
    output: {
      filename: 'wpc-emu.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'WpcEmu',
    },
    module: {
      rules: [{
        test: /\.js$/,
        use: [{
          loader: 'remove-debug-loader'
        }]
      }]
    }

  };
};
