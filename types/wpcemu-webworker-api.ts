const WpcEmuWebWorkerApi = require('../lib/webclient');

const webWorkerApi = WpcEmuWebWorkerApi.initialiseWebworkerAPI({ postMessage: () => {} });
webWorkerApi.reset();
