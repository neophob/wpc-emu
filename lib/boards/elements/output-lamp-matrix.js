'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:elements:outputLampMatrix');

module.exports = {
  getInstance,
};

function getInstance() {
  return new OutputLampMatrix();
}

const MATRIX_COLUMN_SIZE = 64;
const ALL_LAMPS_OFF = 0x00;

// TODO move to timing
const CALL_UPDATELAMP_AFTER_TICKS = 33334;

class OutputLampMatrix {
  constructor() {
    this.lampState = new Uint8Array(MATRIX_COLUMN_SIZE).fill(ALL_LAMPS_OFF);
    this.activeRow = 0;
    this.activeColumn = 0;
    this.ticks = 0;
  }

  _updateLampState() {
    if (this.activeColumn === 0) {
      return;
    }

    for (var i = 0; i < 8; i++) {
      if (this.activeRow & (1 << i)) {
        for (var j = 0; j < 8; j++) {
          if (this.activeColumn & (1 << j)) {
            this.lampState[(j << 3) | i] |= 0x80;
          }
        }
      }
    }
  }

  executeCycle(ticks) {
    this.ticks += ticks;
    // output lamp state @ 60hz
    if (this.ticks >= CALL_UPDATELAMP_AFTER_TICKS) {
      debug('update lamp state');
      this.ticks -= CALL_UPDATELAMP_AFTER_TICKS;
      for (var i = 0; i < MATRIX_COLUMN_SIZE; i++) {
        this.lampState[i] >>>= 1;
      }
    }
  }

  setActiveRow(activeRow) {
    this.activeRow = activeRow;
    debug('SET ACTIVE_ROW', this.activeRow);
    this._updateLampState();
  }

  setActiveColumn(activeColumn) {
    this.activeColumn = activeColumn;
    debug('SET ACTIVE_COLUMN', this.activeColumn);
    this._updateLampState();
  }
}
