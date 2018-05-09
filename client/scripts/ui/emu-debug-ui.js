'use strict';

import { replaceNode } from './htmlselector';

export { initialise, stopEmu, startEmu, wpcSystem };

/*jshint bitwise: false*/

// HINT enable debug in the browser by entering "localStorage.debug = '*'" in the browser

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 700;
const YPOS_DMD_MAIN_VIEW = 20;
const YPOS_GENERIC_DATA = 240;
const YPOS_WPC_DATA = 350;
const YPOS_DMD_DATA = 520;

const LEFT_X_OFFSET = 15;
const MIDDLE_X_OFFSET = 260 + LEFT_X_OFFSET;
const MIDDLE_PLUS_X_OFFSET = 130 + MIDDLE_X_OFFSET;
const RIGHT_X_OFFSET = 260 + MIDDLE_X_OFFSET;
const RIGHT_PLUS_X_OFFSET = 130 + RIGHT_X_OFFSET;

const BIT_ARRAY = [1, 2, 4, 8, 16, 32, 64, 128];

const COLOR_DMD = [
  'rgb(20,20,20)',
  'rgb(164,82,0)',
  'rgb(255,128,0)',
  'rgb(255,198,0)',
];

var c;
var wpcSystem;
var intervalId;
var wpcCycles = 32;
var opsMs = 0;
var perfTicksExecuted = 0;
var perfTs = Date.now();

//called at 60hz -> 16.6ms
function step() {
  updateCanvas();

  var count = wpcCycles;
  while (count--) {
    perfTicksExecuted += wpcSystem.executeCycle();
    perfTicksExecuted += wpcSystem.executeCycle();
    perfTicksExecuted += wpcSystem.executeCycle();
    perfTicksExecuted += wpcSystem.executeCycle();
  }

  const perfDurationMs = Date.now() - perfTs;
  if (perfDurationMs > 480) {
    opsMs = parseInt(perfTicksExecuted / perfDurationMs, 10);
    // try to run at 2000 ops per ms
    if (opsMs > 2040 && wpcCycles > 2) {
      wpcCycles--;
    }
    if (opsMs < 1960 && wpcCycles < 512) {
      wpcCycles++;
    }
    perfTicksExecuted = 0;
    perfTs = Date.now();
  }
  intervalId = requestAnimationFrame(step);
}

function startEmu() {
  console.log('client start emu');
  intervalId = requestAnimationFrame(step);
}

function stopEmu() {
  console.log('stop emu');
  cancelAnimationFrame(intervalId);
  intervalId = false;
  updateCanvas();
}

function updateCanvas() {
  const emuState = wpcSystem.getUiState();

  drawDmdShaded(emuState.asic.dmd.dmdShadedBuffer, LEFT_X_OFFSET, YPOS_DMD_MAIN_VIEW, 128, 6);

  c.fillStyle = '#000';
  c.fillRect(LEFT_X_OFFSET, YPOS_GENERIC_DATA, 150, 70);
  c.fillRect(LEFT_X_OFFSET, YPOS_WPC_DATA, 200, 40);
  c.fillRect(LEFT_X_OFFSET, YPOS_DMD_DATA, 150, 40);

  c.fillStyle = COLOR_DMD[2];
  c.fillText('ROM: ' + emuState.asic.romFileName, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('CPU TICKS: ' + emuState.ticks, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 20);
  c.fillText('CPU TICKS/ms: ' + opsMs, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 30);
  const cpuState = intervalId ? 'running' : 'paused';
  c.fillText('CPU STATE: ' + cpuState, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 40);
  c.fillText('IRQ enabled: ' + emuState.asic.wpc.irqEnabled, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 50);
  c.fillText('UI CYCLES: ' + wpcCycles, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 60);

  const diagnosticLed = emuState.asic.wpc.diagnosticLed ? emuState.asic.wpc.diagnosticLed.toString(2) : '00000000';
  const activePage = emuState.asic.dmd.activepage;
  c.fillText('DIAGLED STATE: ' + diagnosticLed, LEFT_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('DIAGLED TOGGLE COUNT: ' + emuState.asic.wpc.diagnosticLedToggleCount, LEFT_X_OFFSET, YPOS_WPC_DATA + 20);
  c.fillText('Active ROM Bank: ' + emuState.asic.wpc.activeRomBank, LEFT_X_OFFSET, YPOS_WPC_DATA + 30);

  c.fillText('DMD LOW PAGE: ' + emuState.asic.dmd.lowpage, LEFT_X_OFFSET, YPOS_DMD_DATA + 10);
  c.fillText('DMD HIGH PAGE: ' + emuState.asic.dmd.highpage, LEFT_X_OFFSET, YPOS_DMD_DATA + 20);
  c.fillText('DMD ACTIVE PAGE: ' + activePage, LEFT_X_OFFSET, YPOS_DMD_DATA + 30);

  drawMemRegion(emuState.asic.ram, MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 20, 128);
  drawMatrix8x8(emuState.asic.wpc.lampState, RIGHT_X_OFFSET, YPOS_WPC_DATA + 20);
  drawMatrix8x8(emuState.asic.wpc.solenoidState, MIDDLE_X_OFFSET, YPOS_WPC_DATA + 20);
  drawMatrix8x8Binary(emuState.asic.wpc.inputState, RIGHT_PLUS_X_OFFSET, YPOS_WPC_DATA + 20);
  drawMatrix8x8(emuState.asic.wpc.generalIlluminationState, MIDDLE_PLUS_X_OFFSET, YPOS_WPC_DATA + 20);

  //dmd pages - 8 pixel (on/off) per byte, display is 128x32 pixels
  const videoRam = emuState.asic.dmd.videoRam;
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

function drawMemRegion(data, x, y, width) {
  var offsetX = 0;
  var offsetY = 0;
  for (var i = 0, len = data.length; i < len; i++) {
    const alpha = data[i];
    c.fillStyle = 'rgb(' + alpha + ',' + alpha + ',' + alpha + ')';
    c.fillRect(x + offsetX, y + offsetY, 1, 1);
    if (offsetX++ === width) {
      offsetX = 0;
      offsetY++;
    }
  }
}

function drawMatrix8x8(data, x, y) {
  const GRIDSIZE = 15;
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
      const mask = BIT_ARRAY[j];
      if (mask & packedByte) {
        c.fillRect(x + offsetX * SCALE_FACTOR, y + offsetY * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
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
  var offsetX = 0;
  var offsetY = 0;
  for (var i = 0; i < data.length; i++) {
    const pixel = data[i];
    c.fillStyle = COLOR_DMD[pixel];
    c.fillRect(x + offsetX * SCALE_FACTOR, y + offsetY * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
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
  c.fillText('# GENERIC DATA:', LEFT_X_OFFSET, YPOS_GENERIC_DATA);
  c.fillText('# WPC/IO BOARD DATA:', LEFT_X_OFFSET, YPOS_WPC_DATA);
  c.fillText('# DMD BOARD DATA:', LEFT_X_OFFSET, YPOS_DMD_DATA);

  c.fillStyle = COLOR_DMD[2];
  c.fillText('SOLENOID OUT MATRIX', MIDDLE_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('ILLUM. OUT MATRIX', MIDDLE_PLUS_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('LAMP OUT MATRIX', RIGHT_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('SWITCH IN MATRIX', RIGHT_PLUS_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('DMD PAGE RAM:', MIDDLE_X_OFFSET, YPOS_DMD_DATA + 10);
  c.fillText('RAM:', MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 10);
}

function initialise(_wpcSystem) {
  console.log('initialise');
  wpcSystem = _wpcSystem;

  // prepare view
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  c = canvas.getContext('2d', { alpha: false });

  replaceNode('canvasNode', canvas);

  initCanvas();
  stopEmu();
  startEmu();
}
