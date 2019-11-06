const MESSAGE = require('./messaging/message');
const WebworkerEmu = require('./webworker.emu');

module.exports = {
  handleMessage,
  getEmu,
  clearState,
};

let emu;
let emuState;

/**
 * returns the current emu instance, so the emu can be used within a worker thread.
 * Note: the emu might not be initialized yet - so consumer must make sure emu is defined
 */
function getEmu() {
  return emu;
}

/**
 * clears the state
 */
function clearState() {
  if (emu) {
    emu.stop();
  }
  emu = undefined;
  emuState = undefined;
}

/**
 * handles `onmessage = (event) => {` messages in a webworker thread
 * This interface also includes the initialisation of the emulator (using `MESSAGE.initializeEmulator`)
 * Your webworker can look simple as
 *
 * const WebworkerInterface = require('./webworker');
 * onmessage = (event) => {
 *   WebworkerInterface.handleMessage(event);
 * };
 *
 * @param {*} event
 */
function handleMessage(event, postMessage) {
  if (!postMessage) {
    throw new Error('POSTMESSAGE_FUNCTION_UNDEFINED');
  }
  if (!event || !event.data || event.data.length < 2) {
    console.error('INVALID_PARAMETER_SIZE');
    postMessage({ message: MESSAGE.MSG_TYPE_ERROR, parameter: 'INVALID_PARAMETER_SIZE' });
    return;
  }
  const requestId = event.data[0];
  const message = event.data[1];
  const parameter = event.data[2];

  if (message === MESSAGE.initializeEmulator) {
    return WebworkerEmu.buildWpcInstance(parameter.romData, parameter.gameEntry)
      .then((_emu) => {
        if (emu) {
          emu.stop();
        }
        emu = _emu;
        emu.start();
        postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      })
      .catch((error) => {
        postMessage({ message: MESSAGE.MSG_TYPE_ERROR, parameter: error.message });
      });
  }

  if (!emu) {
    postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'EMU_NOT_INITIALIZED' });
    return;
  }

  switch (message) {

    case MESSAGE.resetEmulator:
      emu.reset();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.setCabinetInput:
      if (!Number.isInteger(parameter)) {
        return postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'INVALID_CABINET_INPUT_PARAMETER_' + parameter });
      }
      emu.setCabinetInput(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.setSwitchInput:
      emu.setSwitchInput(parameter, event.data.length > 3 ? event.data[3] : undefined);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.setFliptronicsInput:
      emu.setFliptronicsInput(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.toggleMidnightMadnessMode:
      emu.toggleMidnightMadnessMode();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.getVersion: {
      const version = emu.getVersion();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: version });
      break;
    }

    case MESSAGE.getEmulatorRomName: {
      const romName = emu.getEmulatorRomName();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: romName });
      break;
    }

    case MESSAGE.getEmulatorState: {
      const state = emu.getEmulatorState();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: state });
      break;
    }

    case MESSAGE.setEmulatorState:
      emu.setEmulatorState(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.registerAudioConsumer:
      emu.registerAudioConsumer((sampleId) => {
        postMessage({ message: MESSAGE.MSG_TYPE_AUDIO_CALLBACK, sampleId });
      });
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.getNextFrame:
      if (!emuState) {
        return postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'NEXT_FRAME_NOT_READY' });
      }
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId, parameter: { emuState } });
      emuState = undefined;
      break;

    case MESSAGE.configureFrameRate:
      emu.configureFramerate(parameter);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.pauseEmulator:
      emu.pause();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.resumeEmulator:
      emu.resume();
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    case MESSAGE.writeMemory:
      if (event.data.length < 4) {
        return postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'MISSING_PARAMETER' });
      }
      emu.writeMemory(parameter, event.data[3]);
      postMessage({ message: MESSAGE.MSG_TYPE_ACK, requestId });
      break;

    default:
      return postMessage({ message: MESSAGE.MSG_TYPE_ERROR, requestId, parameter: 'UNKNOWN_MESSAGE_' + message });
  }
}

