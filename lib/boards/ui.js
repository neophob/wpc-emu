'use strict';

module.exports = {
  getInstance,
};

function getInstance() {
  return new UiState();
}

class UiState {
  constructor() {
    this.count = 0;
    this.oldState = {
      videoRam: '',
      dmdShadedBuffer: '',
      lampState: '',
      solenoidState: '',
      inputState: '',
    };
  }

  getChangedState(state) {
    this.count++;
    const dmdShadedBufferChanged = state.dmd.dmdShadedBuffer.toString() !== this.oldState.dmdShadedBuffer;
    const videoRamChanged = state.dmd.videoRam.toString() !== this.oldState.videoRam;
    const lampStateChanged = state.wpc.lampState.toString() !== this.oldState.lampState;
    const solenoidStateChanged = state.wpc.solenoidState.toString() !== this.oldState.solenoidState;
    const inputStateChanged = state.wpc.inputState.toString() !== this.oldState.inputState;

    if (dmdShadedBufferChanged) {
      this.oldState.dmdShadedBuffer = state.dmd.dmdShadedBuffer.toString();
    }
    if (videoRamChanged) {
      this.oldState.videoRam = state.dmd.videoRam.toString();
    }
    if (lampStateChanged) {
      this.oldState.lampState = state.wpc.lampState.toString();
    }
    if (solenoidStateChanged) {
      this.oldState.solenoidState = state.wpc.lampState.toString();
    }
    if (inputStateChanged) {
      this.oldState.inputState = state.wpc.inputState.toString();
    }

    return {
      ram: (this.count % 4) === 0 ? state.ram : undefined,
      wpc: {
        diagnosticLed: state.wpc.diagnosticLed,
        lampState: lampStateChanged ? state.wpc.lampState : undefined,
        solenoidState: solenoidStateChanged ? state.wpc.solenoidState : undefined,
        generalIlluminationState: state.wpc.generalIlluminationState,
        inputState: inputStateChanged ? state.wpc.inputState : undefined,
        diagnosticLedToggleCount: state.wpc.diagnosticLedToggleCount,
        irqEnabled: state.wpc.irqEnabled,
        activeRomBank: state.wpc.activeRomBank,
      },
      dmd: {
        scanline: state.dmd.scanline,
        lowpage: state.dmd.lowpage,
        highpage: state.dmd.highpage,
        activepage: state.dmd.activepage,
        videoRam: videoRamChanged ? state.dmd.videoRam : undefined,
        dmdShadedBuffer: dmdShadedBufferChanged ? state.dmd.dmdShadedBuffer : undefined,
      }
    };
  }

}
