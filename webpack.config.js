'use strict';

const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');

function getWebPackConfig(isProduction) {
  const mode = isProduction ? 'production' : 'development';
  return {
    entry: './lib/emulator.js',
    mode,
    plugins: [
      new MinifyPlugin()
    ],
    output: {
      filename: 'wpc-emu.js',
      path: path.resolve(__dirname, 'dist'),
      library: 'WpcEmu',
    }
  };
}

module.exports = (env) => {
  return getWebPackConfig(env === 'production');
};
