'use strict';

const initialiseEmulator = 'initialiseEmulator';
const resetEmulator = 'resetEmulator';
const setCabinetInput = 'setCabinetInput';
const setInput = 'setInput';
const setFliptronicsInput = 'setFliptronicsInput';
const toggleMidnightMadnessMode = 'toggleMidnightMadnessMode';
const getVersion = 'getVersion';
const getNextFrame = 'getNextFrame';

const setEmulatorState = 'setEmulatorState';
const getEmulatorState = 'getEmulatorState';
const getEmulatorRomName = 'getEmulatorRomName';

const MSG_TYPE_ACK = 'MSG_TYPE_ACK';
const MSG_TYPE_ERROR = 'MSG_TYPE_ERROR';

module.exports = {
  initialiseEmulator,
  resetEmulator,
  setCabinetInput,
  setInput,
  setFliptronicsInput,
  toggleMidnightMadnessMode,
  getVersion,
  getNextFrame,

  setEmulatorState,
  getEmulatorState,
  getEmulatorRomName,

  MSG_TYPE_ACK,
  MSG_TYPE_ERROR,
};
