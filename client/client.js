'use strict';

/* global WpcEmu */
/* global c */
/*jshint bitwise: false*/

// HINT enable debug in the browser by entering "localStorage.debug = '*'" in the browser
console.log('hello');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
var COLOR_DMD = [
  'rgb(10,10,10)',
  'rgb(164,82,0)',
  'rgb(255,128,0)',
  'rgb(255,198,0)',
];

var wpcSystem;
var intervalId;

//called at 60hz -> 16.6ms
function step() {
  updateCanvas();

  // TODO make adaptive, so we execute 2000 emuState.opMs
  var count = 64;
  while (count--) {
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
  }
  intervalId = requestAnimationFrame(step);
}

// NOTE: fetch works only in the browser, see https://github.com/matthew-andrews/isomorphic-fetch
function downloadFileFromUrlAsUInt8Array(url) {
  return fetch(url)
  	.then((response) => {
  		if (response.status >= 400) {
  			throw new Error('INVALID_STATUSCODE_' + response.status);
  		}
      return response.arrayBuffer();
    })
    .then((buffer) => {
      return new Uint8Array(buffer);
  	});
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

function resetEmu() {
  cancelAnimationFrame(intervalId);
  intervalId = false;
  console.log('reset emu');
  // HINT: make sure CORS is correct
//  downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/ft20_32.rom')
  downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/t2_l8.rom')
//    downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/hurcnl_2.rom')
//    downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/tz_h8.u6')
    .then((rom) => {
      return WpcEmu.initVMwithRom(rom, 'hurcnl_2.rom');
    })
    .then((_wpcSystem) => {
      wpcSystem = _wpcSystem;
      console.log('WPC System initialised');
      wpcSystem.start();
      startEmu();
    })
    .catch((error) => {
      stopEmu();
      console.log('EXCEPTION!', error.message);
      console.log(error.stack);
    });
}

canvasClear();
resetEmu();

const YPOS_DMD_MAIN_VIEW = 20;
const YPOS_GENERIC_DATA = 240;
const YPOS_WPC_DATA = 390;
const YPOS_DMD_DATA = 540;

const LEFT_X_OFFSET = 15;
const MIDDLE_X_OFFSET = 260 + LEFT_X_OFFSET;
const RIGHT_X_OFFSET = 260 + MIDDLE_X_OFFSET;
const RIGHT_PLUS_X_OFFSET = 130 + RIGHT_X_OFFSET;

const BIT_ARRAY = [1, 2, 4, 8, 16, 32, 64, 128];

function updateCanvas() {
  canvasClear();
  const emuState = wpcSystem.getUiState();

  drawDmdShaded(emuState.asic.dmd.dmdShadedBuffer, LEFT_X_OFFSET, YPOS_DMD_MAIN_VIEW, 128, 6);

  c.font = '10px Monaco';
  c.fillStyle = COLOR_DMD[3];
  c.fillText('# GENERIC DATA:', LEFT_X_OFFSET, YPOS_GENERIC_DATA);
  c.fillText('# WPC BOARD DATA:', LEFT_X_OFFSET, YPOS_WPC_DATA);
  c.fillText('# DMD BOARD DATA:', LEFT_X_OFFSET, YPOS_DMD_DATA);

  c.fillStyle = COLOR_DMD[2];
  c.fillText('ROM: hurcnl_2.rom', LEFT_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('CPU TICKS: ' + emuState.ticks, MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 10);
  c.fillText('CPU TICKS/ms: ' + emuState.opMs, RIGHT_X_OFFSET, YPOS_GENERIC_DATA + 10);
  const cpuState = intervalId ? 'running' : 'paused';
  c.fillText('CPU STATE: ' + cpuState, MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 20);
  c.fillText('ASIC RAM:', RIGHT_X_OFFSET, YPOS_GENERIC_DATA + 20);

  const diagnosticLed = emuState.asic.wpc.diagnosticLed ? emuState.asic.wpc.diagnosticLed.toString(2) : '00000000';
  const activePage = emuState.asic.dmd.activepage;
  c.fillText('DIAGLED STATE: ' + diagnosticLed, LEFT_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('DIAGLED TOGGLE COUNT: ' + emuState.asic.wpc.diagnosticLedToggleCount, MIDDLE_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('LAMP MATRIX', RIGHT_X_OFFSET, YPOS_WPC_DATA + 10);
  c.fillText('INPUT MATRIX', RIGHT_PLUS_X_OFFSET, YPOS_WPC_DATA + 10);

  c.fillText('Active ROM Bank: ' + emuState.asic.wpc.activeRomBank, LEFT_X_OFFSET, YPOS_WPC_DATA + 20);
  c.fillText('IRQ enabled: ' + emuState.asic.wpc.irqEnabled, MIDDLE_X_OFFSET, YPOS_WPC_DATA + 20);

  c.fillText('DMD LOW PAGE: ' + emuState.asic.dmd.lowpage, LEFT_X_OFFSET, YPOS_DMD_DATA + 10);
  c.fillText('DMD HIGH PAGE: ' + emuState.asic.dmd.highpage, MIDDLE_X_OFFSET, YPOS_DMD_DATA + 10);
  c.fillText('DMD ACTIVE PAGE: ' + activePage, RIGHT_X_OFFSET, YPOS_DMD_DATA + 10);

  c.fillText('DMD PAGE RAM:', LEFT_X_OFFSET, YPOS_DMD_DATA + 20);

  drawMatrix8x8(emuState.asic.wpc.lampState, RIGHT_X_OFFSET, YPOS_WPC_DATA + 20);
  drawMatrix8x8Binary(emuState.asic.wpc.inputState, RIGHT_PLUS_X_OFFSET, YPOS_WPC_DATA + 20);

  drawMemRegion(emuState.asic.ram, RIGHT_X_OFFSET, YPOS_GENERIC_DATA + 30, 128);

  //dmd pages - 8 pixel (on/off) per byte, display is 128x32 pixels
  const videoRam = emuState.asic.dmd.videoRam;
  const DMD_PAGE_SIZE = 0x200;
  let xpos = LEFT_X_OFFSET;
  let ypos = YPOS_DMD_DATA + 30;
  for (var i = 0; i < 16; i++) {
    drawDmd(videoRam.slice(i * DMD_PAGE_SIZE, (i+1) * DMD_PAGE_SIZE), xpos, ypos, 128);
    xpos += 130;
    if (xpos > (800 - 130)) {
      xpos = LEFT_X_OFFSET;
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
    c.fillRect (x + offsetX, y + offsetY, 1, 1);
    if (offsetX++ === width) {
      offsetX = 0;
      offsetY ++;
    }
  }
}

function drawMatrix8x8(data, x, y) {
  const GRIDSIZE = 10;
  data.forEach((lamp, index) => {
    c.fillStyle = lamp & 0x80 ? COLOR_DMD[3] :
      lamp & 0x70 ? COLOR_DMD[2] : COLOR_DMD[0];
    const i = x + (index % 8) * GRIDSIZE;
    const j = y + parseInt(index / 8) * GRIDSIZE;
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
  for (var i=0; i < data.length; i++) {
    const packedByte = data[i];
    for (var j=0; j < BIT_ARRAY.length; j++) {
      const mask = BIT_ARRAY[j];
      if (mask & packedByte) {
        c.fillRect(x + offsetX * SCALE_FACTOR, y + offsetY * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
      }
      offsetX++;
      if (offsetX === width) {
        offsetX = 0;
        offsetY ++;
      }
    }
  }
}

function drawDmdShaded(data, x, y, width, SCALE_FACTOR = 1) {
  var offsetX = 0;
  var offsetY = 0;
  for (var i=0; i < data.length; i++) {
    const pixel = data[i];
    c.fillStyle = COLOR_DMD[pixel];
    c.fillRect(x + offsetX * SCALE_FACTOR, y + offsetY * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
    offsetX++;
    if (offsetX === width) {
      offsetX = 0;
      offsetY ++;
    }
  }
}

function canvasClear() {
  c.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  c.fillStyle = '#000';
  c.fill();
}
