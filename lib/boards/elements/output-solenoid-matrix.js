const debug = require('debug')('wpcemu:boards:elements:outputSolenoidMatrix');

/*
All versions of the power driver board support 28 controlled outputs for
solenoids, motors, etc.  These are divided into four groups:
8 high power drivers, 8 low power drivers, 8 flashlamp drivers, and
4 general purpose drivers.  Each bank operates at a different voltage,
somewhere between 20V and 50V.

The CPU board enables/disable a driver by writing a command to the
power driver board.  All values are latched on the driver board and thus
retain their states until the CPU changes them.  The latches are not
readable, so software must maintain the last value written in RAM.
A CPU board reset will assert a blanking signal to reset the latches;
this helps in the event of a software crash.

TODO On WPC-95, 4 additional low voltage outputs running at 5V are added
to the general purpose group, which can be used for miscellaneous I/O
like small DC motors.

$3FE0     Byte     WPC_SOLENOID_GEN_OUTPUT (7-0: W: Enables for solenoids 25-29) or 25-28???
$3FE1     Byte     WPC_SOLENOID_HIGHPOWER_OUTPUT (7-0: W: Enables for solenoids 1-8)
$3FE2     Byte     WPC_SOLENOID_FLASH1_OUTPUT (7-0: W: Enables for solenoids 17-28)
$3FE3     Byte     WPC_SOLENOID_LOWPOWER_OUTPUT (7-0: W: Enables for solenoids 9-16)
*/

module.exports = {
  getInstance,
};

function getInstance(updateAfterTicks) {
  return new OutputSolenoidMatrix(updateAfterTicks);
}

const NUMBER_OF_SOLENOIDS = 40;
const ALL_SOLENOID_OFF = 0x00;

const WPC_SOLENOID_GEN_OUTPUT = 0x3FE0;
const WPC_SOLENOID_HIGHPOWER_OUTPUT = 0x3FE1;
const WPC_SOLENOID_FLASH1_OUTPUT = 0x3FE2;
const WPC_SOLENOID_LOWPOWER_OUTPUT = 0x3FE3;

const OFFSET_SOLENOID_HIGHPOWER = 0;
const OFFSET_SOLENOID_LOWPOWER = 8;
const OFFSET_SOLENOID_FLASHLIGHT = 16;
const OFFSET_SOLENOID_GENERIC = 24;
const OFFSET_SOLENOID_FLIPTRONIC = 32;

class OutputSolenoidMatrix {
  constructor(updateAfterTicks) {
    if (!updateAfterTicks) {
      throw new Error('MISSING_UPDATE_AFTER_TICKS');
    }
    this.updateAfterTicks = updateAfterTicks;
    this.solenoidState = new Uint8Array(NUMBER_OF_SOLENOIDS).fill(ALL_SOLENOID_OFF);
    this.ticks = 0;
  }

  _updateSolenoidsPacked(offset, value) {
    for (let i = 0; i < 8; i++) {
      if (value & (1 << i)) {
        this.solenoidState[offset + i] = 0xFF;
      }
    }
  }

  executeCycle(ticks) {
    this.ticks += ticks;
    // output solenoids state @ 60hz/8 - TODO
    if (this.ticks >= this.updateAfterTicks) {
      debug('update solenoids state');
      this.ticks -= this.updateAfterTicks;
      this.solenoidState = this.solenoidState
        .map((state) => state >>> 1);
    }
  }

  writeFliptronic(byteValue) {
    debug('UPDATE_FLIPPER_SOLENOIDS');
    return this._updateSolenoidsPacked(OFFSET_SOLENOID_FLIPTRONIC, byteValue);
  }

  write(sourceAddress, value) {
    if (value < 0 || value > 0xFF) {
      throw new Error('SOLENOID_MATRIX_INVALID_VALUE_' + value);
    }
    switch (sourceAddress) {
      case WPC_SOLENOID_HIGHPOWER_OUTPUT:
        return this._updateSolenoidsPacked(OFFSET_SOLENOID_HIGHPOWER, value);
      case WPC_SOLENOID_LOWPOWER_OUTPUT:
        return this._updateSolenoidsPacked(OFFSET_SOLENOID_LOWPOWER, value);
      case WPC_SOLENOID_FLASH1_OUTPUT:
        return this._updateSolenoidsPacked(OFFSET_SOLENOID_FLASHLIGHT, value);
      case WPC_SOLENOID_GEN_OUTPUT:
        return this._updateSolenoidsPacked(OFFSET_SOLENOID_GENERIC, value);
      default:
        throw new Error('SOLENOID_MATRIX_INVALID_OFFSET_' + sourceAddress.toString(16));
    }
  }
}
