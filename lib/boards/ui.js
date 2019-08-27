'use strict';

module.exports = {
  getInstance,
};

const DMD_PAGE_SIZE = 0x200;
const MAXIMAL_STRING_LENGTH = 32;

function getInstance(memoryPosition) {
  return new UiState(memoryPosition);
}

class UiState {
  constructor(memoryPosition = []) {
    this.memoryPosition = memoryPosition
      .filter((entry) => {
        return Number.isInteger(entry.offset) && (entry.type === 'string' || entry.type === 'uint8');
      })

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
        if (entry.type === 'uint8') {
          entry.value = ram[entry.offset];
        } else {
          let offset = entry.offset;
          let dump = '';
          while (ram[offset] > 31 && ram[offset] < 128 && dump.length < MAXIMAL_STRING_LENGTH) {
            dump += String.fromCharCode(ram[offset++]);
          }
          entry.value = dump;
        }
        return entry;
      });
  }

  getChangedState(state) {
    const dmdShadedBufferChanged = !UiState.arraysEqual(state.dmd.dmdShadedBuffer, this.oldState.dmdShadedBuffer);
    const lampStateChanged = !UiState.arraysEqual(state.wpc.lampState, this.oldState.lampState);
    const solenoidStateChanged = !UiState.arraysEqual(state.wpc.solenoidState, this.oldState.solenoidState);
    const inputStateChanged = !UiState.arraysEqual(state.wpc.inputState, this.oldState.inputState);

    if (dmdShadedBufferChanged) {
      this.oldState.dmdShadedBuffer = Uint8Array.from(state.dmd.dmdShadedBuffer);
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
    const videoRamChanged = this.getVideoRamDiff(state.dmd.videoRam);
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
        scanline: state.dmd.scanline,
        dmdPageMapping: state.dmd.dmdPageMapping,
        activepage: state.dmd.activepage,
        videoRam: videoRamChanged ? this.videoRam : undefined,
        dmdShadedBuffer: dmdShadedBufferChanged ? state.dmd.dmdShadedBuffer : undefined,
        videoOutputBuffer: state.dmd.videoOutputBuffer,
        nextActivePage: state.dmd.nextActivePage,
        requestFIRQ: state.dmd.requestFIRQ,
      },
    };
  }

}
