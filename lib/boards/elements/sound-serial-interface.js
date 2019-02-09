'use strict';

//TODO ignore if volume is 0
//TODO fix out of sync issue! MM test menu for example!

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
const DCS_GET_UNKNOWN3D2 = 0x3D2;
const DCS_GET_UNKNOWN3D3 = 0x3D3;

const PREDCS_VOLUME_COMMAND = 0x79;
const PREDCS_EXTENDED_COMMAND = 0x7A;

const COMMAND_PLAYSAMPLE = 'PLAYSAMPLE';
const COMMAND_STOPSOUND = 'STOPSOUND';
const COMMAND_MAINVOLUME = 'MAINVOLUME';
const COMMAND_CHANNELOFF = 'CHANNELOFF';

//TODO 0xFF or 0x00
const READ_NO_DATA_IS_AVAILABLE = 0x00;
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
  }

  reset() {
    this.writeQueue.clear();
    this.readQueue.clear();
    this.volume = DEFAULT_VOLUME;
    this._callbackStopAllSamples();
  }

  registerCallBack(callbackFunction) {
    this.soundBoardCallback = callbackFunction;
  }

  read() {
    if (this.readQueue.isEmpty()) {
      return READ_NO_DATA_IS_AVAILABLE;
    }
    const readValue = this.readQueue.remove();
    console.log('<<< RETURN ', readValue);
    return readValue;
  }

  write(value) {
    console.log('WRITE WPC_LATCH_WRITE', value.toString(16));

    this.writeQueue.insert(value);

    if (value === 0x5F) {
      console.log('####### VERSION REUEST!');
    }

    if (this.isPreDcsSoundBoard) {
      this._processPreDcsSoundCommand(value);
    } else {
      this._processDcsSoundCommand(value);
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
      console.log('EXTENDED_COMMAND_NOT_IMPLEMENTED!!!');
    }

    this._callbackPlaySample(lastCommand);
    this.writeQueue.clear();
  }

  _processDcsSoundCommand(lastCommand) {
    console.log('-> _processDcsSoundCommand', this.writeQueue.queue);

    if (this.writeQueue.size() < 2) {
      console.log('RET')
      return;
    }

    const pendingVolumeCommand = this.writeQueue.queue[0] === DCS_VOLUME_COMMAND;
    if (pendingVolumeCommand) {
      console.log('-> pendingVolumeCommand',this.writeQueue.size());
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
        console.log('## ONLY GLOBAL VOLUME SUPPORTED NOW! ;(')
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
      case DCS_CHANNEL_6_OFF:
        const channel = sampleId - DCS_CHANNEL_0_OFF;
        this._callbackChannelOff(channel);
        break;

//      case DCS_GET_UNKNOWN3D2: //SAFE CRACKER Queries this...
      case DCS_GET_UNKNOWN3D3: //AFM + CONGO need to return something, else soundboard is reset
      this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
      this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
      this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
      this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
      this.readQueue.insert(READ_DATA_IS_AVAILABLE);
      this.readQueue.insert(0x1E);
        break;
/*
      case DCS_GET_MAIN_VERSION:
      case DCS_GET_MINOR_VERSION:
        //TODO UNTESTED
        this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
        this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
        this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
        this.readQueue.insert(READ_NO_DATA_IS_AVAILABLE);
        this.readQueue.insert(READ_DATA_IS_AVAILABLE);
        this.readQueue.insert(0x10);
        break;*/

      default:
        this._callbackPlaySample(sampleId);
        break;
    }
    this.writeQueue.clear();
  }

  _callbackStopAllSamples() {
    console.log('cb STOP');
    this.soundBoardCallback({ command: COMMAND_STOPSOUND });
  }

  _callbackPlaySample(id) {
    console.log('cb SMPLE',id);
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
