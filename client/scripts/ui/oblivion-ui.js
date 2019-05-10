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

let playfieldData;
let playfieldImage;

const THEME = {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,

  DMD_COLOR_DARK: 'rgb(112,152,168)',
  DMD_COLOR_LOW: 'rgb(154,190,189)',
  DMD_COLOR_MIDDLE: 'rgb(171,246,232)',
  DMD_COLOR_HIGH: 'rgb(210,242,227)',

  GRID_POINTS_COLOR: 'rgb(44, 51, 44)',
  GRID_STEP_X: 12,
  GRID_STEP_Y: 12,
  GRID_SIZE: 1.2,

  HEADER_LINE_LOW_COLOR: 'rgb(65, 68, 70)',
  HEADER_LINE_HIGH_COLOR: 'rgb(150, 154, 147)',

  FONT_NAME: 'Space Mono',
  FONT_HEADER: '15px "Space Mono"',
  FONT_TEXT: '10px "Space Mono"',

  TEXT_COLOR_HEADER: 'rgb(127, 179, 171)',
  RIBBON_COLOR_HEADER: 'rgb(32, 45, 50)',

  TEXT_COLOR_LABEL: 'rgb(96, 110, 112)',
  TEXT_COLOR: 'rgb(237, 246, 206)',

  COLOR_GREEN: 'rgb(17, 226, 19)',
  COLOR_RED: 'rgb(255, 108, 74)',
  COLOR_YELLOW: 'rgb(254, 255, 211)',

  POS_CPU_Y: 21,
  POS_CPU_X: 1,
};

function updateCanvas(emuState, cpuRunningState, audioState) {
  if (!emuState) {
    return;
  }
  canvasOverlayDrawLib.clear();


  // CPU
  canvasOverlayDrawLib.writeHeader(2, 32, emuState.cpuState.tickCount);
  canvasOverlayDrawLib.drawVerticalRandomBlip(12, 31, 3);
  canvasOverlayDrawLib.writeHeader(2, 35, emuState.opsMs);
  canvasOverlayDrawLib.writeHeader(9, 35, cpuRunningState, THEME.COLOR_GREEN);
  canvasOverlayDrawLib.drawDiagram(2, 38, 'OPS-DIAG', emuState.opsMs);

  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, 41, emuState.cpuState.irqCount);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, 42, emuState.cpuState.missedIRQ);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 8, 41, emuState.cpuState.firqCount);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 8, 42, emuState.cpuState.missedFIRQ);
}

function initialise() {
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

  canvasOverlayDrawLib = createDrawLib(canvasOverlay, THEME);
  canvasDrawLib = createDrawLib(canvas, THEME);
  canvasDrawLib.drawBackgroundPoints();

  //DRAW STATIC
  canvasDrawLib.drawHorizontalLine(1, 1, 16);
  canvasDrawLib.drawHorizontalLine(19, 1, 72);

  //HEADER
  canvasDrawLib.drawHorizontalLine(1, 15, 16);
  canvasDrawLib.writeRibbonHeader(2, 17, 'STATUS:');
  canvasDrawLib.writeHeader(9, 17, 'SYSTEM');
  canvasDrawLib.drawHorizontalLine(1, 18, 16);

  //CPU
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X, 30, 43);
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X + 15, 30, 43);

  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, 31, 'TICKS');
  canvasDrawLib.writeRibbonHeader(THEME.POS_CPU_X + 12, 32, 'CPU');

  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, 33, 16);
  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, 36, 16);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, 34, 'OPS/MS');
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X + 7, 33, 36);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 8, 34, 'STATUS');

  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, 39, 16);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, 40, 'IRQ/MISSED');
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 8, 40, 'FIRQ/MISSED');


/*
  canvas.fillText('IRQ CALLS/MISSED: ' + emuState.cpuState.irqCount + '/' + emuState.cpuState.missedIRQ,
    LEFT_X_OFFSET, YPOS_GENERIC_DATA + 50);
  canvas.fillText('FIRQ CALLS/MISSED: ' + emuState.cpuState.firqCount + '/' + emuState.cpuState.missedFIRQ,
    LEFT_X_OFFSET, YPOS_GENERIC_DATA + 60);
*/

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
