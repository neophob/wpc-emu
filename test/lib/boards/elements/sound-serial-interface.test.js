'use strict';

import test from 'ava';
import SoundSerialInterface from '../../../../lib/boards/elements/sound-serial-interface';

const PREDCS_SOUND = true;
const DCS_SOUND = false;

const PREDCS_VOLUME_COMMAND = 0x79;
const PREDCS_EXTENDED_COMMAND = 0x7A;
const DCS_VOLUME_COMMAND = 0x55;
const DCS_VOLUME_GLOBAL = 0xAA;

test.beforeEach((t) => {
  const preDcsData = [];
  const dcsData = [];
  const preDcsSound = SoundSerialInterface.getInstance(PREDCS_SOUND);
  const dcsSound = SoundSerialInterface.getInstance(DCS_SOUND);

  preDcsSound.reset();
  dcsSound.reset();

  preDcsSound.registerCallBack((data) => {
    preDcsData.push(data);
  });
  dcsSound.registerCallBack((data) => {
    dcsData.push(data);
  });

  t.context = {
    preDcsSound,
    dcsSound,
    preDcsData,
    dcsData,
  };
});

test('SoundSerialInterface preDCS, no control data available', (t) => {
  const readControl = t.context.preDcsSound.readControl();
  t.deepEqual(readControl, 0x00);
});

test('SoundSerialInterface preDCS, should read data', (t) => {
  const readControl = t.context.preDcsSound.readData();
  t.deepEqual(readControl, 0xFF);
});

test('SoundSerialInterface preDCS, should process volume command', (t) => {
  const preDcsSound = t.context.preDcsSound;
  preDcsSound.writeData(PREDCS_VOLUME_COMMAND);
  preDcsSound.writeData(0x1F);
  preDcsSound.writeData(0xE0);
  t.deepEqual(t.context.preDcsData, [{ command: 'MAINVOLUME', value: 31 }]);
});

test('SoundSerialInterface preDCS, should play sample 1', (t) => {
  const preDcsSound = t.context.preDcsSound;
  preDcsSound.writeData(1);
  t.deepEqual(t.context.preDcsData, [{ command: 'PLAYSAMPLE', id: 1 }]);
});

test('SoundSerialInterface preDCS, should stop all samples', (t) => {
  const preDcsSound = t.context.preDcsSound;
  preDcsSound.writeData(0);
  t.deepEqual(t.context.preDcsData, [{ command: 'STOPSOUND' }]);
});

test('SoundSerialInterface preDCS, should play extended sample', (t) => {
  const preDcsSound = t.context.preDcsSound;
  preDcsSound.writeData(PREDCS_EXTENDED_COMMAND);
  preDcsSound.writeData(1);
  t.deepEqual(t.context.preDcsData, [{ command: 'PLAYSAMPLE', id: 31233 }]);
});

test('SoundSerialInterface DCS, write volume', (t) => {
  const dcsSound = t.context.dcsSound;
  dcsSound.writeData(DCS_VOLUME_COMMAND);
  dcsSound.writeData(DCS_VOLUME_GLOBAL);
  dcsSound.writeData(0xFF);
  dcsSound.writeData(0x00);
  t.deepEqual(t.context.dcsData, [{ command: 'MAINVOLUME', value: 31 }]);
});

test('SoundSerialInterface DCS, play sample', (t) => {
  const dcsSound = t.context.dcsSound;
  dcsSound.writeData(0x88);
  dcsSound.writeData(0x77);
  t.deepEqual(t.context.dcsData, [{ command: 'PLAYSAMPLE', id: 0x8877 }]);
});
