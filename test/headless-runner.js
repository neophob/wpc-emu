'use strict';

const path = require('path');
const fs = require('fs');
const Emulator = require('../lib/emulator');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../rom/t2_l8.rom');
const closedSwitchRaw = process.env.CLOSEDSW || '15,16,17';
const switchesEnabled = closedSwitchRaw.split(',').map((n) => parseInt(n, 10));
const switchBlacklist = closedSwitchRaw.split(',').map((n) => parseInt(n, 10));
switchBlacklist.push(21);

console.log('GAME', romU06Path);
console.log('switchesEnabled',switchesEnabled);
console.log('switchBlacklist',switchBlacklist);

const HALF_SECOND_TICKS = 1000000;
const KEYPRESS_TICKS = 500000;
const CPU_STEPS = 64;

function bootEmu() {
  return loadFile(romU06Path)
    .then((u06Rom) => {
      const romData = {
        u06: u06Rom,
      };
      return Emulator.initVMwithRom(romData, {
        fileName: 'foo',
        skipWpcRomCheck: true,
        switchesEnabled,
        //features: ['securityPic'],
      });
    })
    .then((wpcSystem) => {
      wpcSystem.start();
      boot(wpcSystem);

      let x = 0;
      while (1) {
        x++;
        if (x % 200 === 50) {
          const status = wpcSystem.getUiState();
          console.log('# STATUS', { ticks: status.cpuState.tickCount, opsMs: status.opsMs });
        }

        const cycles = HALF_SECOND_TICKS + HALF_SECOND_TICKS * parseInt(10 * Math.random(), 10);
        wpcSystem.executeCycle(cycles, CPU_STEPS);

        for (let i = 0; i < 2; i++) {
          let input = parseInt(11 + (Math.random() * 77), 10);
          if (switchBlacklist.includes(input)) {
            input = 13;
          }
          wpcSystem.setInput(input);
          wpcSystem.executeCycle(KEYPRESS_TICKS, CPU_STEPS);
          wpcSystem.setInput(input);
        }
      }
    });
}

bootEmu();

function boot(wpcSystem) {
  wpcSystem.executeCycle(HALF_SECOND_TICKS * 8, CPU_STEPS);

  wpcSystem.setCabinetInput(16);
  wpcSystem.executeCycle(HALF_SECOND_TICKS, CPU_STEPS);
  wpcSystem.setCabinetInput(16);
  wpcSystem.executeCycle(HALF_SECOND_TICKS, CPU_STEPS);
  wpcSystem.setCabinetInput(16);
  wpcSystem.executeCycle(HALF_SECOND_TICKS, CPU_STEPS);
  wpcSystem.setCabinetInput(16);
  wpcSystem.executeCycle(HALF_SECOND_TICKS, CPU_STEPS);

  wpcSystem.setCabinetInput(16);
  wpcSystem.executeCycle(HALF_SECOND_TICKS * 4, CPU_STEPS);

  wpcSystem.setInput(13);
  wpcSystem.executeCycle(2 * HALF_SECOND_TICKS, CPU_STEPS);
  wpcSystem.setInput(13);
  wpcSystem.executeCycle(2 * HALF_SECOND_TICKS, CPU_STEPS);
  wpcSystem.setInput(13);
  wpcSystem.executeCycle(2 * HALF_SECOND_TICKS, CPU_STEPS);

  switchesEnabled.forEach((a) => {
    wpcSystem.setInput(a);
  });
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
