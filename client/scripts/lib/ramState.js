'use strict';

// loads and store the state of a specific game
export { loadRam, saveRam };

const RAM_SIZE = 1024 * 8;

function convertObjectUint8ArrayToRegularArray(object) {
  for (let [key, value] of Object.entries(object)) {
    const type = typeof value;
    console.log('->', type, value instanceof Uint8Array, key, value);

    if (value instanceof Uint8Array) {
      object[key] = Array.from(value);
    } else
    if (type === 'object') {
      convertObjectUint8ArrayToRegularArray(value);
    }
  }
}

function saveRam(wpcSystem) {
  const romName = getRomName(wpcSystem);
  const stateObject = wpcSystem.cpuBoard.getState();
  //convert all typed array to plain arrays to store
  convertObjectUint8ArrayToRegularArray(stateObject);

  window.localStorage.setItem(romName, JSON.stringify(stateObject));
  console.log('RAM STATE SAVED', romName);
}

function loadRam(wpcSystem) {
  const romName = getRomName(wpcSystem);
  const stateObjectAsString = window.localStorage.getItem(romName);
  if (!stateObjectAsString) {
    console.log('NO RAM STATE FOUND', romName);
    return;
  }
  const stateObject = JSON.parse(stateObjectAsString);

  for (let [key, value] of Object.entries(stateObject)) {
    console.log('<-', typeof value, key, value);
}

  wpcSystem.cpuBoard.setState(stateObject);
  console.log('RAM STATE LOADED', romName);
}

function getRomName(wpcSystem) {
  return wpcSystem.cpuBoard.romFileName;
}