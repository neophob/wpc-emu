'use strict';

const initialiseEmulator = 'initialiseEmulator';
const resetEmulator = 'resetEmulator';
const setCabinetInput = 'setCabinetInput';
const setInput = 'setInput';
const setFliptronicsInput = 'setFliptronicsInput';
const toggleMidnightMadnessMode = 'toggleMidnightMadnessMode';
const getVersion = 'getVersion';
const getNextFrame = 'getNextFrame';
const executeCycles = 'executeCycles';
const registerAudioConsumer = 'registerAudioConsumer';
const configureFrameRate = 'configureFrameRate';

const pauseEmulator = 'pauseEmulator';
const resumeEmulator = 'resumeEmulator';

const setEmulatorState = 'setEmulatorState';
const getEmulatorState = 'getEmulatorState';
const getEmulatorRomName = 'getEmulatorRomName';

const MSG_TYPE_ACK = 'MSG_TYPE_ACK';
const MSG_TYPE_ERROR = 'MSG_TYPE_ERROR';
const MSG_TYPE_AUDIO_CALLBACK = 'MSG_TYPE_AUDIO_CALLBACK';
const MSG_TYPE_UIDATA = 'MSG_TYPE_UIDATA';

module.exports = {
  initialiseEmulator,
  resetEmulator,
  setCabinetInput,
  setInput,
  setFliptronicsInput,
  toggleMidnightMadnessMode,
  getVersion,
  getNextFrame,
  executeCycles,
  registerAudioConsumer,
  configureFrameRate,

  pauseEmulator,
  resumeEmulator,

  setEmulatorState,
  getEmulatorState,
  getEmulatorRomName,

  MSG_TYPE_ACK,
  MSG_TYPE_ERROR,
  MSG_TYPE_AUDIO_CALLBACK,
  MSG_TYPE_UIDATA,
};
