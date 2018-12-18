'use strict';

import { build as bluetoothConnection } from './connection';
import { parseMessage } from './parser';
export { pairBluetooth, resetPinballMachine, restartBluetoothController };

const WPCEMU_SERIVCE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const WPCEMU_SERIVCE_NAME = 'WPC-EMU';
const WPCEMU_CHARACTERISTIC_WPCSTATE_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const WPCEMU_CHARACTERISTIC_POWERSTATE_UUID = '82ee4ff0-b0e3-4088-85e3-bdaa212e4fa3';
const WPCEMU_CHARACTERISTIC_RESET_UUID = '26ac8e88-7b63-4e88-8ca2-045c76345b5f';

const WPCEMU_PAYLOAD_REBOOT_CONTROLLER = 42;
const WPCEMU_PAYLOAD_REBOOT_PINBALLMACHINE = 1;

let bluetoothDevice = bluetoothConnection(WPCEMU_SERIVCE_UUID, WPCEMU_SERIVCE_NAME);
let messageCount = 0;
let callback;

function pairBluetooth(_callback) {
  callback = _callback;
  return bluetoothDevice.readCharacteristic(WPCEMU_CHARACTERISTIC_POWERSTATE_UUID)
    .then((powerstate) => {
      console.log('pinball powerstate', powerstate);
      return subscribeToNotifications();
    });
}

function resetPinballMachine() {
  return bluetoothDevice.writeCharacteristic(WPCEMU_CHARACTERISTIC_RESET_UUID, Uint8Array.of(WPCEMU_PAYLOAD_REBOOT_PINBALLMACHINE));
}

function restartBluetoothController() {
  console.log('reset bluetooth controller');
  return bluetoothDevice.writeCharacteristic(WPCEMU_CHARACTERISTIC_RESET_UUID, Uint8Array.of(WPCEMU_PAYLOAD_REBOOT_CONTROLLER))
    .catch((error) => console.error('RESTART FAILED:', error.message));
}

function subscribeToNotifications() {
  const powerstatePromise = bluetoothDevice.subscribeToCharacteristic(WPCEMU_CHARACTERISTIC_POWERSTATE_UUID, (event) => {
    const value = event.target.value;
    console.log('POWERSTATE CHANGED', value);
  });

  const statePromise = bluetoothDevice.subscribeToCharacteristic(WPCEMU_CHARACTERISTIC_WPCSTATE_UUID, (event) => {
    const value = event.target.value;
    const parsedMessage = parseMessage(value);
    messageCount++;
    callback(null, parsedMessage);
  });

  return Promise.all([ powerstatePromise, statePromise ]);
}
