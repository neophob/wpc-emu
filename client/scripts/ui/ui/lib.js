'use strict';

export { createDrawLib, getDiagramCluster };

function createDrawLib(ctx, theme) {
  return new DrawLib(ctx, theme);
}

const diagrams = [];
const BIT_ARRAY = [1, 2, 4, 8, 16, 32, 64, 128];

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

  unpackBits(data) {
    const dataUnpacked = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 8; j++) {
        const entry = data[i] & BIT_ARRAY[j];
        dataUnpacked.push(entry > 0 ? 255 : 0);
      }
    }
    return dataUnpacked;
  }

  drawHorizontalLine(x, y, width, color = this.theme.HEADER_LINE_LOW_COLOR) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;

    const startX = x * this.theme.GRID_STEP_X;
    const endX = (x + width) * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;

    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, startY);
    this.ctx.stroke();

    this.ctx.fillStyle = this.theme.HEADER_LINE_HIGH_COLOR;
    this.ctx.fillRect(startX, startY - 1, 2, 2);
    this.ctx.fillRect(endX, startY - 1, 2, 2);
  }

  drawVerticalLine(x, y, height, color = this.theme.HEADER_LINE_LOW_COLOR) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;

    const startX = x * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;
    const endY = (y + height) * this.theme.GRID_STEP_Y;

    this.ctx.beginPath();
    this.ctx.moveTo(startX + 1, startY);
    this.ctx.lineTo(startX + 1, endY);
    this.ctx.stroke();

    this.ctx.fillStyle = this.theme.HEADER_LINE_HIGH_COLOR;
    this.ctx.fillRect(startX, startY, 2, 2);
    this.ctx.fillRect(startX, endY - 2, 2, 2);
  }

  clear(x = 0, y = 0, width = this.theme.CANVAS_WIDTH, height = this.theme.CANVAS_HEIGHT) {
    this.ctx.clearRect(x, y, width, height);
  }

  writeLabel(x, y, text, color = this.theme.TEXT_COLOR_LABEL) {
    this.ctx.font = this.theme.FONT_TEXT;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x * this.theme.GRID_STEP_X, y * this.theme.GRID_STEP_Y);
  }

  writeText(x, y, text, font = this.theme.FONT_TEXT) {
    this.ctx.font = font;
    this.ctx.fillStyle = this.theme.TEXT_COLOR;
    this.ctx.fillText(text, x * this.theme.GRID_STEP_X, y * this.theme.GRID_STEP_Y);
  }

  writeHeader(x, y, text, color = this.theme.TEXT_COLOR_HEADER) {
    this.ctx.font = this.theme.FONT_HEADER;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x * this.theme.GRID_STEP_X, y * this.theme.GRID_STEP_Y);
  }

  writeHuge(x, y, text, color = this.theme.TEXT_COLOR_HEADER) {
    this.ctx.font = this.theme.FONT_HUGE;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x * this.theme.GRID_STEP_X, y * this.theme.GRID_STEP_Y);
  }

  writeRibbonHeader(x, y, text, font = this.theme.FONT_HEADER) {
    this.ctx.font = font;
    const textWidth = this.ctx.measureText(text).width + this.theme.GRID_STEP_X;
    const textHeight = parseInt(this.ctx.font.match(/\d+/), 10);

    const startX = x * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;

    this.ctx.fillStyle = this.theme.RIBBON_COLOR_HEADER;
    this.ctx.fillRect(startX - this.theme.GRID_STEP_X / 2, startY - textHeight,
      textWidth, textHeight * 1.3);

    this.ctx.fillStyle = this.theme.TEXT_COLOR_HEADER;
    this.ctx.fillText(text, startX, startY);
  }

  drawVerticalRandomBlip(x, y, nr) {
    const startX = x * this.theme.GRID_STEP_X;
    const startY = y * this.theme.GRID_STEP_Y;
    const endY = startY + nr * this.theme.GRID_STEP_Y / 2;
    const colors = [
      this.theme.COLOR_RED,
      this.theme.COLOR_BLUE_INTENSE,
      this.theme.COLOR_YELLOW,
      this.theme.DMD_COLOR_DARK,
      this.theme.RIBBON_COLOR_HEADER,
    ];

    const now = Date.now();
    for (let n = startY; n < endY; n += this.theme.GRID_STEP_Y / 2) {
      this.ctx.fillStyle = colors[((now % 0xFFFF) >> 6 + n) % 5];
      this.ctx.fillRect(startX, n, 2, 2);
    }
  }

  drawHorizontalRandomBlip(x, y, nr, seed = (Date.now() % 0xFFFF) >> 8) {
    const startX = x * this.theme.GRID_STEP_X;
    const endX = startX + nr * this.theme.GRID_STEP_X / 2;
    const startY = y * this.theme.GRID_STEP_Y;
    const colors = [
      this.theme.COLOR_BLUE,
      this.theme.COLOR_RED,
      this.theme.COLOR_BLUE_INTENSE,
      this.theme.COLOR_YELLOW,
      this.theme.DMD_COLOR_DARK,
      this.theme.RIBBON_COLOR_HEADER,
      this.theme.DMD_COLOR_DARK,
      this.theme.COLOR_BLUE_INTENSE,
      this.theme.COLOR_YELLOW,
    ];

    for (let n = startX; n < endX; n += this.theme.GRID_STEP_X / 2) {
      this.ctx.fillStyle = colors[(seed + n) % 8];
      this.ctx.fillRect(n, startY, 2, 2);
    }
  }

  drawDiagram(xpos, ypos, name, value, maxEntries = 54) {
    let startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;

    const diagramData = getDiagram(name, maxEntries);
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
    });

    this.ctx.stroke();
  }

  drawRect(xpos, ypos, width, height, color) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;
    const endX = width * this.theme.GRID_STEP_X;
    const endY = height * this.theme.GRID_STEP_Y;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(startX, startY, endX, endY);
  }

  fillRect(xpos, ypos, width, height, color) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;
    const endX = width * this.theme.GRID_STEP_X;
    const endY = height * this.theme.GRID_STEP_Y;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(startX, startY, endX, endY);
  }

  drawRedTriangle(xpos, ypos, sliderMaxValue, floatValue) {
    const startX = xpos * this.theme.GRID_STEP_X + sliderMaxValue * floatValue * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;

    this.ctx.fillStyle = this.theme.COLOR_RED;

    this.ctx.beginPath();
    this.ctx.moveTo(startX - this.theme.GRID_STEP_X / 2, startY - this.theme.GRID_STEP_Y / 2);
    this.ctx.lineTo(startX + this.theme.GRID_STEP_X / 2, startY - this.theme.GRID_STEP_Y / 2);
    this.ctx.lineTo(startX, startY);
    this.ctx.fill();
  }

  drawWpcLogo(xpos, ypos) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;
    const XXX = 1.5;
    const Y_STRETCH = this.theme.GRID_STEP_Y * XXX;
    const X_OFFSET = this.theme.GRID_STEP_X / XXX;

    this.ctx.fillStyle = this.theme.COLOR_BLUE_INTENSE;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(startX + this.theme.GRID_STEP_X * 2, startY);
    this.ctx.lineTo(startX + this.theme.GRID_STEP_X, startY + Y_STRETCH);
    this.ctx.fill();

    this.ctx.fillStyle = this.theme.COLOR_RED;
    this.ctx.beginPath();
    this.ctx.moveTo(startX + X_OFFSET, startY);
    this.ctx.lineTo(startX + X_OFFSET + this.theme.GRID_STEP_X * 2, startY);
    this.ctx.lineTo(startX + X_OFFSET + this.theme.GRID_STEP_X, startY + Y_STRETCH);
    this.ctx.fill();

    this.ctx.fillStyle = this.theme.COLOR_YELLOW;
    this.ctx.beginPath();
    this.ctx.moveTo(startX + X_OFFSET, startY);
    this.ctx.lineTo(startX + X_OFFSET + X_OFFSET * 2, startY);
    this.ctx.lineTo(startX + X_OFFSET + this.theme.GRID_STEP_X / XXX, startY + Y_STRETCH / XXX);
    this.ctx.fill();

  }

  drawScala(xpos, ypos, p1, p2) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;
    const end1 = p1 * this.theme.GRID_STEP_X;
    const end2 = p2 * this.theme.GRID_STEP_X;

    this.ctx.fillStyle = this.theme.COLOR_BLUE;
    this.ctx.fillRect(startX, startY + this.theme.GRID_STEP_Y / 4, end1, this.theme.GRID_STEP_Y / 2);

    this.ctx.fillStyle = this.theme.COLOR_YELLOW;
    this.ctx.fillRect(startX + end1, startY + this.theme.GRID_STEP_Y / 4, end2, this.theme.GRID_STEP_Y / 2);

    this.ctx.strokeStyle = this.theme.COLOR_YELLOW;
    this.ctx.lineWidth = 1;

    const strokeXStart = startX - this.theme.GRID_STEP_X / 4;
    const strokeXEnd = (xpos + p1 + p2) * this.theme.GRID_STEP_X + this.theme.GRID_STEP_X / 4;
    const Y34 = startY + this.theme.GRID_STEP_Y;//this.theme.GRID_STEP_Y / 4 + this.theme.GRID_STEP_Y / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(strokeXStart, startY - this.theme.GRID_STEP_Y / 2);
    this.ctx.lineTo(strokeXStart, Y34);
    this.ctx.lineTo(strokeXEnd, Y34);
    this.ctx.lineTo(strokeXEnd, startY - this.theme.GRID_STEP_Y / 2);
    this.ctx.stroke();

    this.ctx.beginPath();
    for (let ofs = 1; ofs < p1 + p2; ofs++) {
      const x = startX + this.theme.GRID_STEP_X * ofs;
      this.ctx.moveTo(x, Y34);
      this.ctx.lineTo(x, startY);
    }
    this.ctx.stroke();
  }

  drawDmdShaded(xpos, ypos, data) {
    //128 x 32
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;

    const KOL = [
      'rgb(255,0,0)',
      this.theme.DMD_COLOR_DARK,
      this.theme.DMD_COLOR_MIDDLE,
      this.theme.DMD_COLOR_HIGH,
    ];
    let offsetX = 0;
    let offsetY = 0;
    let color = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > 0) {
        if (color !== data[i]) {
          color = data[i];
          this.ctx.fillStyle = KOL[color];
        }

        this.ctx.fillRect(
          1 + startX + offsetX * this.theme.GRID_STEP_X / 2,
          1 + startY + offsetY * this.theme.GRID_STEP_Y / 2,
          this.theme.GRID_STEP_X / 2 - 1,
          this.theme.GRID_STEP_Y / 2 - 1);
      }
      offsetX++;
      if (offsetX === 128) {
        offsetX = 0;
        offsetY++;
      }
    }
  }

  drawMemRegion(xpos, ypos, data, width = 13 * this.theme.GRID_STEP_X) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;

    let offsetX = 0;
    let offsetY = 0;
    let color = 0;
    for (let i = 0; i < data.length / 2; i++) {
      if (data[i] > 0) {
        if (color !== data[i]) {
          color = data[i].toString(16);
          const color2 = (data[i] >> 1).toString(16);
          this.ctx.fillStyle = '#' + color2 + color + color;
        }
        this.ctx.fillRect(startX + offsetX, startY + offsetY, 1, 1);
      }
      if (offsetX++ >= width - 1) {
        offsetX = 0;
        offsetY++;
      }
    }
  }

  drawDmd(data, x, y, width = 128) {
    this.ctx.fillStyle = this.theme.DMD_COLOR_LOW;

    let offsetX = 0;
    let offsetY = 0;
    for (let i = 0; i < data.length; i++) {
      const packedByte = data[i];
      for (let j = 0; j < BIT_ARRAY.length; j++) {
        //NOTE: important speed optimize here...
        if (packedByte > 0) {
          const mask = BIT_ARRAY[j];
          if (mask & packedByte) {
            this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
          }
        }
        //this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        offsetX++;
        if (offsetX === width) {
          offsetX = 0;
          offsetY++;
        }
      }
    }
  }

  drawVideoRam(x, y, frame, data) {
    // draw only 4 dmd frames to avoid dropping fps
    const dmdRow = frame % 4;
    let xpos = x * this.theme.GRID_STEP_X + (128 % this.theme.GRID_STEP_X) / 2;
    const ypos = y * this.theme.GRID_STEP_Y + dmdRow * (4.5 * this.theme.GRID_STEP_Y);

    // clear rect
    this.ctx.clearRect(xpos, ypos, this.theme.GRID_STEP_X * 12 * 4, 4.5 * this.theme.GRID_STEP_Y);

    for (let i = 0; i < 4; i++) {
      this.drawDmd(data[dmdRow * 4 + i], xpos, ypos);
      xpos += this.theme.GRID_STEP_X * 12;
    }
  }

  drawVerticalByteDiagram(xpos, ypos, data) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;
    const KOL = [
      this.theme.COLOR_BLUE_INTENSE,//DMD_COLOR_MIDDLE,
      this.theme.COLOR_YELLOW,
      this.theme.DMD_COLOR_DARK,
      this.theme.COLOR_GREEN,
    ];
    let ofs = 0;
    let colorOffset = 0;

    this.ctx.strokeStyle = KOL[0];
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();

    data.forEach((value, index) => {
      if (index % 8 === 7) {
        this.ctx.stroke();
        this.ctx.beginPath();

        colorOffset++;
        this.ctx.strokeStyle = KOL[colorOffset % 4];
      }
      this.ctx.moveTo(startX + ofs, startY);
      this.ctx.lineTo(startX + ofs, startY - (value >> 4));

      ofs += 3;
    });
    this.ctx.stroke();
  }

  drawHorizontalBitDiagram(xpos, ypos, data) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;

    let ofs = 0;
    const dataUnpacked = [];
    for (let j = 0; j < 8; j++) {
      const entry = data & BIT_ARRAY[j];
      dataUnpacked.push(entry > 0 ? 1 : 0);
    }

    this.ctx.strokeStyle = this.theme.COLOR_RED;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    dataUnpacked.forEach((value) => {
      this.ctx.moveTo(startX + ofs, startY);
      this.ctx.lineTo(startX + ofs, startY - value * (this.theme.GRID_STEP_Y / 2));
      ofs += 4;
    });
    this.ctx.stroke();
  }

  drawMatrix8x8(xpos, ypos, data) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;

    const gridsizeX = this.theme.GRID_STEP_X * 0.75;
    const gridsizeY = this.theme.GRID_STEP_Y * 0.75;

    data.forEach((lamp, index) => {
      this.ctx.fillStyle = lamp & 0x80 ? this.theme.COLOR_RED :
        lamp & 0x70 ? this.theme.DMD_COLOR_LOW : this.theme.DMD_COLOR_DARK;
      const i = startX + (index % 8) * gridsizeX;
      const j = startY + parseInt(index / 8, 10) * gridsizeY;
      this.ctx.fillRect(i, j, gridsizeX - 1, gridsizeY - 1);
    });
  }

  drawImage(xpos, ypos, playfieldImage) {
    const startX = xpos * this.theme.GRID_STEP_X;
    const startY = ypos * this.theme.GRID_STEP_Y;
    this.ctx.drawImage(playfieldImage, startX, startY);
  }

  drawDiagramCluster(xpos, ypos, arrayData, visibleElements, maxEntries = 20) {
    const STARTX = xpos * this.theme.GRID_STEP_X;
    let startX = STARTX;
    let startY = ypos * this.theme.GRID_STEP_Y;

    const diagramDataArray = getDiagramCluster(arrayData.length, maxEntries);
    diagramDataArray.add(arrayData);

    this.ctx.strokeStyle = this.theme.COLOR_YELLOW;
    this.ctx.lineWidth = 1;
    this.ctx.font = this.theme.FONT_TEXT;
    this.ctx.fillStyle = this.theme.TEXT_COLOR_LABEL;

    this.ctx.beginPath();

    // DRAW diagram
    diagramDataArray.getInterestingDiagrams(visibleElements)
      .forEach((diagramData, index) => {
        let normalized = diagramData.values[0] / diagramData.maxValue * this.theme.GRID_STEP_Y;

        this.ctx.fillText('0x' + diagramData.offset.toString(16), startX, startY + this.theme.GRID_STEP_Y * 0.5);
        this.ctx.moveTo(startX, startY - normalized);

        diagramData.values.forEach((n) => {
          normalized = n / diagramData.maxValue * this.theme.GRID_STEP_Y;
          this.ctx.lineTo(startX, startY - normalized);
          startX += this.theme.GRID_STEP_X / 4;
        });

        startX += this.theme.GRID_STEP_X * 0.75;
        if (index % 8 === 7) {
          startX = STARTX;
          startY += this.theme.GRID_STEP_Y * 2;
        }
      });

    this.ctx.stroke();
  }

}

function getDiagram(name, nrOfElementsPerDiagram) {
  if (diagrams[name]) {
    return diagrams[name];
  }
  diagrams[name] = new HorizontalDiagram(nrOfElementsPerDiagram);
  return diagrams[name];
}

class HorizontalDiagram {

  constructor(nrOfElementsPerDiagram) {
    this.nrOfElementsPerDiagram = nrOfElementsPerDiagram;
    this.values = new Array(nrOfElementsPerDiagram).fill(0);
    this.pos = 0;
    this.maxValue = 1;
    this.interesting = 0;
    this.offset = -1;
  }

  // add value to diagram
  add(value) {
    this.values[this.pos] = value;
    this.pos = (this.pos + 1) % this.nrOfElementsPerDiagram;
    this.maxValue = Math.max(value, this.maxValue);

    if (this.pos === 0) {
      this.maxValue = Math.max(value, this.maxValue);
      let interesting = 0;
      for (let n = 0; n < this.values.length - 1; n++) {
        interesting += Math.abs(this.values[n] - this.values[n + 1]);
      }
      this.interesting = interesting;
    }
  }
}

function getDiagramCluster(nrOfDiagrams, nrOfElementsPerDiagram) {
  const name = nrOfDiagrams + 'cluster' + nrOfElementsPerDiagram;
  if (diagrams[name]) {
    return diagrams[name];
  }
  diagrams[name] = new HorizontalDiagramCluster(nrOfDiagrams, nrOfElementsPerDiagram);
  return diagrams[name];
}

class HorizontalDiagramCluster {

  // nrOfDiagrams, int: how many diagrams should be created
  // nrOfElementsPerDiagram, int: how many elements should a diagram have
  constructor(nrOfDiagrams, nrOfElementsPerDiagram) {
    this.nrOfDiagrams = nrOfDiagrams;
    this.diagCluster = new Map();
    for (let i = 0; i < nrOfDiagrams; i++) {
      const diagram = new HorizontalDiagram(nrOfElementsPerDiagram);
      diagram.offset = i;
      this.diagCluster.set(i, diagram);
    }
  }

  // elements, array: input data, array length MUST match the nrOfDiagrams
  add(elements) {
    if (!Array.isArray(elements)) {
      console.error('HorizontalDiagramCluster: input is not an Array', typeof elements);
      return false;
    }
    if (elements.length !== this.nrOfDiagrams) {
      console.error('HorizontalDiagramCluster: data count invalid');
      return false;
    }
    elements.forEach((element, index) => {
      const diag = this.diagCluster.get(index);
      diag.add(element);
    });
  }

  getInterestingDiagrams(nrOfDiagramsToReturn) {
    return [...this.diagCluster.values()]
      .sort((e1, e2) => {
        if (e1.interesting === e2.interesting) {
          return 0;
        }
        if (e1.interesting > e2.interesting) {
          return 1;
        }
        return -1;
      })
      //TODO REMOVE DUPLICATE ELEMENTS
      .reverse()
      .slice(0, nrOfDiagramsToReturn);
  }

}
