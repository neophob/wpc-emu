'use strict';

import test from 'ava';
import validatePatch from '../../../lib/rom/validate-patch';

test('validatePatch: returns undefined when no patch is available', (t) => {
  const result = validatePatch.run();
  t.is(result, undefined);
});

test('validatePatch: should patch valid rom', (t) => {
  const patchArray = [{                  // patch game on the fly
    offset: 1,
    expected: 33,
    replace: 22,
  }];
  const u6Rom = new Uint8Array(2);
  u6Rom[1] = 33;
  const result = validatePatch.run(patchArray, u6Rom);
  t.deepEqual(result, patchArray);
});

test('validatePatch: should ignore invalid rom', (t) => {
  const patchArray = [{                  // patch game on the fly
    offset: 1,
    expected: 33,
    replace: 22,
  }];
  const u6Rom = new Uint8Array(2);
  u6Rom[1] = 1;
  const result = validatePatch.run(patchArray, u6Rom);
  console.log('u6Rom',u6Rom)
  console.log('res',result)
  t.deepEqual(result, []);
});

test('validatePatch: should filter out invalid entry', (t) => {
  const patchArray = [
    {
      offset: 1,
      expected: 33,
      replace: 22,
    },
    {
      offset: 1,
      expected: 33,
      replace: 'x',
    },
  ];
  const u6Rom = new Uint8Array(2);
  u6Rom[1] = 33;
  const result = validatePatch.run(patchArray, u6Rom);
  t.deepEqual(result, [ patchArray[0] ]);
});
