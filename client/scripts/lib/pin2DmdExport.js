import * as FileSaver from 'file-saver';

export { initialise, save };

/**
 * used to dump RAW DMD frames, use the PIN2DMD format. Format description (aka VPinMameRawRenderer)
 * - HEADER, see description below
 * - FRAMES, each frame consists of a 4 byte uptimeInMs counter and 1536 bytes video frames (3 * unshaded video ram content)
 */

const TICKS_PER_MS = 2000;

const HEADER = [
  // RAW as ascii
  82, 65, 87,

  // VERSION 1
  0, 1,

  // DMD WIDTH in pixels
  128,

  // DMD HEIGHT in pixels
  32,

  // FRAMES PER IMAGE, always 3 for WPC devices
  3,
];

function initialise() {
  return new DmdGrabber();
}

function save(uint8Array, filename = 'pin2dmd.raw') {
  if (!uint8Array || uint8Array.length <= HEADER.length) {
    console.info('no frames found, abort');
    return false;
  }

  const blob = new Blob(
    [ uint8Array.buffer ],
    { type: 'text/plain;charset=utf-8' },
  );
  FileSaver.saveAs(blob, filename);
}

class DmdGrabber {

  constructor() {
    this.frames = [ HEADER ];
    this.lastVideoOutputBuffer = [];
  }

  _ticksToTimestamp(ticks) {
    const msSinceStart = Math.round(ticks / TICKS_PER_MS);
    return [
      msSinceStart & 0xFF,
      (msSinceStart >> 8) & 0xFF,
      (msSinceStart >> 16) & 0xFF,
      (msSinceStart >> 24) & 0xFF,
    ];
  }

  addFrames(videoOutputBuffer, ticks) {
    if (arraysEqual(this.lastVideoOutputBuffer, videoOutputBuffer)) {
      return;
    }
    const timeSinceLastFrameMs = this._ticksToTimestamp(ticks);
    this.lastVideoOutputBuffer = videoOutputBuffer;
    this.frames.push(
      timeSinceLastFrameMs.concat(Array.from(videoOutputBuffer))
    );
  }

  getCapturedFrames() {
    return this.frames.length - 1;
  }

  buildExportFile() {
    return new Uint8Array(flatten(this.frames));
  }
}

function flatten(array) {
  return Array.prototype.concat(...array);
}

function arraysEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a === null || b === null || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
