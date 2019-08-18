'use strict';

/**
 *  security PIC emulation (U22)
 *  source of this code is freewpc project, wpc-pic.c
 */

const debug = require('debug')('wpcemu:boards:elements:securityPic');

const PIC_SERIAL_SIZE = 16;
const WPC_PIC_RESET = 0x00;
const WPC_PIC_COUNTER = 0x0D;
const WPC_PIC_UNLOCK = 0x20;
const INITIAL_BYTE = 0xFF;

const MEDIEVAL_MADNESS_GAME_ID = 559;

module.exports = {
  getInstance,
};

function getInstance(machineNumber) {
  return new SecurityPIC(machineNumber);
}

class SecurityPIC {
  constructor(machineNumber = MEDIEVAL_MADNESS_GAME_ID) {
    //RAW CONTENT will be converted
    const gameSerialNumber =  machineNumber + ' 123456 12345 123';
    // The contents of the 16 PIC serial data registers
    this.picSerialNumber = new Uint8Array(PIC_SERIAL_SIZE);

    this.picSerialNumber[10] = 0x12;
    this.picSerialNumber[2] = 0x34;

    let tmp = 100 * (gameSerialNumber[1] - '0') +
              10 * (gameSerialNumber[8] - '0') +
              (gameSerialNumber[5] - '0');
    tmp += 5 * this.picSerialNumber[10];
    tmp = (tmp * 0x1BCD) + 0x1F3F0;
    this.picSerialNumber[1] = (tmp >> 16) & 0xFF;
    this.picSerialNumber[11] = (tmp >> 8) & 0xFF;
    this.picSerialNumber[9] = tmp & 0xFF;

console.log('11',tmp,this.picSerialNumber)

    tmp = 10000 * (gameSerialNumber[2] - '0') +
          1000 * (gameSerialNumber[18] - '0') +
          100 * (gameSerialNumber[0] - '0') +
          10 * (gameSerialNumber[9] - '0') +
          (gameSerialNumber[7] - '0');
    tmp += 2 * this.picSerialNumber[10] + this.picSerialNumber[2];
    tmp = (tmp * 0x107F) + 0x71E259;
    this.picSerialNumber[7] = (tmp >> 24) & 0xFF;
    this.picSerialNumber[12] = (tmp >> 16) & 0xFF;
    this.picSerialNumber[0] = (tmp >> 8) & 0xFF;
    this.picSerialNumber[8] = tmp & 0xFF;

    console.log('22',tmp,this.picSerialNumber)

    tmp = 1000 * (gameSerialNumber[19] - '0') +
          100 * (gameSerialNumber[4] - '0') +
          10 * (gameSerialNumber[6] - '0') +
          (gameSerialNumber[17] - '0');
    tmp += this.picSerialNumber[2];
    tmp = (tmp * 0x245) + 0x3D74;
    this.picSerialNumber[3] = (tmp >> 16) & 0xFF;
    this.picSerialNumber[14] = (tmp >> 8) & 0xFF;
    this.picSerialNumber[6] = tmp & 0xFF;
    console.log('33',tmp,this.picSerialNumber)

    tmp = 10000 * ('9' - gameSerialNumber[15]) +
          1000 * ('9' - gameSerialNumber[14]) +
          100 * ('9' - gameSerialNumber[13]) +
          10 * ('9' - gameSerialNumber[12]) +
          ('9' - gameSerialNumber[11]);
    this.picSerialNumber[15] = (tmp >> 8) & 0xFF;
    this.picSerialNumber[4] = tmp & 0xFF;
  }

  reset() {
    this.lastByteWrite = INITIAL_BYTE;
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
      case INITIAL_BYTE:
        return 0;

      case WPC_PIC_COUNTER:
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
      case 0x1E:
      case 0x1F: {
        if (this.unlockMode > 0) {
          debug('Column read in unlock mode');
          console.log('Column read in unlock mode');
          return 0;
        }

        const col = this.lastByteWrite - 0x16;
        return getRowFunction(col + 1);
      }

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
      case 0x7F: {
        const offset = this.lastByteWrite - 0x70;
        if (offset < 0/* || offset > this.gameSerialNumber.length*/) {
          console.log('invalid OFFSET read:', offset);
          return 0;
        }

        /* update serial number scrambler */
        this.sNoS = ((this.sNoS >> 4) | (this.lastByteWrite << 4)) & 0xFF;
        this.picSerialNumber[5]  = (this.picSerialNumber[5]  ^ this.sNoS) + this.picSerialNumber[13];
        this.picSerialNumber[13] = (this.picSerialNumber[13] + this.sNoS) ^ this.picSerialNumber[5];
        console.log('this.sNoS', this.sNoS);

        return this.picSerialNumber[offset];
      }

      default:
        debug('Invalid PIC address read %d', this.lastByteWrite);
        console.log('Invalid PIC address read', this.lastByteWrite);
        return 0;
    }
  }

  write(data) {
    /* Handles writes to the PIC */
    if (this.lastByteWrite === INITIAL_BYTE && data !== WPC_PIC_RESET) {
      debug('PIC write before reset:', data);
      return;
    }

    if (data === WPC_PIC_COUNTER) {
      this.writesUntilUnlockNeeded = (this.writesUntilUnlockNeeded - 1) & 0x1F;
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

    if (data === 0) {
      console.log('IINNNNIIIIIIIIIIIIITTT');
      this.sNoS = 0xA5;
      this.picSerialNumber[5]  = this.picSerialNumber[0] ^ this.picSerialNumber[15];
      this.picSerialNumber[13] = this.picSerialNumber[2] ^ this.picSerialNumber[12];
    }

    if (data === WPC_PIC_UNLOCK) {
      this.unlockMode = 1;
      this.unlockCode = 0;
    }
  }

}
