// loads and store the state of a specific game
export { loadRam, saveRam };

function convertObjectUint8ArrayToRegularArray(object) {
  for (const [key, value] of Object.entries(object)) {
    if (value instanceof Uint8Array) {
      object[key] = [...value];
    } else if (typeof value === 'object') {
      convertObjectUint8ArrayToRegularArray(value);
    }
  }
}

function saveRam(romName, emuState) {
  // convert all typed array to plain arrays to store
  convertObjectUint8ArrayToRegularArray(emuState);

  globalThis.localStorage.setItem(romName, JSON.stringify(emuState));
  console.log('RAM STATE SAVED', romName);
}

function loadRam(romName) {
  const stateObjectAsString = globalThis.localStorage.getItem(romName);
  if (!stateObjectAsString) {
    console.log('NO RAM STATE FOUND', romName);
    return false;
  }

  const stateObject = JSON.parse(stateObjectAsString);
  console.log('RAM STATE LOADED', romName);
  return stateObject;
}
