'use strict';

import test from 'ava';
import romParser from '../../../lib/rom/index';

test('romParser should reject empty rom', (t) => {
  return romParser
    .parse()
    .catch((error) => {
      t.is(error.message, 'INVALID_ROM_DATA');
    });
});

test('romParser should reject invalid data', (t) => {
  const romData = {
    u06: new Uint8Array(7),
  };
  return romParser
    .parse(romData)
    .catch((error) => {
      t.is(error.message, 'INVALID_ROM_SIZE');
    });
});

test('romParser should parse game rom', (t) => {
  const romData = buildRomData();
  return romParser
    .parse(romData)
    .then((result) => {
      t.is(result.gameRom[0x000000], 11);
      t.is(result.fileName, 'Unknown');
      t.is(result.romSizeMBit, 2);
      t.is(result.skipWmcRomCheck, false);
      t.is(result.hasSecurityPic, false);
      t.is(result.preDcsSoundboard, false);
    });
});

test('romParser should parse wpc95 board', (t) => {
  const romData = buildRomData();
  const metaData = {
    features: [ 'wpc95', 'securityPic' ],
  }
  return romParser
    .parse(romData, metaData)
    .then((result) => {
      t.is(result.preDcsSoundboard, false);
      t.is(result.hasSecurityPic, true);
    });
});

test('romParser should parse wpcDmd board', (t) => {
  const romData = buildRomData();
  const metaData = {
    features: [ 'wpcDmd' ],
  }
  return romParser
    .parse(romData, metaData)
    .then((result) => {
      t.is(result.preDcsSoundboard, true);
      t.is(result.hasSecurityPic, false);
    });
});

test('romParser should parse wpcFliptronics board', (t) => {
  const romData = buildRomData();
  const metaData = {
    features: [ 'wpcFliptronics' ],
  }
  return romParser
    .parse(romData, metaData)
    .then((result) => {
      t.is(result.preDcsSoundboard, true);
      t.is(result.hasSecurityPic, false);
    });
});


function buildRomData() {
  const u06 = new Uint8Array(256 * 1024).fill(11);
  return {
    u06,
  }
}