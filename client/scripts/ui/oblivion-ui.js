'use strict';

import { replaceNode } from './htmlselector';
import { createDrawLib } from './ui/lib.js';

export { initialise, updateCanvas, populateInitialCanvas, errorFeedback, loadFeedback };

// https://gmunk.com/OBLIVION-GFX
// https://www.reddit.com/r/OblivionMovie/comments/6pchsr/i_have_cloned_the_dc_tet_font_as_best_as_i_can/
// https://ilikeinterfaces.com/2015/04/21/ui-review-oblivion/
// FONT: https://www.whatfontis.com/Blender-Bold.similar

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

let canvas, canvasDrawLib;
let canvasOverlay, canvasOverlayDrawLib;
let canvasDmd, canvaDmdDrawLib;

let playfieldData;
let playfieldImage;

const THEME = {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,

  DMD_COLOR_DARK: 'rgb(43,50,50)',
  DMD_COLOR_LOW: 'rgb(65,101,105)',
  DMD_COLOR_MIDDLE: 'rgb(66,116,127)',
  DMD_COLOR_HIGH: 'rgb(75,164,175)',

  GRID_POINTS_COLOR: 'rgb(44, 51, 44)',
  GRID_STEP_X: 12,
  GRID_STEP_Y: 12,
  GRID_SIZE: 1.2,

  HEADER_LINE_LOW_COLOR: 'rgb(65, 68, 70)',
  HEADER_LINE_HIGH_COLOR: 'rgb(150, 154, 147)',

  FONT_NAME: 'Space Mono',
  FONT_HEADER: '15px "Space Mono"',
  FONT_TEXT: '10px "Space Mono"',
  FONT_HUGE: '22px "Space Mono"',

  TEXT_COLOR_HEADER: 'rgb(127, 179, 171)',
  RIBBON_COLOR_HEADER: 'rgb(32, 45, 50)',

  TEXT_COLOR_LABEL: 'rgb(96, 110, 112)',
  TEXT_COLOR: 'rgb(237, 246, 206)',

  COLOR_GREEN: 'rgb(17, 226, 19)',
  COLOR_RED: 'rgb(255, 108, 74)',
  COLOR_YELLOW: 'rgb(254, 255, 211)',

  POS_HEADER_X: 1,
  POS_HEADER_Y: 6,

  POS_META_X: 1,
  POS_META_Y: 11,

  POS_CPU_X: 1,
  POS_CPU_Y: 18,

  POS_DMD_X: 19,
  POS_DMD_Y: 8,

  POS_ASIC_X: 1,
  POS_ASIC_Y: 34,

  POS_MEM_X: 1,
  POS_MEM_Y: 48,
};

function updateCanvas(emuState, cpuRunningState, audioState) {
  if (!emuState) {
    return;
  }
  canvasOverlayDrawLib.clear();

  // META
  canvasOverlayDrawLib.writeHeader(THEME.POS_META_X + 4, THEME.POS_META_Y + 1, emuState.romFileName);
  canvasOverlayDrawLib.writeHuge(THEME.POS_META_X + 1, THEME.POS_META_Y + 4, emuState.asic.wpc.time, THEME.DMD_COLOR_HIGH);

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
  canvasOverlayDrawLib.drawHorizontalRandomBlip(THEME.POS_DMD_X, THEME.POS_DMD_Y - 2.5, 10, (Date.now() & 0xDBABE) >> 9);
  canvasOverlayDrawLib.drawHorizontalRandomBlip(THEME.POS_DMD_X + 25, THEME.POS_DMD_Y - 2.5, 6, (Date.now() / 0xCAFFE) << 2);
  canvasOverlayDrawLib.drawHorizontalRandomBlip(THEME.POS_DMD_X + 50, THEME.POS_DMD_Y - 2.5, 8);

  canvasOverlayDrawLib.drawDiagram(THEME.POS_DMD_X + 1, THEME.POS_DMD_X + 10, 'DMD_ACTIVE_PAGE', emuState.asic.dmd.activepage);



  //ASIC
  canvasOverlayDrawLib.drawDiagram(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 3, 'WATCHDOG', emuState.asic.wpc.watchdogTicks);
  canvasOverlayDrawLib.writeLabel(THEME.POS_ASIC_X + 12, THEME.POS_ASIC_Y + 1, emuState.asic.wpc.watchdogExpiredCounter);

  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 6, 1, 1, emuState.asic.wpc.blankSignalHigh ? THEME.COLOR_GREEN : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 4, THEME.POS_ASIC_Y + 6, 1, 1, emuState.asic.wpc.diagnosticLed ? THEME.COLOR_GREEN : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 6, 1, 1, THEME.COLOR_GREEN);
  canvasOverlayDrawLib.writeLabel(THEME.POS_ASIC_X + 10, THEME.POS_ASIC_Y + 7, emuState.asic.wpc.diagnosticLedToggleCount);

  canvasOverlayDrawLib.writeHeader(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 10, emuState.asic.wpc.activeRomBank);
  canvasOverlayDrawLib.writeHeader(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 10, emuState.protectedMemoryWriteAttempts);


}

function initialise() {
  console.log('initialise');

  const canvasRootElement = document.createElement('canvas');
  canvasRootElement.width = CANVAS_WIDTH;
  canvasRootElement.height = CANVAS_HEIGHT;
  canvas = canvasRootElement.getContext('2d', { alpha: false });
  replaceNode('canvasNode', canvasRootElement);

  const canvasOverlayElement = document.createElement('canvas');
  canvasOverlayElement.width = CANVAS_WIDTH;
  canvasOverlayElement.height = CANVAS_HEIGHT;
  canvasOverlay = canvasOverlayElement.getContext('2d', { alpha: true });
  replaceNode('canvasOverlayNode', canvasOverlayElement);

  const canvasDmdElement = document.createElement('canvas');
  canvasDmdElement.width = CANVAS_WIDTH;
  canvasDmdElement.height = CANVAS_HEIGHT;
  canvasDmd = canvasDmdElement.getContext('2d', { alpha: true });
  replaceNode('canvasDmdNode', canvasDmdElement);

  canvasDrawLib = createDrawLib(canvas, THEME);
  canvasDrawLib.drawBackgroundPoints();
  canvasOverlayDrawLib = createDrawLib(canvasOverlay, THEME);
  canvaDmdDrawLib = createDrawLib(canvasDmd, THEME);

  canvasDmd.clearRect(0, 0, canvasDmd.width, canvasDmd.height);

  //DRAW STATIC
  canvasDrawLib.drawHorizontalLine(1, 1, 15);
  canvasDrawLib.drawHorizontalLine(18, 1, 66);

  // HEADER
  canvasDrawLib.drawHorizontalLine(THEME.POS_HEADER_X, THEME.POS_HEADER_Y, 15);
  canvasDrawLib.writeRibbonHeader(THEME.POS_HEADER_X + 1, THEME.POS_HEADER_Y + 2, 'STATUS:');
  canvasDrawLib.writeHeader(THEME.POS_HEADER_X + 8, THEME.POS_HEADER_Y + 2, 'SYSTEM');
  canvasDrawLib.drawHorizontalLine(THEME.POS_HEADER_X, THEME.POS_HEADER_Y + 3, 15);

  // META
  canvasDrawLib.drawVerticalLine(THEME.POS_META_X,      THEME.POS_META_Y, 5);
  canvasDrawLib.drawVerticalLine(THEME.POS_META_X + 15, THEME.POS_META_Y, 5);
  canvasDrawLib.writeHeader(THEME.POS_META_X + 1, THEME.POS_META_Y + 1, 'ROM', THEME.TEXT_COLOR_LABEL);
  canvasDrawLib.drawHorizontalLine(THEME.POS_META_X, THEME.POS_META_Y + 2, 15);

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
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X,      THEME.POS_ASIC_Y, 11);
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X + 15, THEME.POS_ASIC_Y, 11);
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 1, 'WATCHDOG');
  canvasDrawLib.writeRibbonHeader(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 1, 'EXPIRED:', THEME.FONT_TEXT);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X, THEME.POS_ASIC_Y + 4, 15);

  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 5, 'D19');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 4, THEME.POS_ASIC_Y + 5, 'D21');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 5, 'D20');
  canvasDrawLib.writeRibbonHeader(THEME.POS_ASIC_X + 10, THEME.POS_ASIC_Y + 5, 'TGLE CNT', THEME.FONT_TEXT);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X, THEME.POS_ASIC_Y + 8, 15);

  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 9, 'ROM BANK');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 9, 'LOCKED MEM W');
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X + 6, THEME.POS_ASIC_Y + 8, 3);

  // MEM
  canvasDrawLib.drawVerticalLine(THEME.POS_MEM_X,      THEME.POS_MEM_Y, 5);
  canvasDrawLib.drawVerticalLine(THEME.POS_MEM_X + 15, THEME.POS_MEM_Y, 5);
  canvasDrawLib.writeLabel(THEME.POS_MEM_X + 1, THEME.POS_MEM_Y + 1, 'MEMORY');

  // DMD SHADED
  canvasDrawLib.drawRect(THEME.POS_DMD_X - 0.2, THEME.POS_DMD_Y - 0.2, 65 - 0.6, 17 - 0.6, THEME.DMD_COLOR_DARK);
  canvasDrawLib.drawRect(THEME.POS_DMD_X - 1, THEME.POS_DMD_Y - 1, 66, 18, THEME.TEXT_COLOR_HEADER);

  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X - 1, THEME.POS_DMD_Y - 2, 66);
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 60, THEME.POS_DMD_Y - 2.5, 'LIVE', THEME.TEXT_COLOR_HEADER);
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 62, THEME.POS_DMD_Y - 2.5, 'FEED');
}

function initCanvas() {
}

function populateInitialCanvas(gameEntry) {
  initCanvas();

  // preload data
  playfieldData = gameEntry.playfield;
  playfieldImage = null;
  if (playfieldData) {
    playfieldImage = new Image();
    playfieldImage.onload = function () {
//TODO      canvas.drawImage(playfieldImage, 800, YPOS_DMD_MAIN_VIEW);
    };
    playfieldImage.src = FETCHURL + playfieldData.image;
  }
}

function errorFeedback(error) {
  initCanvas();

  canvas.fillStyle = COLOR_DMD[3];
  const x = LEFT_X_OFFSET + 10;
  const y = YPOS_DMD_MAIN_VIEW + 30;
  canvas.font = '25px ' + FONT;

  canvas.fillText('ERROR! Failed to load ROM!', x, y);
  canvas.fillText('Details: ' + error.message, x, y + 30);

  canvas.font = '10px ' + FONT;
}

function loadFeedback(romName) {
  initCanvas();

  canvas.fillStyle = COLOR_DMD[3];
  const x = LEFT_X_OFFSET + 10;
  const y = YPOS_DMD_MAIN_VIEW + 30;
  canvas.font = '25px ' + FONT;

  canvas.fillText('Load ROM ' + romName, x, y);

  canvas.font = '10px ' + FONT;
}
