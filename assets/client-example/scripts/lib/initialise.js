'use strict';

export { initialiseActions };

function initialiseActions(initObject, webclient) {
  let initPromise = Promise.resolve();
  if (!initObject) {
    return initPromise;
  }

  if (Array.isArray(initObject.closedSwitches)) {
    initObject.closedSwitches.forEach((switchIdToEnable) => {
      console.log('INIT::enable switch', switchIdToEnable);
      if (switchIdToEnable[0] === 'F') {
        webclient.setFliptronicsInput(switchIdToEnable);
      } else {
        webclient.setInput(switchIdToEnable);
      }
    });
  }

  if (Array.isArray(initObject.initialAction)) {
    initObject.initialAction.forEach((initialAction) => {
      initPromise = initPromise
        .then(() => {
          return promiseDelay(initialAction.delayMs);
        })
        .then(() => {
          const source = initialAction.source;
          switch (source) {
            case 'cabinetInput':
              const keyValue = initialAction.value;
              console.log('INIT::action - cabinet key', keyValue);
              return webclient.setCabinetInput(keyValue);

            case 'writeMemory':
              const offset = initialAction.offset;
              const value = initialAction.value;
              console.log('INIT::action - writeMemory', offset, value);
              return wpcInterface.writeMemory(offset, value);

            default:
              console.warn('UNKNOWN_SOURCE', source);
          }
        });
    });
  }
  return initPromise;
}

function promiseDelay(delayMs) {
  if (!delayMs) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  });
}
