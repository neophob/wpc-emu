'use strict';

const debug = require('debug')('wpcemu:boards:elements:inputSwitchMatrix');
const bitmagic = require('./bitmagic');

module.exports = {
  getInstance,
};

function getInstance() {
  return new InputSwitchMatrix();
}

const INPUT_ALWAYS_CLOSED = 24;

const CABINET_KEY_RELEASE_TIME_MS = 100;
const MATRIX_COLUMN_SIZE = 10;
const ALL_SWITCHES_OFF = 0x00;

const CABINET_COLUMN = 0x00;
const FLIPTRONICS_COLUMN = 0x09;

class InputSwitchMatrix {
  constructor() {
    // cabinet input keys (ESCAPE/+/-/ENTER) are wired seperatly
    this.cabinetKeyState = ALL_SWITCHES_OFF;
    // keys are autoreleased after CABINET_KEY_RELEASE_TIME_MS
    this.cabinetKeyAutoreleaseTs = 0;
    // row 0 is used for the coin door inputs, so used array start with 1
    this.switchState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_SWITCHES_OFF);
    this.setInputKey(INPUT_ALWAYS_CLOSED);
    this.activeColumn = 0;
  }

  setActiveColumn(columnBitmask) {
    this.activeColumn = bitmagic.findMsbBit(columnBitmask);
    debug('SET ACTIVE_COLUMN', this.activeColumn);
  }

  setCabinetKey(keyValue) {
    console.log('SET CABINET_KEY', keyValue);
    debug('SET CABINET_KEY', keyValue);
    this.switchState[CABINET_COLUMN] = keyValue;
    this.cabinetKeyAutoreleaseTs = Date.now();
  }

  getCabinetKey() {
    const cabinetKeyReleased = (Date.now() - this.cabinetKeyAutoreleaseTs) > CABINET_KEY_RELEASE_TIME_MS;
    if (cabinetKeyReleased) {
      this.switchState[CABINET_COLUMN] = ALL_SWITCHES_OFF;
    }
    debug('GET CABINET_KEY', this.cabinetKeyState);
    return this.switchState[CABINET_COLUMN];
  }

  setFliptronicsInput(value) {
    const hasValidTypeAndLength = typeof value === 'string' && value.length === 2;
    if (!hasValidTypeAndLength || value[0] !== 'F') {
      console.log('INVALID_FLIPTRONICS_INPUT_VALUE_' + value);
      return;
    }
    const column = value[1] - 1;
    debug('setFliptronicsInput', value);
    console.log('setFliptronicsInput', value);
    this.switchState[FLIPTRONICS_COLUMN] ^= bitmagic.setMsbBit(column);
  }

  // Input format is ROW/COLUMN, for example 13 means ROW 1, COLUMN 3 -> start button
  // Valid input numbers range from 11..88, keys are toggled
  setInputKey(keyValue = 0) {
    if (!Number.isInteger(keyValue) || keyValue < 11 || keyValue > 95) {
      console.log('INVALID INPUT_KEY', keyValue);
      debug('INVALID INPUT_KEY', keyValue);
      return;
    }
    const normalizedKeyValue = keyValue - 1;
    const row = parseInt(normalizedKeyValue / 10, 10);
    const column = parseInt(normalizedKeyValue % 10, 10);
    debug('SET INPUT_KEY', row, column);
    // toggle state
    this.switchState[row] ^= bitmagic.setMsbBit(column);
    // There is ONE switch in all WPC games called "always closed" (always switch 24 on all WPC games).
    this.switchState[2] |= 0x08;
  }

  getActiveRow() {
    debug('GET ROW_STATE');
    return this.switchState[this.activeColumn];
  }

  getRow(number) {
    debug('GET ROW_STATE');
    return this.switchState[number];
  }

  getFliptronicsKeys() {
    return ((~this.switchState[FLIPTRONICS_COLUMN]) & 0xFF);
  }

  clearInputKeys() {
    this.cabinetKeyState = ALL_SWITCHES_OFF;
    this.switchState.fill(ALL_SWITCHES_OFF);
  }

}
