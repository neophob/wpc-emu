'use strict';

import { createDrawLib } from './ui/lib';
import { replaceNode } from './htmlselector';

export { getInstance };

function getInstance(options) {
  return new VariableMonitor(options);
}

const WINDOW_HEIGHT = 160;

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
    let xpos = 2;
    let ypos = 0;
    let maxTextLenght = 0;
    memoryPositions.forEach((element, index) => {
      ypos += 1.5;
      const text = element.name + ': ' + element.value;
      maxTextLenght = Math.max(maxTextLenght, text.length);
      this.canvasVariablesDrawLib.writeHeader(
        xpos,
        ypos,
        text,
        index % 2 === 1 ? this.THEME.TEXT_COLOR : this.THEME.TEXT_COLOR_HEADER
      );
      if ((index % 8) === 7) {
        xpos += maxTextLenght - 3;
        ypos = 0;
        maxTextLenght = 0;
      }
    });
  }

}
