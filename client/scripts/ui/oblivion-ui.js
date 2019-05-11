'use strict';

import { replaceNode } from './htmlselector';
import { createDrawLib } from './ui/lib.js';

export { initialise, updateCanvas, populateInitialCanvas, errorFeedback, loadFeedback };

// https://gmunk.com/OBLIVION-GFX
// https://www.reddit.com/r/OblivionMovie/comments/6pchsr/i_have_cloned_the_dc_tet_font_as_best_as_i_can/
// https://ilikeinterfaces.com/2015/04/21/ui-review-oblivion/
// FONT: https://www.whatfontis.com/Blender-Bold.similar

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 768;

let canvas, canvasDrawLib;
let canvasOverlay, canvasOverlayDrawLib;
let canvasDmd, canvaDmdDrawLib;
let canvasDmdMem, canvaDmdMemDrawLib;
let canvasMem, canvaMemDrawLib;

let playfieldData;
let playfieldImage;
let frame = 0;
let initialized = false;

const THEME = {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,

  DMD_COLOR_DARK: 'rgb(43,50,50)',
  DMD_COLOR_LOW: 'rgb(65,101,105)',
  DMD_COLOR_MIDDLE: 'rgb(66,116,127)',
  DMD_COLOR_HIGH: 'rgb(75,164,175)',

  GRID_POINTS_COLOR: 'rgb(44, 63, 67)',
  GRID_STEP_X: 12,
  GRID_STEP_Y: 12,
  GRID_SIZE: 1.2,

  HEADER_LINE_LOW_COLOR: 'rgb(52, 71, 75)',
  HEADER_LINE_HIGH_COLOR: 'rgb(150, 154, 147)',

  FONT_NAME: 'Space Mono',
  FONT_HEADER: '14px "Space Mono"',
  FONT_TEXT: '10px "Space Mono"',
  FONT_HUGE: '22px "Space Mono"',

  TEXT_COLOR_HEADER: 'rgb(127, 179, 171)',
  RIBBON_COLOR_HEADER: 'rgb(32, 45, 50)',

  TEXT_COLOR_LABEL: 'rgb(96, 110, 112)',
  TEXT_COLOR: 'rgb(237, 246, 206)',

  COLOR_BLUE: 'rgb(81, 115, 117)',
  COLOR_GREEN: 'rgb(17, 226, 19)',
  COLOR_RED: 'rgb(255, 108, 74)',
  COLOR_YELLOW: 'rgb(254, 255, 211)',

  POS_HEADER_X: 1,
  POS_HEADER_Y: 6,

  POS_CPU_X: 1,
  POS_CPU_Y: 12,

  POS_DMD_X: 21,
  POS_DMD_Y: 8,

  POS_PLAYFIELD_X: 88,
  POS_PLAYFIELD_Y: 6,

  POS_DMDMEM_X: 20,
  POS_DMDMEM_Y: 28,

  POS_ASIC_X: 1,
  POS_ASIC_Y: 28,

  POS_MEM_X: 1,
  POS_MEM_Y: 41,

  POS_SND_X: 1,
  POS_SND_Y: 51,

};

function updateCanvas(emuState, cpuRunningState, audioState) {
  if (!emuState) {
    return;
  }
  frame++;
  canvasOverlayDrawLib.clear();

  // HEADER
  canvasOverlayDrawLib.writeHeader(THEME.POS_HEADER_X + 5, THEME.POS_HEADER_Y + 2, emuState.romFileName);
  canvasOverlayDrawLib.writeRibbonHeader(THEME.POS_DMD_X + 60, THEME.POS_DMD_Y - 3.5, emuState.asic.wpc.time, THEME.FONT_TEXT);

  // CPU
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 2, emuState.cpuState.tickCount);
  canvasOverlayDrawLib.drawVerticalRandomBlip(THEME.POS_CPU_X + 11, THEME.POS_CPU_Y + 1, 3);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 5, emuState.opsMs);
  if (cpuRunningState === 'running') {
    canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 5, cpuRunningState, THEME.COLOR_GREEN);
  } else {
    canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 5, cpuRunningState, THEME.COLOR_RED);
  }
  canvasOverlayDrawLib.drawDiagram(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 8, 'OPS-DIAG', emuState.opsMs);

  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 11, emuState.cpuState.irqCount);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 12, emuState.cpuState.missedIRQ);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 11, emuState.cpuState.firqCount);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 12, emuState.cpuState.missedFIRQ);

  // DMD SHADED
  if (emuState.asic.dmd.dmdShadedBuffer) {
    canvaDmdDrawLib.clear();
    canvaDmdDrawLib.drawDmdShaded(THEME.POS_DMD_X, THEME.POS_DMD_Y, emuState.asic.dmd.dmdShadedBuffer);//128, emuState.asic.dmd.dmdShadedBuffer, 5);
  }
  canvasOverlayDrawLib.drawHorizontalRandomBlip(THEME.POS_DMD_X, THEME.POS_DMD_Y - 2.5, 10, emuState.opsMs >> 2);
  canvasOverlayDrawLib.drawHorizontalRandomBlip(THEME.POS_DMD_X + 25, THEME.POS_DMD_Y - 2.5, 6, emuState.asic.dmd.activepage >> 1);
  canvasOverlayDrawLib.drawHorizontalRandomBlip(THEME.POS_DMD_X + 50, THEME.POS_DMD_Y - 2.5, 8, emuState.asic.wpc.diagnosticLedToggleCount);

  canvasOverlayDrawLib.drawDiagram(THEME.POS_DMD_X + 32, THEME.POS_DMD_Y - 2.5, 'DMD_ACTIVE_PAGE', emuState.asic.dmd.activepage);
  canvasOverlayDrawLib.writeLabel(THEME.POS_DMD_X + 12, THEME.POS_DMD_Y - 2.5, emuState.asic.dmd.dmdPageMapping, THEME.TEXT_COLOR_HEADER);

  //ASIC
  canvasOverlayDrawLib.drawDiagram(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 3, 'WATCHDOG', emuState.asic.wpc.watchdogTicks);
  canvasOverlayDrawLib.writeLabel(THEME.POS_ASIC_X + 11.5, THEME.POS_ASIC_Y + 1, emuState.asic.wpc.watchdogExpiredCounter);

  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 5.5, 1, 1, emuState.asic.wpc.blankSignalHigh ? THEME.COLOR_GREEN : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 3, THEME.POS_ASIC_Y + 5.5, 1, 1, emuState.asic.wpc.diagnosticLed ? THEME.COLOR_GREEN : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 5, THEME.POS_ASIC_Y + 5.5, 1, 1, THEME.COLOR_GREEN);
  canvasOverlayDrawLib.writeHeader(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 6.5, emuState.asic.wpc.diagnosticLedToggleCount);

  canvasOverlayDrawLib.drawDiagram(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 10, 'ASIC_ROM_BANK', emuState.asic.wpc.activeRomBank, 22);
  canvasOverlayDrawLib.writeHeader(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 9.5, emuState.protectedMemoryWriteAttempts);


  // MEMORY
  if (emuState.asic.ram) {
    canvaMemDrawLib.drawMemRegion(THEME.POS_MEM_X + 1, THEME.POS_MEM_Y + 2, emuState.asic.ram);
  }

  // DMD MEM
  if (emuState.asic.dmd.videoRam) {
    canvaDmdMemDrawLib.clear();
    canvaDmdMemDrawLib.drawVideoRam(THEME.POS_DMDMEM_X + 0.5, THEME.POS_DMDMEM_Y + 2.75, frame, emuState.asic.dmd.videoRam);
    canvaDmdMemDrawLib.drawHorizontalRandomBlip(THEME.POS_DMDMEM_X + 13, THEME.POS_DMDMEM_Y + 11.5, 2);
    canvaDmdMemDrawLib.drawHorizontalRandomBlip(THEME.POS_DMDMEM_X + 25, THEME.POS_DMDMEM_Y + 11.5, 1);
    canvaDmdMemDrawLib.drawHorizontalRandomBlip(THEME.POS_DMDMEM_X + 25, THEME.POS_DMDMEM_Y + 1.5, 3);
    canvaDmdMemDrawLib.drawVerticalRandomBlip(THEME.POS_DMDMEM_X + 0.5, THEME.POS_DMDMEM_Y + 16.5, 2, (Date.now() / 0xCAFFE) << 2);
  }

  // SOUND
  canvasOverlayDrawLib.drawRedTriangle(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 2.5, 13, emuState.asic.sound.volume / 31);
  canvasOverlayDrawLib.writeLabel(THEME.POS_SND_X + 9.5, THEME.POS_SND_Y + 1, audioState);

  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 6, emuState.asic.sound.readControlBytes);
  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 7, emuState.asic.sound.writeControlBytes);
  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 8, THEME.POS_SND_Y + 6, emuState.asic.sound.readDataBytes);
  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 8, THEME.POS_SND_Y + 7, emuState.asic.sound.writeDataBytes);
}

function createCanvas() {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = CANVAS_WIDTH;
  canvasElement.height = CANVAS_HEIGHT;
  return canvasElement;
}

function initialise() {
  if (initialized) {
    console.log('ALREADY_INITIALIZED!');
    return;
  }
  initialized = true;
  console.log('initialise');

  const canvasRootElement = createCanvas();
  canvas = canvasRootElement.getContext('2d', { alpha: false });
  /*canvas = canvasRootElement.getContext('2d', { alpha: true });
  canvas.fillStyle = '#000000';
  canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.shadowBlur = 2;
  canvas.shadowColor = THEME.COLOR_BLUE;*/
  replaceNode('canvasNode', canvasRootElement);

  const canvasOverlayElement = createCanvas();
  canvasOverlay = canvasOverlayElement.getContext('2d', { alpha: true });
  //canvasOverlay.shadowBlur = 2;
  //canvasOverlay.shadowColor = THEME.COLOR_BLUE;
  replaceNode('canvasOverlayNode', canvasOverlayElement);

  const canvasDmdElement = createCanvas();
  canvasDmd = canvasDmdElement.getContext('2d', { alpha: true });
  replaceNode('canvasDmdNode', canvasDmdElement);

  const canvasDmdMemElement = createCanvas();
  canvasDmdMem = canvasDmdMemElement.getContext('2d', { alpha: true });
  replaceNode('canvasDmdMemNode', canvasDmdMemElement);

  const canvasMemElement = createCanvas();
  canvasMem = canvasMemElement.getContext('2d', { alpha: true });
  replaceNode('canvasMemNode', canvasMemElement);

  canvasDrawLib = createDrawLib(canvas, THEME);
  canvasOverlayDrawLib = createDrawLib(canvasOverlay, THEME);
  canvaDmdDrawLib = createDrawLib(canvasDmd, THEME);
  canvaMemDrawLib = createDrawLib(canvasMem, THEME);
  canvaDmdMemDrawLib = createDrawLib(canvasDmdMem, THEME);

  canvasDrawLib.drawBackgroundPoints();

  //DRAW STATIC
  canvasDrawLib.drawHorizontalLine(1, 1, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X - 1, 1, 66);

  // HEADER
  canvasDrawLib.drawHorizontalLine(THEME.POS_HEADER_X, THEME.POS_HEADER_Y, 15);
  canvasDrawLib.writeRibbonHeader(THEME.POS_HEADER_X + 1, THEME.POS_HEADER_Y + 2, 'FILE');
  canvasDrawLib.drawHorizontalLine(THEME.POS_HEADER_X, THEME.POS_HEADER_Y + 3, 15);

  // CPU
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X,      THEME.POS_CPU_Y, 13);
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X + 15, THEME.POS_CPU_Y, 13);

  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 1, 'TICKS');
  canvasDrawLib.writeRibbonHeader(THEME.POS_CPU_X + 12, THEME.POS_CPU_Y + 2, 'CPU');

  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 3, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 6, 15);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 4, 'OPS/MS');
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X + 7, THEME.POS_CPU_Y + 3, 3);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 4, 'STATUS');

  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 9, 15);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 10, 'IRQ/MISSED');
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 10, 'FIRQ/MISSED');

  // ASIC
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X,      THEME.POS_ASIC_Y, 10);
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X + 15, THEME.POS_ASIC_Y, 10);
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 1, 'WATCHDOG');
  canvasDrawLib.writeRibbonHeader(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 1, 'EXPIRED', THEME.FONT_TEXT);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X, THEME.POS_ASIC_Y + 4, 15);

  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 5, 'D19');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 3, THEME.POS_ASIC_Y + 5, 'D21');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 5, THEME.POS_ASIC_Y + 5, 'D20');
  canvasDrawLib.writeRibbonHeader(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 5, 'TGLE CNT', THEME.FONT_TEXT);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X, THEME.POS_ASIC_Y + 7, 15);

  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 8, 'ROM BANK');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 8, 'LOCKED MEM W');
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 7, 3);

  // DMD
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 12, THEME.POS_DMD_Y - 4, 'DMD PAGE MAP');
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 32, THEME.POS_DMD_Y - 4, 'DMD ACTIVE PAGE');

  // DMD MEM
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X,      THEME.POS_DMDMEM_Y, 21);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 12, THEME.POS_DMDMEM_Y + 1, 20);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 24, THEME.POS_DMDMEM_Y + 1, 20);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 36, THEME.POS_DMDMEM_Y + 1, 20);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 48, THEME.POS_DMDMEM_Y, 21);
  canvasDrawLib.writeRibbonHeader(THEME.POS_DMDMEM_X + 1, THEME.POS_DMDMEM_Y + 1, 'DMD', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 3.5, THEME.POS_DMDMEM_Y + 1, 'VIDEO RAM');
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMDMEM_X, THEME.POS_DMDMEM_Y + 6, 48);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMDMEM_X, THEME.POS_DMDMEM_Y + 11, 48);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMDMEM_X, THEME.POS_DMDMEM_Y + 16, 48);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 2, '#00', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 7, '#04', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 12, '#08', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 17, '#12', THEME.COLOR_YELLOW);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 2, '#01', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 7, '#05', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 12, '#09', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 17, '#13', THEME.COLOR_YELLOW);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 2, '#02', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 7, '#06', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 12, '#10', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 17, '#14', THEME.COLOR_YELLOW);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 2, '#03', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 7, '#07', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 12, '#11', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 17, '#15', THEME.COLOR_YELLOW);

  // MEM
  canvasDrawLib.drawVerticalLine(THEME.POS_MEM_X,      THEME.POS_MEM_Y, 7);
  canvasDrawLib.drawVerticalLine(THEME.POS_MEM_X + 15, THEME.POS_MEM_Y, 7);
  canvasDrawLib.writeLabel(THEME.POS_MEM_X + 1, THEME.POS_MEM_Y + 1, 'MEMORY');

  // DMD SHADED
  canvasDrawLib.drawRect(THEME.POS_DMD_X - 0.2, THEME.POS_DMD_Y - 0.2, 65 - 0.6, 17 - 0.6, THEME.DMD_COLOR_DARK);
  canvasDrawLib.drawRect(THEME.POS_DMD_X - 1, THEME.POS_DMD_Y - 1, 66, 18, THEME.TEXT_COLOR_HEADER);

  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X - 1, THEME.POS_DMD_Y - 2, 66);
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 60, THEME.POS_DMD_Y - 2.5, 'LIVE', THEME.TEXT_COLOR_HEADER);
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 62, THEME.POS_DMD_Y - 2.5, 'FEED');

  // SND
  canvasDrawLib.drawVerticalLine(THEME.POS_SND_X,      THEME.POS_SND_Y, 8);
  canvasDrawLib.drawVerticalLine(THEME.POS_SND_X + 15, THEME.POS_SND_Y, 8);
  canvasDrawLib.writeLabel(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 1, 'SOUND');

  canvasDrawLib.writeRibbonHeader(THEME.POS_SND_X + 6, THEME.POS_SND_Y + 1, 'STATE', THEME.FONT_TEXT);
  canvasDrawLib.drawScala(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 2.5, 10, 3);
  canvasDrawLib.drawHorizontalLine(THEME.POS_SND_X, THEME.POS_SND_Y + 4, 15);

  canvasDrawLib.writeLabel(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 5, 'CTRL R/W');
  canvasDrawLib.writeLabel(THEME.POS_SND_X + 8, THEME.POS_SND_Y + 5, 'DATA R/W');

}


function populateInitialCanvas(gameEntry) {
  initialise();

  // preload data
  playfieldData = gameEntry.playfield;
  playfieldImage = null;
  if (playfieldData) {
    playfieldImage = new Image();
    playfieldImage.onload = function () {
      canvasDrawLib.drawImage(THEME.POS_PLAYFIELD_X, THEME.POS_PLAYFIELD_Y, playfieldImage);
    };
    playfieldImage.src = FETCHURL + playfieldData.image;
  }
}

function errorFeedback(error) {
  initialise();

  canvas.fillStyle = COLOR_DMD[3];
  const x = LEFT_X_OFFSET + 10;
  const y = YPOS_DMD_MAIN_VIEW + 30;
  canvas.font = '25px ' + FONT;

  canvas.fillText('ERROR! Failed to load ROM!', x, y);
  canvas.fillText('Details: ' + error.message, x, y + 30);

  canvas.font = '10px ' + FONT;
}

function loadFeedback(romName) {
  initialise();

  canvas.fillStyle = COLOR_DMD[3];
  const x = LEFT_X_OFFSET + 10;
  const y = YPOS_DMD_MAIN_VIEW + 30;
  canvas.font = '25px ' + FONT;

  canvas.fillText('Load ROM ' + romName, x, y);

  canvas.font = '10px ' + FONT;
}
