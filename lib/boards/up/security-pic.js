'use strict';

/**
 *  security PIC emulation (U22)
 *  source of this code is freewpc project, wpc-pic.c
 *
 */

const debug = require('debug')('wpcemu:boards:elements:securityPic');

// length is 17 bytes
const SECURITY_CHIP_SERIAL_NUMBER = [
  // Model of Pinball (e.g. 530 for Dirty Harry)
  0,0,0,

  //Serial number (it's that is registered on the labels)
  1,2,3,4,5,6,

  //Serial number n ° 2 (this number has no known utility)
  1,2,3,4,5,

  //Unlock key of the matrix's contacts key (ALWAYS at the value of 123, it is used to generate the corresponding unlock code)
  1,2,3
];
const PIC_SERIAL_SIZE = 16;

const WPC_PIC_RESET = 0x00;
const WPC_PIC_COUNTER = 0x0D;
const WPC_PIC_UNLOCK = 0x20;

const INITAL_BYTE = 0xFF;

module.exports = {
  getInstance,
};

function getInstance(machineNumber) {
  return new SecurityPIC(machineNumber);
}

class SecurityPIC {
  constructor(machineNumber = 559) {
    this.machineNumber = machineNumber;
    this.gameSerialNumber = new Uint8Array(SECURITY_CHIP_SERIAL_NUMBER);
    // The contents of the 16 PIC serial data registers
    this.picSerialNumber = new Uint8Array(PIC_SERIAL_SIZE);

    // Initialize the PIC with the desired machine number.
    const machineNumberString = '' + machineNumber;
  	this.gameSerialNumber[0] = parseInt(machineNumberString[0], 10);
  	this.gameSerialNumber[1] = parseInt(machineNumberString[1], 10);
  	this.gameSerialNumber[2] = parseInt(machineNumberString[2], 10);

    this.picSerialNumber[10] = 0;
    this.picSerialNumber[2] = 0;

    let tmp = 100 * this.gameSerialNumber[1] +
              10 * this.gameSerialNumber[7] +
  		        this.gameSerialNumber[4] +
              5 * this.picSerialNumber[10];
  	tmp = (tmp * 0x1BCD) + 0x1F3F0;
  	this.picSerialNumber[1] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[11] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[9] = tmp & 0xFF;

    tmp = 10000 * this.gameSerialNumber[2] +
          1000 * this.gameSerialNumber[15] +
  		    100 * this.gameSerialNumber[0] +
          10 * this.gameSerialNumber[8] +
  		    this.gameSerialNumber[6] +
          2 * this.picSerialNumber[10] +
  		    this.picSerialNumber[2];
  	tmp = (tmp * 0x107F) + 0x71E259;
  	this.picSerialNumber[7] = (tmp >> 24) & 0xFF;
  	this.picSerialNumber[12] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[0] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[8] = tmp & 0xFF;

    tmp = 1000 * this.gameSerialNumber[16] +
          100 * this.gameSerialNumber[3] +
  		    10 * this.gameSerialNumber[5] +
          this.gameSerialNumber[14] +
  		    this.picSerialNumber[2];
  	tmp = (tmp * 0x245) + 0x3D74;
  	this.picSerialNumber[3] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[14] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[6] = tmp  & 0xFF;

    tmp = 10000 * this.gameSerialNumber[13] +
          1000 * this.gameSerialNumber[12] +
          100 * this.gameSerialNumber[11] +
          10 * this.gameSerialNumber[10] +
          this.gameSerialNumber[9];
    tmp = 99999 - tmp;
    this.picSerialNumber[15] = (tmp >> 8) & 0xFF;
    this.picSerialNumber[4] = tmp & 0xFF;
  }

  reset() {
    this.lastByteWrite = INITAL_BYTE;
    this.unlockMode = 0;
    this.unlockCode = 0;
    this.writesUntilUnlockNeeded = 0x20;
    debug('RESET SECURITY PIC');
    console.log('RESET SECURITY PIC');
  }

  read(getRowFunction) {
		switch (this.lastByteWrite) {
			case WPC_PIC_RESET:
			case WPC_PIC_UNLOCK:
				return 0;

			case WPC_PIC_COUNTER:
        this.writesUntilUnlockNeeded = (this.writesUntilUnlockNeeded - 1) & 0x1F;
				return this.writesUntilUnlockNeeded;

      //The command to read the xth switch column
			case 0x16:
      case 0x17:
      case 0x18:
      case 0x19:
      case 0x1A:
      case 0x1B:
      case 0x1C:
      case 0x1D:
				if (this.unlockMode > 0) {
					debug('Column read in unlock mode');
          console.log('Column read in unlock mode');
					return 0;
				}

				const col = this.lastByteWrite - 0x16;
				if (col < 0 || col >= 8) {
					debug('Invalid column %d', col);
          console.log('Invalid column %d', col);
					return 0;
				}
				return getRowFunction(col + 1);

      // The command to read the xth byte of the serial number.
			case 0x70:
      case 0x71:
      case 0x72:
      case 0x73:
      case 0x74:
      case 0x75:
      case 0x76:
      case 0x77:
      case 0x78:
      case 0x79:
      case 0x7A:
      case 0x7B:
      case 0x7C:
      case 0x7D:
      case 0x7E:
      case 0x7F:
        const offset = this.lastByteWrite - 0x70;
        if (offset < 0 || offset > this.gameSerialNumber.length) {
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
		if (this.lastByteWrite === INITAL_BYTE && data !== WPC_PIC_RESET) {
			debug('PIC write before reset:', data);
      return;
		}

    this.lastByteWrite = data;
    if (this.unlockMode > 0) {
			this.unlockCode = (this.unlockCode << 8) | data;
			if (++this.unlockMode > 3) {
        debug('PIC_UNLOCK_CODE', this.unlockCode);
        this.unlockMode = 0;
      }
      return;
		}

		if (data === WPC_PIC_UNLOCK) {
			this.unlockMode = 1;
			this.unlockCode = 0;
		}
  }

}
