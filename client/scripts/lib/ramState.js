'use strict';

// loads and store the state of a specific game
export { loadRam, saveRam };

function convertObjectUint8ArrayToRegularArray(object) {
  for (const [key, value] of Object.entries(object)) {
    if (value instanceof Uint8Array) {
      object[key] = Array.from(value);
    } else if (typeof value === 'object') {
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
  //TODO MOVE to interface
  wpcSystem.cpuBoard.setState(stateObject);
  console.log('RAM STATE LOADED', romName);
  return true;
}

function getRomName(wpcSystem) {
  //TODO MOVE to interface
  return wpcSystem.cpuBoard.romFileName;
}
