'use strict';

const initialiseEmulator = 'initialiseEmulator';
const pauseEmulator = 'pauseEmulator';
const resumeEmulator = 'resumeEmulator';
const resetEmulator = 'resetEmulator';
const setCabinetInput = 'setCabinetInput';
const setInput = 'setInput';
const setFliptronicsInput = 'setFliptronicsInput';
const toggleMidnightMadnessMode = 'toggleMidnightMadnessMode';
const getVersion = 'getVersion';

const setEmulatorState = 'setEmulatorState';
const getEmulatorState = 'getEmulatorState';
const getEmulatorRomName = 'getEmulatorRomName';

const MSG_TYPE_ACK = 'MSG_TYPE_ACK';
const MSG_TYPE_ERROR = 'MSG_TYPE_ERROR';
const MSG_TYPE_UIDATA = 'MSG_TYPE_UIDATA';

module.exports = {
  initialiseEmulator,
  pauseEmulator,
  resumeEmulator,
  resetEmulator,
  setCabinetInput,
  setInput,
  setFliptronicsInput,
  toggleMidnightMadnessMode,
  getVersion,

  setEmulatorState,
  getEmulatorState,
  getEmulatorRomName,

  MSG_TYPE_ACK,
  MSG_TYPE_ERROR,
  MSG_TYPE_UIDATA,
};
