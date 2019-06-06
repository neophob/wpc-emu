'use strict';

export { initialiseWebworker };


function initialiseWebworker() {
  return new WebWorkerApi();
}

class WebWorkerApi {

  constructor() {
    if (!window.Worker) {
      throw new Error('NO_WEBWORKER_SUPPORT');
    }

    this.id = 100;
    this.worker = new Worker('./webworker.js');
    this.worker.onmessage = (message) => {
      this._messageFromWorker(message);
    };
  }

  _getId() {
    return this.id++;
  }

  _messageFromWorker(message) {
    const message = JSON.stringify(e.data);
    console.log(`[From Worker]: ${message}`);
  }

  initialiseEmulator(romData, gameEntry) {

  }
}
