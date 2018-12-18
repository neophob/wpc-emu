'use strict';

export { build };

function build(serviceUuid, serviceName) {
  return new BluetoothConnection(serviceUuid, serviceName);
}

const EVENT_GATTSERVER_DISCONNECTED = 'gattserverdisconnected';
const EVENT_VALUE_CHANGED = 'characteristicvaluechanged';

class BluetoothConnection {

  constructor(serviceUuid, serviceName) {
    this.serviceUuid = serviceUuid;
    this.serviceName = serviceName;
    this.bluetoothDevice = null;
    this.bluetoothService = null;
    this.subscribedCharacteristics = [];
  }

  /*
   * Pair with a bluetooth device, this must be initiated by an user action!
   * @returns a promise
   */
  _pair() {
    const bluetoothFilter = {
      filters: [
        { services: [ this.serviceUuid ] },
        { name: this.serviceName },
      ]
    };
    console.log('Requesting Bluetooth Device...');
    return navigator.bluetooth.requestDevice(bluetoothFilter)
      .then((bluetoothDevice) => {
        this.bluetoothDevice = bluetoothDevice;
        this.bluetoothDevice.addEventListener(EVENT_GATTSERVER_DISCONNECTED, this._disconnectEvent.bind(this));
        return this.bluetoothDevice;
      });
  }

  _getBluetoothDevice() {
    if (this.bluetoothDevice) {
      return Promise.resolve(this.bluetoothDevice);
    }
    return this._pair();
  }

  _disconnectEvent(event = {}) {
    console.log('Bluetooth disconnected', {
      target: event.target
    });
    this.bluetoothService = undefined;
    this._connectToService()
      .then(() => {
        const subscriptionPromises = this.subscribedCharacteristics
          .map((entry) => this.subscribeToCharacteristic(entry.characteristicUuid, entry.callback, false));
        return Promise.all(subscriptionPromises);
      })
      .catch((error) => {
        console.error('RECONNECT FAILED:', error.message);
      });
  }

  _connectToService() {
    return this._getBluetoothDevice()
      .then((bluetoothDevice) => {
        console.log('Connecting to GATT Server...');
        return bluetoothDevice.gatt.connect();
      })
      .then((server) => server.getPrimaryService(this.serviceUuid))
      .then((service) => {
        console.log('connected');
        this.bluetoothService = service;
        return this.bluetoothService;
      });
  }

  _getBluetoothService() {
    if (this.bluetoothService) {
      return Promise.resolve(this.bluetoothService);
    }
    return this._connectToService();
  }

  subscribeToCharacteristic(characteristicUuid, callback, addListener = true) {
    let characteristic;
    return this._getBluetoothService()
      .then((service) => {
        return service.getCharacteristic(characteristicUuid);
      })
      .then((_characteristic) => {
        characteristic = _characteristic;
        return characteristic.startNotifications();
      })
      .then((subscription = {}) => {
        console.log('> Notifications started', subscription.uuid);
        characteristic.addEventListener(EVENT_VALUE_CHANGED, callback);
        if (addListener) {
          this.subscribedCharacteristics.push({ characteristicUuid, callback });
        }
      });
  }

  // return a promise that eventually resolve to a uint8 value of the characteristic
  readCharacteristic(characteristicUuid) {
    return this._getBluetoothService()
      .then((service) => {
        return service.getCharacteristic(characteristicUuid);
      })
      .then((characteristic) => {
        return characteristic.readValue();
      })
      .then((value) => {
        return value.getUint8(0);
      });
  }

  writeCharacteristic(characteristicUuid, value) {
    return this._getBluetoothService()
      .then((service) => {
        return service.getCharacteristic(characteristicUuid);
      })
      .then((characteristic) => {
        return characteristic.writeValue(value);
      });
  }
}
