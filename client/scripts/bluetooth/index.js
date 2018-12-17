'use strict';

export { pairBluetooth };
import { parseMessage } from './parser';

let messageCount = 0;
let callback;

function pairBluetooth(_callback) {
  callback = _callback;
  const bluetoothState = {
    serviceUuid: '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
    characteristicUuid: 'beb5483e-36e1-4688-b7f5-ea07361b26a8',
    serviceName: 'WPC-EMU',
  };
  return discoverConnectSubscribe(
    bluetoothState,
    disconnectCallback,
    notificationCallback
  );
}

function requestDevice(serviceUuid, serviceName) {
  const bluetoothFilter = {
    filters: [
      { services: [ serviceUuid ] },
      { name: serviceName },
    ]
  };
  console.log('Requesting Bluetooth Device...');
  return navigator.bluetooth.requestDevice(bluetoothFilter);
}

function connectDevice(bluetoothDevice, disconnectCallback) {
  console.log('Connecting to GATT Server...');
  bluetoothDevice.addEventListener('gattserverdisconnected', disconnectCallback);
  return bluetoothDevice.gatt.connect();
}

function getPrimaryService(server, serviceUuid) {
  console.log('Getting Service...');
  return server.getPrimaryService(serviceUuid);
}

function getCharacteristic(service, characteristicUuid) {
  console.log('Getting Characteristic...');
  return service.getCharacteristic(characteristicUuid);
}

function registerNotification(characteristic, notificationCallback) {
  return characteristic.startNotifications()
    .then(_ => {
      console.log('> Notifications started', _);
      characteristic.addEventListener('characteristicvaluechanged', notificationCallback);
    });
}

function discoverConnectSubscribe(bluetoothState, disconnectCallback, notificationCallback) {
  const { serviceUuid, serviceName, characteristicUuid } = bluetoothState;

  return requestDevice(serviceUuid, serviceName)
    .then((device) => connectDevice(device, disconnectCallback))
    .then((server) => getPrimaryService(server, serviceUuid))
    .then((service) => getCharacteristic(service, characteristicUuid))
    .then((characteristic) => registerNotification(characteristic, notificationCallback));
}

function disconnectCallback(data) {
  callback(data);
}

function notificationCallback(event) {
  const value = event.target.value;

  messageCount++;
  const parsedMessage = parseMessage(value);
  callback(null, parsedMessage);
}
