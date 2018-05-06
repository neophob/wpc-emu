'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:elements:inputSwitchMatrix');
const bitmagic = require('../bitmagic');

module.exports = {
  getInstance,
};

function getInstance() {
  return new InputSwitchMatrix();
}

//const INPUT_SLAM_TILT = 21;
//const INPUT_ALWAYS_CLOSED = 24;

// NOTE if coin door is closed, test menu cannot be used!
//const INPUT_COIN_DOOR_CLOSED = 22;

const CABINET_KEY_RELEASE_TIME_MS = 100;
const MATRIX_COLUMN_SIZE = 8;
const ALL_SWITCHES_OFF = 0x00;

class InputSwitchMatrix {
  constructor() {
    // cabinet input keys (ESCAPE/+/-/ENTER) are wired seperatly
    this.cabinetKeyState = ALL_SWITCHES_OFF;
    // keys are autoreleased after CABINET_KEY_RELEASE_TIME_MS
    this.cabinetAutoreleaseTs = 0;
    // row 0 *seems* to be used for the coin door inputs, so used array start with 1
    this.switchState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_SWITCHES_OFF);
    //this.setInputKey(INPUT_COIN_DOOR_CLOSED);
    this.activeColumn = 0;
  }

  setActiveColumn(columnBitmask) {
    this.activeColumn = bitmagic.findMsbBit(columnBitmask);
    debug('SET ACTIVE_COLUMN', this.activeColumn);
  }

  setCabinetKey(keyValue) {
    console.log('SET CABINET_KEY', keyValue);
    debug('SET CABINET_KEY', keyValue);
    this.cabinetKeyState = keyValue;
    this.cabinetAutoreleaseTs = Date.now();
  }

  getCabinetKey() {
    const cabinetKeyReleased = (Date.now() - this.cabinetAutoreleaseTs) > CABINET_KEY_RELEASE_TIME_MS;
    if (cabinetKeyReleased) {
      return ALL_SWITCHES_OFF;
    }
    debug('GET CABINET_KEY', this.cabinetKeyState);
    return this.cabinetKeyState;
  }

  // Input format is ROW/COLUMN, for example 13 means ROW 1, COLUMN 13 -> start button
  // Valid input numbers range from 11..88
  // TODO how to release keys? add release key?
  setInputKey(keyValue = 0) {
    console.log('SET INPUT', keyValue);
    if (!Number.isInteger(keyValue) || keyValue < 11 || keyValue > 88) {
      console.log('INVALID INPUT_KEY', keyValue);
      debug('INVALID INPUT_KEY', keyValue);
      return;
    }
    const normalizedKeyValue = keyValue - 1;
    const row = parseInt(normalizedKeyValue / 10);
    const column = parseInt(normalizedKeyValue % 10);
    debug('SET INPUT_KEY', row, column);
    // toggle state
    this.switchState[row] ^= bitmagic.setMsbBit(column);
  }

  getActiveRow() {
    const activeInputs = this.switchState[this.activeColumn];
    debug('GET ROW_STATE', activeInputs);
    if (this.activeColumn === 2) {
      // There is ONE switch in all WPC games called "always closed" (always switch 24 on all WPC games).
      return activeInputs | 0x08;
    }
    return activeInputs;
  }

  clearInputKeys() {
    this.cabinetKeyState = ALL_SWITCHES_OFF;
    this.switchState.fill(ALL_SWITCHES_OFF);
  }

}
