'use strict';
/*jshint bitwise: false*/

const debug = require('debug')('wpcemu:boards:up:cpu6809:');

/*
  seems to be based on 6809.c by Larry Bank

  TODO, see https://groups.google.com/forum/#!msg/comp.sys.m6809/ct2V1nGIy2c/4xfP-qI91TIJ
  1) NMIs were not being masked before the 1st LDS.
  Fixed -> NMIs are now ignored until the system stack pointer
  is initialized
  "the NMI is not recognized until the first program load of the Hardware Stack Pointer (S)."

  2) CWAI pushed state twice, once when the CWAI first executed
  and again when the interrupt occured (DOH!).
  Fixed -> The second state push has been removed.

  3) SYNC required an enabled interrupt before exiting the sync state.
  Fixed -> It now exits the sync state on the occurance of NMI,
  IRQ, or FIRQ interrupts regardless of whether IRQ or FIRQ are
  masked.  If the interrupt duration is < 3 clocks or if the interrupt
  is masked then continue executing from the next instruction
  else take the interrupt vector.

*/

/*
The MIT License (MIT)

Copyright (c) 2014 Martin Maly, http://retrocip.cz, http://www.uelectronics.info,
twitter: @uelectronics

Copyright (c) 2018 Michael Vogt
twitter: @neophob

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const F_CARRY = 1;
const F_OVERFLOW = 2;
const F_ZERO = 4;
const F_NEGATIVE = 8;
const F_IRQMASK = 16;
const F_HALFCARRY = 32;
const F_FIRQMASK = 64;
const F_ENTIRE = 128;

const vecRESET = 0xFFFE;
const vecFIRQ = 0xFFF6;
const vecIRQ = 0xFFF8;
const vecNMI = 0xFFFC;
const vecSWI = 0xFFFA;
const vecSWI2 = 0xFFF4;
const vecSWI3 = 0xFFF2;

const cycles = [
  6, 0, 0, 6, 6, 0, 6, 6, 6, 6, 6, 0, 6, 6, 3, 6, /* 00-0F */
  0, 0, 2, 4, 0, 0, 5, 9, 0, 2, 3, 0, 3, 2, 8, 6, /* 10-1F */
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, /* 20-2F */
  4, 4, 4, 4, 5, 5, 5, 5, 0, 5, 3, 6, 9,11, 0, 19, /* 30-3F */
  2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 0, 2, /* 40-4F */
  2, 0, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 0, 2, /* 50-5F */
  6, 0, 0, 6, 6, 0, 6, 6, 6, 6, 6, 0, 6, 6, 3, 6, /* 60-6F */
  7, 0, 0, 7, 7, 0, 7, 7, 7, 7, 7, 0, 7, 7, 4, 7, /* 70-7F */
  2, 2, 2, 4, 2, 2, 2, 0, 2, 2, 2, 2, 4, 7, 3, 0, /* 80-8F */
  4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 7, 5, 5, /* 90-9F */
  4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 6, 7, 5, 5, /* A0-AF */
  5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 7, 8, 6, 6, /* B0-BF */
  2, 2, 2, 4, 2, 2, 2, 0, 2, 2, 2, 2, 3, 0, 3, 0, /* C0-CF */
  4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, /* D0-DF */
  4, 4, 4, 6, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, /* E0-EF */
  5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6  /* F0-FF */
];

/* Instruction timing for the two-byte opcodes */
const cycles2 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 00-0F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 10-1F */
  0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, /* 20-2F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, /* 30-3F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 40-4F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 50-5F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 60-6F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 70-7F */
  0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 4, 0, /* 80-8F */
  0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 6, 6, /* 90-9F */
  0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 6, 6, /* A0-AF */
  0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 7, 7, /* B0-BF */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, /* C0-CF */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, /* D0-DF */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, /* E0-EF */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7  /* F0-FF */
];

/* Negative and zero flags for quicker flag settings */
const flagsNZ = [
  4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 00-0F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 10-1F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 20-2F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 30-3F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 40-4F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 50-5F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 60-6F */
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* 70-7F */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, /* 80-8F */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, /* 90-9F */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, /* A0-AF */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, /* B0-BF */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, /* C0-CF */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, /* D0-DF */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, /* E0-EF */
  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8  /* F0-FF */
];

module.exports = {
  getInstance
};

function getInstance(memoryWriteFunction, memoryReadFunction, name) {
  return new Cpu6809(memoryWriteFunction, memoryReadFunction, name);
}

class Cpu6809 {
  constructor(memoryWriteFunction, memoryReadFunction, name) {
    // see https://github.com/ddhp/remove-debug-loader/issues/1
    this.name = name;
    debug(this.name, 'INITIALISE CPU');

    this.memoryWriteFunction = memoryWriteFunction;
    this.memoryReadFunction = memoryReadFunction;

    this.tickCount = 0;

    this.missedIRQ = 0;
    this.missedFIRQ = 0;

    this.irqPendingNMI = false;
    this.irqPendingFIRQ = false;
    this.irqPendingIRQ = false;
    this.irqCount = 0;
    this.firqCount = 0;
    this.nmiCount = 0;

    this.regA = 0;
    this.regB = 0;
    this.regX = 0;
    this.regY = 0;
    this.regU = 0;
    this.regS = 0;
    this.regCC = 0;
    this.regPC = 0;
    this.regDP = 0;
  }

  // set overflow flag
  setV8(a, b, r) {
    this.regCC |= ((a ^ b ^ r ^ (r >> 1)) & 0x80) >> 6;
  }

  // set overflow flag
  setV16(a, b, r) {
    this.regCC |= ((a ^ b ^ r ^ (r >> 1)) & 0x8000) >> 14;
  }

  getD() {
    return (this.regA << 8) + this.regB;
  }

  setD(v) {
    this.regA = (v >> 8) & 0xff;
    this.regB = v & 0xff;
  }

  PUSHB(b) {
    this.regS = (this.regS - 1) & 0xFFFF;
    this.memoryWriteFunction(this.regS, b & 0xFF);
  }

  PUSHW(b) {
    debug(this.name, 'PUSHW', b, this.regS);
    this.regS = (this.regS - 1) & 0xFFFF;
    this.memoryWriteFunction(this.regS, b & 0xFF);
    this.regS = (this.regS - 1) & 0xFFFF;
    this.memoryWriteFunction(this.regS, (b >> 8) & 0xFF);
  }

  PUSHBU(b) {
    this.regU = (this.regU - 1) & 0xFFFF;
    this.memoryWriteFunction(this.regU, b & 0xFF);
  }

  PUSHWU(b) {
    this.regU = (this.regU - 1) & 0xFFFF;
    this.memoryWriteFunction(this.regU, b & 0xFF);
    this.regU = (this.regU - 1) & 0xFFFF;
    this.memoryWriteFunction(this.regU, (b >> 8) & 0xFF);
  }

  PULLB() {
    return this.memoryReadFunction(this.regS++);
  }

  PULLW() {
    debug(this.name, 'PULLW', this.regS);
    return (this.memoryReadFunction(this.regS++) << 8) + this.memoryReadFunction(this.regS++);
  }

  PULLBU() {
    return this.memoryReadFunction(this.regU++);
  }

  PULLWU() {
    return (this.memoryReadFunction(this.regU++) << 8) + this.memoryReadFunction(this.regU++);
  }

  //Push A, B, CC, DP, D, X, Y, U, or PC onto hardware stack
  PSHS(ucTemp) {
    var i = 0;
    if (ucTemp & 0x80) {
      this.PUSHW(this.regPC);
      i += 2;
    }
    if (ucTemp & 0x40) {
      this.PUSHW(this.regU);
      i += 2;
    }
    if (ucTemp & 0x20) {
      this.PUSHW(this.regY);
      i += 2;
    }
    if (ucTemp & 0x10) {
      this.PUSHW(this.regX);
      i += 2;
    }
    if (ucTemp & 0x8) {
      this.PUSHB(this.regDP);
      i++;
    }
    if (ucTemp & 0x4) {
      this.PUSHB(this.regB);
      i++;
    }
    if (ucTemp & 0x2) {
      this.PUSHB(this.regA);
      i++;
    }
    if (ucTemp & 0x1) {
      this.PUSHB(this.regCC);
      i++;
    }
    this.tickCount += i; //timing
  }

  //Push A, B, CC, DP, D, X, Y, S, or PC onto user stack
  PSHU(ucTemp) {
    var i = 0;
    if (ucTemp & 0x80) {
      this.PUSHWU(this.regPC);
      i += 2;
    }
    if (ucTemp & 0x40) {
      this.PUSHWU(this.regS);
      i += 2;
    }
    if (ucTemp & 0x20) {
      this.PUSHWU(this.regY);
      i += 2;
    }
    if (ucTemp & 0x10) {
      this.PUSHWU(this.regX);
      i += 2;
    }
    if (ucTemp & 0x8) {
      this.PUSHBU(this.regDP);
      i++;
    }
    if (ucTemp & 0x4) {
      this.PUSHBU(this.regB);
      i++;
    }
    if (ucTemp & 0x2) {
      this.PUSHBU(this.regA);
      i++;
    }
    if (ucTemp & 0x1) {
      this.PUSHBU(this.regCC);
      i++;
    }
    this.tickCount += i; //timing
  }

  //Pull A, B, CC, DP, D, X, Y, U, or PC from hardware stack
  PULS(ucTemp) {
    var i = 0;
    if (ucTemp & 0x1) {
      this.regCC = this.PULLB();
      i++;
    }
    if (ucTemp & 0x2) {
      this.regA = this.PULLB();
      i++;
    }
    if (ucTemp & 0x4) {
      this.regB = this.PULLB();
      i++;
    }
    if (ucTemp & 0x8) {
      this.regDP = this.PULLB();
      i++;
    }
    if (ucTemp & 0x10) {
      this.regX = this.PULLW();
      i += 2;
    }
    if (ucTemp & 0x20) {
      this.regY = this.PULLW();
      i += 2;
    }
    if (ucTemp & 0x40) {
      this.regU = this.PULLW();
      i += 2;
    }
    if (ucTemp & 0x80) {
      this.regPC = this.PULLW();
      i += 2;
    }
    this.tickCount += i; //timing
  }

  //Pull A, B, CC, DP, D, X, Y, S, or PC from hardware stack
  PULU(ucTemp) {
    var i = 0;
    if (ucTemp & 0x1) {
      this.regCC = this.PULLBU();
      i++;
    }
    if (ucTemp & 0x2) {
      this.regA = this.PULLBU();
      i++;
    }
    if (ucTemp & 0x4) {
      this.regB = this.PULLBU();
      i++;
    }
    if (ucTemp & 0x8) {
      this.regDP = this.PULLBU();
      i++;
    }
    if (ucTemp & 0x10) {
      this.regX = this.PULLWU();
      i += 2;
    }
    if (ucTemp & 0x20) {
      this.regY = this.PULLWU();
      i += 2;
    }
    if (ucTemp & 0x40) {
      this.regS = this.PULLWU();
      i += 2;
    }
    if (ucTemp & 0x80) {
      this.regPC = this.PULLWU();
      i += 2;
    }
    this.tickCount += i; //timing
  }

  getPBR(ucPostByte) {
    switch (ucPostByte & 0xf) {
      case 0x00:
        return this.getD();
      case 0x1:
        return this.regX;
      case 0x2:
        return this.regY;
      case 0x3:
        return this.regU;
      case 0x4:
        return this.regS;
      case 0x5:
        return this.regPC;
      case 0x8:
        return this.regA;
      case 0x9:
        return this.regB;
      case 0xA:
        return this.regCC;
      case 0xB:
        return this.regDP;
      default:
        /* illegal */
        throw new Error('getPBR_INVALID' + ucPostByte);
    }
  }

  setPBR(ucPostByte, v) {
    /* Get destination register */
    switch (ucPostByte & 0xf) {
      case 0x00:
        this.setD(v);
        return;
      case 0x1:
        this.regX = v;
        return;
      case 0x2:
        this.regY = v;
        return;
      case 0x3:
        this.regU = v;
        return;
      case 0x4:
        this.regS = v;
        return;
      case 0x5:
        this.regPC = v;
        return;
      case 0x8:
        this.regA = v;
        return;
      case 0x9:
        this.regB = v;
        return;
      case 0xA:
        this.regCC = v;
        return;
      case 0xB:
        this.regDP = v;
        return;
      default:
        /* illegal */
        throw new Error('setPBR_INVALID' + ucPostByte);
    }
  }

  TFREXG(ucPostByte, bExchange) {
    var ucTemp = ucPostByte & 0x88;
    if (ucTemp === 0x80 || ucTemp === 0x08) {
      throw new Error('TFREXG_ERROR');
    }

    ucTemp = this.getPBR(ucPostByte >> 4);
    if (bExchange) {
      this.setPBR(ucPostByte >> 4, this.getPBR(ucPostByte));
    }
    /* Transfer */
    this.setPBR(ucPostByte, ucTemp);
  }

  signed(x) {
    return x > 127 ? x - 256 : x;
  }

  signed16(x) {
    return x > 32767 ? x - 65536 : x;
  }

  fetch() {
    return this.memoryReadFunction(this.regPC++);
  }

  fetch16() {
    const v1 = this.memoryReadFunction(this.regPC++);
    const v2 = this.memoryReadFunction(this.regPC++);
    return (v1 << 8) + v2;
  }

  ReadWord(addr) {
    const v1 = this.memoryReadFunction(addr++);
    const v2 = this.memoryReadFunction(addr);
    return (v1 << 8) + v2;
  }

  WriteWord(addr, v) {
    this.memoryWriteFunction(addr++, (v >> 8) & 0xff);
    this.memoryWriteFunction(addr, v & 0xff);
  }

  //PURPOSE    : Calculate the EA for indexed addressing mode.
  PostByte() {
    const pb = this.fetch();
    var preg;
    // Isolate register is used for the indexed operation
    switch (pb & 0x60) {
      case 0:
        preg = this.regX;
        break;
      case 0x20:
        preg = this.regY;
        break;
      case 0x40:
        preg = this.regU;
        break;
      case 0x60:
        preg = this.regS;
        break;
      default:
        throw new Error('INVALID_ADDRESS_PB');
    }

    var xchg = null;
    var addr = null;
    var sTemp;

    if (pb & 0x80) {
      // Complex stuff
      switch (pb & 0x0F) {
        case 0:
          // EA = ,reg+
          addr = preg;
          xchg = preg + 1;
          this.tickCount += 2;
          break;
        case 1:
          // EA = ,reg++
          addr = preg;
          xchg = preg + 2;
          this.tickCount += 3;
          break;
        case 2:
          // EA = ,-reg
          xchg = preg - 1;
          addr = xchg;
          this.tickCount += 2;
          break;
        case 3:
          // EA = ,--reg
          xchg = preg - 2;
          addr = xchg;
          this.tickCount += 3;
          break;
        case 4:
          // EA = ,reg
          addr = preg;
          break;
        case 5:
          // EA = ,reg + B
          addr = preg + this.signed(this.regB);
          /*
          ea.b[LSB]  = cpu->B;
          ea.b[MSB]  = (cpu->B < 0x80) ? 0x00 : 0xFF;
          ea.w      += cpu->index[reg].w;
          */
          this.tickCount += 1;
          break;
        case 6:
          // EA = ,reg + A
          addr = preg + this.signed(this.regA);
          /*
          ea.b[LSB]  = cpu->A;
          ea.b[MSB]  = (cpu->A < 0x80) ? 0x00: 0xFF;
          ea.w      += cpu->index[reg].w;
          */
          this.tickCount += 1;
          break;
        case 7:
          // illegal
          throw new Error('INVALID_ADDRESS_MODE_0x07');
        case 8:
          // EA = ,reg + 8-bit offset
          addr = preg + this.signed(this.fetch());
          /*
          ea.b[LSB]  = (*cpu->read)(cpu,cpu->pc.w++,true);
          ea.b[MSB]  = (ea.b[LSB] < 0x80) ? 0x00 : 0xFF;
          ea.w      += cpu->index[reg].w;
          */
          this.tickCount += 1;
          break;
        case 9:
          // EA = ,reg + 16-bit offset
          addr = preg + this.signed16(this.fetch16());
          /*
          ea.b[MSB]  = (*cpu->read)(cpu,cpu->pc.w++,true);
          ea.b[LSB]  = (*cpu->read)(cpu,cpu->pc.w++,true);
          ea.w      += cpu->index[reg].w;
          */
          this.tickCount += 4;
          break;
        case 0xA:
          // illegal
          throw new Error('INVALID_ADDRESS_MODE_0x0A');
        case 0xB:
          // EA = ,reg + D
          this.tickCount += 4;
          addr = preg + this.getD();
          break;
        case 0xC:
          // EA = this.regPC + 8-bit offset
          sTemp = this.signed(this.fetch());
          addr = this.regPC + sTemp;
          this.tickCount += 1;
          break;
        case 0xD:
          // EA = this.regPC + 16-bit offset
          sTemp = this.signed16(this.fetch16());
          addr = this.regPC + sTemp;
          this.tickCount += 5;
          break;
        case 0xE:
          // Illegal
          throw new Error('INVALID_ADDRESS_MODE_0x0E');
        case 0xF:
          // EA = [,address]
          this.tickCount += 5;
          addr = this.fetch16();
          break;
      }

      addr &= 0xffff;

      if (pb & 0x10) {
        // Indirect addressing
        addr = this.ReadWord(addr);
        this.tickCount += 3;
      }
    } else {
      // Just a 5 bit signed offset + register
      var sByte = pb & 0x1F;
      if (sByte > 15) {
        // Two's complement 5-bit value
        sByte -= 32;
      }
      addr = preg + sByte;
      this.tickCount += 1;
    }

    if (xchg !== null) {
      switch (pb & 0x60) {
        case 0:
          this.regX = xchg;// & 0xFFFF;
          break;
        case 0x20:
          this.regY = xchg;// & 0xFFFF;
          break;
        case 0x40:
          this.regU = xchg;// & 0xFFFF;
          break;
        case 0x60:
          this.regS = xchg;// & 0xFFFF;
          break;
        default:
          throw new Error('PB_INVALID_XCHG_VALUE_' + pb);
      }
    }
    // Return the effective address
    return addr & 0xffff;
  }

  flagsNZ16(word) {
    this.regCC &= ~(F_ZERO | F_NEGATIVE);
    if (word === 0) {
      this.regCC |= F_ZERO;
    }
    if (word & 0x8000) {
      this.regCC |= F_NEGATIVE;
    }
  }

  // ============= Operations

  oINC(b) {
    b = (b + 1) & 0xFF;
    this.regCC &= ~(F_ZERO | F_OVERFLOW | F_NEGATIVE);
    this.regCC |= flagsNZ[b];
    //Docs say:
    //V: Set if the original operand was 01111111
    if (b === 0x80) {
      this.regCC |= F_OVERFLOW;
    }
    return b;
  }

  oDEC(b) {
    b = (b - 1) & 0xFF;
    this.regCC &= ~(F_ZERO | F_OVERFLOW | F_NEGATIVE);
    this.regCC |= flagsNZ[b];
    //Docs say:
    //V: Set if the original operand was 10000000
    if (b === 0x7f) {
      this.regCC |= F_OVERFLOW;
    }
    return b;
  }

  oSUB(b, v) {
    var temp = b - v;
    this.regCC &= ~(F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (temp & 0x100) {
      this.regCC |= F_CARRY;
    }
    this.setV8(b, v, temp);
    temp &= 0xFF;
    this.regCC |= flagsNZ[temp];
    return temp;
  }

  oSUB16(b, v) {
    var temp = b - v;
    this.regCC &= ~(F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (temp & 0x8000) {
      this.regCC |= F_NEGATIVE;
    }
    if (temp & 0x10000) {
      this.regCC |= F_CARRY;
    }
    this.setV16(b, v, temp);
    temp &= 0xFFFF;
    if (temp === 0) {
      this.regCC |= F_ZERO;
    }
    return temp;
  }

  oADD(b, v) {
    var temp = b + v;
    this.regCC &= ~(F_HALFCARRY | F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (temp & 0x100) {
      this.regCC |= F_CARRY;
    }
    this.setV8(b, v, temp);
    if ((temp ^ b ^ v) & 0x10) {
      this.regCC |= F_HALFCARRY;
    }
    temp &= 0xFF;
    this.regCC |= flagsNZ[temp];
    return temp;
  }

  oADD16(b, v) {
    var temp = b + v;
    this.regCC &= ~(F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (temp & 0x8000) {
      this.regCC |= F_NEGATIVE;
    }
    if (temp & 0x10000) {
      this.regCC |= F_CARRY;
    }
    this.setV16(b, v, temp);
    temp &= 0xFFFF;
    if (temp === 0) {
      this.regCC |= F_ZERO;
    }
    return temp;
  }

  oADC(b, v) {
    var temp = b + v + (this.regCC & F_CARRY);
    this.regCC &= ~(F_HALFCARRY | F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (temp & 0x100) {
      this.regCC |= F_CARRY;
    }
    this.setV8(b, v, temp);
    if ((temp ^ b ^ v) & 0x10) {
      this.regCC |= F_HALFCARRY;
    }
    temp &= 0xFF;
    this.regCC |= flagsNZ[temp];
    return temp;
  }

  oSBC(b, v) {
    var temp = b - v - (this.regCC & F_CARRY);
    this.regCC &= ~(F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (temp & 0x100) {
      this.regCC |= F_CARRY;
    }
    this.setV8(b, v, temp);
    temp &= 0xFF;
    this.regCC |= flagsNZ[temp];
    return temp;
  }

  oCMP(b, v) {
    var temp = b - v;
    this.regCC &= ~(F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (temp & 0x100) {
      this.regCC |= F_CARRY;
    }
    this.setV8(b, v, temp);
    temp &= 0xFF;
    this.regCC |= flagsNZ[temp];
  }

  oCMP16(b, v) {
    var temp = b - v;
    this.regCC &= ~(F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if ((temp & 0xFFFF) === 0) {
      this.regCC |= F_ZERO;
    }
    if (temp & 0x8000) {
      this.regCC |= F_NEGATIVE;
    }
    if (temp & 0x10000) {
      this.regCC |= F_CARRY;
    }
    this.setV16(b, v, temp);
  }

  oNEG(b) {
    this.regCC &= ~(F_CARRY | F_ZERO | F_OVERFLOW | F_NEGATIVE);
    if (b === 0x80) {
      this.regCC |= F_OVERFLOW;
    }
    b *= -1;
    if (b === 0) {
      this.regCC |= F_ZERO;
    }
    if (b & 0x80) {
      this.regCC |= F_NEGATIVE | F_CARRY;
    }
    return b;
  }

  oLSR(b) {
    this.regCC &= ~(F_ZERO | F_CARRY | F_NEGATIVE);
    if (b & F_CARRY) {
      this.regCC |= F_CARRY;
    }
    b >>= 1;
    if (b === 0) {
      this.regCC |= F_ZERO;
    }
    return b;
  }

  oASR(b) {
    this.regCC &= ~(F_ZERO | F_CARRY | F_NEGATIVE);
    if (b & 0x01) {
      this.regCC |= F_CARRY;
    }
    b = (b & 0x80) | (b >> 1);
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    return b;
  }

  oASL(b) {
    var temp = b;
    this.regCC &= ~(F_ZERO | F_CARRY | F_NEGATIVE | F_OVERFLOW);
    if (b & 0x80) {
      this.regCC |= F_CARRY;
    }
    b <<= 1;
    if ((b ^ temp) & 0x80) {
      this.regCC |= F_OVERFLOW;
    }
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    return b;
  }

  oROL(b) {
    var temp = b;
    var oldCarry = this.regCC & F_CARRY;
    this.regCC &= ~(F_ZERO | F_CARRY | F_NEGATIVE | F_OVERFLOW);
    if (b & 0x80) {
      this.regCC |= F_CARRY;
    }
    b = (b << 1) | oldCarry;
    if ((b ^ temp) & 0x80) {
      this.regCC |= F_OVERFLOW;
    }
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    return b;
  }

  oROR(b) {
    var oldCarry = this.regCC & F_CARRY;
    this.regCC &= ~(F_ZERO | F_CARRY | F_NEGATIVE);
    if (b & 0x01) {
      this.regCC |= F_CARRY;
    }
    b = (b >> 1) | (oldCarry << 7);
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    return b;
  }

  oEOR(b, v) {
    this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
    b ^= v;
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    return b;
  }

  oOR(b, v) {
    this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
    b |= v;
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    return b;
  }

  oAND(b, v) {
    this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
    b &= v;
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    return b;
  }

  oCOM(b) {
    this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
    b ^= 0xFF;
    b &= 0xFF;
    this.regCC |= flagsNZ[b];
    this.regCC |= F_CARRY;
    return b;
  }

  //----common
  dpadd() {
    //direct page + 8bit index
    return (this.regDP << 8) + this.fetch();
  }

  checkInterrupt() {
    //check for pending irq, order or interrupts is important: NMI/FIRQ/IRQ
    if (this.irqPendingNMI) {
      this.irqPendingNMI = false;
      this.nmiCount++;
      this._executeNmi();
    } else if (this.irqPendingFIRQ && ((this.regCC & F_FIRQMASK) === 0)) {
      this.irqPendingFIRQ = false;
      this.firqCount++;
      this._executeFirq();
    } else if (this.irqPendingIRQ && ((this.regCC & F_IRQMASK) === 0)) {
      this.irqPendingIRQ = false;
      this.irqCount++;
      this._executeIrq();
    }
  }

  step() {
    const oldTickCount = this.tickCount;

    this.checkInterrupt();

    var addr = null;
    var pb = null;

    var opcode = this.fetch();
    this.tickCount += cycles[opcode];

    switch (opcode) {
      case 0x00: //NEG DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oNEG(this.memoryReadFunction(addr))
        );
        break;
      case 0x03: //COM DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oCOM(this.memoryReadFunction(addr))
        );
        break;
      case 0x04: //LSR DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oLSR(this.memoryReadFunction(addr))
        );
        break;
      case 0x06: //ROR DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oROR(this.memoryReadFunction(addr))
        );
        break;
      case 0x07: //ASR DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oASR(this.memoryReadFunction(addr))
        );
        break;
      case 0x08: //ASL DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oASL(this.memoryReadFunction(addr))
        );
        break;
      case 0x09: //ROL DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oROL(this.memoryReadFunction(addr))
        );
        break;

      case 0x0a: //DEC DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oDEC(this.memoryReadFunction(addr))
        );
        break;
      case 0x0c: //INC DP
        addr = this.dpadd();
        this.memoryWriteFunction(
          addr,
          this.oINC(this.memoryReadFunction(addr))
        );
        break;

      case 0x0d: //TST DP
        addr = this.dpadd();
        pb = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[pb];
        break;

      case 0x0e: //JMP DP
        addr = this.dpadd();
        this.regPC = addr;
        break;
      case 0x0f: //CLR DP
        addr = this.dpadd();
        this.memoryWriteFunction(addr, 0);
        this.regCC &= ~(F_CARRY | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= F_ZERO;
        break;

      case 0x12: //NOP
        break;
      case 0x13: //SYNC
        /*
        This commands stops the CPU, brings the processor bus to high impedance state and waits for an interrupt.
        */
        console.log('SYNC');
        break;
      case 0x16: //LBRA relative
        addr = this.signed16(this.fetch16());
        this.regPC += addr;
        break;
      case 0x17: //LBSR relative
        addr = this.signed16(this.fetch16());
        this.PUSHW(this.regPC);
        this.regPC += addr;
        break;
      case 0x19: //DAA
        var cf = 0;
        var nhi = this.regA & 0xF0;
        var nlo = this.regA & 0x0F;
        if (nlo > 0x09 || this.regCC & 0x20)
          cf |= 0x06;
        if (nhi > 0x80 && nlo > 0x09)
          cf |= 0x60;
        if (nhi > 0x90 || this.regCC & 0x01)
          cf |= 0x60;
        addr = cf + this.regA;
        this.regCC &= ~(F_CARRY | F_NEGATIVE | F_ZERO | F_OVERFLOW);
        if (addr & 0x100) this.regCC |= F_CARRY;
        this.regA = addr & 0xFF;
        this.regCC |= flagsNZ[this.regA];
        break;
      case 0x1a: //ORCC
        this.regCC |= this.fetch();
        break;
      case 0x1c: //ANDCC
        this.regCC &= this.fetch();
        break;
      case 0x1d: //SEX
        this.regA = this.regB & 0x80 ? 0xff : 0;
        this.flagsNZ16(this.getD());
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0x1e: //EXG
        pb = this.fetch();
        this.TFREXG(pb, true);
        break;
      case 0x1f: //EXG
        pb = this.fetch();
        this.TFREXG(pb, false);
        break;

      case 0x20: //BRA
        addr = this.signed(this.fetch());
        this.regPC += addr;
        break;
      case 0x21: //BRN
        addr = this.signed(this.fetch());
        break;
      case 0x22: //BHI
        addr = this.signed(this.fetch());
        if (!(this.regCC & (F_CARRY | F_ZERO))) this.regPC += addr;
        break;
      case 0x23: //BLS
        addr = this.signed(this.fetch());
        if (this.regCC & (F_CARRY | F_ZERO)) this.regPC += addr;
        break;
      case 0x24: //Bthis.regCC
        addr = this.signed(this.fetch());
        if (!(this.regCC & F_CARRY)) this.regPC += addr;
        break;
      case 0x25: //BCS
        addr = this.signed(this.fetch());
        if (this.regCC & F_CARRY) this.regPC += addr;
        break;
      case 0x26: //BNE
        addr = this.signed(this.fetch());
        if (!(this.regCC & F_ZERO)) this.regPC += addr;
        break;
      case 0x27: //BEQ
        addr = this.signed(this.fetch());
        if (this.regCC & F_ZERO) this.regPC += addr;
        break;
      case 0x28: //BVC
        addr = this.signed(this.fetch());
        if (!(this.regCC & F_OVERFLOW)) this.regPC += addr;
        break;
      case 0x29: //BVS
        addr = this.signed(this.fetch());
        if (this.regCC & F_OVERFLOW) this.regPC += addr;
        break;
      case 0x2a: //BPL
        addr = this.signed(this.fetch());
        if (!(this.regCC & F_NEGATIVE)) this.regPC += addr;
        break;
      case 0x2b: //BMI
        addr = this.signed(this.fetch());
        if (this.regCC & F_NEGATIVE) this.regPC += addr;
        break;
      case 0x2c: //BGE
        addr = this.signed(this.fetch());
        if (!((this.regCC & F_NEGATIVE) ^ ((this.regCC & F_OVERFLOW) << 2)))
          this.regPC += addr;
        break;
      case 0x2d: //BLT
        addr = this.signed(this.fetch());
        if ((this.regCC & F_NEGATIVE) ^ ((this.regCC & F_OVERFLOW) << 2))
          this.regPC += addr;
        break;
      case 0x2e: //BGT
        addr = this.signed(this.fetch());
        if (
          !((this.regCC & F_NEGATIVE) ^ ((this.regCC & F_OVERFLOW) << 2) ||
            this.regCC & F_ZERO)
        )
          this.regPC += addr;
        break;
      case 0x2f: //BLE
        addr = this.signed(this.fetch());
        if (
          (this.regCC & F_NEGATIVE) ^ ((this.regCC & F_OVERFLOW) << 2) ||
          this.regCC & F_ZERO
        )
          this.regPC += addr;
        break;

      case 0x30: //LEAX
        this.regX = this.PostByte();
        this.regCC &= ~F_ZERO;
        if (this.regX === 0) this.regCC |= F_ZERO;
        //else this.regCC &= ~F_ZERO;
        break;
      case 0x31: //LEAY
        this.regY = this.PostByte();
        this.regCC &= ~F_ZERO;
        if (this.regY === 0) this.regCC |= F_ZERO;
        //else this.regCC &= ~F_ZERO;
        break;
      case 0x32: //LEAS
        this.regS = this.PostByte();
        break;
      case 0x33: //LEAU
        this.regU = this.PostByte();
        break;

      case 0x34: //PSHS
        this.PSHS(this.fetch());
        break;
      case 0x35: //PULS
        this.PULS(this.fetch());
        break;
      case 0x36: //PSHU
        this.PSHU(this.fetch());
        break;
      case 0x37: //PULU
        this.PULU(this.fetch());
        break;
      case 0x39: //RTS
        this.regPC = this.PULLW();
        break;
      case 0x3a: //ABX
        this.regX += this.regB;
        break;
      case 0x3b: //RTI
        this.regCC = this.PULLB();
        // Check for fast interrupt
        if (this.regCC & F_ENTIRE) {
          this.tickCount += 9;
          this.regA = this.PULLB();
          this.regB = this.PULLB();
          this.regDP = this.PULLB();
          this.regX = this.PULLW();
          this.regY = this.PULLW();
          this.regU = this.PULLW();
        }
        this.regPC = this.PULLW();
        break;
      case 0x3c: //CWAI
        console.log('CWAI might be broken!');
        /*
         * CWAI stacks the entire machine state on the hardware stack,
         * then waits for an interrupt; when the interrupt is taken
         * later, the state is *not* saved again after CWAI.
         */
        // larry pages 6809 emu does this
        //             regs->ucRegCC &= M6809ReadByte(m_map09, PC++);
        this.regCC &= this.fetch();
        //TODO - ??? set cwai flag to true, do not exec next interrupt (NMI, FIRQ, IRQ) - but set reset cwai flag afterwards
        break;
      case 0x3d: //MUL
        addr = this.regA * this.regB;
        if (addr === 0) this.regCC |= F_ZERO;
          else this.regCC &= ~F_ZERO;
        if (addr & 0x80) this.regCC |= F_CARRY;
          else this.regCC &= ~F_CARRY;
        this.setD(addr);
        break;
      case 0x3f: //SWI
        console.log('swi');
        this.regCC |= F_ENTIRE;
        this.PUSHW(this.regPC);
        this.PUSHW(this.regU);
        this.PUSHW(this.regY);
        this.PUSHW(this.regX);
        this.PUSHB(this.regDP);
        this.PUSHB(this.regB);
        this.PUSHB(this.regA);
        this.PUSHB(this.regCC);
        this.regCC |= F_IRQMASK | F_FIRQMASK;
        this.regPC = this.ReadWord(vecSWI);
        break;

      case 0x40:
        this.regA = this.oNEG(this.regA);
        break;
      case 0x43:
        this.regA = this.oCOM(this.regA);
        break;
      case 0x44:
        this.regA = this.oLSR(this.regA);
        break;
      case 0x46:
        this.regA = this.oROR(this.regA);
        break;
      case 0x47:
        this.regA = this.oASR(this.regA);
        break;
      case 0x48:
        this.regA = this.oASL(this.regA);
        break;
      case 0x49:
        this.regA = this.oROL(this.regA);
        break;
      case 0x4a:
        this.regA = this.oDEC(this.regA);
        break;
      case 0x4c:
        this.regA = this.oINC(this.regA);
        break;
      case 0x4d: // tsta
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0x4f:
        this.regA = 0;
        this.regCC &= ~(F_NEGATIVE | F_OVERFLOW | F_CARRY);
        this.regCC |= F_ZERO;
        break;

      case 0x50:
        this.regB = this.oNEG(this.regB);
        break;
      case 0x53:
        this.regB = this.oCOM(this.regB);
        break;
      case 0x54:
        this.regB = this.oLSR(this.regB);
        break;
      case 0x56:
        this.regB = this.oROR(this.regB);
        break;
      case 0x57:
        this.regB = this.oASR(this.regB);
        break;
      case 0x58:
        this.regB = this.oASL(this.regB);
        break;
      case 0x59:
        this.regB = this.oROL(this.regB);
        break;
      case 0x5a:
        this.regB = this.oDEC(this.regB);
        break;
      case 0x5c: // INCB
        this.regB = this.oINC(this.regB);
        break;
      case 0x5d:
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0x5f: //CLRB
        this.regB = 0;
        this.regCC &= ~(F_NEGATIVE | F_OVERFLOW | F_CARRY);
        this.regCC |= F_ZERO;
        break;

      case 0x60: //NEG indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oNEG(this.memoryReadFunction(addr))
        );
        break;
      case 0x63: //COM indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oCOM(this.memoryReadFunction(addr))
        );
        break;
      case 0x64: //LSR indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oLSR(this.memoryReadFunction(addr))
        );
        break;
      case 0x66: //ROR indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oROR(this.memoryReadFunction(addr))
        );
        break;
      case 0x67: //ASR indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oASR(this.memoryReadFunction(addr))
        );
        break;
      case 0x68: //ASL indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oASL(this.memoryReadFunction(addr))
        );
        break;
      case 0x69: //ROL indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oROL(this.memoryReadFunction(addr))
        );
        break;

      case 0x6a: //DEC indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oDEC(this.memoryReadFunction(addr))
        );
        break;
      case 0x6c: //INC indexed
        addr = this.PostByte();
        this.memoryWriteFunction(
          addr,
          this.oINC(this.memoryReadFunction(addr))
        );
        break;

      case 0x6d: //TST indexed
        addr = this.PostByte();
        pb = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[pb];
        break;

      case 0x6e: //JMP indexed
        addr = this.PostByte();
        this.regPC = addr;
        break;
      case 0x6f: //CLR indexed
        addr = this.PostByte();
        this.memoryWriteFunction(addr, 0);
        this.regCC &= ~(F_CARRY | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= F_ZERO;
        break;

      case 0x70: //NEG extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oNEG(this.memoryReadFunction(addr))
        );
        break;
      case 0x73: //COM extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oCOM(this.memoryReadFunction(addr))
        );
        break;
      case 0x74: //LSR extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oLSR(this.memoryReadFunction(addr))
        );
        break;
      case 0x76: //ROR extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oROR(this.memoryReadFunction(addr))
        );
        break;
      case 0x77: //ASR extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oASR(this.memoryReadFunction(addr))
        );
        break;
      case 0x78: //ASL extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oASL(this.memoryReadFunction(addr))
        );
        break;
      case 0x79: //ROL extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oROL(this.memoryReadFunction(addr))
        );
        break;

      case 0x7a: //DEC extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oDEC(this.memoryReadFunction(addr))
        );
        break;
      case 0x7c: //INC extended
        addr = this.fetch16();
        this.memoryWriteFunction(
          addr,
          this.oINC(this.memoryReadFunction(addr))
        );
        break;

      case 0x7d: //TST extended
        addr = this.fetch16();
        pb = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[pb];
        break;

      case 0x7e: //JMP extended
        addr = this.fetch16();
        this.regPC = addr;
        break;
      case 0x7f: //CLR extended
        addr = this.fetch16();
        this.memoryWriteFunction(addr, 0);
        this.regCC &= ~(F_CARRY | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= F_ZERO;
        break;
      // regs A,X


      case 0x80: //SUBA imm
        this.regA = this.oSUB(this.regA, this.fetch());
        break;
      case 0x81: //CMPA imm
        this.oCMP(this.regA, this.fetch());
        break;
      case 0x82: //SBCA imm
        this.regA = this.oSBC(this.regA, this.fetch());
        break;
      case 0x83: //SUBD imm
        this.setD(this.oSUB16(this.getD(), this.fetch16()));
        break;
      case 0x84: //ANDA imm
        this.regA = this.oAND(this.regA, this.fetch());
        break;
      case 0x85: //BITA imm
        this.oAND(this.regA, this.fetch());
        break;
      case 0x86: //LDA imm
        this.regA = this.fetch();
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0x88: //EORA imm
        this.regA = this.oEOR(this.regA, this.fetch());
        break;
      case 0x89: //ADCA imm
        this.regA = this.oADC(this.regA, this.fetch());
        break;
      case 0x8a: //ORA imm
        this.regA = this.oOR(this.regA, this.fetch());
        break;
      case 0x8b: //ADDA imm
        this.regA = this.oADD(this.regA, this.fetch());
        break;
      case 0x8c: //CMPX imm
        this.oCMP16(this.regX, this.fetch16());
        break;

      case 0x8d: //JSR imm
        addr = this.signed(this.fetch());
        this.PUSHW(this.regPC);
        this.regPC += addr;
        break;
      case 0x8e: //LDX imm
        this.regX = this.fetch16();
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0x90: //SUBA direct
        addr = this.dpadd();
        this.regA = this.oSUB(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x91: //CMPA direct
        addr = this.dpadd();
        this.oCMP(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x92: //SBCA direct
        addr = this.dpadd();
        this.regA = this.oSBC(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x93: //SUBD direct
        addr = this.dpadd();
        this.setD(this.oSUB16(this.getD(), this.ReadWord(addr)));
        break;
      case 0x94: //ANDA direct
        addr = this.dpadd();
        this.regA = this.oAND(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x95: //BITA direct
        addr = this.dpadd();
        this.oAND(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x96: //LDA direct
        addr = this.dpadd();
        this.regA = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0x97: //STA direct
        addr = this.dpadd();
        this.memoryWriteFunction(addr, this.regA);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0x98: //EORA direct
        addr = this.dpadd();
        this.regA = this.oEOR(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x99: //ADCA direct
        addr = this.dpadd();
        this.regA = this.oADC(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x9a: //ORA direct
        addr = this.dpadd();
        this.regA = this.oOR(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x9b: //ADDA direct
        addr = this.dpadd();
        this.regA = this.oADD(this.regA, this.memoryReadFunction(addr));
        break;
      case 0x9c: //CMPX direct
        addr = this.dpadd();
        this.oCMP16(this.regX, this.ReadWord(addr));
        break;

      case 0x9d: //JSR direct
        addr = this.dpadd();
        this.PUSHW(this.regPC);
        this.regPC = addr;
        break;
      case 0x9e: //LDX direct
        addr = this.dpadd();
        this.regX = this.ReadWord(addr);
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0x9f: //STX direct
        addr = this.dpadd();
        this.WriteWord(addr, this.regX);
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xa0: //SUBA indexed
        addr = this.PostByte();
        this.regA = this.oSUB(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xa1: //CMPA indexed
        addr = this.PostByte();
        this.oCMP(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xa2: //SBCA indexed
        addr = this.PostByte();
        this.regA = this.oSBC(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xa3: //SUBD indexed
        addr = this.PostByte();
        this.setD(this.oSUB16(this.getD(), this.ReadWord(addr)));
        break;
      case 0xa4: //ANDA indexed
        addr = this.PostByte();
        this.regA = this.oAND(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xa5: //BITA indexed
        addr = this.PostByte();
        this.oAND(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xa6: //LDA indexed
        addr = this.PostByte();
        this.regA = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0xa7: //STA indexed
        addr = this.PostByte();
        this.memoryWriteFunction(addr, this.regA);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0xa8: //EORA indexed
        addr = this.PostByte();
        this.regA = this.oEOR(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xa9: //ADCA indexed
        addr = this.PostByte();
        this.regA = this.oADC(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xaa: //ORA indexed
        addr = this.PostByte();
        this.regA = this.oOR(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xab: //ADDA indexed
        addr = this.PostByte();
        this.regA = this.oADD(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xac: //CMPX indexed
        addr = this.PostByte();
        this.oCMP16(this.regX, this.ReadWord(addr));
        break;

      case 0xad: //JSR indexed
        addr = this.PostByte();
        this.PUSHW(this.regPC);
        this.regPC = addr;
        break;
      case 0xae: //LDX indexed
        addr = this.PostByte();
        this.regX = this.ReadWord(addr);
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xaf: //STX indexed
        addr = this.PostByte();
        this.WriteWord(addr, this.regX);
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0xb0: //SUBA extended
        addr = this.fetch16();
        this.regA = this.oSUB(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xb1: //CMPA extended
        addr = this.fetch16();
        this.oCMP(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xb2: //SBCA extended
        addr = this.fetch16();
        this.regA = this.oSBC(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xb3: //SUBD extended
        addr = this.fetch16();
        this.setD(this.oSUB16(this.getD(), this.ReadWord(addr)));
        break;
      case 0xb4: //ANDA extended
        addr = this.fetch16();
        this.regA = this.oAND(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xb5: //BITA extended
        addr = this.fetch16();
        this.oAND(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xb6: //LDA extended
        addr = this.fetch16();
        this.regA = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0xb7: //STA extended
        addr = this.fetch16();
        this.memoryWriteFunction(addr, this.regA);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regA & 0xFF];
        break;
      case 0xb8: //EORA extended
        addr = this.fetch16();
        this.regA = this.oEOR(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xb9: //ADCA extended
        addr = this.fetch16();
        this.regA = this.oADC(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xba: //ORA extended
        addr = this.fetch16();
        this.regA = this.oOR(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xbb: //ADDA extended
        addr = this.fetch16();
        this.regA = this.oADD(this.regA, this.memoryReadFunction(addr));
        break;
      case 0xbc: //CMPX extended
        addr = this.fetch16();
        this.oCMP16(this.regX, this.ReadWord(addr));
        break;

      case 0xbd: //JSR extended
        addr = this.fetch16();
        this.PUSHW(this.regPC);
        this.regPC = addr;
        break;
      case 0xbe: //LDX extended
        addr = this.fetch16();
        this.regX = this.ReadWord(addr);
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xbf: //STX extended
        addr = this.fetch16();
        this.WriteWord(addr, this.regX);
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;
      //Regs B, Y


      case 0xc0: //SUBB imm
        this.regB = this.oSUB(this.regB, this.fetch());
        break;
      case 0xc1: //CMPB imm
        this.oCMP(this.regB, this.fetch());
        break;
      case 0xc2: //SBCB imm
        this.regB = this.oSBC(this.regB, this.fetch());
        break;
      case 0xc3: //ADDD imm
        this.setD(this.oADD16(this.getD(), this.fetch16()));
        break;
      case 0xc4: //ANDB imm
        this.regB = this.oAND(this.regB, this.fetch());
        break;
      case 0xc5: //BITB imm
        this.oAND(this.regB, this.fetch());
        break;
      case 0xc6: //LDB imm
        this.regB = this.fetch();
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0xc8: //EORB imm
        this.regB = this.oEOR(this.regB, this.fetch());
        break;
      case 0xc9: //ADCB imm
        this.regB = this.oADC(this.regB, this.fetch());
        break;
      case 0xca: //ORB imm
        this.regB = this.oOR(this.regB, this.fetch());
        break;
      case 0xcb: //ADDB imm
        this.regB = this.oADD(this.regB, this.fetch());
        break;
      case 0xcc: //LDD imm
        addr = this.fetch16();
        this.setD(addr);
        this.flagsNZ16(addr);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0xce: //LDU imm
        this.regU = this.fetch16();
        this.flagsNZ16(this.regU);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0xd0: //SUBB direct
        addr = this.dpadd();
        this.regB = this.oSUB(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xd1: //CMPB direct
        addr = this.dpadd();
        this.oCMP(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xd2: //SBCB direct
        addr = this.dpadd();
        this.regB = this.oSBC(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xd3: //ADDD direct
        addr = this.dpadd();
        this.setD(this.oADD16(this.getD(), this.ReadWord(addr)));
        break;
      case 0xd4: //ANDB direct
        addr = this.dpadd();
        this.regB = this.oAND(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xd5: //BITB direct
        addr = this.dpadd();
        this.oAND(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xd6: //LDB direct
        addr = this.dpadd();
        this.regB = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0xd7: //STB direct
        addr = this.dpadd();
        this.memoryWriteFunction(addr, this.regB);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0xd8: //EORB direct
        addr = this.dpadd();
        this.regB = this.oEOR(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xd9: //ADCB direct
        addr = this.dpadd();
        this.regB = this.oADC(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xda: //ORB direct
        addr = this.dpadd();
        this.regB = this.oOR(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xdb: //ADDB direct
        addr = this.dpadd();
        this.regB = this.oADD(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xdc: //LDD direct
        addr = this.dpadd();
        pb = this.ReadWord(addr);
        this.setD(pb);
        this.flagsNZ16(pb);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0xdd: //STD direct
        addr = this.dpadd();
        this.WriteWord(addr, this.getD());
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xde: //LDU direct
        addr = this.dpadd();
        this.regU = this.ReadWord(addr);
        this.flagsNZ16(this.regX);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xdf: //STU direct
        addr = this.dpadd();
        this.WriteWord(addr, this.regU);
        this.flagsNZ16(this.regU);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xe0: //SUBB indexed
        addr = this.PostByte();
        this.regB = this.oSUB(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xe1: //CMPB indexed
        addr = this.PostByte();
        this.oCMP(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xe2: //SBCB indexed
        addr = this.PostByte();
        this.regB = this.oSBC(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xe3: //ADDD indexed
        addr = this.PostByte();
        this.setD(this.oADD16(this.getD(), this.ReadWord(addr)));
        break;
      case 0xe4: //ANDB indexed
        addr = this.PostByte();
        this.regB = this.oAND(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xe5: //BITB indexed
        addr = this.PostByte();
        this.oAND(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xe6: //LDB indexed
        addr = this.PostByte();
        this.regB = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0xe7: //STB indexed
        addr = this.PostByte();
        this.memoryWriteFunction(addr, this.regB);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0xe8: //EORB indexed
        addr = this.PostByte();
        this.regB = this.oEOR(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xe9: //ADCB indexed
        addr = this.PostByte();
        this.regB = this.oADC(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xea: //ORB indexed
        addr = this.PostByte();
        this.regB = this.oOR(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xeb: //ADDB indexed
        addr = this.PostByte();
        this.regB = this.oADD(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xec: //LDD indexed
        addr = this.PostByte();
        pb = this.ReadWord(addr);
        this.setD(pb);
        this.flagsNZ16(pb);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0xed: //STD indexed
        addr = this.PostByte();
        this.WriteWord(addr, this.getD());
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xee: //LDU indexed
        addr = this.PostByte();
        this.regU = this.ReadWord(addr);
        this.flagsNZ16(this.regU);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xef: //STU indexed
        addr = this.PostByte();
        this.WriteWord(addr, this.regU);
        this.flagsNZ16(this.regU);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0xf0: //SUBB extended
        addr = this.fetch16();
        this.regB = this.oSUB(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xf1: //CMPB extended
        addr = this.fetch16();
        this.oCMP(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xf2: //SBCB extended
        addr = this.fetch16();
        this.regB = this.oSBC(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xf3: //ADDD extended
        addr = this.fetch16();
        this.setD(this.oADD16(this.getD(), this.ReadWord(addr)));
        break;
      case 0xf4: //ANDB extended
        addr = this.fetch16();
        this.regB = this.oAND(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xf5: //BITB extended
        addr = this.fetch16();
        this.oAND(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xf6: //LDB extended
        addr = this.fetch16();
        this.regB = this.memoryReadFunction(addr);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0xf7: //STB extended
        addr = this.fetch16();
        this.memoryWriteFunction(addr, this.regB);
        this.regCC &= ~(F_ZERO | F_NEGATIVE | F_OVERFLOW);
        this.regCC |= flagsNZ[this.regB & 0xFF];
        break;
      case 0xf8: //EORB extended
        addr = this.fetch16();
        this.regB = this.oEOR(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xf9: //ADCB extended
        addr = this.fetch16();
        this.regB = this.oADC(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xfa: //ORB extended
        addr = this.fetch16();
        this.regB = this.oOR(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xfb: //ADDB extended
        addr = this.fetch16();
        this.regB = this.oADD(this.regB, this.memoryReadFunction(addr));
        break;
      case 0xfc: //LDD extended
        addr = this.fetch16();
        pb = this.ReadWord(addr);
        this.setD(pb);
        this.flagsNZ16(pb);
        this.regCC &= ~F_OVERFLOW;
        break;

      case 0xfd: //STD extended
        addr = this.fetch16();
        this.WriteWord(addr, this.getD());
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xfe: //LDU extended
        addr = this.fetch16();
        this.regU = this.ReadWord(addr);
        this.flagsNZ16(this.regU);
        this.regCC &= ~F_OVERFLOW;
        break;
      case 0xff: //STU extended
        addr = this.fetch16();
        this.WriteWord(addr, this.regU);
        this.flagsNZ16(this.regU);
        this.regCC &= ~F_OVERFLOW;
        break;
      // page 1
      case 0x10: //page 1
        {
          opcode = this.fetch();
          this.tickCount += cycles2[opcode];
          switch (opcode) {
            case 0x21: //BRN
              addr = this.signed16(this.fetch16());
              break;
            case 0x22: //BHI
              addr = this.signed16(this.fetch16());
              if (!(this.regCC & (F_CARRY | F_ZERO))) this.regPC += addr;
              break;
            case 0x23: //BLS
              addr = this.signed16(this.fetch16());
              if (this.regCC & (F_CARRY | F_ZERO)) this.regPC += addr;
              break;
            case 0x24: //BCC
              addr = this.signed16(this.fetch16());
              if (!(this.regCC & F_CARRY)) this.regPC += addr;
              break;
            case 0x25: //BCS
              addr = this.signed16(this.fetch16());
              if (this.regCC & F_CARRY) this.regPC += addr;
              break;
            case 0x26: //BNE
              addr = this.signed16(this.fetch16());
              if (!(this.regCC & F_ZERO)) this.regPC += addr;
              break;
            case 0x27: //LBEQ
              addr = this.signed16(this.fetch16());
              if (this.regCC & F_ZERO) this.regPC += addr;
              break;
            case 0x28: //BVC
              addr = this.signed16(this.fetch16());
              if (!(this.regCC & F_OVERFLOW)) this.regPC += addr;
              break;
            case 0x29: //BVS
              addr = this.signed16(this.fetch16());
              if (this.regCC & F_OVERFLOW) this.regPC += addr;
              break;
            case 0x2a: //BPL
              addr = this.signed16(this.fetch16());
              if (!(this.regCC & F_NEGATIVE)) this.regPC += addr;
              break;
            case 0x2b: //BMI
              addr = this.signed16(this.fetch16());
              if (this.regCC & F_NEGATIVE) this.regPC += addr;
              break;
            case 0x2c: //BGE
              addr = this.signed16(this.fetch16());
              if (
                !((this.regCC & F_NEGATIVE) ^ ((this.regCC & F_OVERFLOW) << 2))
              )
                this.regPC += addr;
              break;
            case 0x2d: //BLT
              addr = this.signed16(this.fetch16());
              if ((this.regCC & F_NEGATIVE) ^ ((this.regCC & F_OVERFLOW) << 2))
                this.regPC += addr;
              break;
            case 0x2e: //BGT
              addr = this.signed16(this.fetch16());
              if (
                !((this.regCC & F_NEGATIVE) ^
                  ((this.regCC & F_OVERFLOW) << 2) || this.regCC & F_ZERO)
              )
                this.regPC += addr;
              break;
            case 0x2f: //BLE
              addr = this.signed16(this.fetch16());
              if (
                (this.regCC & F_NEGATIVE) ^ ((this.regCC & F_OVERFLOW) << 2) ||
                this.regCC & F_ZERO
              )
                this.regPC += addr;
              break;
            case 0x3f: //SWI2
              this.regCC |= F_ENTIRE;
              this.PUSHW(this.regPC);
              this.PUSHW(this.regU);
              this.PUSHW(this.regY);
              this.PUSHW(this.regX);
              this.PUSHB(this.regDP);
              this.PUSHB(this.regB);
              this.PUSHB(this.regA);
              this.PUSHB(this.regCC);
              this.regCC |= F_IRQMASK | F_FIRQMASK;
              this.regPC = this.ReadWord(vecSWI2);
              break;
            case 0x83: //CMPD imm
              this.oCMP16(this.getD(), this.fetch16());
              break;
            case 0x8c: //CMPY imm
              this.oCMP16(this.regY, this.fetch16());
              break;
            case 0x8e: //LDX/LDY imm
              //NOTE MAME uses the X register here
              this.regY = this.fetch16();
              this.flagsNZ16(this.regY);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0x93: //CMPD direct
              addr = this.dpadd();
              this.oCMP16(this.getD(), this.ReadWord(addr));
              break;
            case 0x9c: //CMPY direct
              addr = this.dpadd();
              this.oCMP16(this.regY, this.ReadWord(addr));
              break;
            case 0x9e: //LDY direct
              addr = this.dpadd();
              this.regY = this.ReadWord(addr);
              this.flagsNZ16(this.regY);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0x9f: //STY direct
              addr = this.dpadd();
              this.WriteWord(addr, this.regY);
              this.flagsNZ16(this.regY);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xa3: //CMPD indexed
              addr = this.PostByte();
              this.oCMP16(this.getD(), this.ReadWord(addr));
              break;
            case 0xac: //CMPY indexed
              addr = this.PostByte();
              this.oCMP16(this.regY, this.ReadWord(addr));
              break;
            case 0xae: //LDY indexed
              addr = this.PostByte();
              this.regY = this.ReadWord(addr);
              this.flagsNZ16(this.regY);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xaf: //STY indexed
              addr = this.PostByte();
              this.WriteWord(addr, this.regY);
              this.flagsNZ16(this.regY);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xb3: //CMPD extended
              addr = this.fetch16();
              this.oCMP16(this.getD(), this.ReadWord(addr));
              break;
            case 0xbc: //CMPY extended
              addr = this.fetch16();
              this.oCMP16(this.regY, this.ReadWord(addr));
              break;
            case 0xbe: //LDY extended
              addr = this.fetch16();
              this.regY = this.ReadWord(addr);
              this.flagsNZ16(this.regY);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xbf: //STY extended
              addr = this.fetch16();
              this.WriteWord(addr, this.regY);
              this.flagsNZ16(this.regY);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xce: //LDS imm
              this.regS = this.fetch16();
              this.flagsNZ16(this.regS);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xde: //LDS direct
              addr = this.dpadd();
              this.regS = this.ReadWord(addr);
              this.flagsNZ16(this.regS);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xdf: //STS direct
              addr = this.dpadd();
              this.WriteWord(addr, this.regS);
              this.flagsNZ16(this.regS);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xee: //LDS indexed
              addr = this.PostByte();
              this.regS = this.ReadWord(addr);
              this.flagsNZ16(this.regS);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xef: //STS indexed
              addr = this.PostByte();
              this.WriteWord(addr, this.regS);
              this.flagsNZ16(this.regS);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xfe: //LDS extended
              addr = this.fetch16();
              this.regS = this.ReadWord(addr);
              this.flagsNZ16(this.regS);
              this.regCC &= ~F_OVERFLOW;
              break;
            case 0xff: //STS extended
              addr = this.fetch16();
              this.WriteWord(addr, this.regS);
              this.flagsNZ16(this.regS);
              this.regCC &= ~F_OVERFLOW;
              break;
            default:
              throw new Error('CPU_OPCODE_INVALID_PAGE1_' + opcode);
          }
        }
        break;
      // page 2
      case 0x11: //page 2
        {
          opcode = this.fetch();
          this.tickCount += cycles2[opcode];
          switch (opcode) {
            case 0x3f: //SWI3
              this.regCC |= F_ENTIRE;
              this.PUSHW(this.regPC);
              this.PUSHW(this.regU);
              this.PUSHW(this.regY);
              this.PUSHW(this.regX);
              this.PUSHB(this.regDP);
              this.PUSHB(this.regB);
              this.PUSHB(this.regA);
              this.PUSHB(this.regCC);
              this.regCC |= F_IRQMASK | F_FIRQMASK;
              this.regPC = this.ReadWord(vecSWI3);
              break;
            case 0x83: //CMPU imm
              this.oCMP16(this.regU, this.fetch16());
              break;
            case 0x8c: //CMPS imm
              this.oCMP16(this.regS, this.fetch16());
              break;
            case 0x93: //CMPU imm
              addr = this.dpadd();
              this.oCMP16(this.regU, this.ReadWord(addr));
              break;
            case 0x9c: //CMPS imm
              addr = this.dpadd();
              this.oCMP16(this.regS, this.ReadWord(addr));
              break;
            case 0xa3: //CMPU imm
              addr = this.PostByte();
              this.oCMP16(this.regU, this.ReadWord(addr));
              break;
            case 0xac: //CMPS imm
              addr = this.PostByte();
              this.oCMP16(this.regS, this.ReadWord(addr));
              break;
            case 0xb3: //CMPU imm
              addr = this.fetch16();
              this.oCMP16(this.regU, this.ReadWord(addr));
              break;
            case 0xbc: //CMPS imm
              addr = this.fetch16();
              this.oCMP16(this.regS, this.ReadWord(addr));
              break;
            default:
              throw new Error('CPU_OPCODE_INVALID_PAGE2_' + opcode);
          }
        }
        break;
    }

    this.regA &= 0xff;
    this.regB &= 0xff;
    this.regCC &= 0xff;
    this.regDP &= 0xff;
    this.regX &= 0xffff;
    this.regY &= 0xffff;
    this.regU &= 0xffff;
    this.regS &= 0xffff;
    this.regPC &= 0xffff;
    return this.tickCount - oldTickCount;
  }

  reset() {
    debug(this.name, 'exec reset');
    this.regDP = 0;
    // disable IRQ and FIRQ
    this.irqPendingIRQ = false;
    this.irqPendingFIRQ = false;
    this.irqPendingNMI = false;
    this.missedIRQ = 0;
    this.missedFIRQ = 0;
    this.irqCount = 0;
    this.firqCount = 0;
    this.regCC = F_IRQMASK | F_FIRQMASK;
    this.regPC = this.ReadWord(vecRESET);
    this.tickCount = 0;
  }

  _executeNmi() {
    debug(this.name, 'exec nmi');
    // Saves entire state and sets E=1 like IRQ,
    // NMI sets F=1 and I=1 disabling FIRQ and IRQ requests.
    this.PUSHW(this.regPC);
    this.PUSHW(this.regU);
    this.PUSHW(this.regY);
    this.PUSHW(this.regX);
    this.PUSHB(this.regDP);
    this.PUSHB(this.regB);
    this.PUSHB(this.regA);
    this.regCC |= F_ENTIRE;
    this.PUSHB(this.regCC);
    this.regCC |= F_IRQMASK | F_FIRQMASK;
    this.regPC = this.ReadWord(vecNMI);
    this.tickCount += 19;
  }

  /*
  FIRQ can be generated in two ways: from the dot matrix controller after a
  certain scanline is redrawn, or from the high-performance timer.  When
  an FIRQ is received, the CPU has to determine which of these occurred
  to determine how to process it.
  */
  _executeFirq() {
    // TODO check if CWAI is pending
    debug(this.name, 'exec firq');
    this.PUSHW(this.regPC);
    // clear ENTIRE flag to this.regCC, used for RTI
    this.regCC &= ~F_ENTIRE;
    this.PUSHB(this.regCC);
    //Disable interrupts, Set F,I
    this.regCC |= F_IRQMASK | F_FIRQMASK;
    this.regPC = this.ReadWord(vecFIRQ);
    this.tickCount += 10;
  }

  _executeIrq() {
    // TODO check if CWAI is pending
    debug(this.name, 'exec irq');
    // set ENTIRE flag to this.regCC, used for RTI
    this.regCC |= F_ENTIRE;
    this.PUSHW(this.regPC);
    this.PUSHW(this.regU);
    this.PUSHW(this.regY);
    this.PUSHW(this.regX);
    this.PUSHB(this.regDP);
    this.PUSHB(this.regB);
    this.PUSHB(this.regA);
    this.PUSHB(this.regCC);
    // Disable interrupts, Set I
    this.regCC |= F_IRQMASK;
    this.regPC = this.ReadWord(vecIRQ);
    this.tickCount += 19;
  }

  steps(ticks = 1) {
    const preTicks = this.tickCount;
    while (ticks > 0) {
      ticks -= this.step();
    }
    return this.tickCount - preTicks;
  }

  status() {
    return {
      pc: this.regPC,
      sp: this.regS,
      u: this.regU,
      a: this.regA,
      b: this.regB,
      x: this.regX,
      y: this.regY,
      dp: this.regDP,
      flags: this.regCC,
      irqPendingNMI: this.irqPendingNMI,
      irqPendingFIRQ: this.irqPendingFIRQ,
      irqPendingIRQ: this.irqPendingIRQ,
      missedIRQ: this.missedIRQ,
      missedFIRQ: this.missedFIRQ,
      irqCount: this.irqCount,
      firqCount: this.firqCount,
      nmiCount: this.nmiCount,
    };
  }

  irq() {
    if (this.irqPendingIRQ) {
      this.missedIRQ++;
      return;
    }
    debug(this.name, 'schedule interrupt');
    this.irqPendingIRQ = true;
  }

  clearIrqMasking() {
    // clear F_IRQMASK flag
    this.regCC &= ~F_IRQMASK;
    this.irqPendingIRQ = false;
  }

  firq() {
    if (this.irqPendingFIRQ) {
      this.missedFIRQ++;
      return;
    }
    debug(this.name, 'schedule fast interrupt');
    this.irqPendingFIRQ = true;
  }

  clearFirqMasking() {
    // clear F_FIRQMASK flag
    this.regCC &= ~F_FIRQMASK;
    this.irqPendingFIRQ = false;
  }

  nmi() {
    debug(this.name, 'schedule nmi');
    this.irqPendingNMI = true;
  }

  set(reg, value) {
    switch (reg.toUpperCase()) {
      case 'PC':
        this.reg = value;
        break;
      case 'A':
        this.regA = value;
        break;
      case 'B':
        this.regB = value;
        break;
      case 'X':
        this.regX = value;
        break;
      case 'Y':
        this.regY = value;
        break;
      case 'SP':
        this.regS = value;
        break;
      case 'U':
        this.regU = value;
        break;
      case 'FLAGS':
        this.regCC = value;
        break;
    }
  }

  flagsToString() {
    const fx = 'EFHINZVC';
    var f = '';
    for (var i = 0; i < 8; i++) {
      var n = this.regCC & (0x80 >> i);
      if (n === 0) {
        f += fx[i].toLowerCase();
      } else {
        f += fx[i];
      }
    }
    return f;
  }
}
