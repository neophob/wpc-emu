'use strict';

import { createDrawLib } from './ui/lib';
import { replaceNode } from './htmlselector';

export { getInstance };

function getInstance(options) {
  return new VariableMonitor(options);
}

const WINDOW_HEIGHT = 220;

class VariableMonitor {

  constructor(options) {
    this.THEME = options.THEME;
    this.CANVAS_WIDTH = options.CANVAS_WIDTH;
    this.memoryMonitorEnabled = false;

    const canvasVariablesElement = this._createCanvas();
    this.canvasVariables = canvasVariablesElement.getContext('2d', { alpha: false });
    replaceNode('variableNode', canvasVariablesElement);
    this.canvasVariablesDrawLib = createDrawLib(this.canvasVariables, options.THEME);
  }

  _createCanvas() {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = this.CANVAS_WIDTH;
    canvasElement.height = WINDOW_HEIGHT;
    return canvasElement;
  }

  clear() {
    this.canvasVariablesDrawLib.clear();
  }

  toggleView(enabled) {
    this.variableMonitorEnabled = enabled === true;
  }

  draw(memoryPositions) {
    if (!this.variableMonitorEnabled || !memoryPositions) {
      return;
    }

    this.canvasVariablesDrawLib.clear();
    memoryPositions.forEach((element, index) => {
      this.canvasVariablesDrawLib.writeHeader(
        2,
        2 + index * 1.5,
        element.name + ': ' + element.value,
        index % 2 === 1 ? this.THEME.TEXT_COLOR : this.THEME.TEXT_COLOR_HEADER
      );
    });
  }

}
