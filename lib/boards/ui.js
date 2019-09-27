'use strict';

const bcd = require('./memory/bcd');

module.exports = {
  getInstance,
};

const DMD_PAGE_SIZE = 0x200;
const MAXIMAL_STRING_LENGTH = 32;

const ENCODING_BCD = 'bcd';
const ENCODING_STRING = 'string';
const ENCODING_UINT8 = 'uint8';
const SUPPORTED_ENCODINGS = [ ENCODING_STRING, ENCODING_UINT8, ENCODING_BCD ];

function getInstance(memoryPosition) {
  return new UiState(memoryPosition);
}

class UiState {
  constructor(memoryPosition) {
    this.memoryPosition = undefined;
    if (memoryPosition && memoryPosition.knownValues) {
      this.memoryPosition = memoryPosition.knownValues
        .filter((entry) => {
          return Number.isInteger(entry.offset) && SUPPORTED_ENCODINGS.includes(entry.type);
        });
    }

    this.oldState = {
      videoRam: [],
      dmdShadedBuffer: [],
      lampState: [],
      solenoidState: [],
      inputState: [],
    };
    this.videoRam = [];
  }

  getVideoRamDiff(videoMemory) {
    let changedFrames = false;
    for (let i = 0; i < 16; i++) {
      const tempDmdFrame = videoMemory.slice(i * DMD_PAGE_SIZE, (i + 1) * DMD_PAGE_SIZE);
      const changedFrame = this.oldState.videoRam[i] ?
        !UiState.arraysEqual(tempDmdFrame, this.oldState.videoRam[i]) :
        true;

      if (changedFrame) {
        changedFrames = true;
        this.videoRam[i] = tempDmdFrame;
        this.oldState.videoRam[i] = Uint8Array.from(tempDmdFrame);
      }
    }
    return changedFrames;
  }

  static arraysEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (!a || !b || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  parseMemoryPosition(ram) {
    if (!this.memoryPosition) {
      return;
    }
    return this.memoryPosition
      .map((entry) => {
        switch (entry.type) {
          case ENCODING_UINT8:
            const length = entry.length || 1;
            if (length === 1) {
              entry.value = ram[entry.offset];
            } else {
              entry.value = 0;
              for (let n = 0; n < length; n++) {
                const shl = (length - n - 1) * 8;
                entry.value += (ram[entry.offset + n] << shl);
              }
            }
            break;

          case ENCODING_STRING:
            let offset = entry.offset;
            let dump = '';
            while (ram[offset] > 31 && ram[offset] < 128 && dump.length < MAXIMAL_STRING_LENGTH) {
              dump += String.fromCharCode(ram[offset++]);
            }
            entry.value = dump;
            break;

          case ENCODING_BCD:
            const bcdLength = entry.length || 2;
            const number = bcd.toNumber(ram.subarray(entry.offset, entry.offset + bcdLength), bcdLength);
            entry.value = number;
            break;

          default:
            entry.value = 'TYPE_INVALID';
        }
        return entry;
      });
  }

  getChangedAsicState(state) {
    const dmdShadedBufferChanged = !UiState.arraysEqual(state.display.dmdShadedBuffer, this.oldState.dmdShadedBuffer);
    const lampStateChanged = !UiState.arraysEqual(state.wpc.lampState, this.oldState.lampState);
    const solenoidStateChanged = !UiState.arraysEqual(state.wpc.solenoidState, this.oldState.solenoidState);
    const inputStateChanged = !UiState.arraysEqual(state.wpc.inputState, this.oldState.inputState);

    if (dmdShadedBufferChanged) {
      this.oldState.dmdShadedBuffer = Uint8Array.from(state.display.dmdShadedBuffer);
    }
    if (lampStateChanged) {
      this.oldState.lampState = Uint8Array.from(state.wpc.lampState);
    }
    if (solenoidStateChanged) {
      this.oldState.solenoidState = Uint8Array.from(state.wpc.solenoidState);
    }
    if (inputStateChanged) {
      this.oldState.inputState = Uint8Array.from(state.wpc.inputState);
    }
    const videoRamChanged = this.getVideoRamDiff(state.display.videoRam);
    const memoryPosition = this.parseMemoryPosition(state.ram);

    return {
      ram: state.ram,
      memoryPosition,
      sound: state.sound,
      wpc: {
        diagnosticLed: state.wpc.diagnosticLed,
        lampState: lampStateChanged ? state.wpc.lampState : undefined,
        solenoidState: solenoidStateChanged ? state.wpc.solenoidState : undefined,
        generalIlluminationState: state.wpc.generalIlluminationState,
        inputState: inputStateChanged ? state.wpc.inputState : undefined,
        diagnosticLedToggleCount: state.wpc.diagnosticLedToggleCount,
        midnightModeEnabled: state.wpc.midnightModeEnabled,
        irqEnabled: state.wpc.irqEnabled,
        activeRomBank: state.wpc.activeRomBank,
        time: state.wpc.time,
        blankSignalHigh: state.wpc.blankSignalHigh,
        watchdogExpiredCounter: state.wpc.watchdogExpiredCounter,
        watchdogTicks: state.wpc.watchdogTicks,
        zeroCrossFlag: state.wpc.zeroCrossFlag,
        inputSwitchMatrixActiveColumn: state.wpc.inputSwitchMatrixActiveColumn,
        lampRow: state.wpc.lampRow,
        lampColumn: state.wpc.lampColumn,
        wpcSecureScrambler: state.wpc.wpcSecureScrambler,
      },
      dmd: {
        scanline: state.display.scanline,
        dmdPageMapping: state.display.dmdPageMapping,
        activepage: state.display.activepage,
        videoRam: videoRamChanged ? this.videoRam : undefined,
        dmdShadedBuffer: dmdShadedBufferChanged ? state.display.dmdShadedBuffer : undefined,
        videoOutputBuffer: state.display.videoOutputBuffer,
        nextActivePage: state.display.nextActivePage,
        requestFIRQ: state.display.requestFIRQ,
        ticksUpdateDmd: state.display.ticksUpdateDmd,
      },
    };
  }

}
