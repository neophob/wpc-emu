'use strict';

const initializeEmulator = 'initializeEmulator';
const resetEmulator = 'resetEmulator';
const setCabinetInput = 'setCabinetInput';
const setSwitchInput = 'setSwitchInput';
const setFliptronicsInput = 'setFliptronicsInput';
const toggleMidnightMadnessMode = 'toggleMidnightMadnessMode';
const setDipSwitchByte = 'setDipSwitchByte';
const getDipSwitchByte = 'getDipSwitchByte';
const getVersion = 'getVersion';
const registerAudioConsumer = 'registerAudioConsumer';
const configureFrameRate = 'configureFrameRate';
const writeMemory = 'writeMemory';

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
  initializeEmulator,
  resetEmulator,
  setCabinetInput,
  setSwitchInput,
  setFliptronicsInput,
  toggleMidnightMadnessMode,
  setDipSwitchByte,
  getDipSwitchByte,
  getVersion,
  registerAudioConsumer,
  configureFrameRate,
  writeMemory,

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
