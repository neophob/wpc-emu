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

  pauseEmulator() {
    return this._sendMessage([ MESSAGE.pauseEmulator ]);
  }

  resumeEmulator() {
    return this._sendMessage([ MESSAGE.resumeEmulator ]);
  }

  resetEmulator() {
    return this._sendMessage([ MESSAGE.resetEmulator ]);
  }

  setCabinetInput(value) {
    return this._sendMessage([ MESSAGE.setCabinetInput, value ]);
  }

  setInput(value) {
    return this._sendMessage([ MESSAGE.setInput, value ]);
  }

  setFliptronicsInput(value) {
    return this._sendMessage([ MESSAGE.setFliptronicsInput, value ]);
  }

  toggleMidnightMadnessMode() {
    return this._sendMessage([ MESSAGE.toggleMidnightMadnessMode ]);
  }

  getVersion() {
    return this._sendMessage([ MESSAGE.getVersion ]);
  }

}
