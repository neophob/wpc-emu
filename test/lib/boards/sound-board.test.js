'use strict';

import test from 'ava';
import SoundBoard from '../../../lib/boards/sound-board';

const WPC_SOUND_DATA = 0x3FDC;

test.beforeEach((t) => {
  const initObject = {
    interruptCallback: {
      firq: () => {},
    },
    romObject: {
      preDcsSoundboard: true
    },
  };
  const playbackArray = [];
  const instance = SoundBoard.getInstance(initObject);
  instance.reset();

  instance.registerSoundBoardCallback((msg) => {
    console.log('CALLBACK!', msg)
    playbackArray.push(msg);
  })
  t.context = {
    instance,
    playbackArray,
  };
});

test('should validate callback function', (t) => {
  const soundBoard = t.context.instance;
  const result = soundBoard.registerSoundBoardCallback(2);
  t.is(result, false);
});

test('should handle multiple writes', (t) => {
  const soundBoard = t.context.instance;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xEE);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x22);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x00);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x01);
  console.log('t.context.playbackArray',t.context.playbackArray)
  t.deepEqual(t.context.playbackArray, [
    { command: 'PLAYSAMPLE', id: 0x0 },
    { command: 'PLAYSAMPLE', id: 0xEE22 },
    { command: 'PLAYSAMPLE', id: 0x1 },
  ]);
});
