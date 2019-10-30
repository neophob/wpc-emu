const WpcEmuWebWorkerApi = require('../lib/webclient');

const webWorkerApi = WpcEmuWebWorkerApi.initializeWebworkerAPI({ postMessage: () => {} });
webWorkerApi.reset();
