const test = require('ava');
const SoundBoard = require('../../../lib/boards/sound-board');

const WPC_SOUND_DATA = SoundBoard.OP.WPC_SOUND_DATA;
const WPC_SOUND_CONTROL_STATUS = SoundBoard.OP.WPC_SOUND_CONTROL_STATUS;

test.beforeEach((t) => {
  const initObjectPreDcs = {
    interruptCallback: {
      firq: () => {},
    },
    romObject: {
      preDcsSoundboard: true,
    },
  };
  const playbackArray = [];

  const instancePreDcs = SoundBoard.getInstance(initObjectPreDcs);
  instancePreDcs.reset();
  instancePreDcs.registerSoundBoardCallback((msg) => {
    console.log('CALLBACK!', msg);
    playbackArray.push(msg);
  });

  const initObjectDcs = {
    interruptCallback: {
      firq: () => {},
    },
    romObject: {
      preDcsSoundboard: false,
    },
  };
  const instanceDcs = SoundBoard.getInstance(initObjectDcs);
  instanceDcs.reset();
  instanceDcs.registerSoundBoardCallback((msg) => {
    console.log('CALLBACK!', msg);
    playbackArray.push(msg);
  });

  t.context = {
    instancePreDcs,
    instanceDcs,
    playbackArray,
  };
});

test('should validate callback function', (t) => {
  const soundBoard = t.context.instancePreDcs;
  const result = soundBoard.registerSoundBoardCallback(2);
  t.is(result, false);
});

test('should read control status, no data available', (t) => {
  const soundBoard = t.context.instanceDcs;
  const result = soundBoard.readInterface(WPC_SOUND_CONTROL_STATUS);
  t.is(result, 0xFF);
});

test('should read control status, data is available', (t) => {
  const soundBoard = t.context.instanceDcs;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x03);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xD3);
  const result = soundBoard.readInterface(WPC_SOUND_CONTROL_STATUS);
  t.is(result, 0x80);
});

test('should handle multiple writes', (t) => {
  const soundBoard = t.context.instancePreDcs;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xEE);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x22);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x00);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x01);

  const result = soundBoard.readInterface(WPC_SOUND_CONTROL_STATUS);

  t.is(result, 0xFF);
  t.deepEqual(t.context.playbackArray, [
    { command: 'STOPSOUND' },
    { command: 'STOPSOUND' },
    { command: 'PLAYSAMPLE', id: 0xEE },
    { command: 'PLAYSAMPLE', id: 0x22 },
    { command: 'STOPSOUND' },
    { command: 'PLAYSAMPLE', id: 1 }
  ]);
});

test('preDcs: set volume', (t) => {
  const soundBoard = t.context.instancePreDcs;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x79);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x0B);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xF4);
  t.deepEqual(t.context.playbackArray, [
    { command: 'MAINVOLUME', value: 11 },
  ]);
});

test('DCS: set volume', (t) => {
  const soundBoard = t.context.instanceDcs;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x55);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xAA);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0xB7);
  soundBoard.writeInterface(WPC_SOUND_DATA, 0x48);
  t.deepEqual(t.context.playbackArray, [
    { command: 'MAINVOLUME', value: 22 },
  ]);
});

test('DCS: ignore first 0 byte after alot of sound board resets', (t) => {
  const soundBoard = t.context.instanceDcs;
  soundBoard.resetCount = 22;
  soundBoard.writeInterface(WPC_SOUND_DATA, 0);
  soundBoard.writeInterface(WPC_SOUND_DATA, 22);
  const actualState = soundBoard.getState();
  t.deepEqual(actualState, {
    volume: 8,
    readDataBytes: 0,
    writeDataBytes: 1,
    readControlBytes: 0,
    writeControlBytes: 0,
  });
});

test('DCS: set and get state', (t) => {
  const soundBoard = t.context.instanceDcs;
  const state = {
    volume: 44,
    readDataBytes: 55,
    writeDataBytes: 66,
    readControlBytes: 77,
    writeControlBytes: 88,
  };

  soundBoard.setState(state);
  const actualState = soundBoard.getState();
  t.deepEqual(actualState, state);
});

test('DCS: empty setState', (t) => {
  const soundBoard = t.context.instanceDcs;
  const result = soundBoard.setState();
  t.is(result, false);
});
