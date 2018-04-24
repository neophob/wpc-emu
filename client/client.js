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

function updateCanvas() {
  canvasClear();
  const emuState = wpcSystem.getUiState();
  c.fillStyle = 'yellow';
  c.font = '14px Monaco';
  c.fillText('ROM: hurcnl_2.rom', 0, 30);
  c.fillText('CPU Ticks: ' + emuState.ticks, 250, 30);
  const cpuState = intervalId ? 'running' : 'stopped';
  c.fillText('CPU state: ' + cpuState, 500, 30);
  const diagnosticLed = emuState.asic.wpc.dignosticLed ? emuState.asic.wpc.dignosticLed.toString(2) : '00000000';

  c.fillText('DIAGLED: ' + diagnosticLed, 0, 60);
  c.fillText('Active ROM Bank: ' + emuState.asic.wpc.activeRomBank, 250, 60);

  c.fillText('DMD ACTIVE PAGE: ' + emuState.asic.dmd.activepage, 0, 90);
  c.fillText('DMD LOW PAGE: ' + emuState.asic.dmd.lowpage, 250, 90);
  c.fillText('DMD HIGH PAGE: ' + emuState.asic.dmd.highpage, 500, 90);

  c.fillText('DMD SCANLINE: ' + emuState.asic.dmd.scanline, 0, 120);
}

function canvasClear() {
  c.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  c.fillStyle = 'black';
  c.fill();
}
