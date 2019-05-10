'use strict';

export { createDrawLib };


function createDrawLib(ctx, theme) {
  return new DrawLib(ctx, theme);
}

const diagrams = [];

class DrawLib {

  constructor(ctx, theme) {
    this.ctx = ctx;
    this.theme = theme;

    this.ctx.textBaseline = 'alphabetic';
  }

  drawBackgroundPoints() {
    this.ctx.fillStyle = this.theme.GRID_POINTS_COLOR;
    for (let y = this.theme.GRID_STEP_Y; y < this.theme.CANVAS_HEIGHT; y += this.theme.GRID_STEP_Y) {
      for (let x = this.theme.GRID_STEP_X; x < this.theme.CANVAS_WIDTH; x += this.theme.GRID_STEP_X) {
        this.ctx.fillRect(x, y, this.theme.GRID_SIZE, this.theme.GRID_SIZE);
      }
    }
  }

  drawHorizontalLine(x, y, x2) {
    this.ctx.strokeStyle = this.theme.HEADER_LINE_LOW_COLOR;
    this.ctx.lineWidth = 1;

    const startX = x * this.theme.GRID_STEP_X;
    const endX = x2 * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, startY);
    this.ctx.stroke();

    this.ctx.fillStyle = this.theme.HEADER_LINE_HIGH_COLOR;
    this.ctx.fillRect(startX,   startY - 1, 2, 2);
    this.ctx.fillRect(endX, startY - 1, 2, 2);
  }

  drawVerticalLine(x, y, y2) {
    const startX = x * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;
    const endY = y2 * this.theme.GRID_STEP_Y;

    this.ctx.strokeStyle = this.theme.HEADER_LINE_LOW_COLOR;
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.moveTo(startX + 1, startY);
    this.ctx.lineTo(startX + 1, endY);
    this.ctx.stroke();

    this.ctx.fillStyle = this.theme.HEADER_LINE_HIGH_COLOR;
    this.ctx.fillRect(startX, startY, 2, 2);
    this.ctx.fillRect(startX, endY - 2, 2, 2);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.theme.CANVAS_WIDTH, this.theme.CANVAS_HEIGHT);
  }

  writeLabel(x, y, text) {
    this.ctx.font = this.theme.FONT_TEXT;
    this.ctx.fillStyle = this.theme.TEXT_COLOR_LABEL;
    this.ctx.fillText(text, x * this.theme.GRID_STEP_X, y * this.theme.GRID_STEP_Y);
  }

  writeText(x, y, text) {
    this.ctx.font = this.theme.FONT_TEXT;
    this.ctx.fillStyle = this.theme.TEXT_COLOR;
    this.ctx.fillText(text, x * this.theme.GRID_STEP_X, y * this.theme.GRID_STEP_Y);
  }

  writeHeader(x, y, text, color = this.theme.TEXT_COLOR_HEADER) {
    this.ctx.font = this.theme.FONT_HEADER;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x * this.theme.GRID_STEP_X, y * this.theme.GRID_STEP_Y);
  }

  writeRibbonHeader(x, y, text) {
    this.ctx.font = this.theme.FONT_HEADER;
    const textWidth = this.ctx.measureText(text).width + this.theme.GRID_STEP_X;

    const startX = x * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;

    this.ctx.fillStyle = this.theme.RIBBON_COLOR_HEADER;
    this.ctx.fillRect(startX - this.theme.GRID_STEP_X / 2, startY - this.theme.GRID_STEP_Y * 1.5,
      textWidth, this.theme.GRID_STEP_Y * 2);

    this.ctx.fillStyle = this.theme.TEXT_COLOR_HEADER;
    this.ctx.fillText(text, startX, startY);
  }

  drawVerticalRandomBlip(x, y, nr) {
    const startX = x * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;
    const endY = startY + nr * this.theme.GRID_STEP_Y / 2;
    const colors = [
      this.theme.COLOR_RED,
      this.theme.DMD_COLOR_MIDDLE,
      this.theme.COLOR_YELLOW,
      this.theme.DMD_COLOR_DARK,
      this.theme.RIBBON_COLOR_HEADER,
    ];

    let count = 0;
    const now = Date.now();
    for (let n = startY; n < endY; n += this.theme.GRID_STEP_Y / 2) {
      this.ctx.fillStyle = colors[((now % 0xFFFF)>>6 + count++) % 5];
      this.ctx.fillRect(startX, n, 2, 2);
    }
  }

  drawDiagram(xpos, ypos, name, value) {
    let startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;

    const diagramData = getDiagram(name);
    diagramData.add(value);

    let normalized = diagramData.values[0] / diagramData.maxValue * this.theme.GRID_STEP_Y;

    this.ctx.strokeStyle = this.theme.COLOR_YELLOW;
    this.ctx.lineWidth = 1;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY - normalized);

    diagramData.values.forEach((n) => {
      normalized = n / diagramData.maxValue * this.theme.GRID_STEP_Y;
      this.ctx.lineTo(startX, startY - normalized);
      startX += this.theme.GRID_STEP_X / 4;
    })

    this.ctx.stroke();
  }
}

function getDiagram(name) {
  if (diagrams[name]) {
    return diagrams[name];
  }
  diagrams[name] = new HorizontalDiagram(27 * 2);
  return diagrams[name];
}

class HorizontalDiagram {

  constructor(maxEntries) {
    this.maxEntries = maxEntries;
    this.values = new Array(maxEntries).fill(0);
    this.pos = 0;
    this.maxValue = 1;
  }

  add(value) {
    this.values[this.pos] = value;
    this.pos = (this.pos + 1) % this.maxEntries;
    this.maxValue = Math.max(value, this.maxValue);
    if (this.maxValue > 1) {
      this.maxValue--;
    }
  }
}
