import test from 'ava';

import Webworker from '../../../lib/webclient/webworker';
import MESSAGE from '../../../lib/webclient/messaging/message';

const gameEntry = {
  rom: {
    u06: 'filename',
  },
};
let answer;

function postMessage(_answer) {
  answer = _answer;
}

test.beforeEach(() => {
  answer = undefined;
  Webworker.clearState();
});

test.serial('Webworker: chokes when no postMessage is defined', (t) => {
  try {
    Webworker.handleMessage();
  } catch (error) {
    t.is(error.message, 'POSTMESSAGE_FUNCTION_UNDEFINED');
  }
});

test.serial('Webworker: ignore invalid parameters', (t) => {
  Webworker.handleMessage(undefined, postMessage);
  t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ERROR, parameter: 'INVALID_PARAMETER_SIZE' });
});

function initializeWebWorker(size = 1) {
  const romData = {
    u06: new Uint8Array(size),
  };
  const event = {
    data: [1, MESSAGE.initializeEmulator, {romData, gameEntry}],
  };
  return Webworker.handleMessage(event, postMessage);
}

test.serial('Webworker: should initialize EMU', (t) => {
  return initializeWebWorker(128 * 1024)
    .then(() => {
      t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ACK, requestId: 1 });
      const emu = Webworker.getEmu();
      t.is(emu.getEmulatorRomName(), gameEntry.rom.u06);
    });
});

test.serial('Webworker: should fail to initialize EMU', (t) => {
  return initializeWebWorker()
    .then(() => {
      t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ERROR, parameter: 'INVALID_ROM_SIZE' });
    });
});

test.serial('Webworker: should detect an uninitialized emu', (t) => {
  const event = {
    data: [1, MESSAGE.setSwitchInput, 4],
  };
  Webworker.handleMessage(event, postMessage);
  t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ERROR, requestId: 1, parameter: 'EMU_NOT_INITIALIZED' });
});

test.serial('Webworker: should send setSwitchInput toggle', (t) => {
  const event = {
    data: [1, MESSAGE.setSwitchInput, 4],
  };
  return initializeWebWorker(128 * 1024)
    .then(() => {
      Webworker.handleMessage(event, postMessage);
      t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ACK, requestId: 1 });
    });
});

test.serial('Webworker: should send setSwitchInput set', (t) => {
  const event = {
    data: [1, MESSAGE.setSwitchInput, 4, true],
  };
  return initializeWebWorker(128 * 1024)
    .then(() => {
      Webworker.handleMessage(event, postMessage);
      t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ACK, requestId: 1 });
    });
});

test.serial('Webworker: should fail to send writeMemory', (t) => {
  const event = {
    data: [1, MESSAGE.writeMemory, 4],
  };
  return initializeWebWorker(128 * 1024)
    .then(() => {
      Webworker.handleMessage(event, postMessage);
      t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ERROR, requestId: 1, parameter: 'MISSING_PARAMETER' });
    });
});

test.serial('Webworker: should send writeMemory', (t) => {
  const event = {
    data: [1, MESSAGE.writeMemory, 4, 5],
  };
  return initializeWebWorker(128 * 1024)
    .then(() => {
      Webworker.handleMessage(event, postMessage);
      t.deepEqual(answer, { message: MESSAGE.MSG_TYPE_ACK, requestId: 1 });
    });
});
