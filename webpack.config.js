const path = require('path');

module.exports = {
  entry: './lib/emulator.js',
  mode: 'development',
  output: {
    filename: 'wpc-emu.js',
    path: path.resolve(__dirname, 'dist')
  }
};
