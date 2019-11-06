'use strict';

import { WebWorker } from 'wpc-emu/lib/webclient';

onmessage = (event) => {
  WebWorker.handleMessage(event, postMessage);
};
