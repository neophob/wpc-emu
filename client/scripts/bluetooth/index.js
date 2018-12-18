'use strict';

export { pairBluetooth };
import { build as bluetoothConnection } from './connection';
import { parseMessage } from './parser';

//TODO handle reconnect
//TODO expose reset function

const WPCEMU_SERIVCE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const WPCEMU_SERIVCE_NAME = 'WPC-EMU';
const WPCEMU_CHARACTERISTIC_WPCSTATE_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const WPCEMU_CHARACTERISTIC_POWERSTATE_UUID = '82ee4ff0-b0e3-4088-85e3-bdaa212e4fa3';

let messageCount = 0;
let bluetoothDevice = bluetoothConnection(WPCEMU_SERIVCE_UUID, WPCEMU_SERIVCE_NAME);

function pairBluetooth(_callback) {
  const powerstatePromise = bluetoothDevice.subscribeToCharacteristic(WPCEMU_CHARACTERISTIC_POWERSTATE_UUID, (event) => {
    const value = event.target.value;
    console.log('POWERSTATE CHANGED', value);
  });

  const statePromise = bluetoothDevice.subscribeToCharacteristic(WPCEMU_CHARACTERISTIC_WPCSTATE_UUID, (event) => {
    const value = event.target.value;
    const parsedMessage = parseMessage(value);
    messageCount++;
    _callback(null, parsedMessage);
  });

  return Promise.all([ powerstatePromise, statePromise ]);
}
