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

    this.codeW = 0;
    const gameSerialNumber =  machineNumber + ' 123456 12345 123';

    console.log('gameSerialNumber', gameSerialNumber);

    // The contents of the 16 PIC serial data registers
    this.unlockCode = new Uint8Array(3);
    this.picSerialNumber = new Uint8Array(PIC_SERIAL_SIZE).fill(0);

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
    console.log('44',tmp,this.picSerialNumber)
    this.originalPicSerialNumber = new Uint8Array(this.picSerialNumber);

    tmp = 100 * (gameSerialNumber[0] - '0') +
          10 * (gameSerialNumber[1] - '0') +
          (gameSerialNumber[2] - '0');
    console.log('555',tmp)
    tmp = ((tmp >> 8) & 0xFF) * (0x100 * gameSerialNumber[17] + gameSerialNumber[19]) +
          (tmp & 0xFF) * (0x100 * gameSerialNumber[18] + gameSerialNumber[17]);

    // [3, 192, 53]
    this.unlockCode[0] = (tmp >> 16) & 0xFF;
    this.unlockCode[1] = (tmp >> 8) & 0xFF;
    this.unlockCode[2] = (tmp) & 0xFF;

    console.log('this.unlockCode', this.unlockCode, tmp);
  }

  reset() {
    this.lastByteWrite = INITIAL_BYTE;
    this.writesUntilUnlockNeeded = 0x20;
    this.picSerialNumber = new Uint8Array(this.originalPicSerialNumber);

    debug('RESET SECURITY PIC');
    console.log('RESET SECURITY PIC', this.picSerialNumber);
  }

  read(getRowFunction) {
    if (this.lastByteWrite === WPC_PIC_COUNTER) {
      console.log('R_WPC_PIC_COUNTER', this.writesUntilUnlockNeeded);
      return this.writesUntilUnlockNeeded;
    }

    if (this.lastByteWrite >= 0x16 && this.lastByteWrite <= 0x1F) {
      const col = this.lastByteWrite - 0x16;
      return getRowFunction(col + 1);
    }

    if ((this.lastByteWrite & 0xF0) === 0x70) {
      const ret = this.picSerialNumber[this.lastByteWrite & 0x0F];

      this.sNoS = ((this.sNoS >> 4) | (this.lastByteWrite << 4)) & 0xFF;
      this.picSerialNumber[5]  = ((this.picSerialNumber[5] ^ this.sNoS) + this.picSerialNumber[13]) & 0xFF;
      this.picSerialNumber[13] = ((this.picSerialNumber[13] + this.sNoS) ^ this.picSerialNumber[5]) & 0xFF;
      console.log('this.sNoS', this.sNoS);
      return ret;
    }
  }

  write(data) {
    this.lastByteWrite = data;

    if (this.codeW > 0) {
      if (this.unlockCode[3 - this.codeW] !== data)
        console.log('Wrong code sent to pic', { sent: data, codeW: this.codeW, expected: this.unlockCode[3 - this.codeW] });
      else
        console.log('Correct code sent to pic', { sent: data, codeW: this.codeW, expected: this.unlockCode[3 - this.codeW] });
      this.codeW--;
      return;
    }

    if (data === WPC_PIC_RESET) {
      this.sNoS = 0xA5;
      this.picSerialNumber[5]  = this.picSerialNumber[0] ^ this.picSerialNumber[15];
      this.picSerialNumber[13] = this.picSerialNumber[2] ^ this.picSerialNumber[12];
      this.writesUntilUnlockNeeded = 0x20;
      console.log('W_INIT_PIC', this.sNoS);
      return;
    }

    if (data === WPC_PIC_UNLOCK) {
      console.log('W_WPC_PIC_UNLOCK');
      this.codeW = 3;
      return;
    }

    if (data === WPC_PIC_COUNTER) {
      console.log('W_WPC_PIC_COUNTER');
      this.writesUntilUnlockNeeded = (this.writesUntilUnlockNeeded - 1) & 0x1F;
      return;
    }

  }

}
