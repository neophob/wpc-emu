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
    this.patch = new Map();
  }

  addPatch(memoryOffset, value) {
    this.patch.set(memoryOffset, { memoryOffset, value });
  }

  // memoryOffset is the unmapped memory address (0x0000 - 0xFFFF)
  hasPatch(memoryOffset) {
    return this.patch.get(memoryOffset);
  }
}
