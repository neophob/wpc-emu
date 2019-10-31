'use strict';

const WebworkerInterface = require('../../lib/webclient/webworker');

onmessage = (event) => {
  WebworkerInterface.handleMessage(event, postMessage);
};
