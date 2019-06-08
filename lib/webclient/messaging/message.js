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

//TODO
const setEmulatorState = 'setEmulatorState';
const getEmulatorState = 'getEmulatorState';
const getEmulatorRomName = 'getEmulatorRomName';

const ACK = 'ACK';
const ERROR = 'ERROR';

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

  ACK,
  ERROR,
};