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
          if (source === 'cabinetInput') {
            const keyValue = initialAction.value;
            console.log('INIT::action - cabinet key', keyValue);
            webclient.setCabinetInput(keyValue);
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
