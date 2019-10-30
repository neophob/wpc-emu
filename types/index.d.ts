// TypeScript Version: 2.2

export namespace WpcEmuWebWorkerApi {
  /**
   * create new webworker API interface
   * @param optionalWebWorkerInstance Optional worker instance, useful if you use https://github.com/webpack-contrib/worker-loader
   * @returns new WebWorkerApi instance
   */
  function initialiseWebworkerAPI(optionalWebWorkerInstance?: any): WebWorkerApi;

  interface WorkerStatistic {
    averageRTTms: number;
    sentMessages: number;
    failedMessages: number;
  }

  interface WorkerMessage {
    requestId: number;
    message: string;
    parameter?: string;
  }

  interface EmuState {
    // TODO more details
    ram: object;
    memoryPosition: object;
    sound: object;
    wpc: object;
    dmd: object;
  }

  class WebWorkerApi {
    /**
     * initialize emulator
     * @param romData the game rom as { u06: UInt8Array }
     * @param gameEntry from the internal database
     */
    initialiseEmulator(romData: any, gameEntry: any): Promise<WorkerMessage>;

    /**
     * reset the RPC proxy to its initial state. used when a new game is loaded.
     */
    reset(): void;

    /**
     * returns meta data about the connection with the webworker process
     */
    getStatistics(): WorkerStatistic;

    /**
     * reboots the emulator
     */
    resetEmulator(): Promise<WorkerMessage>;

    /**
     * Cabinet key emulation (Coins, ESC, +, -, ENTER)
     * @param value number between 1 and 8
     */
    setCabinetInput(value: number): Promise<WorkerMessage>;

    /**
     * Toggle a switch
     * @param switchNr number between 11 and 99
     */
    setInput(switchNr: number): Promise<WorkerMessage>;

    /**
     * fliptronic flipper move (depends on the machine if this is supported)
     * @param value the switch name, like 'F1', 'F2' .. 'F8'
     */
    setFliptronicsInput(value: string): Promise<WorkerMessage>;

    /**
     * set target framerate of the client
     * @param framerate the new framerate of the emulator
     */
    adjustFramerate(framerate: number): Promise<WorkerMessage>;

    /**
     * set the internal time some seconds before midnight madness time (toggles)
     */
    toggleMidnightMadnessMode(): Promise<WorkerMessage>;

    /**
     * Debugging tool, write to emu ram
     * @param offset of memory, must be between 0..0x3FFF
     * @param value to write to the memory location (uint8)
     */
    writeMemory(offset: number, value: number): Promise<WorkerMessage>;

    /**
     * stop setInterval loop in web worker
     */
    pauseEmulator(): Promise<WorkerMessage>;

    /**
     * resume setInterval loop in web worker
     */
    resumeEmulator(): Promise<WorkerMessage>;

    /**
     * callback to playback audio samples
     * @param callbackFunction function will be called when a sampleId should be played
     */
    registerAudioConsumer(callbackFunction: (sampleId: number) => void): Promise<WorkerMessage>;

    /**
     * register ui callback function
     * @param callbackFunction function will be called when new ui state is available
     */
    registerUiUpdateConsumer(callbackFunction: (uiState: EmuState) => void): Promise<void>;

    /**
     * get the internal state of the emulator, used to save current emulator state
     */
    getEmulatorState(): Promise<EmuState>;

    /**
     * restore a previously saved emulator state
     * @param emuState the new state
     */
    setEmulatorState(emuState: EmuState): Promise<WorkerMessage>;

    /**
     * returns current WPC-Emu version
     */
    getVersion(): Promise<string>;

    /**
     * returns current rom name
     */
    getEmulatorRomName(): Promise<string>;
  }
}
