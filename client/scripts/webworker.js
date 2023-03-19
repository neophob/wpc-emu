import { WebWorker } from '../../lib/webclient.js';

onmessage = (event) => {
  WebWorker.handleMessage(event, postMessage);
};
