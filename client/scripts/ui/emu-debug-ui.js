'use strict';

import { replaceNode } from './htmlselector';

export { initialise, updateCanvas };

/*jshint bitwise: false*/

// HINT enable debug in the browser by entering "localStorage.debug = '*'" in the browser

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 560;
const YPOS_DMD_MAIN_VIEW = 15;
const YPOS_GENERIC_DATA = 225;
const YPOS_DMD_DATA = 385;

const LEFT_X_OFFSET = 15;
const MIDDLE_X_OFFSET = 250 + LEFT_X_OFFSET;
const MIDDLE_PLUS_X_OFFSET = 125 + MIDDLE_X_OFFSET;
const RIGHT_X_OFFSET = 250 + MIDDLE_X_OFFSET;
const RIGHT_PLUS_X_OFFSET = 125 + RIGHT_X_OFFSET;

const BIT_ARRAY = [1, 2, 4, 8, 16, 32, 64, 128];

const COLOR_DMD = [
  'rgb(50,20,20)',
  'rgb(164,82,0)',
  'rgb(255,128,0)',
  'rgb(255,198,0)',
];

var c;

function updateCanvas(emuState, cpuState) {
  if (!emuState) {
    return;
  }
  c.fillStyle = '#000';
  c.fillRect(LEFT_X_OFFSET, YPOS_GENERIC_DATA, 170, 122);
  c.fillRect(LEFT_X_OFFSET, YPOS_DMD_DATA, 150, 40);

  c.fillStyle = COLOR_DMD[2];
  c.fillText('ROM: ' + emuState.romFileName, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('CPU TICKS: ' + emuState.ticks, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 20);
  c.fillText('CPU TICKS/ms: ' + emuState.opsMs, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 30);
  c.fillText('CPU STATE: ' + cpuState, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 40);
  c.fillText('IRQ MISSED: ' + (emuState.missedIrqCall - emuState.missedIrqMaskCall || 0), LEFT_X_OFFSET, YPOS_GENERIC_DATA + 50);
  c.fillText('FIRQ MISSED: ' + emuState.missedFirqCall, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 60);

  const diagnosticLed = emuState.asic.wpc.diagnosticLed ? emuState.asic.wpc.diagnosticLed.toString(2) : '00000000';
  const activePage = emuState.asic.dmd.activepage;
  c.fillText('DIAGLED STATE: ' + diagnosticLed, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 70);
  c.fillText('DIAGLED TOGGLE COUNT: ' + emuState.asic.wpc.diagnosticLedToggleCount, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 80);
  c.fillText('ACTIVE ROM BANK: ' + emuState.asic.wpc.activeRomBank, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 90);

  c.fillText('SND CPU TICK: ' + emuState.asic.sound.ticks, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 100);
  c.fillText('SND IRQ MISSED: ' + emuState.asic.sound.missedIrqCall, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 110);
  c.fillText('SND FIRQ MISSED: ' + emuState.asic.sound.missedFirqCall, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 120);

  c.fillText('DMD LOW PAGE: ' + emuState.asic.dmd.lowpage, LEFT_X_OFFSET, YPOS_DMD_DATA + 10);
  c.fillText('DMD HIGH PAGE: ' + emuState.asic.dmd.highpage, LEFT_X_OFFSET, YPOS_DMD_DATA + 20);
  c.fillText('DMD ACTIVE PAGE: ' + activePage, LEFT_X_OFFSET, YPOS_DMD_DATA + 30);

  if (emuState.asic.dmd.dmdShadedBuffer) {
    drawDmdShaded(emuState.asic.dmd.dmdShadedBuffer, LEFT_X_OFFSET, YPOS_DMD_MAIN_VIEW, 128, 6);
  }

  if (emuState.asic.ram) {
    drawMemRegion(emuState.asic.ram, LEFT_X_OFFSET, YPOS_DMD_DATA + 80, 128);
  }

  if (emuState.asic.wpc.lampState) {
    drawMatrix8x8(emuState.asic.wpc.lampState, RIGHT_X_OFFSET, YPOS_GENERIC_DATA + 20);
  }

  if (emuState.asic.wpc.solenoidState) {
    drawMatrix8x8(emuState.asic.wpc.solenoidState, MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 20);
  }

  if (emuState.asic.wpc.inputState) {
    drawMatrix8x8Binary(emuState.asic.wpc.inputState, RIGHT_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 20);
  }

  drawMatrix8x8(emuState.asic.wpc.generalIlluminationState, MIDDLE_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 20);

  //dmd pages - 8 pixel (on/off) per byte, display is 128x32 pixels
  const videoRam = emuState.asic.dmd.videoRam;
  if (videoRam) {
    const DMD_PAGE_SIZE = 0x200;
    let xpos = MIDDLE_X_OFFSET;
    let ypos = YPOS_DMD_DATA + 20;
    for (var i = 0; i < 16; i++) {
      drawDmd(videoRam.slice(i * DMD_PAGE_SIZE, (i + 1) * DMD_PAGE_SIZE), xpos, ypos, 128);
      xpos += 130;
      if (xpos > (800 - 130)) {
        xpos = MIDDLE_X_OFFSET;
        ypos += 35;
      }
    }
  }
}

function drawMemRegion(data, x, y, width) {
  c.fillStyle = COLOR_DMD[0];
  c.fillRect(x, y, width, 65);

  var offsetX = 0;
  var offsetY = 0;
  var color = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      if (color !== data[i]) {
        color = data[i];
        c.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
      }
      c.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
    if (offsetX++ === width) {
      offsetX = 0;
      offsetY++;
    }
  }
}

function drawMatrix8x8(data, x, y, GRIDSIZE = 15) {
  data.forEach((lamp, index) => {
    c.fillStyle = lamp & 0x80 ? COLOR_DMD[3] :
      lamp & 0x70 ? COLOR_DMD[1] : COLOR_DMD[0];
    const i = x + (index % 8) * GRIDSIZE;
    const j = y + parseInt(index / 8, 10) * GRIDSIZE;
    c.fillRect(i, j, GRIDSIZE, GRIDSIZE);
  });
}

function drawMatrix8x8Binary(data, x, y) {
  const dataUnpacked = [];
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      const entry = data[i] & BIT_ARRAY[j];
      dataUnpacked.push(entry > 0 ? 255 : 0);
    }
  }
  drawMatrix8x8(dataUnpacked, x, y);
}

function drawDmd(data, x, y, width, SCALE_FACTOR = 1) {
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

function drawDmdShaded(data, x, y, width, SCALE_FACTOR = 1) {
  c.fillStyle = COLOR_DMD[0];
  c.fillRect(x, y, width * SCALE_FACTOR, 32 * SCALE_FACTOR);

  var offsetX = 0;
  var offsetY = 0;
  var color = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      if (color !== data[i]) {
        color = data[i];
        c.fillStyle = COLOR_DMD[color];
      }
      c.fillRect(x + offsetX * SCALE_FACTOR, y + offsetY * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
    }
    offsetX++;
    if (offsetX === width) {
      offsetX = 0;
      offsetY++;
    }
  }
}

function initCanvas() {
  c.fillStyle = '#000';
  c.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  c.font = '10px Monaco';
  c.fillStyle = COLOR_DMD[3];
  c.fillText('# DEBUG DATA:', LEFT_X_OFFSET, YPOS_GENERIC_DATA);
  c.fillText('# DMD BOARD DATA:', LEFT_X_OFFSET, YPOS_DMD_DATA);

  c.fillStyle = COLOR_DMD[2];
  c.fillText('SOLENOID OUT MATRIX', MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('ILLUM. OUT MATRIX', MIDDLE_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('LAMP OUT MATRIX', RIGHT_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('SWITCH IN MATRIX', RIGHT_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('DMD PAGE RAM:', MIDDLE_X_OFFSET, YPOS_DMD_DATA + 10);
  c.fillText('RAM:', LEFT_X_OFFSET, YPOS_DMD_DATA + 70);
}

function initialise() {
  console.log('initialise');

  // prepare view
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  c = canvas.getContext('2d', { alpha: false });

  replaceNode('canvasNode', canvas);

  initCanvas();
}
