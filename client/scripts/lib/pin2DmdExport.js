'use strict';

import * as FileSaver from 'file-saver';
export { initialise, save };

/**
 * used to dump RAW DMD frames, use the PIN2DMD format
 */

/*
Die Daten für jedes Frame sind dann so aufgebaut
4byte SysTick als DWORD
und bei WPC 1536byte Daten.
*/

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

/*
- ja das Display addiert die 3 frames die von der Maschine kommen einfach auf und ordnet diese dann Farb bzw Helligkeitswerten zu.
- systick ist ein Timecode in ms. Hier wird die Zeit zwischen den Änderungen fortlaufend gezählt. Passt also auch zu Deiner Implementierung. Für Dich müsste das hier gehen
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
- das mit dem Payload stimmt genau. Die Bytes sind LSB.
*/

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
    this.startTimeMs = Date.now();
  }

  _getTimestampSinceLastFrameAs4Bytes() {
    const msSinceLastFrame = Date.now() - this.startTimeMs;
    return [
      msSinceLastFrame & 0xFF,
      (msSinceLastFrame >> 8) & 0xFF,
      (msSinceLastFrame >> 16) & 0xFF,
      (msSinceLastFrame >> 24) & 0xFF,
    ];
  }

  addFrames(videoOutputBuffer) {
    const timeSinceLastFrameMs = this._getTimestampSinceLastFrameAs4Bytes();
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