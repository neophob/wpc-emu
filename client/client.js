'use strict';

/* global WpcEmu */
/* global c */

// HINT enable debug in the browser by entering "localStorage.debug = '*'" in the browser
console.log('hello');

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

var wpcSystem, intervalId;

function step() {
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();

  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();

  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();

  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();
  wpcSystem.executeCycle();

  updateCanvas();
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
  console.log('start emu');
  intervalId = requestAnimationFrame(step);
}

function stopEmu() {
  console.log('stop emu');
  cancelAnimationFrame(intervalId);
  intervalId = false;
  updateCanvas();
}

canvasClear();
// HINT: make sure CORS is correct
downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/hurcnl_2.rom')
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

const YPOS_GENERIC_DATA = 20;
const YPOS_WPC_DATA = 170;
const YPOS_DMD_DATA = 320;

function updateCanvas() {
  canvasClear();
  const emuState = wpcSystem.getUiState();
  c.font = '10px Monaco';

  c.fillStyle = 'magenta';
  c.fillText('GENERIC DATA:', 0, YPOS_GENERIC_DATA);
  c.fillText('WPC BOARD DATA:', 0, YPOS_WPC_DATA);
  c.fillText('DMD BOARD DATA:', 0, YPOS_DMD_DATA);

  c.fillStyle = 'yellow';
  c.fillText('ROM: hurcnl_2.rom', 0, YPOS_GENERIC_DATA + 10);
  c.fillText('CPU Ticks: ' + emuState.ticks + ' / OPMS: ' + emuState.opMs, 250, YPOS_GENERIC_DATA + 10);
  const cpuState = intervalId ? 'running' : 'stopped';
  c.fillText('CPU state: ' + cpuState, 500, YPOS_GENERIC_DATA + 10);

  const diagnosticLed = emuState.asic.wpc.dignosticLed ? emuState.asic.wpc.dignosticLed.toString(2) : '00000000';
  c.fillText('DIAGLED: ' + diagnosticLed, 0, YPOS_WPC_DATA + 10);
  c.fillText('Active ROM Bank: ' + emuState.asic.wpc.activeRomBank, 250, YPOS_WPC_DATA + 10);
  c.fillText('IRQ enabled: ' + emuState.asic.wpc.irqEnabled, 500, YPOS_WPC_DATA + 10);

  c.fillText('DMD ACTIVE PAGE: ' + emuState.asic.dmd.activepage, 0, YPOS_DMD_DATA + 10);
  c.fillText('DMD LOW PAGE: ' + emuState.asic.dmd.lowpage, 250, YPOS_DMD_DATA + 10);
  c.fillText('DMD HIGH PAGE: ' + emuState.asic.dmd.highpage, 500, YPOS_DMD_DATA + 10);

  c.fillText('DMD SCANLINE: ' + emuState.asic.dmd.scanline, 0, YPOS_DMD_DATA + 20);


  c.fillText('ASIC RAM:', 0, YPOS_GENERIC_DATA + 30);
  c.fillText('PAGE 1 RAM:', 0, YPOS_DMD_DATA + 40);
  c.fillText('PAGE 2 RAM:', 250, YPOS_DMD_DATA + 40);

  drawMemRegion(emuState.asic.ram, 0, YPOS_GENERIC_DATA + 40, 128);
  drawMemRegion(emuState.asic.dmd.page1, 0, YPOS_DMD_DATA + 50, 128);
  drawMemRegion(emuState.asic.dmd.page2, 250, YPOS_DMD_DATA + 50, 128);
}

function drawMemRegion(data, x, y, width) {
  var offsetX = 0;
  var offsetY = 0;
  data.forEach((alpha) => {
    c.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
    c.fillRect (x + offsetX, y + offsetY, 1, 1);
    offsetX ++;
    if (offsetX === width) {
      offsetX = 0;
      offsetY ++;
    }
  });
}

function canvasClear() {
  c.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  c.fillStyle = 'black';
  c.fill();
}
