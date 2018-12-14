var myCharacteristic;
var bluetoothDevice;

function run() {
  const serviceUuid = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  const characteristicUuid = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
  const bluetoothFilter = {
    filters: [
      { services: [ serviceUuid ] },
      { name: 'WPC-EMU' },

    ]
  };
  bluetoothDevice = null;

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(bluetoothFilter)
  .then(device => {
    log('Connecting to GATT Server...');
    bluetoothDevice = device;
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Service...', server);
    return server.getPrimaryService(serviceUuid);
  })
  .then(service => {
    log('Getting Characteristic...');
    return service.getCharacteristic(characteristicUuid);
  })
  .then(characteristic => {
    myCharacteristic = characteristic;
    return myCharacteristic.startNotifications().then(_ => {
      log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged',
          handleNotifications);
    });
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function onDisconnected() {
  log('> Bluetooth Device disconnected');
}

function log(data) {
  console.log(data);
}

let lastMessageReceivedTs = Date.now();
let messageCount = 0;
function handleNotifications(event) {
  let value = event.target.value;
  let a = [];
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i++) {
    a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
  }
  if (++messageCount % 10 === 1) {
    const deltaTimeMs = Date.now() - lastMessageReceivedTs;
    log('> ' + a.join(' ') + ' -- ' + deltaTimeMs + 'ms, count: ' + messageCount);    
  }
  lastMessageReceivedTs = Date.now();
}

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
function exponentialBackoff(max, delay, toTry, success, fail) {
  toTry().then(result => success(result))
  .catch(_ => {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)');
    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  });
}


function time(text) {
  log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}

run();
