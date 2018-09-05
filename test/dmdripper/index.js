'use strict';

const path = require('path');
const fs = require('fs');
const { createCanvas } = require('canvas');
const Emulator = require('../../lib/emulator');
const crypto = require('crypto');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../../rom/t2_l8.rom');
const romU14Path = process.argv[3] || path.join(__dirname, '/../../rom/U14.PP');
const romU15Path = process.argv[4] || path.join(__dirname, '/../../rom/U15.PP');
const romU18Path = process.argv[5] || path.join(__dirname, '/../../rom/U18.PP');

const CYCLE_COUNT = process.env.CYCLES || 2000000;

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

const BIT_ARRAY = [1, 2, 4, 8, 16, 32, 64, 128];
const COLOR_DMD = [
  'rgba(248,248,248,1)',
  'rgba(164,82,0,1)',
  'rgba(255,128,0,1)',
  'rgba(0,0,0,1)',
];

function drawDmd(c, data, x, y, width, SCALE_FACTOR = 1) {
  c.fillStyle = COLOR_DMD[0];
  c.fillRect(x, y, width * SCALE_FACTOR, 32 * SCALE_FACTOR);
  c.fillStyle = COLOR_DMD[3];

  var offsetX = 0;
  var offsetY = 0;
  for (var i = 0; i < data.length; i++) {
    const packedByte = data[i];
    for (var j = 0; j < BIT_ARRAY.length; j++) {
      if (packedByte > 0) {
        const mask = BIT_ARRAY[j];
        if (mask & packedByte) {
          c.fillRect(x + offsetX * SCALE_FACTOR, y + offsetY * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
        }
      }
      offsetX++;
      if (offsetX === width) {
        offsetX = 0;
        offsetY++;
      }
    }
  }
}

const INIT_X = 10;
let xpos = INIT_X;
let ypos = INIT_X;
const DMD_PAGE_SIZE = 0x200;
const canvas = createCanvas(800, 1200);
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const imgChecksum = new Set();

function extractDmdFrames(rawImages) {  
  for (var i = 0; i < 16; i++) {
    const frame = rawImages.slice(i * DMD_PAGE_SIZE, (i + 1) * DMD_PAGE_SIZE);
    const isNotEmpty = frame.find((color) => color > 0);
    const lowerHalfFrame = frame.slice(parseInt(8*(frame.length/10)), frame.length);
    const checksum = crypto.createHash('md5').update(lowerHalfFrame).digest('hex');
    const isNotAddedYet = imgChecksum.has(checksum);
    if (isNotEmpty && !isNotAddedYet) {
      console.log('ADD_IMAGE');
      imgChecksum.add(checksum);
      drawDmd(ctx, frame, xpos, ypos, 128);
      xpos += 130;
      if (xpos > (800 - 130)) {
        xpos = INIT_X;
        ypos += 35;
      }    
    }
  }
}

function ripDmdFrames() {
  const loadRomFilesPromise = Promise.all([
    loadFile(romU06Path),
    loadFile(romU14Path),
    loadFile(romU15Path),
    loadFile(romU18Path),
  ]);

  return loadRomFilesPromise
    .then((romFiles) => {
      const romData = {
        u06: romFiles[0],
        u14: romFiles[1],
        u15: romFiles[2],
        u18: romFiles[3],
      };
      return Emulator.initVMwithRom(romData, {
        fileName: 'foo',
        skipWmcRomCheck: true,
        switchesEnabled: [15,16,17],
      });
    })
    .then((wpcSystem) => {
      const HALF_SECOND_TICKS = 1000000;
      
      wpcSystem.start();
      wpcSystem.executeCycle(HALF_SECOND_TICKS * 6, 16);
      wpcSystem.reset();
      
      wpcSystem.executeCycle(HALF_SECOND_TICKS * 8, 16);
      wpcSystem.setCabinetInput(16);
      wpcSystem.executeCycle(HALF_SECOND_TICKS, 16);
      
      wpcSystem.setCabinetInput(16);
      wpcSystem.executeCycle(HALF_SECOND_TICKS*4, 16);

      wpcSystem.setInput(13);
      wpcSystem.executeCycle(HALF_SECOND_TICKS*4, 16);

      wpcSystem.setInput(13);
      wpcSystem.executeCycle(HALF_SECOND_TICKS*4, 16);

      let status = wpcSystem.getUiState();   
      if (status.asic.dmd.videoRam !== undefined) {
        extractDmdFrames(status.asic.dmd.videoRam);          
      }

      for (let x=0; ypos < 1200; x++) {
        if (x%11 === 0) {
          console.log('round', x, ypos);
        }
        
        for (let i=0; i<10; i++) {
          let input = parseInt(11+(Math.random()*64), 10);
          if (input === 21 || input === 14) {
            input = 13;
          }
          wpcSystem.setInput(input);
          const cycles = HALF_SECOND_TICKS + parseInt(2*HALF_SECOND_TICKS*(Math.random()));
          wpcSystem.executeCycle(cycles, 16);  
        }
                
        status = wpcSystem.getUiState();   
        if (status.asic.dmd.videoRam !== undefined) {
          extractDmdFrames(status.asic.dmd.videoRam);          
        }
      }

      const image = canvas.toBuffer();
      fs.writeFileSync(Date.now() + 'aa.png', image);

    });
}

const HZ = 2000000;
const cpuRealTime = 1 / HZ * CYCLE_COUNT * 1000;
console.error(`BENCHMARK START, ROM: ${romU06Path}`);
console.error(`Ticks to execute: ${CYCLE_COUNT} => CPU REALTIME: ${cpuRealTime}ms (CPU HZ: ${HZ})`);
console.error('  tickSteps\tdurationMs\tmissed IRQ\tmissed FIRQ\tticksExecuted');

ripDmdFrames();
