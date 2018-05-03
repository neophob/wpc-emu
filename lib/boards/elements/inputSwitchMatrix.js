'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:elements:inputSwitch');
const bitmagic = require('../bitmagic');

module.exports = {
  getInstance,
};

function getInstance() {
  return new InputSwitchMatrix();
}

//const INPUT_SLAM_TILT = 21;
//const INPUT_COIN_DOOR_CLOSED = 22;
//const INPUT_ALWAYS_CLOSED = 24;

const MATRIX_COLUMN_SIZE = 8;
const ALL_SWITCHES_OFF = 0x00;

class InputSwitchMatrix {
  constructor() {
    // cabinet input keys (ESCAPE/+/-/ENTER) are wired seperatly
    this.cabinetKeyState = ALL_SWITCHES_OFF;
    this.switchState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_SWITCHES_OFF);
    // There is ONE switch in all WPC games called "always closed" (always switch 24 on all WPC games).
    this.switchState[1] |= 0x08;
//    this.switchState[1] |= 0x0A;
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
  }

  getActiveRow() {
    const activeInputs = this.switchState[this.activeColumn];
    debug('GET ROW_STATE', activeInputs);
    //TODO if I return activeInputs t2 does not start the game
    //return activeInputs;
    return this.activeColumn;
  }

  getCabinetKey() {
    //TODO manually clear key? -> yes - but keys are debounced and need to be cleared after several reads?
    const key = this.cabinetKeyState;
    debug('GET CABINET_KEY', key);
    //this.cabinetKeyState = ALL_SWITCHES_OFF;
    return key;
  }

}
