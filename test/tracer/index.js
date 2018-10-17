'use strict';

const Emulator = require('../../lib/emulator');
const path = require('path');
const fs = require('fs');
const disasm = require('./disasm');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../../rom/HURCNL_2.ROM');
const MAX_LOOPS = 64;
const lastPC = [MAX_LOOPS].fill(0xFF);

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

      //TODO dump to a file

      let i = 0;
      const outputSlice = [];
      let traceLoops = 0;

      while (i++ < 3107) {
        wpcSystem.executeCycle(1, 1);
        const cpu = wpcSystem.cpuBoard.cpu;
        const pc = cpu.regPC;
        const i1 = cpu.memoryReadFunction(pc);
        const i2 = cpu.memoryReadFunction(pc+1);
        const i3 = cpu.memoryReadFunction(pc+2);
        const i4 = cpu.memoryReadFunction(pc+3);
        const i5 = cpu.memoryReadFunction(pc+4);
        outputSlice.push({ pc, i1, i2, i3, i4, i5 });
      }

      outputSlice.forEach((line) => {
        const pc = line.pc;
        let count = 0;
        /* check for trace_loops - ripped from mame */
        for (i = 0; i < MAX_LOOPS; i++ ) {
          if (lastPC[i] === pc) {
            count++;
          }
        }

        if (count > 1) {
          traceLoops++;
        } else {
          if (traceLoops) {
            console.log('TRACELOOP', traceLoops);
          }
          const instr = disasm.disasm(line.i1, line.i2, line.i3, line.i4, line.i5, pc);

          console.log(pc.toString(16).toUpperCase() + ': ' +
            instr.mnemo.padEnd(6) + instr.params);
          
        }

      });
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
