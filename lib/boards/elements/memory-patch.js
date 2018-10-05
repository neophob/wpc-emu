'use strict';

module.exports = {
  getInstance,
};

const MM_GAMEID_LO = 20;
const MM_GAMEID_HI = 99;

function getInstance(gameIdMemoryPosition) {
  const memoryPatch = new MemoryPatch();
  if (gameIdMemoryPosition) {
    memoryPatch.addPatch(gameIdMemoryPosition, MM_GAMEID_LO);
    memoryPatch.addPatch(gameIdMemoryPosition + 1, MM_GAMEID_HI);
  }
  return memoryPatch;
}


class MemoryPatch {
  constructor() {
    this.patch = [];
  }

  addPatch(memoryOffset, value) {
    this.patch.push({
      memoryOffset,
      value,
    });
  }

  hasPatch(memoryOffset) {
    console.log('this.patch',this.patch);
    return this.patch
      .find((patchEntry) => {
        return patchEntry.memoryOffset === memoryOffset;
      });
  }
}
