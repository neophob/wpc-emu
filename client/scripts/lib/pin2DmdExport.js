'use strict';

import * as FileSaver from 'file-saver';
export { initialise, save };

/**
 * used to dump RAW DMD frames, use the PIN2DMD format. Format
 * HEADER
 * 4 byte uptimeInMs + 1536 bytes video frames (3 * unshaded ram content)
 */

const TICKS_PER_MS = 2000;

const HEADER = [
  // RAW
  82, 65, 87,

  // VERSION
  0, 1,

  // DMD WIDTH
  128,

  // DMD HEIGHT
  32,

  // FRAMES PER IMAGE
  3,
];

function initialise() {
  return new DmdGrabber();
}

function save(uint8Array, filename = 'pin2dmd.raw') {
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
    const msSinceStart = Math.floor(ticks / TICKS_PER_MS);
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

function flatten(arr) {
  return Array.prototype.concat(...arr);
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
