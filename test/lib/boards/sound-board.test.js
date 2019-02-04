'use strict';

import test from 'ava';
import SoundBoard from '../../../lib/boards/sound-board';

const WPC_SOUND_DATA = 0x3FDC;

test.beforeEach((t) => {
  const initObject = {
    interruptCallback: {
      firq: () => {},
    },
  };
  const playbackArray = [];
  const instance = SoundBoard.getInstance(initObject);
  instance.reset();

  instance.registerSoundBoardPlayIdCallback((id) => {
    console.log('CALLBACK!',id)
    playbackArray.push(id);
  })
  t.context = {
    instance,
    playbackArray,
  };
});

test('should validate callback function', (t) => {
  const soundBoard = t.context.instance;
  const result = soundBoard.registerSoundBoardPlayIdCallback(2);
  t.is(result, false);
});

test('should ignore zero bytes after reset', (t) => {
  const soundBoard = t.context.instance;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xEE);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x22);
  t.deepEqual(soundBoard.resetZeroByteHandled, true);
  t.deepEqual(t.context.playbackArray, [ 0xEE22 ]);
});

test('should handle multiple writes', (t) => {
  const soundBoard = t.context.instance;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xEE);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x22);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x00);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x01);
  t.deepEqual(t.context.playbackArray, [ 0xEE22, 0x1 ]);
});
