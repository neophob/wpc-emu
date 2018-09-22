'use strict';

import { replaceNode } from './htmlselector';

export { initialise, updateCanvas };

/*jshint bitwise: false*/

// HINT enable debug in the browser by entering "localStorage.debug = '*'" in the browser

const LAMP_DISPLAY_WIDTH = 200;

const CANVAS_WIDTH = 815 + LAMP_DISPLAY_WIDTH;
const CANVAS_HEIGHT = 560;
const YPOS_DMD_MAIN_VIEW = 15;
const YPOS_GENERIC_DATA = 225;
const YPOS_DMD_DATA = 400;
const YPOS_MEM_DATA = YPOS_DMD_DATA + 65;

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

let canvas;
let canvasOverlay;
let playfieldData;
let playfieldImage;
let videoRam;
let frame = 0;

const colorLut = new Map();
colorLut.set('YELLOW', 'rgba(255,255,0,');
colorLut.set('ORANGE', 'rgba(255,165,0,');
colorLut.set('RED', 'rgba(255,0,0,');
colorLut.set('LBLUE', 'rgba(173,216,230,');
colorLut.set('LPURPLE', 'rgba(218,112,214,');
colorLut.set('WHITE', 'rgba(255,255,255,');
colorLut.set('GREEN', 'rgba(0,255,0,');
colorLut.set('BLACK', 'rgba(0,0,0,0)');

function updateCanvas(emuState, cpuState) {
  if (!emuState) {
    return;
  }
  canvas.fillStyle = '#000';
  canvas.fillRect(LEFT_X_OFFSET, YPOS_GENERIC_DATA, 245, 145);
  canvas.fillRect(LEFT_X_OFFSET, YPOS_DMD_DATA, 150, 40);

  canvas.fillStyle = COLOR_DMD[2];
  canvas.fillText('ROM: ' + emuState.romFileName, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 10);
  canvas.fillText('CPU TICKS: ' + emuState.ticks, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 20);
  canvas.fillText('CPU TICKS/ms: ' + emuState.opsMs, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 30);
  canvas.fillText('CPU STATE: ' + cpuState, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 40);
  const irqMissed = emuState.missedIrqCall - emuState.missedIrqMaskCall || 0;
  canvas.fillText('IRQ CALLS/MISSED: ' + emuState.irqCount + '/' + irqMissed,
    LEFT_X_OFFSET, YPOS_GENERIC_DATA + 50);
  canvas.fillText('FIRQ CALLS/MISSED: ' + emuState.firqCount + '/' + emuState.missedFirqCall,
    LEFT_X_OFFSET, YPOS_GENERIC_DATA + 60);

  const diagnosticLed = emuState.asic.wpc.diagnosticLed ? 1 : 0;
  const activePage = emuState.asic.dmd.activepage;
  canvas.fillText('DIAGLED STATE: ' + diagnosticLed, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 70);
  canvas.fillText('DIAGLED TOGGLE COUNT: ' + emuState.asic.wpc.diagnosticLedToggleCount, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 80);
  canvas.fillText('ACTIVE ROM BANK: ' + emuState.asic.wpc.activeRomBank, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 90);
  canvas.fillText('WRITE TO LOCKED MEM: ' + emuState.protectedMemoryWriteAttempts, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 100);

  canvas.fillText('SND CPU TICK: ' + emuState.asic.sound.ticks, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 110);
  canvas.fillText('SND IRQ CALLS/MISSED: ' + emuState.asic.sound.irqCount + '/' + emuState.asic.sound.missedIrqCall,
    LEFT_X_OFFSET, YPOS_GENERIC_DATA + 120);
  canvas.fillText('SND FIRQ CALLS/MISSED: ' + emuState.asic.sound.firqCount + '/' + emuState.asic.sound.missedFirqCall,
    LEFT_X_OFFSET, YPOS_GENERIC_DATA + 130);
  canvas.fillText('SND VOLUME: ' + emuState.asic.sound.volume, LEFT_X_OFFSET, YPOS_GENERIC_DATA + 140);

  canvas.fillText('DMD LOW PAGE: ' + emuState.asic.dmd.lowpage, LEFT_X_OFFSET, YPOS_DMD_DATA + 10);
  canvas.fillText('DMD HIGH PAGE: ' + emuState.asic.dmd.highpage, LEFT_X_OFFSET, YPOS_DMD_DATA + 20);
  canvas.fillText('DMD ACTIVE PAGE: ' + activePage, LEFT_X_OFFSET, YPOS_DMD_DATA + 30);

  if (emuState.asic.sound.ram) {
    drawMemRegion(emuState.asic.sound.ram, LEFT_X_OFFSET + 125, YPOS_MEM_DATA + 20, 120);
  }

  if (emuState.asic.dmd.dmdShadedBuffer) {
    drawDmdShaded(emuState.asic.dmd.dmdShadedBuffer, LEFT_X_OFFSET, YPOS_DMD_MAIN_VIEW, 128, 6);
  }

  if (emuState.asic.ram) {
    drawMemRegion(emuState.asic.ram, LEFT_X_OFFSET, YPOS_MEM_DATA + 20, 120);
  }

  if (emuState.asic.wpc.lampState) {
    drawMatrix8x8(emuState.asic.wpc.lampState, RIGHT_X_OFFSET, YPOS_GENERIC_DATA + 20);
    drawLampPositions(emuState.asic.wpc.lampState, 800, YPOS_DMD_MAIN_VIEW);
  }

  if (emuState.asic.wpc.solenoidState) {
    drawMatrix8x8(emuState.asic.wpc.solenoidState, MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 20);
    canvasOverlay.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    drawFlashlamps(emuState.asic.wpc.solenoidState, 800, YPOS_DMD_MAIN_VIEW);
  }

  if (emuState.asic.wpc.inputState) {
    drawMatrix8x8Binary(emuState.asic.wpc.inputState, RIGHT_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 20);
  }

  drawMatrix8x8(emuState.asic.wpc.generalIlluminationState, MIDDLE_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 20);

  //dmd pages - 8 pixel (on/off) per byte, display is 128x32 pixels
  if (emuState.asic.dmd.videoRam) {
    videoRam = emuState.asic.dmd.videoRam;
  }
  frame++;
  const dmdRow = frame % 4;
  // draw only 4 dmd frames to avoid dropping fps
  if (Array.isArray(videoRam)) {
    let xpos = MIDDLE_X_OFFSET;
    let ypos = YPOS_DMD_DATA + 20;
    for (let i = 0; i < dmdRow * 4; i++) {
      xpos += 130;
      if (xpos > (800 - 130)) {
        xpos = MIDDLE_X_OFFSET;
        ypos += 35;
      }
    }
    for (let i = 0; i < 4; i++) {
      drawDmd(videoRam[dmdRow * 4 + i], xpos, ypos, 128);
      xpos += 130;
      if (xpos > (800 - 130)) {
        xpos = MIDDLE_X_OFFSET;
        ypos += 35;
      }
    }
  }
}

function drawMemRegion(data, x, y, width) {
  canvas.fillStyle = COLOR_DMD[0];
  canvas.fillRect(x, y, width, 70);

  let offsetX = 0;
  let offsetY = 0;
  let color = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      if (color !== data[i]) {
        color = data[i].toString(16);
        canvas.fillStyle = '#' + color + color + color;
      }
      canvas.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
    if (offsetX++ >= width - 1) {
      offsetX = 0;
      offsetY++;
    }
  }
}

function drawMatrix8x8(data, x, y, GRIDSIZE = 15) {
  data.forEach((lamp, index) => {
    canvas.fillStyle = lamp & 0x80 ? COLOR_DMD[3] :
      lamp & 0x70 ? COLOR_DMD[1] : COLOR_DMD[0];
    const i = x + (index % 8) * GRIDSIZE;
    const j = y + parseInt(index / 8, 10) * GRIDSIZE;
    canvas.fillRect(i, j, GRIDSIZE, GRIDSIZE);
  });
}

function drawFlashlamps(lampState, x, y) {
  if (!playfieldData || !lampState || !Array.isArray(playfieldData.flashlamps)) {
    return;
  }

  playfieldData.flashlamps.forEach((lamp) => {
    const selectedLamp = lampState[lamp.id - 1];
    if (!selectedLamp) {
      return;
    }
    const alpha = (selectedLamp / 255).toFixed(2);
    canvasOverlay.beginPath();
    canvasOverlay.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    canvasOverlay.arc(x + lamp.x, y + lamp.y, 24, 0, 2 * Math.PI);
    canvasOverlay.fill();
  });
}

const LAMP_SIZE = 6;
const LAMP_SIZE2 = LAMP_SIZE / 2;
function drawLampPositions(lampState, x, y) {
  if (!playfieldData || !lampState || !Array.isArray(playfieldData.lamps)) {
    return;
  }

  lampState.forEach((lamp, index) => {
    if (index >= playfieldData.lamps.length) {
      return;
    }
    const lampObjects = playfieldData.lamps[index];
    if (!lampObjects) {
      return;
    }

    const alpha = (lamp / 512).toFixed(2);
    const isOn = lamp > 0;
    lampObjects.forEach((lampObject) => {
      if (isOn) {
        canvas.fillStyle = colorLut.get(lampObject.color) + alpha + ')';
      } else {
        canvas.fillStyle = 'black';
      }
      canvas.fillRect(x + lampObject.x - LAMP_SIZE2, y + lampObject.y - LAMP_SIZE2, LAMP_SIZE, LAMP_SIZE);
    });
  });
}

function drawMatrix8x8Binary(data, x, y) {
  const dataUnpacked = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 8; j++) {
      const entry = data[i] & BIT_ARRAY[j];
      dataUnpacked.push(entry > 0 ? 255 : 0);
    }
  }
  drawMatrix8x8(dataUnpacked, x, y);
}

function drawDmd(data, x, y, width) {
  canvas.fillStyle = COLOR_DMD[0];
  canvas.fillRect(x, y, width, 32);
  canvas.fillStyle = COLOR_DMD[3];

  let offsetX = 0;
  let offsetY = 0;
  for (let i = 0; i < data.length; i++) {
    const packedByte = data[i];
    for (let j = 0; j < BIT_ARRAY.length; j++) {
      //NOTE: important speed optimize here...
      if (packedByte > 0) {
        const mask = BIT_ARRAY[j];
        if (mask & packedByte) {
          canvas.fillRect(x + offsetX, y + offsetY, 1, 1);
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
  const MARGIN = 2;
  canvas.fillStyle = COLOR_DMD[0];
  canvas.fillRect(x, y, width * SCALE_FACTOR, 32 * SCALE_FACTOR);

  let offsetX = 0;
  let offsetY = 0;
  let color = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      if (color !== data[i]) {
        color = data[i];
        canvas.fillStyle = COLOR_DMD[color];
      }
      canvas.fillRect(MARGIN + x + offsetX * SCALE_FACTOR, MARGIN + y + offsetY * SCALE_FACTOR,
        SCALE_FACTOR - MARGIN, SCALE_FACTOR - MARGIN);
    }
    offsetX++;
    if (offsetX === width) {
      offsetX = 0;
      offsetY++;
    }
  }
}

function initCanvas() {
  canvas.fillStyle = '#000';
  canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  canvas.font = '10px Monaco';
  canvas.fillStyle = COLOR_DMD[3];
  canvas.fillText('# DEBUG DATA:', LEFT_X_OFFSET, YPOS_GENERIC_DATA);
  canvas.fillText('# DMD BOARD DATA:', LEFT_X_OFFSET, YPOS_DMD_DATA);
  canvas.fillText('# MEMORY:', LEFT_X_OFFSET, YPOS_MEM_DATA);

  canvas.fillStyle = COLOR_DMD[2];
  canvas.fillText('SOLENOID OUT MATRIX', MIDDLE_X_OFFSET, YPOS_GENERIC_DATA + 10);
  canvas.fillText('ILLUM. OUT MATRIX', MIDDLE_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 10);
  canvas.fillText('LAMP OUT MATRIX', RIGHT_X_OFFSET, YPOS_GENERIC_DATA + 10);
  canvas.fillText('SWITCH IN MATRIX', RIGHT_PLUS_X_OFFSET, YPOS_GENERIC_DATA + 10);
  canvas.fillText('DMD PAGE RAM:', MIDDLE_X_OFFSET, YPOS_DMD_DATA + 10);
  canvas.fillText('WPC CPU RAM:', LEFT_X_OFFSET, YPOS_MEM_DATA + 10);
  canvas.fillText('SOUND CPU RAM:', LEFT_X_OFFSET + 125, YPOS_MEM_DATA + 10);
}

function initialise(gameEntry) {
  console.log('initialise');

  // prepare view
  const canvasRootElement = document.createElement('canvas');
  canvasRootElement.width = CANVAS_WIDTH;
  canvasRootElement.height = CANVAS_HEIGHT;
  canvas = canvasRootElement.getContext('2d', { alpha: false });
  replaceNode('canvasNode', canvasRootElement);

  //TODO make canvas smaller
  const canvasOverlayElement = document.createElement('canvas');
  canvasOverlayElement.width = CANVAS_WIDTH;
  canvasOverlayElement.height = CANVAS_HEIGHT;
  canvasOverlay = canvasOverlayElement.getContext('2d', { alpha: true });
  replaceNode('canvasOverlayNode', canvasOverlayElement);

  // preload data
  playfieldData = gameEntry.playfield;
  playfieldImage = null;
  if (playfieldData) {
    playfieldImage = new Image();
    playfieldImage.onload = function() {
      canvas.drawImage(playfieldImage, 800, YPOS_DMD_MAIN_VIEW);
    };
    playfieldImage.src = playfieldData.image;
  }

  initCanvas();
}
