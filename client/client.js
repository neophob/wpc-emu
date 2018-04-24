'use strict';

// HINT enable debug in the browser by entering "localStorage.debug = '*'" in the browser
console.log('hello');

var intervalId;

function runWpsMainloop(wpcSystem) {
  intervalId = setInterval(() => {
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();

    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
    wpcSystem.executeCycle();
  }, 0);
}

// NOTE: fetch works only in the browser, see https://github.com/matthew-andrews/isomorphic-fetch
function downloadFileFromUrlAsUInt8Array(url) {
  return fetch(url)
  	.then((response) => {
  		if (response.status >= 400) {
  			throw new Error('INVALID_STATUSCODE_' + response.status);
  		}
      console.log('typeof ',  response.body);
      return response.arrayBuffer();
    })
    .then((buffer) => {
      return new Uint8Array(buffer);
  	});
}

function stopEmu() {
  clearInterval(intervalId);
  intervalId = false;
  console.log('emu stopped');
}

// HINT: make sure CORS is correct
downloadFileFromUrlAsUInt8Array('https://s3-eu-west-1.amazonaws.com/foo-temp/hurcnl_2.rom')
  .then((rom) => {
    return WpcEmu.initVMwithRom(rom, 'foo');
  })
  .then((wpcSystem) => {
    console.log('WPC System initialised');
    wpcSystem.start();
    runWpsMainloop(wpcSystem);
  })
  .catch((error) => {
    stopEmu();
    console.log('EXCEPTION!', error.message);
    console.log(error.stack);
  });
