'use strict';

const RpcProxy = require('./messaging/rpcProxy');
const MESSAGE = require('./messaging/message');

module.exports = {
  initialiseWebworker,
};

//TODO rename to initialiseWebworkerAPI
function initialiseWebworker(callback) {
  return new WebWorkerApi(callback);
}

class WebWorkerApi {

  constructor(callback) {
    if (!window.Worker) {
      throw new Error('NO_WEBWORKER_SUPPORT');
    }

    this.id = 100;
    this.rpcProxy = RpcProxy.build();
    this.worker = new Worker('webworker.js');
    this.worker.onmessage = (message = {}) => {

      if (message.data.message === MESSAGE.MSG_TYPE_UIDATA) {
        callback(message.data.parameter);
        return;
      }
      const messageHandled = this.rpcProxy.resolvePendingAnswerIfFoundFor(message.data);
      if (!messageHandled) {
        console.warn('UNHANDLED_MESSAGE:', message.data);
      }
    };
    this.worker.onerror = (message) => {
      console.error('WEBWORKER_ERROR', message);
    }
  }

  _sendMessage(messageAndParameterArray) {
    // webworker expect 3 parameters:
    // - requestId (int)
    // - message (string)
    // - parameter (any)

    this.id++;
    const message = [ this.id ].concat(messageAndParameterArray);
    console.log('>>', message);
    this.worker.postMessage(message);
    return this.rpcProxy.waitOnAnswer(this.id);
  }

  initialiseEmulator(romData, gameEntry) {
    console.log('init emu');
    return this._sendMessage([ MESSAGE.initialiseEmulator, {romData, gameEntry} ]);
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
