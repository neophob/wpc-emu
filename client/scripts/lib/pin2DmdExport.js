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

function save(uint8Array) {
  console.log('save', uint8Array)
  const blob = new Blob(
    [ uint8Array.buffer ],
    { type: 'text/plain;charset=utf-8' },
  );
  FileSaver.saveAs(blob, "pin2dmd.raw");
}

class DmdGrabber {

  constructor() {
    this.frames = [ HEADER ];
  }

  addFrames(videoOutputBuffer, timestamp = Date.now()) {
    this.frames.push(
      getSystickAs4Bytes(timestamp).concat(Array.from(videoOutputBuffer))
    );
    console.log('-->',this.frames);
  }

  getCapturedFrames() {
    return this.frames.length - 1;
  }

  buildExportFile() {
    return new Uint8Array(flatten(this.frames));
  }
}

function getSystickAs4Bytes(timestamp = 0) {
  return [
    timestamp & 0xFF,
    (timestamp >> 8) & 0xFF,
    (timestamp >> 16) & 0xFF,
    (timestamp >> 32) & 0xFF,
  ];
}

function flatten(arr) {
  return Array.prototype.concat(...arr);
}