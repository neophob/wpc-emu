import * as GamelistDB from './client/scripts/db';
import * as WpcEmuApi from './lib/emulator';
import * as WpcEmuWebWorkerApi from './lib/webclient';

export {
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
