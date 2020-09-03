'use strict';

import { replaceNode } from './htmlselector';
import { createDrawLib } from './ui/lib';
import * as MemoryMonitor from './memory-monitor';
import * as VariableMonitor from './variable-monitor';

export {
  initialise,
  drawMetaData,
  updateCanvas,
  populateInitialCanvas,
  errorFeedback,
  loadFeedback,
  toggleMemoryView,
  memoryMonitorNextPage,
  memoryMonitorPrevPage,
  memoryMonitorRefresh,
  memoryFindData,
  memoryDumpData,
};

// inspiration:
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
let canvasLamp, canvaLampDrawLib;
let canvasFlash, canvaFlashDrawLib;

let memoryMonitor;
let variableMonitor;

let playfieldData;
let playfieldImage;
let frame = 0;
let initialized = false;
let gameEntry;

const THEME = {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,

  DMD_COLOR_BLACK: 'rgb(0,0,0)',
  DMD_COLOR_DARK: 'rgb(43,62,67)',
  DMD_COLOR_LOW: 'rgb(65,101,105)',
  DMD_COLOR_MIDDLE: 'rgb(182,155,93)',
  DMD_COLOR_HIGH: 'rgb(254, 255, 211)',
  DMD_COLOR_RED_RGBA: 'rgb(255, 108, 74, ',

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

  DMD_COLOR_VERY_DARK: 'rgba(64, 64, 64, 0.5)',

  COLOR_BLUE: 'rgb(81, 115, 117)',
  COLOR_BLUE_INTENSE: 'rgb(106, 198, 213)',
  COLOR_RED: 'rgb(255, 108, 74)',
  COLOR_YELLOW: 'rgb(254, 255, 211)',

  POS_HEADER_X: 1,
  POS_HEADER_Y: 6,

  POS_CPU_X: 1,
  POS_CPU_Y: 12,

  POS_DMD_X: 20,
  POS_DMD_Y: 8,

  POS_PLAYFIELD_X: 89,
  POS_PLAYFIELD_Y: 9,

  POS_DMDMEM_X: 37,
  POS_DMDMEM_Y: 28,

  POS_ASIC_X: 1,
  POS_ASIC_Y: 38,

  POS_MEM_X: 19,
  POS_MEM_Y: 28,

  POS_SND_X: 1,
  POS_SND_Y: 51,

  POS_DMDSTAT_X: 19,
  POS_DMDSTAT_Y: 1,

  POS_MATRIX_X: 19,
  POS_MATRIX_Y: 38,

  POS_RAMDIAG_X: 38,
  POS_RAMDIAG_Y: 53,
};

let videoRam;
let videoRamDraw = 0;

const lampColorLut = new Map();
lampColorLut.set('YELLOW', 'rgba(255,255,0,');
lampColorLut.set('ORANGE', 'rgba(255,165,0,');
lampColorLut.set('RED', 'rgba(255,0,0,');
lampColorLut.set('LBLUE', 'rgba(173,216,230,');
lampColorLut.set('LPURPLE', 'rgba(218,112,214,');
lampColorLut.set('WHITE', 'rgba(255,255,255,');
lampColorLut.set('GREEN', 'rgba(0,255,0,');
lampColorLut.set('BLACK', 'rgba(0,0,0,255)');

function drawMetaData(object) {
  const { averageRTTms, sentMessages, failedMessages, missedDraw, lastFps } = object;
  canvasOverlayDrawLib.writeHeader(THEME.POS_PLAYFIELD_X + 1, 4, averageRTTms);
  canvasOverlayDrawLib.writeHeader(THEME.POS_PLAYFIELD_X + 1, 6, missedDraw);
  canvasOverlayDrawLib.writeHeader(THEME.POS_PLAYFIELD_X + 9, 4, sentMessages);
  canvasOverlayDrawLib.writeHeader(THEME.POS_PLAYFIELD_X + 9, 5, failedMessages);
  canvasOverlayDrawLib.writeHeader(THEME.POS_DMDSTAT_X + 43.5, THEME.POS_DMDSTAT_Y + 4.5, lastFps);
}

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
  canvasOverlayDrawLib.fillRect(THEME.POS_CPU_X + 13, THEME.POS_CPU_Y + 1.5, 1, 1, emuState.asic.wpc.irqEnabled ? THEME.COLOR_RED : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.drawVerticalRandomBlip(THEME.POS_CPU_X + 14.5, THEME.POS_CPU_Y + 1, 3);

  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 5, emuState.opsMs);
  if (cpuRunningState === 'running') {
    canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 9, THEME.POS_CPU_Y + 5, cpuRunningState, THEME.COLOR_BLUE_INTENSE);
  } else {
    canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 9, THEME.POS_CPU_Y + 5, cpuRunningState, THEME.COLOR_RED);
  }
  canvasOverlayDrawLib.drawDiagram(THEME.POS_CPU_X + 4.5, THEME.POS_CPU_Y + 5.5, 'OPS-DIAG', emuState.opsMs, 12);

  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 8, emuState.cpuState.irqCount);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 9, emuState.cpuState.missedIRQ);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 9, THEME.POS_CPU_Y + 8, emuState.cpuState.firqCount);
  canvasOverlayDrawLib.writeHeader(THEME.POS_CPU_X + 9, THEME.POS_CPU_Y + 9, emuState.cpuState.missedFIRQ);

  canvasOverlayDrawLib.drawDiagram(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 12, 'REGPC', emuState.cpuState.regPC);

  canvasOverlayDrawLib.drawHorizontalBitDiagram(THEME.POS_CPU_X + 2.75, THEME.POS_CPU_Y + 18.625, emuState.cpuState.regCC);

  // DMD SHADED
  if (emuState.asic.dmd.dmdShadedBuffer) {
    canvaDmdDrawLib.clear(
      THEME.GRID_STEP_X * THEME.POS_DMD_X,
      THEME.GRID_STEP_Y * THEME.POS_DMD_Y,
      THEME.GRID_STEP_X * 128 / 2,
      THEME.GRID_STEP_Y * 32 / 2
    );
    canvaDmdDrawLib.drawDmdShaded(THEME.POS_DMD_X, THEME.POS_DMD_Y, emuState.asic.dmd.dmdShadedBuffer);
  }
  canvasOverlayDrawLib.drawHorizontalRandomBlip(THEME.POS_DMD_X + 60, THEME.POS_DMD_Y - 5, 8, emuState.asic.wpc.diagnosticLedToggleCount);
  canvasOverlayDrawLib.fillRect(THEME.POS_DMD_X - 1, THEME.POS_DMD_Y + 17.5, 1, 0.5, emuState.asic.dmd.requestFIRQ ? THEME.COLOR_RED : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.fillRect(THEME.POS_DMD_X + 24, THEME.POS_DMD_Y + 17.5, 1, 0.5, emuState.asic.wpc.zeroCrossFlag ? THEME.COLOR_RED : THEME.DMD_COLOR_DARK);

  // ASIC
  canvasOverlayDrawLib.drawDiagram(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 3, 'WATCHDOG', emuState.asic.wpc.watchdogTicks);
  canvasOverlayDrawLib.writeLabel(THEME.POS_ASIC_X + 11.5, THEME.POS_ASIC_Y + 1, emuState.asic.wpc.watchdogExpiredCounter, THEME.COLOR_RED);

  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 5.5, 1, 1, emuState.asic.wpc.blankSignalHigh ? THEME.COLOR_RED : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 3, THEME.POS_ASIC_Y + 5.5, 1, 1, THEME.COLOR_RED);
  canvasOverlayDrawLib.fillRect(THEME.POS_ASIC_X + 5, THEME.POS_ASIC_Y + 5.5, 1, 1, emuState.asic.wpc.diagnosticLed ? THEME.COLOR_RED : THEME.DMD_COLOR_DARK);
  canvasOverlayDrawLib.writeHeader(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 6.5, emuState.asic.wpc.diagnosticLedToggleCount);

  canvasOverlayDrawLib.drawDiagram(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 9.5, 'ASIC_ROM_BANK', emuState.asic.wpc.activeRomBank, 22);
  canvasOverlayDrawLib.writeHeader(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 9, emuState.protectedMemoryWriteAttempts);
  canvasOverlayDrawLib.writeHeader(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 10, emuState.memoryWrites);

  // MEMORY
  if (emuState.asic.ram) {
    canvaMemDrawLib.drawMemRegion(THEME.POS_MEM_X + 1, THEME.POS_MEM_Y + 2, emuState.asic.ram);

    canvaDmdDrawLib.clear(
      (THEME.POS_RAMDIAG_X - 1) * THEME.GRID_STEP_X,
      (THEME.POS_RAMDIAG_Y - 2) * THEME.GRID_STEP_Y,
      THEME.GRID_STEP_X * 50,
      THEME.GRID_STEP_Y * 10
    );
    const memory1k = Array.from(emuState.asic.ram.slice(0, 1024));
    canvaDmdDrawLib.drawDiagramCluster(THEME.POS_RAMDIAG_X + 0.5, THEME.POS_RAMDIAG_Y + 1, memory1k, 24);

    memoryMonitor.draw(emuState.asic.ram);
    variableMonitor.draw(emuState.asic.memoryPosition);
  }

  // DMD MEM - draw only 4 dmd video fragment per loop
  if (emuState.asic.dmd.videoRam) {
    videoRam = emuState.asic.dmd.videoRam;
    videoRamDraw = 0;
  }
  if (videoRam) {
    canvaDmdMemDrawLib.drawVideoRam(THEME.POS_DMDMEM_X + 0.5, THEME.POS_DMDMEM_Y + 2.75, frame, videoRam);
    canvaDmdMemDrawLib.drawHorizontalRandomBlip(THEME.POS_DMDMEM_X + 13, THEME.POS_DMDMEM_Y + 11, 2);
    canvaDmdMemDrawLib.drawHorizontalRandomBlip(THEME.POS_DMDMEM_X + 25, THEME.POS_DMDMEM_Y + 11, 1);
    canvaDmdMemDrawLib.drawHorizontalRandomBlip(THEME.POS_DMDMEM_X + 25, THEME.POS_DMDMEM_Y + 1.5, 3);
    canvaDmdMemDrawLib.drawVerticalRandomBlip(THEME.POS_DMDMEM_X + 0.5, THEME.POS_DMDMEM_Y + 16.5, 2, (Date.now() / 0xCAFFE) << 2);
    if (videoRamDraw++ > 4) {
      videoRam = null;
    }
  }

  // SOUND
  canvasOverlayDrawLib.drawRedTriangle(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 2.5, 13, emuState.asic.sound.volume / 31);
  canvasOverlayDrawLib.writeLabel(THEME.POS_SND_X + 8, THEME.POS_SND_Y + 1, audioState);

  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 6, emuState.asic.sound.readControlBytes);
  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 7, emuState.asic.sound.writeControlBytes);
  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 8, THEME.POS_SND_Y + 6, emuState.asic.sound.readDataBytes);
  canvasOverlayDrawLib.writeHeader(THEME.POS_SND_X + 8, THEME.POS_SND_Y + 7, emuState.asic.sound.writeDataBytes);

  // DMD STAT
  canvasOverlayDrawLib.drawDiagram(THEME.POS_DMDSTAT_X + 1.5, THEME.POS_DMDSTAT_Y + 4.5, 'DMD_ACTIVE_PAGE', emuState.asic.dmd.activepage);
  canvasOverlayDrawLib.drawDiagram(THEME.POS_DMDSTAT_X + 17, THEME.POS_DMDSTAT_Y + 4.5, 'DMD_SCANLINE', emuState.asic.dmd.scanline);
  canvasOverlayDrawLib.writeHeader(THEME.POS_DMDSTAT_X + 32.5, THEME.POS_DMDSTAT_Y + 4.5, emuState.asic.dmd.dmdPageMapping);

  // WPC-SECURITY
  if (emuState.asic.wpc.wpcSecureScrambler) {
    canvasOverlayDrawLib.writeHeader(THEME.POS_DMDSTAT_X + 48.5, THEME.POS_DMDSTAT_Y + 4.5, emuState.asic.wpc.wpcSecureScrambler);
  }

  // MATRIX / INPUT
  if (emuState.asic.wpc.inputState) {
    const inputState = canvasOverlayDrawLib.unpackBits(emuState.asic.wpc.inputState);
    canvaDmdDrawLib.drawMatrix8x8(THEME.POS_MATRIX_X + 1, THEME.POS_MATRIX_Y + 2, inputState);

    canvaDmdDrawLib.clear(
      (THEME.POS_PLAYFIELD_X - 1) * THEME.GRID_STEP_X,
      (THEME.POS_PLAYFIELD_Y + 44) * THEME.GRID_STEP_Y,
      THEME.GRID_STEP_X * 18,
      THEME.GRID_STEP_Y * 4
    );
    canvaDmdDrawLib.drawHorizontalByteDiagram(THEME.POS_PLAYFIELD_X + 0.25, THEME.POS_PLAYFIELD_Y + 47, inputState.slice(0, 64));
  }
  canvasOverlayDrawLib.drawVerticalRandomBlip(THEME.POS_MATRIX_X + 0.5, THEME.POS_MATRIX_Y + 9, 5, emuState.cpuState.irqCount << 4);

  // LAMP
  if (emuState.asic.wpc.lampState) {
    canvaDmdDrawLib.drawMatrix8x8(THEME.POS_MATRIX_X + 1, THEME.POS_MATRIX_Y + 13, emuState.asic.wpc.lampState);
    drawLampPositions(emuState.asic.wpc.lampState);

    canvaDmdDrawLib.clear(
      (THEME.POS_PLAYFIELD_X - 1) * THEME.GRID_STEP_X,
      (THEME.POS_PLAYFIELD_Y + 36) * THEME.GRID_STEP_Y,
      THEME.GRID_STEP_X * 18,
      THEME.GRID_STEP_Y * 4
    );
    canvaDmdDrawLib.drawHorizontalByteDiagram(THEME.POS_PLAYFIELD_X + 0.25, THEME.POS_PLAYFIELD_Y + 39, emuState.asic.wpc.lampState);
  }

  // SOLENOID
  if (emuState.asic.wpc.solenoidState) {
    canvaDmdDrawLib.drawMatrix8x8(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 2, emuState.asic.wpc.solenoidState);
    drawFlashlamps(emuState.asic.wpc.solenoidState);

    canvaDmdDrawLib.clear(
      (THEME.POS_PLAYFIELD_X - 1) * THEME.GRID_STEP_X,
      (THEME.POS_PLAYFIELD_Y + 40) * THEME.GRID_STEP_Y,
      THEME.GRID_STEP_X * 18,
      THEME.GRID_STEP_Y * 4
    );
    canvaDmdDrawLib.drawHorizontalByteDiagram(THEME.POS_PLAYFIELD_X + 0.25, THEME.POS_PLAYFIELD_Y + 43, emuState.asic.wpc.solenoidState);
  }

  // GI
  canvaDmdDrawLib.drawMatrix8x8Lights(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 8.75, emuState.asic.wpc.generalIlluminationState);

  canvasOverlayDrawLib.drawDiagram(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 15.5, 'lampRom', emuState.asic.wpc.lampRow, 26);
  canvasOverlayDrawLib.drawDiagram(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 18.5, 'lampColumn', emuState.asic.wpc.lampColumn, 26);
}

function toggleMemoryView() {
  const node = document.querySelector('#memoryMonitor');

  if (memoryMonitor.memoryMonitorEnabled) {
    node.style.height = '0px';
    node.style.visibility = 'hidden';
    memoryMonitor.toggleView(false);
    variableMonitor.toggleView(false);
    return;
  }

  memoryMonitor.toggleView(true);
  variableMonitor.toggleView(true);
  node.style.height = 350 + 'px';
  node.style.visibility = 'visible';
}

function memoryMonitorNextPage() {
  memoryMonitor.memoryMonitorNextPage();
}

function memoryMonitorPrevPage() {
  memoryMonitor.memoryMonitorPrevPage();
}

function memoryMonitorRefresh() {
  memoryMonitor.refresh();
}

function memoryFindData(value, encoding, rememberResults) {
  memoryMonitor.memoryFindData(value, encoding, rememberResults);
}

function memoryDumpData(offset, optionalEndOffset) {
  memoryMonitor.memoryDumpData(offset, optionalEndOffset);
}

function createCanvas() {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = CANVAS_WIDTH;
  canvasElement.height = CANVAS_HEIGHT;
  return canvasElement;
}

function initiateCanvasElements() {
  if (initialized) {
    return;
  }
  initialized = true;

  const canvasRootElement = createCanvas();
  canvas = canvasRootElement.getContext('2d', { alpha: false });
  replaceNode('canvasNode', canvasRootElement);

  const canvasOverlayElement = createCanvas();
  canvasOverlay = canvasOverlayElement.getContext('2d', { alpha: true });
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

  const canvasLampElement = createCanvas();
  canvasLamp = canvasLampElement.getContext('2d', { alpha: true });
  replaceNode('canvasLampNode', canvasLampElement);

  const canvasFlashElement = createCanvas();
  canvasFlash = canvasFlashElement.getContext('2d', { alpha: true });
  replaceNode('canvasFlashNode', canvasFlashElement);

  canvasDrawLib = createDrawLib(canvas, THEME);
  canvasOverlayDrawLib = createDrawLib(canvasOverlay, THEME);
  canvaDmdDrawLib = createDrawLib(canvasDmd, THEME);
  canvaDmdMemDrawLib = createDrawLib(canvasDmdMem, THEME);
  canvaMemDrawLib = createDrawLib(canvasMem, THEME);
  canvaLampDrawLib = createDrawLib(canvasLamp, THEME);
  canvaFlashDrawLib = createDrawLib(canvasFlash, THEME);

  memoryMonitor = MemoryMonitor.getInstance({ THEME, CANVAS_WIDTH });
  variableMonitor = VariableMonitor.getInstance({ THEME, CANVAS_WIDTH });
}

function initialise() {
  initiateCanvasElements();

  canvasDrawLib.clear();
  canvasOverlayDrawLib.clear();
  canvaDmdDrawLib.clear();
  canvaMemDrawLib.clear();
  canvaDmdMemDrawLib.clear();
  canvaLampDrawLib.clear();
  canvaFlashDrawLib.clear();
  memoryMonitor.clear();
  variableMonitor.clear();

  canvasDrawLib.drawBackgroundPoints();

  // LOGO
  canvasDrawLib.drawWpcLogo(2.25, 2.75);
  canvasDrawLib.writeRibbonHeader(8.5, 4, 'WPC-EMU');
  canvasDrawLib.drawHorizontalLine(1, 1, 5, THEME.COLOR_BLUE_INTENSE);
  canvasDrawLib.drawHorizontalLine(1, 6, 5, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.drawVerticalLine(1, 1, 1, THEME.COLOR_BLUE_INTENSE);
  canvasDrawLib.drawVerticalLine(6, 1, 1, THEME.COLOR_BLUE_INTENSE);
  canvasDrawLib.drawVerticalLine(1, 5, 1, THEME.COLOR_BLUE_INTENSE);
  canvasDrawLib.drawVerticalLine(6, 5, 1, THEME.COLOR_BLUE_INTENSE);

  // DRAW TOP LINES
  canvasDrawLib.drawHorizontalLine(1, 1, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X - 1, 1, 66);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X - 1, THEME.POS_DMD_Y - 2, 66);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X + 59, THEME.POS_DMD_Y - 2, 6, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.drawVerticalLine(THEME.POS_DMD_X - 1, 1, 1, THEME.COLOR_BLUE_INTENSE);
  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X - 1, 1, 18);
  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X - 1, 6, 18);
  canvasDrawLib.drawVerticalLine(THEME.POS_PLAYFIELD_X - 1, 5, 1, THEME.COLOR_BLUE_INTENSE);

  // DRAW BOTTOM LINES
  const BOTTOM_Y = 62;
  canvasDrawLib.drawHorizontalLine(1, BOTTOM_Y, 15);
  canvasDrawLib.drawHorizontalLine(1, BOTTOM_Y + 0.5, 15);

  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X - 1, BOTTOM_Y, 66);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMD_X - 1, BOTTOM_Y + 0.5, 66);

  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X - 1, BOTTOM_Y, 18);
  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X - 1, BOTTOM_Y + 0.5, 18);
  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X + 8, BOTTOM_Y, 9, THEME.COLOR_BLUE_INTENSE);
  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X + 8, BOTTOM_Y + 0.5, 9, THEME.COLOR_BLUE_INTENSE);

  // HEADER
  canvasDrawLib.drawHorizontalLine(THEME.POS_HEADER_X, THEME.POS_HEADER_Y, 15);
  canvasDrawLib.writeRibbonHeader(THEME.POS_HEADER_X + 1, THEME.POS_HEADER_Y + 2, 'FILE');
  canvasDrawLib.drawHorizontalLine(THEME.POS_HEADER_X, THEME.POS_HEADER_Y + 3, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_HEADER_X + 5, THEME.POS_HEADER_Y + 3, 10, THEME.COLOR_BLUE_INTENSE);

  // CPU
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X,      THEME.POS_CPU_Y, 23);
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X + 15, THEME.POS_CPU_Y, 23);

  canvasDrawLib.writeRibbonHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 1, 'CPU', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 3, THEME.POS_CPU_Y + 1, 'TICKS');
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 8.5, THEME.POS_CPU_Y + 1, 'IRQ ENABLED');

  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 3, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 3, 8, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 6, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 6, 7, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 4, 'OPS/MS');
  canvasDrawLib.drawVerticalLine(THEME.POS_CPU_X + 8, THEME.POS_CPU_Y + 3, 3);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 9, THEME.POS_CPU_Y + 4, 'STATUS');

  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 7, 'IRQ/MISSED');
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 9, THEME.POS_CPU_Y + 7, 'FIRQ/MISSED');

  // REG CC
  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 9.5, 15);
  canvasDrawLib.writeLabel(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 10.5, 'PROGRAM COUNTER');
  canvasDrawLib.drawHorizontalLine(THEME.POS_CPU_X, THEME.POS_CPU_Y + 13, 15);

  canvasDrawLib.writeRibbonHeader(THEME.POS_CPU_X + 1, THEME.POS_CPU_Y + 14, 'CONDITION CODE REGISTER', THEME.FONT_TEXT);
  const REG_CC_POS_X = THEME.POS_CPU_X + 1;
  canvasDrawLib.writeLabel(REG_CC_POS_X + 10.125, THEME.POS_CPU_Y + 20, 'CARRY');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 8.75, THEME.POS_CPU_Y + 19, 0.75);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 8.75, THEME.POS_CPU_Y + 19.75, 1);

  canvasDrawLib.writeLabel(REG_CC_POS_X + 8.125, THEME.POS_CPU_Y + 20.75, 'ZERO');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 6.75, THEME.POS_CPU_Y + 19, 1.5);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 6.75, THEME.POS_CPU_Y + 20.5, 1);

  canvasDrawLib.writeLabel(REG_CC_POS_X + 6.125, THEME.POS_CPU_Y + 21.5, 'IRQ');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 4.75, THEME.POS_CPU_Y + 19, 2.25);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 4.75, THEME.POS_CPU_Y + 21.25, 1);

  canvasDrawLib.writeLabel(REG_CC_POS_X + 4.125, THEME.POS_CPU_Y + 22.25, 'FIRQ');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 2.75, THEME.POS_CPU_Y + 19, 3);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 2.75, THEME.POS_CPU_Y + 22, 1);

  canvasDrawLib.writeLabel(REG_CC_POS_X + 9, THEME.POS_CPU_Y + 17.25, 'OVERFLOW');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 7.625, THEME.POS_CPU_Y + 17, 0.75);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 7.625, THEME.POS_CPU_Y + 17, 1);

  canvasDrawLib.writeLabel(REG_CC_POS_X + 7, THEME.POS_CPU_Y + 16.5, 'NEGATIVE');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 5.625, THEME.POS_CPU_Y + 16.25, 1.5);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 5.625, THEME.POS_CPU_Y + 16.25, 1);

  canvasDrawLib.writeLabel(REG_CC_POS_X + 5, THEME.POS_CPU_Y + 15.75, 'HALF CARRY');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 3.625, THEME.POS_CPU_Y + 15.5, 2.25);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 3.625, THEME.POS_CPU_Y + 15.5, 1);

  canvasDrawLib.writeLabel(REG_CC_POS_X + 3, THEME.POS_CPU_Y + 15, 'ENTIRE');
  canvasDrawLib.drawSimpleVerticalLine(REG_CC_POS_X + 1.625, THEME.POS_CPU_Y + 14.75, 3);
  canvasDrawLib.drawSimpleHorizontalLine(REG_CC_POS_X + 1.625, THEME.POS_CPU_Y + 14.75, 1);

  // ASIC
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X,      THEME.POS_ASIC_Y, 10);
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X + 15, THEME.POS_ASIC_Y, 10);
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 1, 'WATCHDOG');
  canvasDrawLib.writeRibbonHeader(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 1, 'EXPIRED', THEME.FONT_TEXT);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X, THEME.POS_ASIC_Y + 4, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 4, 8, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 5, 'D19');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 3, THEME.POS_ASIC_Y + 5, 'D21');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 5, THEME.POS_ASIC_Y + 5, 'D20');
  canvasDrawLib.writeRibbonHeader(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 5, 'TGLE CNT', THEME.FONT_TEXT);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X, THEME.POS_ASIC_Y + 7, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_ASIC_X, THEME.POS_ASIC_Y + 7, 7, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 1, THEME.POS_ASIC_Y + 8, 'ROM BANK');
  canvasDrawLib.writeLabel(THEME.POS_ASIC_X + 8, THEME.POS_ASIC_Y + 8, 'LOCKED MEM W');
  canvasDrawLib.drawVerticalLine(THEME.POS_ASIC_X + 7, THEME.POS_ASIC_Y + 7, 3);

  // META
  canvasDrawLib.writeRibbonHeader(THEME.POS_PLAYFIELD_X, 3, 'AVG RTT MS', THEME.FONT_TEXT);
  canvasDrawLib.writeRibbonHeader(THEME.POS_PLAYFIELD_X, 5, 'MISSED DRAW', THEME.FONT_TEXT);
  canvasDrawLib.writeRibbonHeader(THEME.POS_PLAYFIELD_X + 8, 3, 'MSG SENT/FAILED', THEME.FONT_TEXT);

  // DMD MEM
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X,      THEME.POS_DMDMEM_Y, 20);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 12, THEME.POS_DMDMEM_Y + 1.5, 18.5);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 24, THEME.POS_DMDMEM_Y + 1.5, 18.5);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 36, THEME.POS_DMDMEM_Y + 1.5, 18.5);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 48, THEME.POS_DMDMEM_Y, 20);
  canvasDrawLib.writeRibbonHeader(THEME.POS_DMDMEM_X + 1, THEME.POS_DMDMEM_Y + 1, 'DMD', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 3.5, THEME.POS_DMDMEM_Y + 1, 'VIDEO RANDOM ACCESS MEMORY');
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMDMEM_X, THEME.POS_DMDMEM_Y + 6, 48);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMDMEM_X, THEME.POS_DMDMEM_Y + 10.5, 48);
  canvasDrawLib.drawHorizontalLine(THEME.POS_DMDMEM_X, THEME.POS_DMDMEM_Y + 15, 48);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 2.5, '#00', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 7, '#04', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 11.5, '#08', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 10, THEME.POS_DMDMEM_Y + 16, '#12', THEME.COLOR_YELLOW);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X, THEME.POS_DMDMEM_Y + 6, 4.5, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 2.5, '#01', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 7, '#05', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 11.5, '#09', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 22, THEME.POS_DMDMEM_Y + 16, '#13', THEME.COLOR_YELLOW);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 2.5, '#02', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 7, '#06', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 11.5, '#10', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 34, THEME.POS_DMDMEM_Y + 16, '#14', THEME.COLOR_YELLOW);

  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 2.5, '#03', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 7, '#07', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 11.5, '#11', THEME.COLOR_YELLOW);
  canvasDrawLib.writeLabel(THEME.POS_DMDMEM_X + 46, THEME.POS_DMDMEM_Y + 16, '#15', THEME.COLOR_YELLOW);
  canvasDrawLib.drawVerticalLine(THEME.POS_DMDMEM_X + 48, THEME.POS_DMDMEM_Y + 10.5, 4.5, THEME.COLOR_BLUE_INTENSE);

  // MEM
  canvasDrawLib.drawVerticalLine(THEME.POS_MEM_X,      THEME.POS_MEM_Y, 7);
  canvasDrawLib.drawVerticalLine(THEME.POS_MEM_X + 15, THEME.POS_MEM_Y, 7);
  canvasDrawLib.writeLabel(THEME.POS_MEM_X + 1, THEME.POS_MEM_Y + 1, 'ASIC RANDOM ACCESS MEMORY');

  // DMD SHADED
  canvasDrawLib.drawRect(THEME.POS_DMD_X - 0.2, THEME.POS_DMD_Y - 0.2, 65 - 0.6, 17 - 0.6, THEME.DMD_COLOR_DARK);
  canvasDrawLib.drawRect(THEME.POS_DMD_X - 1, THEME.POS_DMD_Y - 1, 66, 18, THEME.TEXT_COLOR_HEADER);

  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 60, THEME.POS_DMD_Y - 2.5, 'LIVE', THEME.TEXT_COLOR_HEADER);
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 62, THEME.POS_DMD_Y - 2.5, 'FEED');

  canvasDrawLib.fillRect(THEME.POS_DMD_X + 48.5, THEME.POS_DMD_Y + 17.5, 0.8, 0.5, THEME.DMD_COLOR_DARK);
  canvasDrawLib.fillRect(THEME.POS_DMD_X + 49.5, THEME.POS_DMD_Y + 17.5, 0.8, 0.5, THEME.DMD_COLOR_MIDDLE);
  canvasDrawLib.fillRect(THEME.POS_DMD_X + 50.5, THEME.POS_DMD_Y + 17.5, 0.8, 0.5, THEME.DMD_COLOR_HIGH);
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 51.5, THEME.POS_DMD_Y + 18, 'DOT MATRIX DISPLAY PALETTE');
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 0.25, THEME.POS_DMD_Y + 18, 'FAST INTERRUPT REQUEST');
  canvasDrawLib.writeLabel(THEME.POS_DMD_X + 25.25, THEME.POS_DMD_Y + 18, 'AC ZERO CROSS DETECTED');

  // SND
  canvasDrawLib.drawVerticalLine(THEME.POS_SND_X,      THEME.POS_SND_Y, 8);
  canvasDrawLib.drawVerticalLine(THEME.POS_SND_X + 15, THEME.POS_SND_Y, 8);
  canvasDrawLib.writeLabel(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 1, 'AUDIO');

  canvasDrawLib.writeRibbonHeader(THEME.POS_SND_X + 4.5, THEME.POS_SND_Y + 1, 'STATE', THEME.FONT_TEXT);
  canvasDrawLib.drawHorizontalScale(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 2.5, 10, 3);
  canvasDrawLib.drawHorizontalLine(THEME.POS_SND_X, THEME.POS_SND_Y + 4, 15);

  canvasDrawLib.writeLabel(THEME.POS_SND_X + 1, THEME.POS_SND_Y + 5, 'CTRL R/W');
  canvasDrawLib.writeLabel(THEME.POS_SND_X + 8, THEME.POS_SND_Y + 5, 'DATA R/W');

  // PLAYFIELD
  canvasDrawLib.drawVerticalLine(THEME.POS_PLAYFIELD_X - 1,  THEME.POS_PLAYFIELD_Y, 48);
  canvasDrawLib.drawVerticalLine(THEME.POS_PLAYFIELD_X + 17, THEME.POS_PLAYFIELD_Y, 48);
  canvasDrawLib.writeRibbonHeader(THEME.POS_PLAYFIELD_X + 0.5, THEME.POS_PLAYFIELD_Y + 1, 'PLAYFIELD', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_PLAYFIELD_X + 6, THEME.POS_PLAYFIELD_Y + 1, 'VISUALIZATION');

  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X - 1, THEME.POS_PLAYFIELD_Y + 36, 18);
  canvasDrawLib.writeLabel(THEME.POS_PLAYFIELD_X, THEME.POS_PLAYFIELD_Y + 37.25, 'LAMP');
  canvasDrawLib.writeRibbonHeader(THEME.POS_PLAYFIELD_X + 2.75, THEME.POS_PLAYFIELD_Y + 37.25, 'ENERGY', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_PLAYFIELD_X + 6.5, THEME.POS_PLAYFIELD_Y + 37.25, 'USAGE');

  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X - 1, THEME.POS_PLAYFIELD_Y + 40, 18);
  canvasDrawLib.writeLabel(THEME.POS_PLAYFIELD_X, THEME.POS_PLAYFIELD_Y + 41.25, 'SOLENOID ENERGY USAGE');
  canvasDrawLib.drawVerticalLine(THEME.POS_PLAYFIELD_X - 1, THEME.POS_PLAYFIELD_Y + 40, 4, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.drawHorizontalLine(THEME.POS_PLAYFIELD_X - 1, THEME.POS_PLAYFIELD_Y + 44, 18);
  canvasDrawLib.writeLabel(THEME.POS_PLAYFIELD_X, THEME.POS_PLAYFIELD_Y + 45.25, 'INPUT FEEDBACK');

  // DMD STAT
  canvasDrawLib.writeRibbonHeader(THEME.POS_DMDSTAT_X + 1.5, THEME.POS_DMDSTAT_Y + 3, 'DMD', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_DMDSTAT_X + 4, THEME.POS_DMDSTAT_Y + 3, 'ACTIVE PAGE');
  canvasDrawLib.writeLabel(THEME.POS_DMDSTAT_X + 17, THEME.POS_DMDSTAT_Y + 3, 'DMD SCANLINE');
  canvasDrawLib.writeLabel(THEME.POS_DMDSTAT_X + 32.5, THEME.POS_DMDSTAT_Y + 3, 'DMD PAGE MAP');

  // FPS
  canvasDrawLib.writeRibbonHeader(THEME.POS_DMDSTAT_X + 43.5, THEME.POS_DMDSTAT_Y + 3, 'FPS', THEME.FONT_TEXT);

  // WPC-SECURITY
  canvasDrawLib.writeRibbonHeader(THEME.POS_DMDSTAT_X + 48.5, THEME.POS_DMDSTAT_Y + 2, 'SECURITY', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_DMDSTAT_X + 48.5, THEME.POS_DMDSTAT_Y + 3, 'SCRAMBLER');

  // MATRIX
  canvasDrawLib.drawVerticalLine(THEME.POS_MATRIX_X,      THEME.POS_MATRIX_Y, 21);
  canvasDrawLib.drawVerticalLine(THEME.POS_MATRIX_X + 15, THEME.POS_MATRIX_Y, 21);
  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 1, THEME.POS_MATRIX_Y + 1, 'MATRIX');
  canvasDrawLib.writeRibbonHeader(THEME.POS_MATRIX_X + 5, THEME.POS_MATRIX_Y + 1, 'I/O STATUS', THEME.FONT_TEXT);

  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 1, THEME.POS_MATRIX_Y + 10.25, 'INPUT');
  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 7.25, 'SOLENOID');
  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 10.25, 'GI');

  canvasDrawLib.drawSimpleVerticalLine(THEME.POS_MATRIX_X + 13.5, THEME.POS_MATRIX_Y + 9.75, 1.25);
  canvasDrawLib.drawSimpleHorizontalLine(THEME.POS_MATRIX_X + 12.5, THEME.POS_MATRIX_Y + 11, 1.125);
  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 5.5, THEME.POS_MATRIX_Y + 11.25, 'FLIPPER RELAY');

  canvasDrawLib.drawHorizontalLine(THEME.POS_MATRIX_X, THEME.POS_MATRIX_Y + 12, 15);
  canvasDrawLib.drawHorizontalLine(THEME.POS_MATRIX_X, THEME.POS_MATRIX_Y + 12, 7.25, THEME.COLOR_BLUE_INTENSE);

  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 1, THEME.POS_MATRIX_Y + 20, 'LAMP');
  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 14, 'LAMP ROW');
  canvasDrawLib.writeLabel(THEME.POS_MATRIX_X + 8, THEME.POS_MATRIX_Y + 17, 'LAMP COLUMN');

  // RAMDIAG
  canvasDrawLib.drawVerticalLine(THEME.POS_RAMDIAG_X - 1, THEME.POS_RAMDIAG_Y - 2, 8);
  canvasDrawLib.drawVerticalLine(THEME.POS_RAMDIAG_X + 47, THEME.POS_RAMDIAG_Y - 2, 8);
  canvasDrawLib.writeRibbonHeader(THEME.POS_RAMDIAG_X, THEME.POS_RAMDIAG_Y - 1, 'RANDOM ACCESS MEMORY', THEME.FONT_TEXT);
  canvasDrawLib.writeLabel(THEME.POS_RAMDIAG_X + 11.5, THEME.POS_RAMDIAG_Y - 1, 'REAL TIME ANALYTICS');
}

// PLAYFIELD START

function drawFlashlamps(lampState) {
  //TODO FLICKERS!
  if (!playfieldData || !lampState || !Array.isArray(playfieldData.flashlamps)) {
    return;
  }

  const x = (THEME.POS_PLAYFIELD_X - 0.25) * THEME.GRID_STEP_X;
  const y = (THEME.POS_PLAYFIELD_Y + 1.75) * THEME.GRID_STEP_Y;

  canvaFlashDrawLib.clear();

  playfieldData.flashlamps.forEach((lamp) => {
    const selectedLamp = lampState[lamp.id - 1];
    if (!selectedLamp) {
      return;
    }
    const alpha = (selectedLamp / 255).toFixed(2);
    canvaFlashDrawLib.ctx.beginPath();
    canvaFlashDrawLib.ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    canvaFlashDrawLib.ctx.arc(x + lamp.x, y + lamp.y, 24, 0, 2 * Math.PI);
    canvaFlashDrawLib.ctx.fill();
  });
}

function drawLampPositions(lampState) {
  if (!playfieldData || !lampState || !Array.isArray(playfieldData.lamps)) {
    return;
  }

  const x = (THEME.POS_PLAYFIELD_X - 0.25) * THEME.GRID_STEP_X;
  const y = (THEME.POS_PLAYFIELD_Y + 1.75) * THEME.GRID_STEP_Y;

  canvaLampDrawLib.clear();

  lampState.forEach((lamp, index) => {
    if (index >= playfieldData.lamps.length) {
      return;
    }
    const lampObjects = playfieldData.lamps[index];
    if (!lampObjects) {
      return;
    }

    const alpha = (lamp / 0xFF);
    lampObjects.forEach((lampObject) => {
      canvaLampDrawLib.ctx.fillStyle = lamp ?
        lampColorLut.get(lampObject.color) + alpha + ')' :
        canvaLampDrawLib.ctx.fillStyle = 'black';
      canvaLampDrawLib.ctx.fillRect(x + lampObject.x - 3, y + lampObject.y - 3, 6, 6);
    });
  });
}

//PLAYFIELD STOP

function populateInitialCanvas(_gameEntry) {
  gameEntry = _gameEntry;
  initialise();

  // preload data
  playfieldData = gameEntry.playfield;
  playfieldImage = null;
  if (playfieldData) {
    playfieldImage = new Image();
    playfieldImage.onload = function () {
      canvasDrawLib.drawImage(THEME.POS_PLAYFIELD_X - 0.25, THEME.POS_PLAYFIELD_Y + 1.75, playfieldImage);
    };
    playfieldImage.src = FETCHURL + playfieldData.image;
  } else {
    canvasDrawLib.fillRect(THEME.POS_PLAYFIELD_X, THEME.POS_PLAYFIELD_Y, 17, 35, THEME.DMD_COLOR_BLACK);
  }
}

function errorFeedback(error) {
  initialise();
  canvasDrawLib.writeText(THEME.POS_DMD_X + 1, THEME.POS_DMD_Y + 2, 'ERROR! Failed to load ROM!', THEME.FONT_HUGE);
  canvasDrawLib.writeText(THEME.POS_DMD_X + 1, THEME.POS_DMD_Y + 4, 'Details: ' + error.message, THEME.FONT_HUGE);
}

function loadFeedback(romName) {
  initialise();
  canvasDrawLib.writeText(THEME.POS_DMD_X + 1, THEME.POS_DMD_Y + 2, 'Load ROM ' + romName, THEME.FONT_HUGE);
}
