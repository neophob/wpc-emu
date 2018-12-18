'use strict';

export { build };

function build(serviceUuid, serviceName) {
  return new BluetoothConnection(serviceUuid, serviceName);
}

class BluetoothConnection {

  constructor(serviceUuid, serviceName) {
    this.serviceUuid = serviceUuid;
    this.serviceName = serviceName;
  }

  /*
   * Pair with a bluetooth device
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
      .then((bluetoothDevice) => this.bluetoothDevice = bluetoothDevice);
  }

  _getBluetoothDevice() {
    if (this.bluetoothDevice) {
      return Promise.resolve(this.bluetoothDevice);
    }
    return this._pair();
  }

  _disconnectEvent() {
    console.log('BT DISCONNECT');
    this.bluetoothDevice = null;
    this.bluetoothService = null;
  }

  _connectToService() {
    return this._getBluetoothDevice()
      .then((bluetoothDevice) => {
        console.log('Connecting to GATT Server...');
        bluetoothDevice.addEventListener('gattserverdisconnected', this._disconnectEvent);
        return bluetoothDevice.gatt.connect();
      })
      .then((server) => server.getPrimaryService(this.serviceUuid))
      .then((service) => this.bluetoothServer = service);
  }

  _getBluetoothService() {
    if (this.bluetoothService) {
      return Promise.resolve(this.bluetoothService);
    }
    return this._connectToService();
  }

  subscribeToCharacteristic(characteristicUuid, callback) {
    let characteristic;
    return this._getBluetoothService()
      .then((service) => {
        return service.getCharacteristic(characteristicUuid);
      })
      .then((_characteristic) => {
        characteristic = _characteristic;
        return characteristic.startNotifications();
      })
      .then((subscription) => {
        console.log('> Notifications started', subscription);
        characteristic.addEventListener('characteristicvaluechanged', callback);
      });
  }

}
