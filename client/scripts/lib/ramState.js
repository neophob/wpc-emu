'use strict';

// loads and store the state of a specific game
export { loadRam, saveRam };

const RAM_SIZE = 1024 * 8;

function convertObjectUint8ArrayToRegularArray(object) {
  for (let [key, value] of Object.entries(object)) {
    const type = typeof value;

    if (value instanceof Uint8Array) {
      object[key] = Array.from(value);
    } else if (type === 'object') {
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
    return false;
  }
  const stateObject = JSON.parse(stateObjectAsString);
  wpcSystem.cpuBoard.setState(stateObject);
  console.log('RAM STATE LOADED', romName);
  return true;
}

function getRomName(wpcSystem) {
  return wpcSystem.cpuBoard.romFileName;
}