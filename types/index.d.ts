// TypeScript Version: 2.2

export namespace gamelist {
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

  /**
   * get all supported game names
   */
  function getAllNames(): string[];

  /**
   * load metadata for a specific game
   * @param name case sensitive game name
   */
  function getByName(name: string): ClientGameEntry;
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
    lampState?: Uint8Array;
    solenoidState?: Uint8Array;
    generalIlluminationState: Uint8Array;
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

  interface EmuState {
    ram: Uint8Array;
    memoryPosition?: object[];
    sound: EmuStateSound;
    wpc: EmuStateWpc;
    dmd: EmuStateDMD;
  }

  interface RomData {
    u06: Uint8Array;
  }

  interface GameEntry {
    name: string;
    rom: gamelist.GameEntryRomName;
    /**
     * ROM filename
     */
    fileName?: string;
    skipWpcRomCheck?: boolean;
    /**
     * features of this pinball machine: 'securityPic', 'wpc95', 'wpcAlphanumeric', 'wpcDmd', 'wpcFliptronics', 'wpcSecure', 'wpcDcs'
     */
    features?: string[];
    memoryPosition?: gamelist.GameEntryMemoryPositions;
  }

  class WebWorkerApi {
    /**
     * initialize emulator
     * @param romData the game rom as { u06: UInt8Array }
     * @param gameEntry game metadata from the internal database
     */
    initializeEmulator(romData: RomData, gameEntry: GameEntry): Promise<WorkerMessage>;

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
