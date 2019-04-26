'use strict';

const debug = require('debug')('wpcemu:boards:elements:soundQueue');
const volumeConverter = require('./sound-volume-convert');

module.exports = {
  getInstance,
};

const SAMPLE_ID_STOP = 0x00;

const DCS_VOLUME_COMMAND = 0x55;
const DCS_VOLUME_GLOBAL = 0xAA;
const DCS_CHANNEL_0_OFF = 0x3E0;
const DCS_CHANNEL_1_OFF = 0x3E1;
const DCS_CHANNEL_2_OFF = 0x3E2;
const DCS_CHANNEL_3_OFF = 0x3E3;
const DCS_CHANNEL_4_OFF = 0x3E4;
const DCS_CHANNEL_5_OFF = 0x3E5;
const DCS_CHANNEL_6_OFF = 0x3E6;
const DCS_GET_MAIN_VERSION = 0x3E7;
const DCS_GET_MINOR_VERSION = 0x3E8;
const DCS_UNKNOWN3D2 = 0x3D2;
const DCS_UNKNOWN3D3 = 0x3D3;

/*
Note: there are some hardcoded sample id's related to the test menu. these samples
should be present in the audio file and are not handled special.

#define SND_TEST_DOWN			(0x3D4)
#define SND_TEST_UP				(0x3D5)
#define SND_TEST_ABORT		(0x3D6)
#define SND_TEST_CONFIRM	(0x3D7)
#define SND_TEST_ALERT		(0x3D8) // Coin Door open
#define SND_TEST_HSRESET	(0x3D9)
#define SND_TEST_CHANGE		(0x3DA)
#define SND_TEST_ENTER		(0x3DB)
#define SND_TEST_ESCAPE		(0x3DC)
#define SND_TEST_SCROLL		(0x3DD)
*/


const PREDCS_VOLUME_COMMAND = 0x79;
const PREDCS_EXTENDED_COMMAND = 0x7A;

const COMMAND_PLAYSAMPLE = 'PLAYSAMPLE';
const COMMAND_STOPSOUND = 'STOPSOUND';
const COMMAND_MAINVOLUME = 'MAINVOLUME';
const COMMAND_CHANNELOFF = 'CHANNELOFF';

const READ_NO_DATA_IS_AVAILABLE = 0x00;
const READ_CONTROL_NO_DATA_IS_AVAILABLE = 0xFF;
const READ_DATA_IS_AVAILABLE = 0x80;

const DEFAULT_VOLUME = 8;

function getInstance(isPreDcsSoundBoard) {
  return new SoundInterface(isPreDcsSoundBoard);
}

class SoundInterface {

  constructor(isPreDcsSoundBoard) {
    this.isPreDcsSoundBoard = isPreDcsSoundBoard;
    this.soundBoardCallback = () => {};
    this.writeQueue = new Queue();
    this.readQueue = new Queue();
    this.volume = DEFAULT_VOLUME;
    this.lastUnknownControlWrite = -1;
  }

  reset() {
    this.writeQueue.clear();
    this.readQueue.clear();
    this.volume = DEFAULT_VOLUME;
    this._callbackStopAllSamples();
    this.lastUnknownControlWrite = -1;
  }

  registerCallBack(callbackFunction) {
    this.soundBoardCallback = callbackFunction;
  }

  readData() {
    if (this.readQueue.isEmpty()) {
      return READ_NO_DATA_IS_AVAILABLE;
    }
    return this.readQueue.remove();
  }

  writeData(value) {
    this.writeQueue.insert(value);

    if (this.isPreDcsSoundBoard) {
      this._processPreDcsSoundCommand(value);
    } else {
      this._processDcsSoundCommand(value);
    }
  }

  readControl() {
    if (this.readQueue.isEmpty()) {
      return READ_CONTROL_NO_DATA_IS_AVAILABLE;
    }
    return READ_DATA_IS_AVAILABLE;
  }

  writeControl(value) {
    if (value === 0x00) {
      //Reset is triggered by the sound-board
      return true;
    }

    if (value === 0x01) {
      // ignore write 1 - as the transition from 1 -> 0 triggers reset. we however only check if a 0 is written to reset
      return
    }

    if (value !== this.lastUnknownControlWrite) {
      console.log('UNKNOWN CONTROL WRITE:', value);
      this.lastUnknownControlWrite = value;
    }
}

  _processPreDcsSoundCommand(lastCommand) {
    const pendingVolumeCommand = this.writeQueue.queue[0] === PREDCS_VOLUME_COMMAND;
    if (pendingVolumeCommand) {
      if (this.writeQueue.size() !== 3) {
        // WAIT UNTIL ALL BYTES ARRIVE
        return;
      }
      const volume = volumeConverter.getRelativeVolumePreDcs(this.writeQueue.queue[1], this.writeQueue.queue[2]);
      if (Number.isInteger(volume)) {
        this.volume = volume;
        this._callbackMainVolume(this.volume);
        debug('VOLUME_SET', this.volume);
      }
      this.writeQueue.clear();
      return;
    }

    const isExtendedCommand = this.writeQueue.queue[0] === PREDCS_EXTENDED_COMMAND;
    if (isExtendedCommand) {
      if (this.writeQueue.size() > 1) {
        const extendedCommand = (PREDCS_EXTENDED_COMMAND << 8) + this.writeQueue.queue[1];
        this._callbackPlaySample(extendedCommand);
        this.writeQueue.clear();
      }
    } else {
      this._callbackPlaySample(this.writeQueue.queue[0]);
      this.writeQueue.clear();
    }
  }

  _processDcsSoundCommand() {
    if (this.writeQueue.size() < 2) {
      return;
    }

    const pendingVolumeCommand = this.writeQueue.queue[0] === DCS_VOLUME_COMMAND;
    if (pendingVolumeCommand) {
      console.log('-> pendingVolumeCommand', this.writeQueue.size());
      if (this.writeQueue.size() !== 4) {
        // WAIT UNTIL ALL BYTES ARRIVE
        return;
      }

      const changeGlobalVolume = this.writeQueue.queue[1] === DCS_VOLUME_GLOBAL;
      if (changeGlobalVolume) {
        const volume = volumeConverter.getRelativeVolumeDcs(this.writeQueue.queue[2], this.writeQueue.queue[3]);
        if (Number.isInteger(volume)) {
          this.volume = volume;
          this._callbackMainVolume(this.volume);
          debug('VOLUME_SET', this.volume);
        }
      } else {
        console.log('ONLY GLOBAL VOLUME SUPPORTED NOW! ;(');
      }
      this.writeQueue.clear();
      return;
    }

    const sampleId = (this.writeQueue.queue[0] << 8) | this.writeQueue.queue[1];
    switch (sampleId) {
      case SAMPLE_ID_STOP:
        console.log('-> STOP ALL SAMPLES');
        this._callbackStopAllSamples();
        break;

      case DCS_CHANNEL_0_OFF:
      case DCS_CHANNEL_1_OFF:
      case DCS_CHANNEL_2_OFF:
      case DCS_CHANNEL_3_OFF:
      case DCS_CHANNEL_4_OFF:
      case DCS_CHANNEL_5_OFF:
      case DCS_CHANNEL_6_OFF: {
        const channel = sampleId - DCS_CHANNEL_0_OFF;
        this._callbackChannelOff(channel);
        break;
      }

      case DCS_UNKNOWN3D2: //SAFE CRACKER: need to reply else soundboard is reset
      case DCS_UNKNOWN3D3: //AFM + CONGO: need to reply else soundboard is reset
        this.readQueue.insert(0x1);
        break;

      case DCS_GET_MAIN_VERSION:
        console.log('DCS_GET_MAIN_VERSION');
        this.readQueue.insert(0x10);
        break;
      case DCS_GET_MINOR_VERSION:
        console.log('DCS_GET_MINOR_VERSION');
        this.readQueue.insert(0x1);
        break;

      default:
        this._callbackPlaySample(sampleId);
        break;
    }
    this.writeQueue.clear();
  }

  _callbackStopAllSamples() {
    this.soundBoardCallback({ command: COMMAND_STOPSOUND });
  }

  _callbackPlaySample(id) {
    if (id === SAMPLE_ID_STOP) {
      this._callbackStopAllSamples();
      return;
    }
    this.soundBoardCallback({ command: COMMAND_PLAYSAMPLE, id });
  }

  _callbackChannelOff(channel) {
    this.soundBoardCallback({ command: COMMAND_CHANNELOFF, channel });
  }

  _callbackMainVolume(value) {
    this.soundBoardCallback({ command: COMMAND_MAINVOLUME, value });
  }

}

class Queue {
  constructor() {
    this.queue = [];
  }

  insert(value) {
    this.queue.push(value);
  }

  remove() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  clear() {
    this.queue = [];
  }

  size() {
    return this.queue.length;
  }
}
