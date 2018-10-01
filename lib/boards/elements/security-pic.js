'use strict';

// security PIC emulation (U22)

const debug = require('debug')('wpcemu:boards:elements:securityPic');

// value ripped from freewpc
const SECURITY_CHIP_SERIAL_NUMBER = [0, 0, 0, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 1, 2, 3];

const PIC_SERIAL_SIZE = 16;

const WPC_PIC_RESET = 0x00;
const WPC_PIC_COUNTER = 0x0D;
const WPC_PIC_UNLOCK = 0x20;

const INIITAL_BYTE = 0xFF;

module.exports = {
  getInstance,
};

function getInstance(machineNumber) {
  return new SecurityPIC(machineNumber);
}

class SecurityPIC {

  constructor(machineNumber = 530) {
    this.serialNumber = new Uint8Array(SECURITY_CHIP_SERIAL_NUMBER);
    // The contents of the 16 PIC serial data registers
    this.picSerialNumber = new Uint8Array(PIC_SERIAL_SIZE);

    // Initialize the PIC with the desired machine number.
    const machineNumberString = '' + machineNumber;
  	this.serialNumber[0] = parseInt(machineNumberString[0], 10);
  	this.serialNumber[1] = parseInt(machineNumberString[1], 10);
  	this.serialNumber[2] = parseInt(machineNumberString[2], 10);

    this.picSerialNumber[10] = 0;
    this.picSerialNumber[2] = 0;

    let tmp = 100 * this.serialNumber[1] +
              10 * this.serialNumber[7] +
  		        this.serialNumber[4] +
              5 * this.picSerialNumber[10];
  	tmp = (tmp * 0x1BCD) + 0x1F3F0;
  	this.picSerialNumber[1] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[11] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[9] = tmp  & 0xFF;

    tmp = 10000 * this.serialNumber[2] +
          1000 * this.serialNumber[15] +
  		    100 * this.serialNumber[0] +
          10 * this.serialNumber[8] +
  		    this.serialNumber[6] +
          2 * this.picSerialNumber[10] +
  		    this.picSerialNumber[2];
  	tmp = (tmp * 0x107F) + 0x71E259;
  	this.picSerialNumber[7] = (tmp >> 24) & 0xFF;
  	this.picSerialNumber[12] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[0] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[8] = tmp & 0xFF;

    tmp = 1000 * this.serialNumber[16] +
          100 * this.serialNumber[3] +
  		    10 * this.serialNumber[5] +
          this.serialNumber[14] +
  		    this.picSerialNumber[2];
  	tmp = (tmp * 0x245) + 0x3D74;
  	this.picSerialNumber[3] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[14] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[6] = tmp  & 0xFF;

    tmp = 10000 * this.serialNumber[13] +
          1000 * this.serialNumber[12] +
          100 * this.serialNumber[11] +
          10 * this.serialNumber[10] +
          this.serialNumber[9];
    tmp = 99999 - tmp;
    this.picSerialNumber[15] = (tmp >> 8) & 0xFF;
    this.picSerialNumber[4] = tmp & 0xFF;
  }

  reset() {
    console.log('RESET SECURITY PIC');
    this.lastByteWrite = INIITAL_BYTE;
    this.unlockMode = 0;
    this.unlockCode = 0;
    this.expectedUnlockCode = 0;
    this.writesUntilUnlockNeeded = 0xFF;
    this.alreadyWarned = false;
  }

  /** The command to read the xth switch column */
  _readSwichColumn(number) {
    return 0x16 + number;
  }

  /** The command to read the xth byte of the serial number.
   * See pic.c for a full description of how this value is
   * encoded/decoded. */
  _readPicSerial(number) {
    return 0x70 + number;
  }

  read(getRowFunction) {
		switch (this.lastByteWrite) {
			case WPC_PIC_RESET:
			case WPC_PIC_UNLOCK:
				return 0;

			case WPC_PIC_COUNTER:
				return this.writesUntilUnlockNeeded;

			case this._readSwichColumn(0):
      case this._readSwichColumn(1):
			case this._readSwichColumn(2):
      case this._readSwichColumn(3):
			case this._readSwichColumn(4):
      case this._readSwichColumn(5):
			case this._readSwichColumn(6):
      case this._readSwichColumn(7):
				if (this.unlockMode > 0) {
					debug('Column read in unlock mode');
          console.log('Column read in unlock mode');
					return 0;
				}

				const col = this.lastByteWrite - this._readSwichColumn(0);
				if (col < 0 || col >= 8) {
					debug('Invalid column %d', col);
          console.log('Invalid column %d', col);
					return 0;
				}
				return getRowFunction(col + 1);

			case this._readPicSerial(0):
      case this._readPicSerial(1):
			case this._readPicSerial(2):
      case this._readPicSerial(3):
			case this._readPicSerial(4):
      case this._readPicSerial(5):
			case this._readPicSerial(6):
      case this._readPicSerial(7):
			case this._readPicSerial(8):
      case this._readPicSerial(9):
			case this._readPicSerial(10):
      case this._readPicSerial(11):
			case this._readPicSerial(12):
      case this._readPicSerial(13):
			case this._readPicSerial(14):
      case this._readPicSerial(15):
        const offset = this.lastByteWrite - this._readPicSerial(0);
        if (offset < 0 || offset > this.serialNumber.length) {
          console.log('invalid OFFSET!!!', offset);
          return 0;
        }
				return this.picSerialNumber[offset];

			default:
				debug('Invalid PIC address read');
        console.log('Invalid PIC address read');
				return 0;
		}
  }

  write(data) {
    /* Handles writes to the PIC */
		if (this.lastByteWrite === INIITAL_BYTE && data !== WPC_PIC_RESET) {
			debug('PIC write before reset:', data);
      console.log('PIC write before reset:', data);
      return;
		}

    if (this.unlockMode > 0) {
			this.unlockCode = (this.unlockCode << 8) | data;
			if (++this.unlockMode > 3) {
				if (this.unlockCode != this.expectedUnlockCode) {
					if (!this.alreadyWarned) {
            debug('Invalid PIC unlock code', { actual: this.unlockMode, expected: this.expectedUnlockCode });
            console.log('Invalid PIC unlock code', { actual: this.unlockMode, expected: this.expectedUnlockCode });
            this.alreadyWarned = true;
          }
					this.unlockMode = -1;
				} else {
					this.unlockMode = 0;
				}
			}
      return;
		}

		if (data === WPC_PIC_UNLOCK) {
			this.unlockMode = 1;
			this.unlockCode = 0;
      return;
		}

    this.lastByteWrite = data;
		if (this.writesUntilUnlockNeeded > 0) {
      this.writesUntilUnlockNeeded--;
    }

  }

}
