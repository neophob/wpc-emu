'use strict';

const Emulator = require('../../lib/emulator');
const path = require('path');
const fs = require('fs');
const disasm = require('./disasm');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../../rom/HURCNL_2.ROM');
const HAS_SECURITY_FEATURE = process.env.HAS_SECURITY_FEATURE === 'true' ? 'securityPic' : '';
const MAXSTEPS = process.env.STEPS || 0xFF000;

console.log('WPC-EMU tracer', { HAS_SECURITY_FEATURE, MAXSTEPS, ROMFILE: romU06Path });

const MAX_LOOPS = 64;
const lastPC = [MAX_LOOPS].fill(0xFF);
let outputSlice = [];
let traceLoops = 0;

function initTraceLoops() {
  outputSlice = [];
}

function startTrace() {
  const loadRomFilesPromise = Promise.all([
    loadFile(romU06Path),
  ]);

  initTraceLoops();
  return loadRomFilesPromise
    .then((romFiles) => {
      const romData = {
        u06: romFiles[0],
      };
      return Emulator.initVMwithRom(romData, {
        fileName: 'foo',
        features: [
          HAS_SECURITY_FEATURE,
        ],
        skipWmcRomCheck: false,
      });
    })
    .then((wpcSystem) => {

      wpcSystem.reset();
      wpcSystem.start();

      //TODO dump to a file

      let steps = 0;
      while (steps++ < MAXSTEPS) {
        wpcSystem.executeCycle(1, 1);
        const cpu = wpcSystem.cpuBoard.cpu;
        const pc = cpu.regPC;
        const i1 = cpu.memoryReadFunction(pc);
        const i2 = cpu.memoryReadFunction(pc+1);
        const i3 = cpu.memoryReadFunction(pc+2);
        const i4 = cpu.memoryReadFunction(pc+3);
        const i5 = cpu.memoryReadFunction(pc+4);
        outputSlice.push({
          pc,
          i1, i2, i3, i4, i5,
          cc: cpu.regCC,
          a: cpu.regA,
          b: cpu.regB,
          x: cpu.regX,
          y: cpu.regY,
          s: cpu.regS,
          u: cpu.regU
        });
        if (steps % (MAX_LOOPS * 100) === 0) {
          flushTraces();
          initTraceLoops();
        }
      }
    });
}

startTrace();

function flushTraces() {
  outputSlice.forEach((line) => {
    const pc = line.pc;
    let count = 0;
    /* check for trace_loops - ripped from mame */
    for (let i = 0; i < MAX_LOOPS; i++ ) {
      if (lastPC[i] === pc) {
        count++;
      }
    }

    if (count > 1) {
      traceLoops++;
    } else {
      if (traceLoops) {
        console.log('\n   (loops for ' + traceLoops + ' instructions)\n');
        traceLoops = 0;
      }
      const instr = disasm.disasm(line.i1, line.i2, line.i3, line.i4, line.i5, pc);
      printInstruction(pc, instr, line);

      for (let i = 1; i < MAX_LOOPS; i++ ) {
        lastPC[i - 1] = lastPC[i];
      }
      lastPC[MAX_LOOPS - 1] = pc;
    }

  });
}


function formatRegister(value, padLength) {
  return value.toString(16).padStart(padLength, '0').toUpperCase() + ' ';
}

function printInstruction(pc, instr, line) {
  const CC = 'CC=' + formatRegister(line.cc, 2);
  const A = 'A=' + formatRegister(line.a, 4);
  const B = 'B=' + formatRegister(line.b, 4);
  const X = 'X=' + formatRegister(line.x, 4);
  const Y = 'Y=' + formatRegister(line.y, 4);
  const S = 'S=' + formatRegister(line.s, 4);
  const U = 'U=' + formatRegister(line.u, 4);
  const REGS = CC + A + B + X + Y + S + U;
  if (instr.params.length > 0) {
    console.log(REGS + pc.toString(16).toUpperCase() + ': ' +
        instr.mnemo.padEnd(6) + instr.params
    );
  } else {
    console.log(REGS + pc.toString(16).toUpperCase() + ': ' +
        instr.mnemo
    );
  }
}

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
