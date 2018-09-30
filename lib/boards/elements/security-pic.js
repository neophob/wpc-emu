'use strict';

// security PIC emulation (U22)

const debug = require('debug')('wpcemu:boards:elements:securityPic');

// value ripped from freewpc
const SECURITY_CHIP_SERIAL_NUMBER = [0, 0, 0, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 0, 0, 0];
const PIC_SERIAL_SIZE = 16;

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

    // Now encode the 17-byte serial number into the 16 PIC registers.
    this.picSerialNumber[10] = 0x0;
    this.picSerialNumber[2] = 0x0;

    let tmp = 100 * this.serialNumber[1] + 10 * this.serialNumber[7] +
  		this.serialNumber[4] + 5 * this.picSerialNumber[10];
  	tmp = (tmp * 0x1BCD) + 0x1F3F0;
  	this.picSerialNumber[1] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[11] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[9] = tmp  & 0xFF;

    tmp = 10000 * this.serialNumber[2] + 1000 * this.serialNumber[15] +
  		100 * this.serialNumber[0] + 10 * this.serialNumber[8] +
  		this.serialNumber[6] + 2 * this.picSerialNumber[10] +
  		this.picSerialNumber[2];
  	tmp = (tmp * 0x107F) + 0x71E259;
  	this.picSerialNumber[7] = (tmp >> 24) & 0xFF;
  	this.picSerialNumber[12] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[0] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[8] = tmp  & 0xFF;

    tmp = 1000 * this.serialNumber[16] + 100 * this.serialNumber[3] +
  		10 * this.serialNumber[5] + this.serialNumber[14] +
  		this.picSerialNumber[2];
  	tmp = (tmp * 0x245) + 0x3D74;
  	this.picSerialNumber[3] = (tmp >> 16) & 0xFF;
  	this.picSerialNumber[14] = (tmp >> 8) & 0xFF;
  	this.picSerialNumber[6] = tmp  & 0xFF;

    tmp = 10000 * this.serialNumber[13] + 1000 * this.serialNumber[12] +
      100 * this.serialNumber[11] + 10 * this.serialNumber[10] +
      this.serialNumber[9];
    tmp = 99999 - tmp;
    this.picSerialNumber[15] = (tmp >> 8) & 0xFF;
    this.picSerialNumber[4] = tmp & 0xFF;
  }

  read() {
/*
int ret = 0;
if (wpclocals.pic.lastW == 0x0d)
  ret = wpclocals.pic.count;
else if ((wpclocals.pic.lastW >= 0x16) && (wpclocals.pic.lastW <= 0x1f))
  ret = coreGlobals.swMatrix[wpclocals.pic.lastW-0x15];
else if ((wpclocals.pic.lastW & 0xf0) == 0x70) {
  ret = wpclocals.pic.sData[wpclocals.pic.lastW & 0x0f];
  // update serial number scrambler
  wpclocals.pic.sNoS = ((wpclocals.pic.sNoS>>4) | (wpclocals.pic.lastW <<4)) & 0xff;
  wpclocals.pic.sData[5]  = (wpclocals.pic.sData[5]  ^ wpclocals.pic.sNoS) + wpclocals.pic.sData[13];
  wpclocals.pic.sData[13] = (wpclocals.pic.sData[13] + wpclocals.pic.sNoS) ^ wpclocals.pic.sData[5];
}
return ret;
*/
  }

  write(data) {
/*
if (wpclocals.pic.codeW > 0) {
  if (wpclocals.pic.codeNo[3 - wpclocals.pic.codeW] != data)
    DBGLOG(("Wrong code %2x (expected %2x) sent to pic.",
             data, wpclocals.pic.codeNo[3 - wpclocals.pic.codeW]));
  wpclocals.pic.codeW -= 1;
}
else if (data == 0) {
  wpclocals.pic.sNoS = 0xa5;
  wpclocals.pic.sData[5]  = wpclocals.pic.sData[0] ^ wpclocals.pic.sData[15];
  wpclocals.pic.sData[13] = wpclocals.pic.sData[2] ^ wpclocals.pic.sData[12];
  wpclocals.pic.count = 0x20;
}
else if (data == 0x20) {
  wpclocals.pic.codeW = 3;
}
else if (data == 0x0d) {
  wpclocals.pic.count = (wpclocals.pic.count - 1) & 0x1f;
}

wpclocals.pic.lastW = data;
*/
  }
/*

//init

char serialNo[21];  // Securty chip serial number
example "530 123456 12345 123"
         531 123456 12345 123

wpc_serialCnv(core_gameData->wpc.serialNo, wpclocals.pic.sData,
              wpclocals.pic.codeNo);

static void wpc_serialCnv(const char no[21], UINT8 pic[16], UINT8 code[3]) {
  int x;

  pic[10] = 0x12; // whatever
  pic[2]  = 0x34; // whatever
  x = (no[5] - '0') + 10*(no[8]-'0') + 100*(no[1]-'0');
  x += pic[10]*5;
  x *= 0x001bcd; //   7117 = 11*647
  x += 0x01f3f0; // 127984 = 2*2*2*2*19*421
  pic[1]  = x >> 16;
  pic[11] = x >> 8;
  pic[9]  = x;
  x = (no[7]-'0') + 10*(no[9]-'0') + 100*(no[0]-'0') + 1000*(no[18]-'0') + 10000*(no[2]-'0');
  x += 2*pic[10] + pic[2];
  x *= 0x0000107f; //    4223 = 41*103
  x += 0x0071e259; // 7463513 = 53*53*2657
  pic[7]  = x >> 24;
  pic[12] = x >> 16;
  pic[0]  = x >> 8;
  pic[8]  = x;
  x = (no[17]-'0') + 10*(no[6]-'0') + 100*(no[4]-'0') + 1000*(no[19]-'0');
  x += pic[2];
  x *= 0x000245; //   581 = 7*83
  x += 0x003d74; // 15732 =2*2*3*3*19*23
  pic[3]  = x >> 16;
  pic[14] = x >> 8;
  pic[6]  = x;
  x = ('9'-no[11]) + 10*('9'-no[12]) + 100*('9'-no[13]) + 1000*('9'-no[14]) + 10000*('9'-no[15]);
  pic[15] = x >> 8;
  pic[4]  = x;

  x = 100*(no[0]-'0') + 10*(no[1]-'0') + (no[2]-'0');
  x = (x >> 8) * (0x100*no[17] + no[19]) + (x & 0xff) * (0x100*no[18] + no[17]);
  code[0] = x >> 16;
  code[1] = x >> 8;
  code[2] = x;
}
*/
}
