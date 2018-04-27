'use strict';

module.exports = {
  calc,
};

function calc(planedata) {
  if (!Array.isArray(planedata) || planedata.length < 2) {
    return [];
  }
  const plane = {
    '1': 0,
    '2': 0,
    '3': 0,
  };
  const startTs = planedata[0].ts;
  const endTs = planedata[planedata.length - 1].ts;
  const totalTimeInv = 1 / (endTs - startTs);

  for (var i = 0, len = planedata.length - 1; i < len; i++) {
    const currentEntry = planedata[i];
    const nextEntry = planedata[i + 1];
    const timeNeeded = totalTimeInv * (nextEntry.ts - currentEntry.ts);
    plane[currentEntry.plane] += timeNeeded;
  }
  return { 1: plane['1'], 2: plane['2'] };
}
