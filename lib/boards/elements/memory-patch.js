'use strict';

// class to dynamically patch the RAM/ROM content of a game

module.exports = {
  getInstance,
};

function getInstance() {
  return new MemoryPatch();
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

  // memoryOffset is the unmapped memory address (0x0000 - 0xFFFF)
  hasPatch(memoryOffset) {
    return this.patch
      .find((patchEntry) => {
        return patchEntry.memoryOffset === memoryOffset;
      });
  }
}
