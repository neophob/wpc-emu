import { createDrawLib } from './ui/lib';
import { memoryFindData } from './ui/memorysearch';
import { replaceNode, replaceNodeAndResize } from './htmlselector';

export { getInstance };

const WINDOW_HEIGHT = 230;
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
    this.canvasMemory = canvasMemoryElement.getContext('2d');
    replaceNode('memoryNode', canvasMemoryElement);
    this.canvasMemoryDrawLib = createDrawLib(this.canvasMemory, options.THEME);
    this.canvasMemoryDrawLib.clear();

    const canvasMemoryOverlayElement = this._createCanvas();
    this.canvasMemoryOverlay = canvasMemoryOverlayElement.getContext('2d');
    replaceNodeAndResize('memoryOverlayNode', canvasMemoryOverlayElement, WINDOW_HEIGHT - 20);
    this.canvasMemoryOverlayDrawLib = createDrawLib(this.canvasMemoryOverlay, options.THEME);

    // HIGHLIGHT ROWS
    for (let offset = 0; offset < ENTRIES_HORIZONTAL; offset += 2) {
      this.canvasMemoryDrawLib.fillRect(
        MEM_CONTENT_X - 0.25 + offset * 2,
        MEM_CONTENT_Y - 2.5,
        2,
        18.5,
        this.THEME.DMD_COLOR_VERY_DARK);

      this.canvasMemoryDrawLib.fillRect(
        MEM_CONTENT_ASCII_X + offset * 0.75,
        MEM_CONTENT_Y - 0.5,
        0.75,
        16.5,
        this.THEME.DMD_COLOR_VERY_DARK);
    }

    // HEADER: OFFSET X
    for (let offset = 0; offset < ENTRIES_HORIZONTAL; offset++) {
      this.canvasMemoryDrawLib.writeHeader(
        MEM_CONTENT_X + offset * 2,
        MEM_CONTENT_Y - 1,
        (offset < 16 ? '0' : '') + offset.toString(16).toUpperCase(),
        this.THEME.TEXT_COLOR
      );
    }

    // HIGHLIGHT LINES
    for (let y = 0; y < ENTRIES_VERTICAL; y += 2) {
      this.canvasMemoryDrawLib.fillRect(
        1.5,
        MEM_CONTENT_Y + y - 0.5,
        99,
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
    this.oldRamSnapshot = [];
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

  memoryDumpData(offset, optionalEndOffset) {
    if (!this.lastRamSnapshot) {
      return console.warn(ENABLE_MEMORY_MONITOR);
    }

    let dump = '';
    if (!optionalEndOffset && this.lastRamSnapshot[offset] > 31 && this.lastRamSnapshot[offset] < 128) {
      while (this.lastRamSnapshot[offset] > 31 && this.lastRamSnapshot[offset] < 128) {
        dump += String.fromCharCode(this.lastRamSnapshot[offset++]);
      }
    } else {
      dump = '0x' + this.lastRamSnapshot[offset].toString(16);
      if (optionalEndOffset > offset) {
        for (let n = offset + 1; n < optionalEndOffset; n++) {
          dump += ', 0x' + this.lastRamSnapshot[n].toString(16);
        }
      }
    }
    console.log('RAM-DUMP:', dump);
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
        MEM_CONTENT_Y + y + 0.5,
        '0x' + ramOffset.toString(16).toUpperCase(),
        this.THEME.TEXT_COLOR
      );

      const textColor = y % 2 ? this.THEME.TEXT_COLOR_HEADER : this.THEME.COLOR_BLUE_INTENSE;

      for (let offset = 0; offset < ENTRIES_HORIZONTAL; offset++) {
        const value = this.lastRamSnapshot[ramOffset + offset];
        const changedValue = this.oldRamSnapshot[ramOffset + offset] !== value;

        // write hex value
        if (value) {
          this.canvasMemoryOverlayDrawLib.writeHeader(
            MEM_CONTENT_X + offset * 2,
            MEM_CONTENT_Y + y + 0.5,
            value < 16 ? '0' + value.toString(16) : value.toString(16),
            changedValue ? this.THEME.COLOR_RED : textColor
          );
          //write ascii value
          this.canvasMemoryOverlayDrawLib.writeHeader(
            MEM_CONTENT_ASCII_X + offset * 0.75,
            MEM_CONTENT_Y + y + 0.5,
            String.fromCharCode(value),
            changedValue ? this.THEME.COLOR_RED : textColor
          );
        }
      }
    }
    this.oldRamSnapshot = this.lastRamSnapshot;
  }

}
