'use strict';

const RpcProxy = require('./messaging/rpcProxy');
const MESSAGE = require('./messaging/message');

module.exports = {
  initialiseWebworkerAPI,
};

const COMM_TIMEOUT_MS = 1000;
const LOAD_ROM_TIMEOUT_MS = 16000;

function initialiseWebworkerAPI() {
  return new WebWorkerApi();
}

class WebWorkerApi {

  constructor() {
    if (!window.Worker) {
      throw new Error('NO_WEBWORKER_SUPPORT');
    }

    this.id = 100;
    this.rpcProxy = RpcProxy.build();
    this.worker = new Worker('webworker.js');

    this.worker.onmessage = (message = {}) => {
      const messageHandled = this.rpcProxy.resolvePendingAnswerIfFoundFor(message.data);
      if (!messageHandled) {
        console.warn('UNHANDLED_MESSAGE:', message.data);
      }
    };
    this.worker.onerror = (message) => {
      console.error('WEBWORKER_ERROR', message);
    };
  }

  _sendMessage(messageAndParameterArray, timeoutMs = COMM_TIMEOUT_MS) {
    // webworker expect 2 parameters:
    // - requestId (int)
    // - message (string)
    // - optional parameter (any)
    this.id++;
    const message = [ this.id ].concat(messageAndParameterArray);
    console.log('>>', message);
    this.worker.postMessage(message);
    return this.rpcProxy.waitOnAnswer(this.id, timeoutMs, messageAndParameterArray)
      .catch((error) => {
        console.error('FAILED_CALL_RPC', error.message);
      });
  }

  initialiseEmulator(romData, gameEntry) {
    console.log('init emu');
    return this._sendMessage([ MESSAGE.initialiseEmulator, { romData, gameEntry } ], LOAD_ROM_TIMEOUT_MS);
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
    return this._sendMessage([ MESSAGE.getVersion ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  getEmulatorRomName() {
    return this._sendMessage([ MESSAGE.getEmulatorRomName ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  getEmulatorState() {
    return this._sendMessage([ MESSAGE.getEmulatorState ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  setEmulatorState(emuState) {
    return this._sendMessage([ MESSAGE.setEmulatorState, emuState ]);
  }

  getNextFrame() {
    return this._sendMessage([ MESSAGE.getNextFrame ])
      .then((reply) => {
        return reply.parameter;
      });
  }

}
