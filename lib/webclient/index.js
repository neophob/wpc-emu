'use strict';

const RpcProxy = require('./messaging/rpcProxy');
const MESSAGE = require('./messaging/message');

module.exports = {
  initialiseWebworkerAPI,
};

const COMM_TIMEOUT_MS = 1000;
const LOAD_ROM_TIMEOUT_MS = 16000;
const INITIAL_ID = 100;

/**
 * create new webworker API interface
 * @param {Worker} [opionalWebWorkerInstance] Optional worker instance, useful if you use https://github.com/webpack-contrib/worker-loader
 */
function initialiseWebworkerAPI(opionalWebWorkerInstance) {
  return new WebWorkerApi(opionalWebWorkerInstance);
}

class WebWorkerApi {

  /**
   * Create the web worker API
   * @param {Worker} [opionalWebWorkerInstance] Optional worker instance
   */
  constructor(opionalWebWorkerInstance) {
    if (!opionalWebWorkerInstance && !window.Worker) {
      throw new Error('NO_WEBWORKER_SUPPORT');
    }

    this.id = INITIAL_ID;
    this.rpcProxy = RpcProxy.build();
    this.worker = opionalWebWorkerInstance || new Worker('webworker.js');

    this.worker.onmessage = (message = {}) => {
      const messageData = message.data;
      if (this.audioConsumerCallback && messageData.message === MESSAGE.MSG_TYPE_AUDIO_CALLBACK) {
        return this.audioConsumerCallback(messageData.sampleId);
      }
      if (this.uiUpdateConsumerCallback && messageData.message === MESSAGE.MSG_TYPE_UIDATA) {
        return this.uiUpdateConsumerCallback(messageData.parameter);
      }
      const messageHandled = this.rpcProxy.resolvePendingAnswerIfFoundFor(messageData);
      if (!messageHandled) {
        console.warn('UNHANDLED_MESSAGE:', messageData);
      }
    };
    this.worker.onerror = (message) => {
      console.error('WEBWORKER_ON_ERROR', message);
    };
    this.worker.onmessageerror = (message) => {
      console.error('WEBWORKER_ON_MESSAGE_ERROR', message);
    };
  }

  _sendMessage(messageAndParameterArray, timeoutMs = COMM_TIMEOUT_MS) {
    // webworker expect 2 parameters:
    // - requestId (int)
    // - message (string)
    // - optional parameter (any)
    this.id++;
    const message = [ this.id ].concat(messageAndParameterArray);
    const promise = this.rpcProxy.waitOnAnswer(this.id, timeoutMs, messageAndParameterArray);
    this.worker.postMessage(message);
    return promise;
  }

  /**
   * reset the RPC proxy to its initial state
   * used when a new game is loaded
   */
  reset() {
    this.rpcProxy = RpcProxy.build();
    this.id = INITIAL_ID;
  }

  /**
   * return meta data about the connection with the webworker process
   */
  getStatistics() {
    return {
      averageRTTms: this.rpcProxy.getAverageRttMs(),
      sentMessages: this.id - INITIAL_ID,
      failedMessages: this.rpcProxy.errorCounter,
    };
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

  registerAudioConsumer(callbackFunction) {
    this.audioConsumerCallback = callbackFunction;
    return this._sendMessage([ MESSAGE.registerAudioConsumer ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  /**
   * register ui callback function
   * @param {function} callbackFunction
   */
  registerUiUpdateConsumer(callbackFunction) {
    this.uiUpdateConsumerCallback = callbackFunction;
    return Promise.resolve();
  }

  /**
   * report current framerate to synchronize setInterval
   * @param {*} framerate
   */
  adjustFramerate(framerate) {
    return this._sendMessage([ MESSAGE.configureFrameRate, framerate ]);
  }

  /**
   * stop setInterval loop in web worker
   */
  pauseEmulator() {
    return this._sendMessage([ MESSAGE.pauseEmulator ]);
  }

  /**
   * resume setInterval loop in web worker
   */
  resumeEmulator() {
    return this._sendMessage([ MESSAGE.resumeEmulator ]);
  }

}
