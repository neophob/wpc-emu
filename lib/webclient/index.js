'use strict';

const buildRpcProxy = require('./messaging/rpcProxy');
const MESSAGE = require('./messaging/message');

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
      const messageHandled = this.rpcProxy.resolvePendingAnswerIfFoundFor(message);
      if (!messageHandled) {
        log.warn('UNHANDLED_MESSAGE:', message);
      }
    };
  }

  _sendMessage(messageAndParameterArray) {
    // webworker expect 3 parameters:
    // - requestId (int)
    // - message (string)
    // - parameter (any)

    this.id++;
    this.worker.postMessage([ this.id ].concat(messageAndParameterArray));
    return this.rpcProxy.waitOnAnswer(this.id);
  }

  initialiseEmulator(romData, gameEntry) {
    return this._sendMessage([ MESSAGE.resetEmulator, {romData, gameEntry} ]);
  }

  resetEmulator() {
    return this._sendMessage([ MESSAGE.resetEmulator ]);
  }

}
