import * as gamelist from './client/scripts/db';
import * as WpcEmuWebWorkerApi from './lib/webclient';
import * as WebWorker from './lib/webclient/webworker';

export {
  /**
   * gamelist provides access to the WPC-Emu data base including all supported ROM's
   */
  gamelist,

  /**
   * interface to WPC-Emu, used in the main thread where the application runs.
   * Note: WPC-Emu runs in its own worker thread, this interface provides an interface to the web worker
   */
  WpcEmuWebWorkerApi,

  /**
   * Webworker functions calls, which will be called from a web worker thread.
   */
  WebWorker,
};
