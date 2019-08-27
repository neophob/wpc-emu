'use strict';

import { createDrawLib } from './ui/lib';
import { replaceNode } from './htmlselector';

export { getInstance };

function getInstance(options) {
  return new VariableMonitor(options);
}

class VariableMonitor {

  constructor(options) {
    this.THEME = options.THEME;
    this.CANVAS_WIDTH = options.CANVAS_WIDTH;
    this.memoryMonitorEnabled = false;

    const canvasVariablesElement = this._createCanvas();
    this.canvasVariables = canvasVariablesElement.getContext('2d', { alpha: false });
    replaceNode('variableNode', canvasVariablesElement);
    this.canvasVariablesDrawLib = createDrawLib(this.canvasVariables, options.THEME);

    this.canvasVariablesDrawLib.fillRect(
      1,
      1,
      31,
      17,
      this.THEME.COLOR_RED);
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
    this.memorySearchResult = undefined;
    this.lastRamSnapshot = undefined;
  }

  toggleMemoryView() {
    const node = document.querySelector('#memoryMonitor');

    if (this.memoryMonitorEnabled) {
      node.style.height = '0px';
      node.style.visibility = 'hidden';
      this.memoryMonitorEnabled = false;
      return;
    }

    this.memoryMonitorEnabled = true;
    node.style.height = 2 * MEM_HEIGHT + 'px';
    node.style.visibility = 'visible';
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
        const value = this.lastRamSnapshot[ ramOffset + offset ];
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
