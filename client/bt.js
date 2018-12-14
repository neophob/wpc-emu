
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

function discoverConnectSubscribe(serviceUuid, serviceName, characteristicUuid, disconnectCallback, notificationCallback) {
  return requestDevice(serviceUuid, serviceName)
    .then((device) => connectDevice(device, disconnectCallback))
    .then((server) => getPrimaryService(server, serviceUuid))
    .then((service) => getCharacteristic(service, characteristicUuid))
    .then((characteristic) => registerNotification(characteristic, notificationCallback));
}

const serviceUuid = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const serviceName = 'WPC-EMU';
const characteristicUuid = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
let lastMessageReceivedTs = Date.now();
let messageCount = 0;

function disconnectCallback(data) {
  console.log('> Bluetooth Device disconnected', data);
}

function notificationCallback(event) {
  const value = event.target.value;
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  let a = [];
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  if (++messageCount % 10 === 1) {
    const deltaTimeMs = Date.now() - lastMessageReceivedTs;
    console.log('> ' + a.join(' ') + ' -- ' + deltaTimeMs + 'ms, count: ' + messageCount);
  }
  lastMessageReceivedTs = Date.now();
}

discoverConnectSubscribe(serviceUuid, serviceName, characteristicUuid, disconnectCallback, notificationCallback)
  .catch((error) => {
    console.error('Argh! ' + error);
  })
