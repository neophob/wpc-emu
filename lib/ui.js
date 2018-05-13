'use strict';

module.exports = {
  getInstance,
};

function getInstance() {
  return new UiState();
}

class UiState {
  constructor() {
    this.oldState = {
      videoRam: [],
      dmdShadedBuffer: [],
      lampState: [],
      solenoidState: [],
      inputState: [],
    };
  }

  getChangedState(state) {
    if (!this.oldState) {
      this.oldState = state;
      return state;
    }

    const dmdShadedBufferChanged = state.dmd.dmdShadedBuffer.toString() !== this.oldState.dmdShadedBuffer.toString();
    const videoRamChanged = state.dmd.videoRam.toString() !== this.oldState.videoRam.toString();
    const lampStateChanged = state.wpc.lampState.toString() !== this.oldState.lampState.toString();
    const solenoidStateChanged = state.wpc.solenoidState.toString() !== this.oldState.solenoidState.toString();
    const inputStateChanged = state.wpc.inputState.toString() !== this.oldState.inputState.toString();

    this.oldState.videoRam = new Uint8Array(state.dmd.videoRam);
    this.oldState.dmdShadedBuffer = new Uint8Array(state.dmd.dmdShadedBuffer);
    this.oldState.lampState = new Uint8Array(state.wpc.lampState);
    this.oldState.solenoidState = new Uint8Array(state.wpc.lampState);
    this.oldState.inputState = new Uint8Array(state.wpc.inputState);

    return {
      romFileName: state.romFileName,
      ram: state.ram,
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
