'use strict';

import { createDrawLib } from './lib';
import { replaceNode } from '../htmlselector';

export { getInstance };

const MEM_HEIGHT = 220;
const MEM_CONTENT_X = 9;
const MEM_CONTENT_Y = 2;
const MEM_CONTENT_ASCII_X = 76;
const MEM_CONTENT_OFFSET_X = 2;

function getInstance(options) {
  return new MemoryMonitor(options);
}

class MemoryMonitor {

  constructor(options) {
    this.THEME = options.THEME;
    this.CANVAS_WIDTH = options.CANVAS_WIDTH;
    this.memoryMonitorEnabled = false;
    this.page = 0;

    const canvasMemoryElement = this._createCanvas();
    this.canvasMemory = canvasMemoryElement.getContext('2d', { alpha: true });
    replaceNode('memoryNode', canvasMemoryElement);
    this.canvasMemoryDrawLib = createDrawLib(this.canvasMemory, options.THEME);

    const canvasMemoryOverlayElement = this._createCanvas();
    this.canvasMemoryOverlay = canvasMemoryOverlayElement.getContext('2d', { alpha: true });
    replaceNode('memoryOverlayNode', canvasMemoryOverlayElement);
    this.canvasMemoryOverlayDrawLib = createDrawLib(this.canvasMemoryOverlay, options.THEME);

    this.canvasMemoryDrawLib.clear();
    for (let offset = 0; offset < 32; offset += 2) {
      this.canvasMemoryDrawLib.fillRect(
        MEM_CONTENT_X - 0.25 + offset * 2,
        MEM_CONTENT_Y - 1.5,
        2,
        17.25,
        this.THEME.DMD_COLOR_VERY_DARK);

      this.canvasMemoryDrawLib.fillRect(
        MEM_CONTENT_ASCII_X + offset * 0.75,
        MEM_CONTENT_Y - 1.5,
        0.75,
        17.25,
        this.THEME.DMD_COLOR_VERY_DARK);

//        this.canvasMemoryOverlayDrawLib.writeHeader(MEM_CONTENT_ASCII_X + offset * 0.75, 3 + y, String.fromCharCode(value));

    }

    for (let y = 0; y < 16; y += 2) {
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
    canvasElement.height = MEM_HEIGHT;
    return canvasElement;
  }

  clear() {
    this.canvasMemoryOverlayDrawLib.clear();
    this.page = 0;
  }

  toggleMemoryView() {
    const node = document.querySelector('#memoryMonitor');

    if (this.memoryMonitorEnabled) {
      node.style.height = '0px';
      this.memoryMonitorEnabled = false;
      return;
    }

    this.memoryMonitorEnabled = true;
    node.style.height = MEM_HEIGHT + 'px';
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

  draw(ramArray) {
    if (!this.memoryMonitorEnabled) {
      return;
    }

    this.canvasMemoryOverlayDrawLib.clear();
    for (let y = 0; y < 16; y++) {
      let ramOffset = this.page * 512 + 16 * y;

      this.canvasMemoryOverlayDrawLib.writeHeader(MEM_CONTENT_OFFSET_X, MEM_CONTENT_Y + y, '0x' + ramOffset.toString(16).toUpperCase());

      for (let offset = 0; offset < 32; offset++) {
        const value = ramArray[ ramOffset ];
        this.canvasMemoryOverlayDrawLib.writeHeader(MEM_CONTENT_X + offset * 2, MEM_CONTENT_Y + y, value < 16 ? '0' + value.toString(16) : value.toString(16));
        this.canvasMemoryOverlayDrawLib.writeHeader(MEM_CONTENT_ASCII_X + offset * .75, MEM_CONTENT_Y + y, String.fromCharCode(value));
        ramOffset++;
      }
    }
  }

}
