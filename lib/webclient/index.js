const RpcProxy = require('./messaging/rpcProxy');
const MESSAGE = require('./messaging/message');
const WebWorker = require('./webworker');

module.exports = {
  initializeWebworkerAPI,
  WebWorker,
};

const COMM_TIMEOUT_MS = 2000;
const LOAD_ROM_TIMEOUT_MS = 16000;
const INITIAL_ID = 100;

/**
 * create new webworker API interface
 * @param {Worker} [optionalWebWorkerInstance] Optional worker instance, useful if you use https://github.com/webpack-contrib/worker-loader
 * @returns new WebWorkerApi instance
 */
function initializeWebworkerAPI(optionalWebWorkerInstance) {
  return new WebWorkerApi(optionalWebWorkerInstance);
}

class WebWorkerApi {

  /**
   * Create the web worker API
   * @param {Worker} [optionalWebWorkerInstance] Optional worker instance
   */
  constructor(optionalWebWorkerInstance) {
    if (!optionalWebWorkerInstance && !window.Worker) {
      throw new Error('NO_WEBWORKER_SUPPORT');
    }

    this.id = INITIAL_ID;
    this.rpcProxy = RpcProxy.build();
    this.worker = optionalWebWorkerInstance || new Worker('webworker.js');

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
   * @returns promise with meta data about the connection with the webworker process
   */
  getStatistics() {
    return {
      averageRTTms: this.rpcProxy.getAverageRttMs(),
      sentMessages: this.id - INITIAL_ID,
      failedMessages: this.rpcProxy.errorCounter,
    };
  }

  /**
   * initialze emulator
   * @param {Object} romData the game rom as { u06: UInt8Array }
   * @param {Object} gameEntry from the internal database
   * @returns promise if message is ACKED
   */
  initializeEmulator(romData, gameEntry) {
    console.log('init emu');
    this.reset();
    return this._sendMessage([ MESSAGE.initializeEmulator, { romData, gameEntry } ], LOAD_ROM_TIMEOUT_MS);
  }

  /**
   * reboots the emulator
   * @returns promise if message is ACKED
   */
  resetEmulator() {
    return this._sendMessage([ MESSAGE.resetEmulator ]);
  }

  /**
   * Cabinet key emulation (Coins, ESC, +, -, ENTER)
   * @param {Number} value 1-8
   * @returns promise if message is ACKED
   */
  setCabinetInput(value) {
    return this._sendMessage([ MESSAGE.setCabinetInput, value ]);
  }

  /**
   * Set / Toggle switch
   * @param {Number} switchNr 11-99
   * @param {boolean} optionalValue optional value to set the switch to defined state, if this value is missing, the switch will toggle
   * @returns promise if message is ACKED
   */
  setSwitchInput(switchNr, optionalValue) {
    return this._sendMessage([ MESSAGE.setSwitchInput, switchNr, optionalValue ]);
  }

  /**
   * fliptronic flipper move (depends on the machine if this is supported)
   * @param {String} value - the switch name, like 'F1', 'F2' .. 'F8'
   * @param {boolean} optionalValue optional value to set the switch to defined state, if this value is missing, the switch will toggle
   * @returns promise if message is ACKED
   */
  setFliptronicsInput(value, optionalValue) {
    return this._sendMessage([ MESSAGE.setFliptronicsInput, value, optionalValue ]);
  }

  /**
   * set the internal time some seconds before midnight madness time (toggles)
   * @returns promise if message is ACKED
   */
  toggleMidnightMadnessMode() {
    return this._sendMessage([ MESSAGE.toggleMidnightMadnessMode ]);
  }

  /**
   * update the dipswitch setting (country setting)
   */
  setDipSwitchByte(dipSwitch) {
    return this._sendMessage([ MESSAGE.setDipSwitchByte ]);
  }

  /**
   * @returns the current dip switch setting
   */
  getDipSwitchByte() {
    return this._sendMessage([ MESSAGE.getDipSwitchByte ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  /**
   * @returns promise with the WPC-Emu version
   */
  getVersion() {
    return this._sendMessage([ MESSAGE.getVersion ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  /**
   * @returns promise with current rom name
   */
  getEmulatorRomName() {
    return this._sendMessage([ MESSAGE.getEmulatorRomName ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  /**
   * get the internal state of the emulator
   * @returns promise including ui state
   */
  getEmulatorState() {
    return this._sendMessage([ MESSAGE.getEmulatorState ])
      .then((reply) => {
        return reply.parameter;
      });
  }

  /**
   * restore a previously saved emulator state
   * @param {Object} emuState the new state
   * @returns promise if message is ACKED
   */
  setEmulatorState(emuState) {
    return this._sendMessage([ MESSAGE.setEmulatorState, emuState ]);
  }

  /**
   * callback to playback audio samples
   * @param {Function} callbackFunction function will be called when sample is played
   * @returns promise with resolved parameter
   */
  registerAudioConsumer(callbackFunction) {
    this.audioConsumerCallback = callbackFunction;
    return this._sendMessage([ MESSAGE.registerAudioConsumer ]);
  }

  /**
   * register ui callback function
   * @param {Function} callbackFunction function will be called when new ui state is available
   * @returns resolved promise
   */
  registerUiUpdateConsumer(callbackFunction) {
    this.uiUpdateConsumerCallback = callbackFunction;
    return Promise.resolve();
  }

  /**
   * set target framerate of the client
   * @param {Number} framerate the new framerate of the emulator
   * @returns promise if message is ACKED
   */
  adjustFramerate(framerate) {
    return this._sendMessage([ MESSAGE.configureFrameRate, framerate ]);
  }

  /**
   * stop setInterval loop in web worker
   * @returns promise if message is ACKED
   */
  pauseEmulator() {
    return this._sendMessage([ MESSAGE.pauseEmulator ]);
  }

  /**
   * resume setInterval loop in web worker
   * @returns promise if message is ACKED
   */
  resumeEmulator() {
    return this._sendMessage([ MESSAGE.resumeEmulator ]);
  }

  /**
   * Debugging tool, write to emu ram
   * @param {Number} offset of memory, must be between 0..0x3FFF
   * @param {Number|String|Array} value to write to the memory location (uint8)
   * @returns promise if message is ACKED
   */
  writeMemory(offset, value) {
    return this._sendMessage([ MESSAGE.writeMemory, offset, value ]);
  }

}
