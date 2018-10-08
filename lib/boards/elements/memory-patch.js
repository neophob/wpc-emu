'use strict';

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

  hasPatch(memoryOffset) {
    return this.patch
      .find((patchEntry) => {
        return patchEntry.memoryOffset === memoryOffset;
      });
  }
}
