'use strict';

const buildRpcProxy = require('./messaging/rpcProxy');

module.exports = {
  initialiseWebworker,
};


function initialiseWebworker() {
  return new WebWorkerApi();
}

class WebWorkerApi {

  constructor() {
    if (!window.Worker) {
      throw new Error('NO_WEBWORKER_SUPPORT');
    }

    this.id = 100;
    this.rpcProxy = buildRpcProxy();
    this.worker = new Worker('./webworker.js');
    this.worker.onmessage = (message) => {
      this.rpcProxy.resolvePendingAnswerIfFoundFor(message);
    };
  }

  _sendMessage(data) {
    this.id++;
    this.worker.postMessage([ this.id ].concat(data));
    return this.rpcProxy.waitOnAnswer(this.id);
  }

  initialiseEmulator(romData, gameEntry) {
    this._sendMessage([ romData, gameEntry ]);
  }
}
