// TypeScript Version: 2.2

export namespace GamelistDB {
  interface GameEntryRomName {
    u06: string;
  }

  interface GameEntryMemoryPositions {
    /**
     * example: { dataStartOffset: 0x1C61, dataEndOffset: 0x1C80, checksumOffset: 0x1C81, checksum: '16bit', name: 'HI_SCORE' },
     */
    checksum: object[];
    /**
     * example: { offset: 0x86, name: 'GAME_RUNNING', description: '0: not running, 1: running', type: 'uint8' },
     */
    knownValues: object[];
  }

  interface IdNameMap {
    id: number;
    name: string;
  }

  interface AudioData {
    url: string;
    sample: object;
    sprite: object;
  }

  interface GameEntryPinmame {
    /**
     * known game rom names
     */
    knownNames: string[];
    /**
     * game name defined by pinmame
     */
    gameName: string;
    /**
     * pinmame game id
     */
    id: string;
    /**
     * if VPDB.io id differs from pinmame id, its defined here
     */
    vpdbId?: string;
  }

  interface ClientGameEntry {
    /**
     * name if this WPC game
     */
    name: string;
    /**
     * Game version (Like L-8)
     */
    version: string;
    /**
     * data from pinmame
     */
    pinmame: GameEntryPinmame;
    /**
     * rom file names, currently only u06 - the main ROM is included
     */
    rom: GameEntryRomName;
    /**
     * number to name mapping of the switches
     */
    switchMapping: IdNameMap[];
    /**
     * optional fliptronics number to name mapping
     */
    fliptronicsMapping?: IdNameMap[];
    /**
     * Should the Williams ROM boot time be increased, skip ROM check?
     */
    skipWpcRomCheck?: boolean;
    /**
     * features of this pinball machine: 'securityPic', 'wpc95', 'wpcAlphanumeric', 'wpcDmd', 'wpcFliptronics', 'wpcSecure', 'wpcDcs'
     */
    features?: string[];
    /**
     * defines memory positions of this game to evaluate game state (like current ball, current player etc)
     */
    memoryPosition?: GameEntryMemoryPositions;
    /**
     * audio definition for this game
     */
    audio?: AudioData;
    /**
     * playfield information, mainly used for playfield.dev
     */
    playfield?: any;
    /**
     * actions that should be done when starting, like close cabinet input, mainly used for playfield.dev
     */
    initialise?: any;
  }

  interface RomData {
    u06: Uint8Array;
  }

  interface GameEntry {
    name: string;
    rom: GameEntryRomName;
    /**
     * ROM filename
     */
    fileName?: string;
    skipWpcRomCheck?: boolean;
    /**
     * features of this pinball machine: 'securityPic', 'wpc95', 'wpcAlphanumeric', 'wpcDmd', 'wpcFliptronics', 'wpcSecure', 'wpcDcs'
     */
    features?: string[];
    memoryPosition?: GameEntryMemoryPositions;
  }

  /**
   * get all supported game names
   */
  function getAllNames(): string[];

  /**
   * load metadata for a specific game name like "WPC-Fliptronics: Fish Tales"
   * @param name case sensitive game name
   */
  function getByName(name: string): ClientGameEntry;

  /**
   * load metadata for a specific game by its pinmame name, like "tz_94h"
   * @param filename case insensitive filename
   */
  function getByPinmameName(filename: string): ClientGameEntry | undefined;
}

export namespace WpcEmuApi {
  // TODO add types
  class Emulator {
    /**
     * Start the Emulator - reset the CPU
     */
    start(): void;

    /**
     * Returns the current ui state of the emu used to render EMU State.
     * NOTE: compared to the getState function call, getUiState delivers only an element if the content changed.
     * @param includeExpensiveData if set to false, expensive/large state objects (RAM, VideoRAM) are excluded, default is to include this kind of data
     */
    getUiState(includeExpensiveData?: boolean): WpcEmuWebWorkerApi.EmuState;

    /**
     * Get (raw) state of the EMU - main use case is to restore this state at a later time
     */
    getState(): WpcEmuWebWorkerApi.EmuState;

    /**
     * Restore a saved state
     */
    setState(stateObject: WpcEmuWebWorkerApi.EmuState): void;

    /**
     * Callback to playback audio samples
     */
    registerAudioConsumer(callbackFunction: (sampleId: number) => void): void;

    /**
     * Run the system for a particular amount of ticks
     * @param ticksToRun how many ticks should the CPU run, 2'000'000 ticks means one seconds
     * @param tickSteps how many cycles the cpu should run before other systems should be updated? see BENCHMARK.md for more details
     * @returns executed ticks
     */
    executeCycle(ticksToRun: number, tickSteps: number): number;

    /**
     * Run the system for a particular amount of time
     * @param advanceByMs how many ms should the CPU run, 1000 ticks means one seconds
     * @param tickSteps how many cycles the cpu should run before other systems should be updated? see BENCHMARK.md for more details
     * @returns executed ticks
     */
    executeCycleForTime(advanceByMs: number, tickSteps: number): number;

    /**
     * Cabinet key emulation (Coins, ESC, +, -, ENTER)
     * @param value number between 1 and 8
     */
    setCabinetInput(value: number): void;

    /**
     * Toggle a switch
     * @param switchNr number between 11 and 99
     */
    setInput(switchNr: number): void;

    /**
     * Fliptronic flipper move (depends on the machine if this is supported)
     * @param value the switch name, like 'F1', 'F2' .. 'F8'
     */
    setFliptronicsInput(value: string): void;

    /**
     * Set the internal time some seconds before midnight madness time (toggles)
     */
    toggleMidnightMadnessMode(): void;

    /**
     * Reset the emulator
     */
    reset(): void;

    /**
     * Returns current WPC-Emu version
     */
    version(): string;
  }

  /**
   * initialize emulator
   * @param romData the game rom as { u06: UInt8Array }
   * @param gameEntry game metadata from the internal database
   */
  function initVMwithRom(romData: GamelistDB.RomData, gameEntry: GamelistDB.GameEntry): Promise<Emulator>;
  function getVersion(): string;
}

export namespace WpcEmuWebWorkerApi {
  /**
   * create new webworker API interface
   * @param optionalWebWorkerInstance Optional worker instance, useful if you use https://github.com/webpack-contrib/worker-loader
   * @returns new WebWorkerApi instance
   */
  function initializeWebworkerAPI(optionalWebWorkerInstance?: any): WebWorkerApi;

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

  interface EmuStateWpc {
    diagnosticLed: number;
    /**
     * the output lamp state
     */
    lampState?: Uint8Array;
    solenoidState?: Uint8Array;
    /**
     * Contains 8 bytes of the GI lamps
     */
    generalIlluminationState: Uint8Array;
    /**
     * the switch state
     */
    inputState?: Uint8Array;
    diagnosticLedToggleCount: number;
    midnightModeEnabled: boolean;
    irqEnabled: boolean;
    activeRomBank: number;
    time: string;
    blankSignalHigh: boolean;
    watchdogExpiredCounter: number;
    watchdogTicks: number;
    zeroCrossFlag: number;
    inputSwitchMatrixActiveColumn: Uint8Array;
    lampRow: number;
    lampColumn: number;
    wpcSecureScrambler: number;
  }

  interface EmuStateSound {
    volume: number;
    readDataBytes: number;
    writeDataBytes: number;
    readControlBytes: number;
    writeControlBytes: number;
  }

  interface EmuStateDMD {
    scanline: number;
    dmdPageMapping: number[];
    activepage?: number;
    videoRam?: Uint8Array;
    dmdShadedBuffer?: Uint8Array;
    videoOutputBuffer?: Uint8Array;
    nextActivePage?: number;
    requestFIRQ?: boolean;
    ticksUpdateDmd?: number;
  }

  interface EmuStateAsic {
    ram?: Uint8Array;
    memoryPosition?: object[];
    sound: EmuStateSound;
    wpc: EmuStateWpc;
    dmd: EmuStateDMD;
  }

  interface EmuStateCpu {
    /**
     * Current PC register state
     */
    regPC: number;
    regS: number;
    regU: number;
    regA: number;
    regB: number;
    /**
     * how many FIRQ calls were executed
     */
    firqCount: number;
    /**
     * how many IRQ calls were executed
     */
    irqCount: number;
    /**
     * how man FIRQ calls were missed (due flag state?)
     */
    missedFIRQ: number;
    /**
     * how man IRQ calls were missed (due flag state?)
     */
    missedIRQ: number;
    /**
     * how many NMI calls were made
     * NOTE: should be 0 as NMI functions are not implemented!
     */
    nmiCount: number;
    regCC: number;
    regDP: number;
    regX: number;
    regY: number;
    /**
     * how many ticks were processed
     */
    tickCount: number;
    }

  interface EmuState {
    asic: EmuStateAsic;
    cpuState: EmuStateCpu;
    /**
     * Average ops per ms
     * TODO should be renamed to averageTickerPerMs
     */
    opsMs: number;
    /**
     * how many times a RAM write was refused because it was protected
     */
    protectedMemoryWriteAttempts: number;
    /**
     * Absolute emulator runtime in ms
     */
    runtime: number;
    /**
     * how many ticks are left until the next IRQ will be executed
     */
    ticksIrq: number;
    /**
     * internal version number of the data
     */
    version: number;
  }

  class WebWorkerApi {
    /**
     * initialize emulator
     * @param romData the game rom as { u06: UInt8Array }
     * @param gameEntry game metadata from the internal database
     */
    initializeEmulator(romData: GamelistDB.RomData, gameEntry: GamelistDB.GameEntry): Promise<WorkerMessage>;

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
     * Set or toggle a switch
     * @param switchNr number between 11 and 99
     * @param optionalValue if undefined, switch will toggle, else set to the defined state
     */
    setSwitchInput(switchNr: number, optionalValue: boolean): Promise<WorkerMessage>;

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
     * Run the system for a particular amount of time
     * @param advanceByMs how many ms should the CPU run, 1000 ticks means one seconds
     * @param tickSteps how many cycles the cpu should run before other systems should be updated? see BENCHMARK.md for more details
     * @returns executed ticks
     */
    emuStepByTime(advanceByMs: number, ticksStep: number): number;

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

  namespace WebWorker {
    class WpcEmu {
      /**
       * configure new framerate for the setInterval calls
       */
      configureFramerate(frameRate: number): void;

      /**
       * returns the current ui state of the emu.
       * NOTE: compared to the getEmulatorState function call, getUiState delivers only an element if the content changed.
       */
      getUiState(): EmuState;

      /**
       * callback to playback audio samples
       * @param callbackFunction function will be called when a sampleId should be played
       */
      registerAudioConsumer(callbackFunction: (sampleId: number) => void): void;

      /**
       * reset the emulator
       */
      reset(): void;

      /**
       * Cabinet key emulation (Coins, ESC, +, -, ENTER)
       * @param value number between 1 and 8
       */
      setCabinetInput(value: number): void;

      /**
       * Toggle or set a switch
       * @param switchNr number between 11 and 99
       * @param optionalValue if undefined, switch will toggle, else set to the defined state
       */
      setSwitchInput(switchNr: number, optionalValue: boolean): void;

      /**
       * fliptronic flipper move (depends on the machine if this is supported)
       * @param value the switch name, like 'F1', 'F2' .. 'F8'
       */
      setFliptronicsInput(value: string): void;

      /**
       * set the internal time some seconds before midnight madness time (toggles)
       */
      toggleMidnightMadnessMode(): void;

      /**
       * returns current WPC-Emu version
       */
      getVersion(): string;

      /**
       * returns current rom name
       */
      getEmulatorRomName(): string;

      /**
       * get the internal state of the emulator, used to save current emulator state
       */
      getEmulatorState(): EmuState;

      /**
       * restore a previously saved emulator state
       * @param emuState the new state
       */
      setEmulatorState(emuState: EmuState): void;

      /**
       * start the emulator (Reset CPU Board, TODO should go awa)
       */
      start(): void;

      /**
       * clear setInterval loop in web worker
       */
      stop(): void;

      /**
       * stop setInterval loop in web worker, if emulator is already paused, next step will be executed
       */
      pause(): void;

      /**
       * resume setInterval loop in web worker
       */
      resume(): void;

      /**
       * Debugging tool, write to emu ram
       * @param offset of memory, must be between 0..0x3FFF
       * @param value to write to the memory location (uint8)
       */
      writeMemory(offset: number, value: number): void;

      /**
       * if you don't want to use the setInterval function (pause/resume) because there is already
       * a loop running, use this function to run the emulator for N ms.
       */
      emuStepByTime(advanceByMs: number): void;
    }

    /**
     * pass RPC messages from WpcEmuWebWorkerApi to the real implementaion
     * @param event message revieved from the WpcEmuWebWorkerApi
     * @param postMessage webworked postMessage function
     */
    function handleMessage(event: any, postMessage: any): void;

    /**
     * returns the current emu instance, so the emu can be used within a worker thread.
     * Note: the emu might not be initialized yet - so consumer must make sure emu is defined
     */
    function getEmu(): WpcEmu;

    /**
     * clears the state of webworker
     */
    function clearState(): void;
  }
}
