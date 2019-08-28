'use strict';

import { createDrawLib } from './ui/lib';
import { memoryFindData } from './ui/memorysearch';
import { replaceNode, replaceNodeAndResize } from './htmlselector';

export { getInstance };

const WINDOW_HEIGHT = 220;
const MEM_CONTENT_X = 9;
const MEM_CONTENT_Y = 3;
const MEM_CONTENT_ASCII_X = 76;
const MEM_CONTENT_OFFSET_X = 2;

const ENTRIES_HORIZONTAL = 32;
const ENTRIES_VERTICAL = 16;
const ENTRIES_PAGESIZE = ENTRIES_HORIZONTAL * ENTRIES_VERTICAL;

const ENABLE_MEMORY_MONITOR = 'enable memory monitor first (press m)!';

function getInstance(options) {
  return new MemoryMonitor(options);
}

class MemoryMonitor {

  constructor(options) {
    this.THEME = options.THEME;
    this.CANVAS_WIDTH = options.CANVAS_WIDTH;
    this.memoryMonitorEnabled = false;
    this.page = 0;
    this.lastRamSnapshot = undefined;
    this.memorySearchResult = undefined;

    const canvasMemoryElement = this._createCanvas();
    this.canvasMemory = canvasMemoryElement.getContext('2d', { alpha: true });
    replaceNode('memoryNode', canvasMemoryElement);
    this.canvasMemoryDrawLib = createDrawLib(this.canvasMemory, options.THEME);
    this.canvasMemoryDrawLib.clear();

    const canvasMemoryOverlayElement = this._createCanvas();
    this.canvasMemoryOverlay = canvasMemoryOverlayElement.getContext('2d', { alpha: true });
    replaceNodeAndResize('memoryOverlayNode', canvasMemoryOverlayElement, WINDOW_HEIGHT);
    this.canvasMemoryOverlayDrawLib = createDrawLib(this.canvasMemoryOverlay, options.THEME);

    // HIGHLIGHT ROWS
    for (let offset = 0; offset < ENTRIES_HORIZONTAL; offset += 2) {
      this.canvasMemoryDrawLib.fillRect(
        MEM_CONTENT_X - 0.25 + offset * 2,
        MEM_CONTENT_Y - 1,
        2,
        17.25,
        this.THEME.DMD_COLOR_VERY_DARK);

      this.canvasMemoryDrawLib.fillRect(
        MEM_CONTENT_ASCII_X + offset * 0.75,
        MEM_CONTENT_Y - 1,
        0.75,
        17.25,
        this.THEME.DMD_COLOR_VERY_DARK);
    }

    // OFFSET X
    for (let offset = 0; offset < ENTRIES_HORIZONTAL; offset++) {
      this.canvasMemoryDrawLib.writeHeader(
        MEM_CONTENT_X + offset * 2,
        MEM_CONTENT_Y - 1,
        (offset < 16 ? '0' : '') + offset.toString(16).toUpperCase(),
        this.THEME.HEADER_LINE_HIGH_COLOR
      );
    }

    // HIGHLIGHT LINES
    for (let y = 0; y < ENTRIES_VERTICAL; y += 2) {
      this.canvasMemoryDrawLib.fillRect(
        1,
        MEM_CONTENT_Y + y,
        100,
        1,
        this.THEME.DMD_COLOR_VERY_DARK);
    }

  }

  _createCanvas() {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = this.CANVAS_WIDTH;
    canvasElement.height = WINDOW_HEIGHT;
    return canvasElement;
  }

  clear() {
    this.canvasMemoryOverlayDrawLib.clear();
    this.page = 0;
    this.memorySearchResult = undefined;
    this.lastRamSnapshot = undefined;
  }

  toggleView(enabled) {
    this.memoryMonitorEnabled = enabled === true;
  }

  memoryFindData(value, encoding = 'string', rememberResults) {
    if (!this.lastRamSnapshot) {
      return console.warn(ENABLE_MEMORY_MONITOR);
    }
    console.log('memoryFindData', { value, encoding, rememberResults });

    const foundOffset = memoryFindData(value, encoding, rememberResults, this.lastRamSnapshot);
    if (encoding === 'string') {
      foundOffset.forEach((offset) => {
        console.log(value, encoding, 'FOUND at position', '0x' + offset.toString(16).toUpperCase());
      });
    } else {
      foundOffset.forEach((offset) => {
        console.log('0x' + value.toString(16), encoding, 'FOUND at position', '0x' + offset.toString(16).toUpperCase());
      });
    }
  }

  memoryDumpData(offset) {
    if (!this.lastRamSnapshot) {
      return console.warn(ENABLE_MEMORY_MONITOR);
    }

    let dump = '';
    if (this.lastRamSnapshot[offset] > 31 && this.lastRamSnapshot[offset] < 128) {
      while (this.lastRamSnapshot[offset] > 31 && this.lastRamSnapshot[offset] < 128) {
        dump += String.fromCharCode(this.lastRamSnapshot[offset++]);
      }
    } else {
      dump = '0x' + this.lastRamSnapshot[offset].toString(16);
    }
    console.log('RAM-DUMP', dump);
  }

  memoryMonitorNextPage() {
    if (this.page < 31) {
      this.page++;
    }
  }

  memoryMonitorPrevPage() {
    if (this.page > 0) {
      this.page--;
    }
  }

  refresh() {
    if (!this.memoryMonitorEnabled || !this.lastRamSnapshot) {
      return;
    }
    this._render();
  }

  draw(ramArray) {
    if (!this.memoryMonitorEnabled || !ramArray) {
      return;
    }

    this.lastRamSnapshot = ramArray;
    this._render();
  }

  _render() {
    this.canvasMemoryOverlayDrawLib.clear();

    for (let y = 0; y < ENTRIES_VERTICAL; y++) {
      const ramOffset = this.page * ENTRIES_PAGESIZE + ENTRIES_HORIZONTAL * y;
      //write offset
      this.canvasMemoryOverlayDrawLib.writeHeader(
        MEM_CONTENT_OFFSET_X,
        MEM_CONTENT_Y + y,
        '0x' + ramOffset.toString(16).toUpperCase(),
        this.THEME.HEADER_LINE_HIGH_COLOR
      );

      for (let offset = 0; offset < ENTRIES_HORIZONTAL; offset++) {
        const value = this.lastRamSnapshot[ramOffset + offset];
        // write hex value
        this.canvasMemoryOverlayDrawLib.writeHeader(
          MEM_CONTENT_X + offset * 2,
          MEM_CONTENT_Y + y,
          value < 16 ? '0' + value.toString(16) : value.toString(16)
        );
        //write ascii value
        this.canvasMemoryOverlayDrawLib.writeHeader(
          MEM_CONTENT_ASCII_X + offset * 0.75,
          MEM_CONTENT_Y + y,
          String.fromCharCode(value)
        );
      }
    }
  }

}