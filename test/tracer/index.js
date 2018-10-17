'use strict';

const Emulator = require('../../lib/emulator');
const path = require('path');
const fs = require('fs');
const disasm = require('./disasm');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../../rom/HURCNL_2.ROM');

function startTrace() {
  const loadRomFilesPromise = Promise.all([
    loadFile(romU06Path),
  ]);

  return loadRomFilesPromise
    .then((romFiles) => {
      const romData = {
        u06: romFiles[0],
      };
      return Emulator.initVMwithRom(romData, {
        fileName: 'foo',
        skipWmcRomCheck: false,
      });
    })
    .then((wpcSystem) => {

      wpcSystem.reset();
      wpcSystem.start();
/*
8C65: LDA   #$00
8C67: STA   $3FF2
8C6A: LDY   #$0006
8C6E: CLRB
8C6F: LDX   $FFEC
*/
      let i = 0;
      while (i++ < 141) {
        wpcSystem.executeCycle(1, 1);
        const cpu = wpcSystem.cpuBoard.cpu;
        const pc = cpu.regPC;
        const i1 = cpu.memoryReadFunction(pc);
        const i2 = cpu.memoryReadFunction(pc+1);
        const i3 = cpu.memoryReadFunction(pc+2);
        const i4 = cpu.memoryReadFunction(pc+3);
        const i5 = cpu.memoryReadFunction(pc+4);

        const instr = disasm.disasm(i1, i2, i3, i4, i5, pc);
        console.log(pc.toString(16).toUpperCase() + ': ' + instr.mnemo.padEnd(6) + instr.params);
      }

    });
}

startTrace();

function loadFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, data) => {
      if (error) {
        return reject(error);
      }
      resolve(new Uint8Array(data));
    });
  });
}
