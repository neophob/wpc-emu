'use strict';

export { parseMessage };

/*
Firmware sends data to the emulator (serial):
- zerocross counter (32bit)
- input switch matrix state (64bit)
- coin door state (8bit)
- fliptronic state (8bit)
*/

function parseMessage(payload, lastState = {}) {
  const zeroCrossCounter = payload.getUint32(0);
  const inputSwitchStateLo = payload.getUint32(4);
  const inputSwitchStateHi = payload.getUint32(8);
  const coinDoorState = payload.getUint8(12);
  const fliptronicState = payload.getUint8(13);

  const state = {};
  if (lastState.zeroCrossCounter !== zeroCrossCounter) {
    state.zeroCrossCounter = zeroCrossCounter;
  }
  if (lastState.inputSwitchStateLo !== inputSwitchStateLo) {
    state.inputSwitchStateLo = inputSwitchStateLo;
  }
  if (lastState.inputSwitchStateHi !== inputSwitchStateHi) {
    state.inputSwitchStateHi = inputSwitchStateHi;
  }
  if (lastState.coinDoorState !== coinDoorState) {
    state.coinDoorState = coinDoorState;
  }
  if (lastState.fliptronicState !== fliptronicState) {
    state.fliptronicState = fliptronicState;
  }

  return state;
}
