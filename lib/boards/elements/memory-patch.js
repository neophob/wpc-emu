// class to dynamically patch the RAM/ROM content of a game

module.exports = {
  getInstance,
};

function getInstance() {
  return new MemoryPatch();
}

const MEMORY_LIMIT = 0x4000;

class MemoryPatch {

  constructor() {
    this.patch = new Map();
  }

  addPatch(memoryOffset, value, volatile = false) {
    this.patch.set(memoryOffset, { memoryOffset, value, volatile });
  }

  removePatch(memoryOffset) {
    this.patch.delete(memoryOffset);
  }

  removeVolatileEntries() {
    const entriesToRemove = [ ...this.patch.values() ]
      .filter((entry => entry.volatile));

    entriesToRemove.forEach((entry) => this.patch.delete(entry.memoryOffset));
  }

  // memoryOffset is the unmapped memory address (0x0000 - 0xFFFF)
  hasPatch(memoryOffset) {
    return this.patch.get(memoryOffset);
  }

  applyPatchesToExposedMemory(_ram) {
    const ram = new Uint8Array(_ram);

    this.patch.forEach((object, offset) => {
      if (offset < MEMORY_LIMIT) {
        ram[offset] = object.value;
      }
    });

    return ram;
  }
}
