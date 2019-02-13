'use strict';

// env CLOSEDSW="16,17,18" ROMFILE=/Users/michaelvogt/_code/github/wpc-emu/rom/HURCNL_2.ROM node i2.js
// env CLOSEDSW="15,16,17" ROMFILE=/Users/michaelvogt/_code/github/wpc-emu/rom/HURCNL_2.ROM node i2.js
// env CLOSEDSW="81,82,83,84,85,86" ROMFILE=./ijone_l7.rom npm run forever
// env CLOSEDSW="55,56,57,58" ROMFILE=./u6-p-c.rom  npm run forever

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { createCanvas } = require('canvas');
const Emulator = require('../../lib/emulator');

const romU06Path = process.env.ROMFILE || path.join(__dirname, '/../../rom/t2_l8.rom');
const closedSwitchRaw = process.env.CLOSEDSW || '15,16,17';
const switchesEnabled = closedSwitchRaw.split(',').map((n) => parseInt(n, 10));
const switchBlacklist = closedSwitchRaw.split(',').map((n) => parseInt(n, 10));
switchBlacklist.push(21);
console.log('GAME', romU06Path);
console.log('switchesEnabled',switchesEnabled);
console.log('switchBlacklist',switchBlacklist);
const romU14Path = process.argv[3] || path.join(__dirname, '/../../rom/U14.PP');
const romU15Path = process.argv[4] || path.join(__dirname, '/../../rom/U15.PP');
const romU18Path = process.argv[5] || path.join(__dirname, '/../../rom/U18.PP');
console.log('romU14Path',romU14Path);

const DMD_PAGE_SIZE = 0x200;
const BIT_ARRAY = [1, 2, 4, 8, 16, 32, 64, 128];

const LAYOUT = {
  v1: {
    backgroundColor: 'black',
    colorDmdBackground: 'rgba(31,20,17,1)',
    colorDmdForeground: 'rgba(254,233,138,1)',
    margin: 18,
    dmdFrameWidth: 128,
    dmdFrameHeight: 32,
    dmdFrameMargin: 2,
    dmdFramesHorizontal: 6,
    dmdFramesVertical: 33
  },
  v2: {
    backgroundColor: 'black',
    colorDmdBackground: 'rgba(31,20,17,1)',
    colorDmdForeground: 'rgba(254,233,138,1)',
    margin: 18 * 2,
    dmdFrameWidth: 128,
    dmdFrameHeight: 32,
    dmdFrameMargin: 2,
    dmdFramesHorizontal: 8,
    dmdFramesVertical: 48
  },
};
const TEMPLATE = LAYOUT.v2;
const dmdFramesTotal = TEMPLATE.dmdFramesHorizontal * TEMPLATE.dmdFramesVertical;
const canvasWidth = TEMPLATE.margin * 2 + TEMPLATE.dmdFramesHorizontal * (TEMPLATE.dmdFrameWidth + TEMPLATE.dmdFrameMargin);
const canvasHeight = TEMPLATE.margin * 2 + TEMPLATE.dmdFramesVertical * (TEMPLATE.dmdFrameHeight + TEMPLATE.dmdFrameMargin);
const dmdFrameWidthMargin = TEMPLATE.dmdFrameWidth + TEMPLATE.dmdFrameMargin;
const dmdFrameHeightMargin = TEMPLATE.dmdFrameHeight + TEMPLATE.dmdFrameMargin;
const imgChecksum = new Set();
let xpos = TEMPLATE.margin;
let ypos = TEMPLATE.margin;
let addedImages = 0;

function drawDmd(c, data, x, y, width) {
  c.fillStyle = TEMPLATE.colorDmdBackground;
  c.fillRect(x, y, width, 32);

  c.fillStyle = TEMPLATE.colorDmdForeground;
  var offsetX = 0;
  var offsetY = 0;
  for (var i = 0; i < data.length; i++) {
    const packedByte = data[i];
    for (var j = 0; j < BIT_ARRAY.length; j++) {
      if (packedByte > 0) {
        const mask = BIT_ARRAY[j];
        if (mask & packedByte) {
          c.fillRect(x + offsetX, y + offsetY, 1, 1);
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

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');
ctx.fillStyle = TEMPLATE.backgroundColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);

function extractDmdFrames(status) {
  if (!status || status.asic.dmd.videoRam === undefined) {
    return;
  }
  const rawImages = status.asic.dmd.videoRam;

  for (var i = 0; i < 16; i++) {
    const frame = rawImages.slice(i * DMD_PAGE_SIZE, (i + 1) * DMD_PAGE_SIZE);
    const isNotEmpty = frame.find((color) => color > 0);
    const ONE_FRAME_LINE = frame.length / 32;
    //const upperHalfFrame = frame.slice(ONE_FRAME_LINE*5, ONE_FRAME_LINE*10);
    const lowerHalfFrame = frame.slice(ONE_FRAME_LINE * 28, ONE_FRAME_LINE * 32);
    const checksum1 = crypto
      .createHash('md5')
      .update(lowerHalfFrame)
      .digest('hex');
      /*const checksum2 = crypto
      .createHash('md5')
      .update(upperHalfFrame)
      .digest('hex');*/
    const imageHasBeenAdded = imgChecksum.has(checksum1);// || imgChecksum.has(checksum2);
    if (isNotEmpty && !imageHasBeenAdded) {
      addedImages++;
      if (addedImages > dmdFramesTotal) {
        const image = canvas.toBuffer();
        const filename = Date.now() + 'aa.png';
        fs.writeFileSync(filename, image);
        console.log('ALL GOOD. BYE', filename);
        process.exit(0);
      }
      console.log('ADD_IMAGE', addedImages);
      imgChecksum.add(checksum1);
      //imgChecksum.add(checksum2);
      drawDmd(ctx, frame, xpos, ypos, TEMPLATE.dmdFrameWidth);
      xpos += dmdFrameWidthMargin;
      if (xpos > (canvasWidth - dmdFrameWidthMargin)) {
        xpos = TEMPLATE.margin;
        ypos += dmdFrameHeightMargin;
      }
    }
  }
}
const HALF_SECOND_TICKS = 1000000;
const KEYPRESS_TICKS = 500000;
const CPU_STEPS = 64;

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
        switchesEnabled,
      });
    })
    .then((wpcSystem) => {

      boot(wpcSystem);

      for (let x = 0; ypos < 9999; x++) {
        if (x % 11 === 0) {
          console.log('round', x, ypos);
        }
        if (x % 2000 === 1999) {
          console.log('RE-ARM');
          boot(wpcSystem);
        }

        try {
          const cycles = parseInt(HALF_SECOND_TICKS * Math.random(), 10);
          wpcSystem.executeCycle(cycles, CPU_STEPS);
        } catch (error) {}

        extractDmdFrames(wpcSystem.getUiState());
        for (let i = 0; i < 2; i++) {
          try {
            let input = parseInt(11 + (Math.random() * 77), 10);
            if (switchBlacklist.includes(input)) {
              input = 13;
            }
            wpcSystem.setInput(input);
            wpcSystem.executeCycle(KEYPRESS_TICKS, CPU_STEPS);
            wpcSystem.setInput(input);
          } catch (error) {}
        }
        extractDmdFrames(wpcSystem.getUiState());
      }

      console.log('BYE');
    });
}

ripDmdFrames();

function boot(wpcSystem) {
  wpcSystem.start();
  wpcSystem.executeCycle(HALF_SECOND_TICKS * 6, CPU_STEPS);
  wpcSystem.reset();
  wpcSystem.executeCycle(HALF_SECOND_TICKS * 8, CPU_STEPS);

  wpcSystem.setCabinetInput(16);
  wpcSystem.executeCycle(HALF_SECOND_TICKS, CPU_STEPS);

  wpcSystem.setCabinetInput(16);
  wpcSystem.executeCycle(HALF_SECOND_TICKS * 4, CPU_STEPS);

  wpcSystem.setInput(13);
  wpcSystem.executeCycle(HALF_SECOND_TICKS, CPU_STEPS);
  wpcSystem.setInput(13);

  wpcSystem.executeCycle(HALF_SECOND_TICKS, CPU_STEPS);

  extractDmdFrames(wpcSystem.getUiState());

  console.log('IS', wpcSystem.getUiState().asic.wpc.inputState);

  console.log('NAU');
  switchesEnabled.forEach((a) => {
    console.log('_',a);
    wpcSystem.setInput(a);
    console.log('IS', wpcSystem.getUiState().asic.wpc.inputState);

  });
  console.log('FIN', wpcSystem.getUiState().asic.wpc.inputState);
  extractDmdFrames(wpcSystem.getUiState());
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
