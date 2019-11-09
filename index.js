'use strict';

const GamelistDB = require('./lib/db');
const WpcEmuApi = require('./lib/emulator');
const WpcEmuWebWorkerApi = require('./lib/webclient');

module.exports = {
  /**
   * GamelistDB provides access to the WPC-Emu data base including all supported ROM's
   */
  GamelistDB,

  /**
   * Interface to the WPC-Emu implementation
   */
  WpcEmuApi,

  /**
   * Interface to WPC-Emu using a worker thread. This interface provides a serialized interface to the web worker.
   */
  WpcEmuWebWorkerApi,
};
