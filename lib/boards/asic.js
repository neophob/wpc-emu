/**
 * All read/write requests from the CPU are first seen by the ASIC, which can
 * then either respond to it directly if it is an internal function, or forward
 * the request to another device
 * this file emulates the ASIC CHIP
 */

const debug = require('debug')('wpcemu:boards:asic');
const timing = require('./static/timing');
const dipSwitchCountry = require('./static/dipswitch-country');
const inputSwitchMatrix = require('./elements/input-switch-matrix');
const outputLampMatrix = require('./elements/output-lamp-matrix');
const outputSolenoidMatrix = require('./elements/output-solenoid-matrix');
const outputGeneralIllumination = require('./elements/output-general-illumination');
const memoryProtection = require('./elements/memory-protection');
const securityPic = require('./up/security-pic');

const OP = {
  WPC_FLIPTRONICS_FLIPPER_PORT_A: 0x3FD4,

  WPC_SOLENOID_GEN_OUTPUT: 0x3FE0,
  WPC_SOLENOID_HIGHPOWER_OUTPUT: 0x3FE1,
  WPC_SOLENOID_FLASH1_OUTPUT: 0x3FE2,
  WPC_SOLENOID_LOWPOWER_OUTPUT: 0x3FE3,
  WPC_LAMP_ROW_OUTPUT: 0x3FE4,
  WPC_LAMP_COL_STROBE: 0x3FE5,
  WPC_GI_TRIAC: 0x3FE6,
  WPC_SW_JUMPER_INPUT: 0x3FE7,
  WPC_SWITCH_CABINET_INPUT: 0x3FE8,

  //PRE SECURITY PIC
  WPC_SWITCH_ROW_SELECT: 0x3FE9,
  WPC_SWITCH_COL_SELECT: 0x3FEA,

  //SECURITY PIC
  WPC_PICREAD: 0x3FE9,
  WPC_PICWRITE: 0x3FEA,

  WPC_EXTBOARD1: 0x3FEB,
  WPC_EXTBOARD2: 0x3FEC,
  WPC_EXTBOARD3: 0x3FED,
  //aka WPC_EXTBOARD4
  WPC95_FLIPPER_COIL_OUTPUT: 0x3FEE,
  //aka WPC_EXTBOARD5
  WPC95_FLIPPER_SWITCH_INPUT: 0x3FEF,

  WPC_LEDS: 0x3FF2,
  WPC_RAM_BANK: 0x3FF3,
  WPC_SHIFTADDRH: 0x3FF4,
  WPC_SHIFTADDRL: 0x3FF5,
  WPC_SHIFTBIT: 0x3FF6,
  WPC_SHIFTBIT2: 0x3FF7,
  WPC_PERIPHERAL_TIMER_FIRQ_CLEAR: 0x3FF8,
  WPC_ROM_LOCK: 0x3FF9,

  WPC_CLK_HOURS_DAYS: 0x3FFA,
  WPC_CLK_MINS: 0x3FFB,
  WPC_ROM_BANK: 0x3FFC,

  //WPC_PROTMEM
  WPC_RAM_LOCK: 0x3FFD,

  //WPC_PROTMEMCTRL - aka CLOCK CHANGE
  WPC_RAM_LOCKSIZE: 0x3FFE,
  WPC_ZEROCROSS_IRQ_CLEAR: 0x3FFF,
};

const REVERSEOP = [];
Object.keys(OP).forEach((key) => {
  REVERSEOP[OP[key]] = key;
});

const PAGESIZE_MAP = [0x00, 0x07, 0x0F, 0x00, 0x1F, 0x00, 0x00, 0x00, 0x3F];
const WPC_PROTECTED_MEMORY_UNLOCK_VALUE = 0xB4;

const NVRAM_CLOCK_YEAR_HI = 0x1800;
const NVRAM_CLOCK_YEAR_LO = 0x1801;
const NVRAM_CLOCK_MONTH = 0x1802;
const NVRAM_CLOCK_DAY_OF_MONTH = 0x1803;
const NVRAM_CLOCK_DAY_OF_WEEK = 0x1804;
const NVRAM_CLOCK_HOUR = 0x1805;
const NVRAM_CLOCK_IS_VALID = 0x1806;
const NVRAM_CLOCK_CHECKSUM_TIME = 0x1807;
const NVRAM_CLOCK_CHECKSUM_DATE = 0x1808;

const WPC_ZC_BLANK_RESET = 0x02;
const WPC_ZC_WATCHDOG_RESET = 0x04;
const WPC_ZC_IRQ_ENABLE = 0x10;
const WPC_ZC_IRQ_CLEAR = 0x80;

const WPC_FIRQ_CLEAR_BIT = 0x80;

const MIDNIGHT_MADNESS_TIME = new Date('December 17, 1995 23:59:45').getTime();

module.exports = {
  getInstance,
  OP,
};

function getInstance(initObject) {
  return new CpuBoardAsic(initObject);
}

// The ASIC generates the reset, IRQ, and FIRQ signals which are sent to the CPU.
class CpuBoardAsic {
  constructor(initObject) {
    this.interruptCallback = initObject.interruptCallback;
    this.pageMask = PAGESIZE_MAP[initObject.romSizeMBit];
    if (this.pageMask === 0) {
      throw new Error('PAGEMASK_EMPTY');
    }
    debug('pageMask calculated %o', { pageMask: this.pageMask, romSizeMBit: initObject.romSizeMBit });
    this.ram = initObject.ram;
    this.hardwareHasSecurityPic = initObject.romObject && initObject.romObject.hasSecurityPic;

    this.inputSwitchMatrix = inputSwitchMatrix.getInstance();
    this.outputLampMatrix = outputLampMatrix.getInstance(timing.CALL_UPDATELAMP_AFTER_TICKS);
    this.outputSolenoidMatrix = outputSolenoidMatrix.getInstance(timing.CALL_UPDATESOLENOID_AFTER_TICKS);

    const isWpc95 = initObject.romObject && initObject.romObject.wpc95;
    this.outputGeneralIllumination = outputGeneralIllumination.getInstance(isWpc95);
    this.securityPic = securityPic.getInstance();
    this.periodicIRQTimerEnabled = true;
    this.romBank = 0;
    this.diagnosticLedToggleCount = 0;
    this.oldDiagnostigLedState = 0;
    this._firqSourceDmd = false;
    this.irqCountGI = 0;
    this.zeroCrossFlag = 0;
    this.ticksZeroCross = 0;
    this.memoryProtectionMask = null;
    this.midnightMadnessMode = Date.now();
    this.midnightModeEnabled = false;
    this.blankSignalHigh = true;
    this.watchdogTicks = 0;
    this.watchdogExpiredCounter = 0;
    this.dipSwitchSetting = dipSwitchCountry.USA;
  }

  reset() {
    console.log('RESET_ASIC');
    this.periodicIRQTimerEnabled = true;
    this.romBank = 0;
    this.diagnosticLedToggleCount = 0;
    this.oldDiagnostigLedState = 0;
    this._firqSourceDmd = false;
    this.irqCountGI = 0;
    this.zeroCrossFlag = 0;
    this.ticksZeroCross = 0;
    this.memoryProtectionMask = null;
    if (this.hardwareHasSecurityPic) {
      this.securityPic.reset();
    }
    this.midnightMadnessMode = Date.now();
    this.midnightModeEnabled = false;
    this.blankSignalHigh = true;
    this.watchdogTicks = timing.WATCHDOG_ARMED_FOR_TICKS;
    this.watchdogExpiredCounter = 0;
  }

  getState() {
    let time = this.getTime().toTimeString().split(' ')[0];
    if (this.midnightModeEnabled) {
      time += ' MM!';
    }
    return {
      diagnosticLed: this.ram[OP.WPC_LEDS],
      lampState: this.outputLampMatrix.lampState,
      lampRow: this.outputLampMatrix.activeRow,
      lampColumn: this.outputLampMatrix.activeColumn,
      solenoidState: this.outputSolenoidMatrix.solenoidState,
      generalIlluminationState: this.outputGeneralIllumination.getNormalizedState(),
      inputState: this.inputSwitchMatrix.switchState,
      inputSwitchMatrixActiveColumn: this.inputSwitchMatrix.activeColumn,
      diagnosticLedToggleCount: this.diagnosticLedToggleCount,
      irqEnabled: this.periodicIRQTimerEnabled,
      activeRomBank: this.romBank,
      zeroCrossFlag: this.zeroCrossFlag,
      ticksZeroCross: this.ticksZeroCross,
      memoryProtectionMask: this.memoryProtectionMask,
      firqSourceDmd: this._firqSourceDmd,
      irqCountGI: this.irqCountGI,
      midnightModeEnabled: this.midnightModeEnabled,
      time,
      blankSignalHigh: this.blankSignalHigh,
      watchdogExpiredCounter: this.watchdogExpiredCounter,
      watchdogTicks: this.watchdogTicks,
      wpcSecureScrambler: this.securityPic.getScrambler()
    };
  }

  setState(wpcState) {
    if (!wpcState) {
      return false;
    }
    this.inputSwitchMatrix.activeColumn = wpcState.inputSwitchMatrixActiveColumn;
    this.diagnosticLedToggleCount = wpcState.diagnosticLedToggleCount;
    this.periodicIRQTimerEnabled = wpcState.irqEnabled;
    this.romBank = wpcState.activeRomBank;
    this.zeroCrossFlag = wpcState.zeroCrossFlag;
    this.ticksZeroCross = wpcState.ticksZeroCross;
    this.memoryProtectionMask = wpcState.memoryProtectionMask;
    this._firqSourceDmd = wpcState.firqSourceDmd;
    this.irqCountGI = wpcState.irqCountGI;
    this.midnightModeEnabled = wpcState.midnightModeEnabled;
    this.blankSignalHigh = wpcState.blankSignalHigh === true;
    this.watchdogExpiredCounter = wpcState.watchdogExpiredCounter;
    if (typeof wpcState.lampState === 'object') {
      this.outputLampMatrix.lampState = Uint8Array.from(wpcState.lampState);
    }
    if (typeof wpcState.solenoidState === 'object') {
      this.outputSolenoidMatrix.solenoidState = Uint8Array.from(wpcState.solenoidState);
    }
    if (typeof wpcState.generalIlluminationState === 'object') {
      this.outputGeneralIllumination.generalIlluminationState = Uint8Array.from(wpcState.generalIlluminationState);
    }
    if (typeof wpcState.inputState === 'object') {
      this.inputSwitchMatrix.switchState = Uint8Array.from(wpcState.inputState);
    }
  }

  setZeroCrossFlag() {
    debug('SET_ZEROCROSS_FLAG');
    this.zeroCrossFlag = 0x01;
  }

  setCabinetInput(value) {
    debug('setCabinetInput', value);
    this.inputSwitchMatrix.setCabinetKey(value & 0xFF);
  }

  setSwitchInput(switchNr, optionalValue) {
    debug('setSwitchInput', switchNr, optionalValue);
    this.inputSwitchMatrix.setInputKey(switchNr & 0xFF, optionalValue);
  }

  setFliptronicsInput(value, optionalValue) {
    this.inputSwitchMatrix.setFliptronicsInput(value, optionalValue);
  }

  firqSourceDmd(fromDmd) {
    debug('firqSourceDmd', fromDmd);
    this._firqSourceDmd = fromDmd === true;
  }

  toggleMidnightMadnessMode() {
    this.midnightMadnessMode = Date.now();
    this.midnightModeEnabled = !this.midnightModeEnabled;
  }

  setDipSwitchByte(dipSwitch) {
    debug('setDipSwitchByte', dipSwitch);
    this.dipSwitchSetting = dipSwitch;
  }

  getDipSwitchByte() {
    return this.dipSwitchSetting;
  }

  executeCycle(ticksExecuted) {
    this.ticksZeroCross += ticksExecuted;
    if (this.ticksZeroCross >= timing.CALL_ZEROCLEAR_AFTER_TICKS) {
      this.ticksZeroCross -= timing.CALL_ZEROCLEAR_AFTER_TICKS;
      this.setZeroCrossFlag();
    }

    this.watchdogTicks -= ticksExecuted;
    //debug('this.watchdogTicks', this.watchdogTicks)
    if (this.watchdogTicks < 0) {
      debug('WATCHDOG_EXPIRED', this.watchdogTicks);
      this.watchdogTicks = timing.WATCHDOG_ARMED_FOR_TICKS;
      this.watchdogExpiredCounter++;
    }

    this.outputLampMatrix.executeCycle(ticksExecuted);
    this.outputSolenoidMatrix.executeCycle(ticksExecuted);
  }

  isMemoryProtectionEnabled() {
    return this.ram[OP.WPC_RAM_LOCK] === WPC_PROTECTED_MEMORY_UNLOCK_VALUE;
  }

  getTime() {
    if (!this.midnightModeEnabled) {
      return new Date();
    }
    return new Date(MIDNIGHT_MADNESS_TIME + Date.now() - this.midnightMadnessMode);
  }

  write(offset, value) {
    this.ram[offset] = value;

    switch (offset) {
      // save value and bail out
      case OP.WPC_RAM_LOCK:
      case OP.WPC_RAM_BANK:
      case OP.WPC_CLK_HOURS_DAYS:
      case OP.WPC_CLK_MINS:
      case OP.WPC_SHIFTADDRH:
      case OP.WPC_SHIFTADDRL:
      case OP.WPC_SHIFTBIT:
      case OP.WPC_SHIFTBIT2:
      case OP.WPC_ROM_LOCK:
      case OP.WPC_EXTBOARD1:
      case OP.WPC_EXTBOARD2:
      case OP.WPC_EXTBOARD3:
        debug('WRITE', REVERSEOP[offset], value);
        break;

      case OP.WPC95_FLIPPER_COIL_OUTPUT:
        debug('WRITE', REVERSEOP[offset], value);
        this.outputSolenoidMatrix.writeFliptronic((value) & 0xFF);
        break;

      case OP.WPC95_FLIPPER_SWITCH_INPUT:
      case OP.WPC_FLIPTRONICS_FLIPPER_PORT_A:
        debug('WRITE', REVERSEOP[offset], value);
        this.outputSolenoidMatrix.writeFliptronic((~value) & 0xFF);
        break;

      case OP.WPC_RAM_LOCKSIZE:
        if (this.isMemoryProtectionEnabled()) {
          this.memoryProtectionMask = memoryProtection.getMemoryProtectionMask(value);
          debug('UPDATED_MEMORY_PROTECTION_MASK', this.memoryProtectionMask);
        } else {
          debug('MEMORY_PROTECTION_DISABLED', value);
        }
        break;

      case OP.WPC_SWITCH_COL_SELECT:
        debug('WRITE', REVERSEOP[offset], value);
        if (this.hardwareHasSecurityPic) {
          return this.securityPic.write(value);
        }
        this.inputSwitchMatrix.setActiveColumn(value);
        break;

      case OP.WPC_GI_TRIAC:
        debug('WRITE', REVERSEOP[offset], value);
        this.outputGeneralIllumination.update(value, this.irqCountGI);
        break;

      case OP.WPC_LAMP_ROW_OUTPUT:
        debug('WRITE', REVERSEOP[offset], value);
        this.outputLampMatrix.setActiveRow(value);
        break;

      case OP.WPC_LAMP_COL_STROBE:
        debug('WRITE', REVERSEOP[offset], value);
        this.outputLampMatrix.setActiveColumn(value);
        break;

      case OP.WPC_PERIPHERAL_TIMER_FIRQ_CLEAR:
        debug('WRITE', REVERSEOP[offset], { _firqSourceDmd: this._firqSourceDmd, value });
        this._firqSourceDmd = false;
        break;

      case OP.WPC_SOLENOID_GEN_OUTPUT:
      case OP.WPC_SOLENOID_HIGHPOWER_OUTPUT:
      case OP.WPC_SOLENOID_FLASH1_OUTPUT:
      case OP.WPC_SOLENOID_LOWPOWER_OUTPUT:
        debug('WRITE', REVERSEOP[offset], value);
        this.outputSolenoidMatrix.write(offset, value);
        break;

      case OP.WPC_LEDS:
        debug('WRITE', REVERSEOP[offset], value);
        if (value !== this.oldDiagnostigLedState) {
          debug('DIAGNOSTIC_LED_TOGGLE', this.oldDiagnostigLedState, value);
          this.diagnosticLedToggleCount++;
          this.oldDiagnostigLedState = value;
        }
        break;

      case OP.WPC_ROM_BANK: {
        const bank = value & this.pageMask;
        debug('SELECT WPC_ROM_BANK', { value, bank });
        // only 6 bits
        this.romBank = bank;
        break;
      }

      case OP.WPC_ZEROCROSS_IRQ_CLEAR: {
        //debug('WRITE', REVERSEOP[offset], value);

        if (value & WPC_ZC_WATCHDOG_RESET) {
          // the watchdog will be tickled every 1ms by the IRQ (or after 2049 ticks)
          this.watchdogTicks = timing.WATCHDOG_ARMED_FOR_TICKS;
          debug('WPC_ZC_WATCHDOG_RESET: RESET WATCHDOG', this.watchdogTicks);
        }

        if (this.blankSignalHigh && value & WPC_ZC_BLANK_RESET) {
          // like the watchdog, blanking is reset regulary
          debug('CLEAR_BLANKING_SIGNAL');
          this.blankSignalHigh = false;
        }

        if (value & WPC_ZC_IRQ_CLEAR) {
          debug('WRITE WPC_ZEROCROSS_IRQ_CLEAR', value);
          //Increment irq count - This is the best way to know an IRQ was serviced as this register is written immediately during the IRQ code.
          this.irqCountGI++;
          //TODO cpu_set_irq_line(WPC_CPUNO, M6809_IRQ_LINE, CLEAR_LINE); ??
        }

        const timerEnabled = (value & WPC_ZC_IRQ_ENABLE) > 0;
        if (timerEnabled !== this.periodicIRQTimerEnabled) {
          debug('WRITE WPC_ZEROCROSS_IRQ_CLEAR periodic timer changed', value);
          //The periodic interrupt can be disabled/enabled by writing to the ASIC's WPC_ZEROCROSS_IRQ_CLEAR register.
          this.periodicIRQTimerEnabled = timerEnabled;
        }

        break;
      }

      default:
        debug('W_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        console.log('ASIC_WRITE_NOT_IMPLEMENTED', '0x' + offset.toString(16), value);
        break;
    }
  }

  read(offset) {
    let temp;
    switch (offset) {
      case OP.WPC_LEDS:
      case OP.WPC_RAM_BANK:
      case OP.WPC_ROM_LOCK:
      case OP.WPC_EXTBOARD1:
      case OP.WPC_EXTBOARD2:
      case OP.WPC_EXTBOARD3:
        debug('READ', REVERSEOP[offset], this.ram[offset]);
        return this.ram[offset];

      case OP.WPC95_FLIPPER_COIL_OUTPUT:
      case OP.WPC95_FLIPPER_SWITCH_INPUT:
      case OP.WPC_FLIPTRONICS_FLIPPER_PORT_A:
        debug('READ', REVERSEOP[offset]);
        return this.inputSwitchMatrix.getFliptronicsKeys();

      case OP.WPC_RAM_LOCK:
      case OP.WPC_RAM_LOCKSIZE:
        debug('READ', REVERSEOP[offset], this.ram[offset]);
        return this.ram[offset];

      case OP.WPC_SWITCH_CABINET_INPUT:
        debug('READ', REVERSEOP[offset]);
        return this.inputSwitchMatrix.getCabinetKey();

      case OP.WPC_ROM_BANK:
        debug('READ', REVERSEOP[offset], this.ram[offset]);
        return this.ram[offset] & this.pageMask;

      case OP.WPC_SWITCH_ROW_SELECT:
        debug('READ', REVERSEOP[offset]);
        if (this.hardwareHasSecurityPic) {
          return this.securityPic.read((col) => {
            return this.inputSwitchMatrix.getRow(col);
          });
        }
        return this.inputSwitchMatrix.getActiveRow();

      case OP.WPC_SHIFTADDRH:
        temp = (this.ram[OP.WPC_SHIFTADDRH] +
                ((this.ram[OP.WPC_SHIFTADDRL] + (this.ram[OP.WPC_SHIFTBIT] >>> 3)) >>> 8)
               ) & 0xFF;
        debug('READ', REVERSEOP[offset], temp);
        return temp;
      case OP.WPC_SHIFTADDRL:
        temp = (this.ram[OP.WPC_SHIFTADDRL] + (this.ram[OP.WPC_SHIFTBIT] >>> 3)) & 0xFF;
        debug('READ', REVERSEOP[offset], temp);
        return temp;
      case OP.WPC_SHIFTBIT:
      case OP.WPC_SHIFTBIT2:
        debug('READ', REVERSEOP[offset], this.ram[offset]);
        return 1 << (this.ram[offset] & 0x07);

      case OP.WPC_CLK_HOURS_DAYS: {
        //temp = new Date();
        temp = this.getTime();

        debug('READ WPC_CLK_HOURS_DAYS');
        // checksum needs to be stored in RAM
        let checksum = 0;
        checksum += this.ram[NVRAM_CLOCK_YEAR_HI] = temp.getFullYear() >> 8;
        checksum += this.ram[NVRAM_CLOCK_YEAR_LO] = temp.getFullYear() & 0xFF;
        //month (1-12),
        checksum += this.ram[NVRAM_CLOCK_MONTH] = temp.getMonth() + 1;
        //day of month (1-31)
        checksum += this.ram[NVRAM_CLOCK_DAY_OF_MONTH] = temp.getDate();
        //day of the week (0-6, 0=Sunday)
        checksum += this.ram[NVRAM_CLOCK_DAY_OF_WEEK] = temp.getDay() + 1;
        //hour (0-23)
        checksum += this.ram[NVRAM_CLOCK_HOUR] = 0;
        //0 means invalid, 1 means valid
        checksum += this.ram[NVRAM_CLOCK_IS_VALID] = 1;
        checksum = 0xFFFF - checksum;
        this.ram[NVRAM_CLOCK_CHECKSUM_TIME] = checksum >> 8;
        this.ram[NVRAM_CLOCK_CHECKSUM_DATE] = checksum & 0xFF;
        return temp.getHours();
      }

      case OP.WPC_CLK_MINS:
        temp = this.getTime();
        debug('READ WPC_CLK_MINS');
        return temp.getMinutes();

      case OP.WPC_SW_JUMPER_INPUT:
        //SW1 SW2 W20 W19 Country(SW4-SW8)
        debug('READ WPC_SW_JUMPER_INPUT', this.dipSwitchSetting);
        return this.dipSwitchSetting;

      case OP.WPC_ZEROCROSS_IRQ_CLEAR:
        if (this.zeroCrossFlag) {
          debug('RESET GI ZC COUNT');
          this.irqCountGI = 0;
        }
        temp = this.zeroCrossFlag << 7 | (this.ram[offset] & 0x7F);
        debug('READ WPC_ZEROCROSS_IRQ_CLEAR', temp, this.zeroCrossFlag ? 'ZCF_SET' : 'ZCF_NOTSET');
        this.zeroCrossFlag = 0;
        return temp;

      case OP.WPC_PERIPHERAL_TIMER_FIRQ_CLEAR:
        debug('READ WPC_PERIPHERAL_TIMER_FIRQ_CLEAR', this._firqSourceDmd);
        return this._firqSourceDmd === true ? 0x00 : WPC_FIRQ_CLEAR_BIT;

      default:
        debug('R_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.ram[offset]);
        console.log('ASIC_READ_NOT_IMPLEMENTED', '0x' + offset.toString(16), this.ram[offset]);
        return this.ram[offset];
    }
  }
}

/*

  wpcemu:boards:wpc W_NOT_IMPLEMENTED 0x3ff3 0 +57ms

Address	  Format	 Description
$3FE0     Byte     WPC_SOLENOID_GEN_OUTPUT (7-0: W: Enables for solenoids 25-29) or 25-28???
$3FE1     Byte     WPC_SOLENOID_HIGHPOWER_OUTPUT (7-0: W: Enables for solenoids 1-8)
$3FE2     Byte     WPC_SOLENOID_FLASH1_OUTPUT (7-0: W: Enables for solenoids 17-24)
$3FE3     Byte     WPC_SOLENOID_LOWPOWER_OUTPUT (7-0: W: Enables for solenoids 9-16)
$3FE4     Byte     WPC_LAMP_ROW_OUTPUT (7-0: W: Lamp matrix row output)
$3FE5     Byte     WPC_LAMP_COL_STROBE (7-0: W: Enables for solenoids 9-16)
                    7-0: W: Lamp matrix column strobe, At most one bit in this register should be set.
                    If all are clear, then no controlled lamps are enabled.
$3FE6     Byte     WPC_GI_TRIAC
                    7: W: Flipper enable relay
                    5: W: Coin door enable relay
                    4-0: W: General illumination enables
$3FE7     Byte     WPC_SW_JUMPER_INPUT (7-0: R: Jumper/DIP switch inputs)
$3FE8     Byte     WPC_SW_CABINET_INPUT
                    7: R: Fourth coin switch
                    6: R: Right coin switch
                    5: R: Center coin switch
                    4: R: Left coin switch
                    3: R: Enter (Begin Test) button
                    2: R: Up button
                    1: R: Down button
                    0: R: Escape (Service Credit) button
$3fe9     Byte     WPC_SW_ROW_INPUT
                    7-0: R: Readings for the currently selected switch column.
                    Bit 0 corresponds to row 1, bit 1 to row 2, and so on.
                    A '1' indicates active voltage level.  For a mechanical switch,
                    this means the switch is closed.  For an optical switch, this
                    means the switch is open.
$3fea     Byte     WPC_SW_COL_STROBE, W: Switch column enable
$3FEB     Byte     WPC_EXTBOARD1 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FEC     Byte     WPC_EXTBOARD2 (On DMD games, this is a general I/O that is used for machine-specific purposes)
$3FED     Byte     WPC_EXTBOARD3 (On DMD games, this is a general I/O that is used for machine-specific purposes)
0x3FF0             WPC_ASIC_BASE

$3FF2     Byte     WPC_LEDS (7: R/W: The state of the diagnostic LED. >0=Off >1=On)
                    - blink once, it indicates a problem with the CPU ROM
                    - blink twice, the game RAM is faulty, or, again, traces, etc
                    - blink thrice, there's a problem with the ASIC, or again, traces, etc.
$3FF3     Byte     WPC_RAM_BANK    :
$3FF4     Byte     WPC_SHIFTADDRH
$3FF5     Byte     WPC_SHIFTADDRL
                    15-0: R/W: The base address for the bit shifter.
                    Writing to this address initializes the shifter.
                    Reading from this address after a shift command returns the
                    shifted address.
$3FF6     Byte     WPC_SHIFTBIT
                    7-0: W: Sets the bit position for a shift command.
                    7-0: R: Returns the output of the last shift command as a bitmask.
$3FF7     Byte     WPC_SHIFTBIT2
$3FF8     Byte     WPC_PERIPHERAL_TIMER_FIRQ_CLEAR R: bit 7 0=DMD, 1=SOUND? W: Clear FIRQ line
$3FF9     Byte     WPC_ROM_LOCK
$3FFA	    Byte	   WPC_CLK_HOURS_DAYS (7-0: R/W: The time-of-day hour counter)
$3FFB	    Byte	   WPC_CLK_MINS (7-0: R/W: The time-of-day minute counter)
$3FFC	    Byte	   WPC_ROM_BANK (5-0: R/W)
                    5-0: R/W: The page of ROM currently mapped into the banked region (0x4000-0x7FFF).
                    Pages 62 and 63 correspond to the uppermost 32KB, and are not normally mapped
                    because those pages are accessible in the fixed region (0x8000-0xFFFF).
                    Page numbers are consecutive.  Page 0 corresponds to the lowest address in a
                    1MB device.  If a smaller ROM is installed, the uppermost bits of this register
                    are effectively ignored.
$3FFD     Byte     WPC_RAM_LOCK
$3FFE     Byte     WPC_RAM_LOCKSIZE
$3FFF     Byte     WPC_ZEROCROSS_IRQ_CLEAR aka WPC_WATCHDOG
                    7: R: Set to 1 when AC is currently at a zero crossing, or 0 otherwise.
                    7: W: Writing a 1 here clears the source of the periodic timer interrupt.
                    4: R/W: Periodic timer interrupt enable
                    >0=Periodic IRQ disabled
                    >1=Periodic IRQ enabled
                    2: W: Writing a 1 here resets the watchdog.
*/
