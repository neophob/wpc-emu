// TypeScript Version: 2.2
declare namespace WPCEmuWebworkerApi {
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
  interface WebworkerApi {
    // TODO define romData and gameEntry!
    initialiseEmulator(romData: any, gameEntry: any): Promise<WorkerMessage>;
    reset(): void;
    getStatistics(): WorkerStatistic;
    resetEmulator(): Promise<WorkerMessage>;
    setCabinetInput(value: number): Promise<WorkerMessage>;
    setInput(value: number): Promise<WorkerMessage>;
    setFliptronicsInput(value: string): Promise<WorkerMessage>;
    adjustFramerate(framerate: number): Promise<WorkerMessage>;
    toggleMidnightMadnessMode(): Promise<WorkerMessage>;
    writeMemory(offset: number, value: number): Promise<WorkerMessage>;
    pauseEmulator(): Promise<WorkerMessage>;
    resumeEmulator(): Promise<WorkerMessage>;
    registerAudioConsumer(callbackFunction: (sampleId: number) => void): Promise<WorkerMessage>;
    registerUiUpdateConsumer(callbackFunction: (uiState: EmuState) => void): Promise<void>;
    getEmulatorState(): Promise<EmuState>;
    setEmulatorState(emuState: EmuState): Promise<WorkerMessage>;
    getVersion(): Promise<string>;
    getEmulatorRomName(): Promise<string>;
  }

  function initialiseWebworkerAPI(optionalWebWorkerInstance: any): WebworkerApi;
}
