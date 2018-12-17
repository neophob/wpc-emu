'use strict';

export { parseMessage };

/*
Firmware sends data to the emulator (serial):
- zerocross counter (32bit)
- input switch matrix state (64bit)
- coin door state (8bit)
- fliptronic state (8bit)
*/

function parseMessage(payload) {
  const zeroCrossCounter = payload.getUint32(0);
  const inputSwitchStateLo = payload.getUint32(4);
  const inputSwitchStateHi = payload.getUint32(8);
  const coinDoorState = payload.getUint8(12);
  const fliptronicState = payload.getUint8(13);

  const state = {
    zeroCrossCounter,
    inputSwitchStateLo,
    inputSwitchStateHi,
    coinDoorState,
    fliptronicState,
  };

  return state;
}
