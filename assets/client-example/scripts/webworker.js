'use strict';

import WebworkerInterface from 'wpc-emu/lib/webclient/webworker';

onmessage = (event) => {
  WebworkerInterface.handleMessage(event, postMessage);
};
