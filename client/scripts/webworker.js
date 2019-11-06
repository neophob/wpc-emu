'use strict';

import { WebWorker } from '../../lib/webclient';

onmessage = (event) => {
  WebWorker.handleMessage(event, postMessage);
};
