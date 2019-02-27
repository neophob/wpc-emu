#define MINIMAL_ZEROCROSS_TICK_DIFF 160
#define ZEROCROSS_TICKS_PER_SECOND 100

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristicPowerstate = NULL;
BLECharacteristic* pCharacteristicWpcState = NULL;
BLECharacteristic* pCharacteristicWpcReset = NULL;

class BleConnectionCallback: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("connected");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("disconnected");
    }
};

class BleResetCallback: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if (value[0] == WPCEMU_PAYLOAD_REBOOT_PINBALLMACHINE) {
        Serial.println("RESET PINBALL MACHINE");
        resetPinballMachine();
      } else
      if (value[0] == WPCEMU_PAYLOAD_REBOOT_CONTROLLER) {
        Serial.println("REBOOT CONTROLLER!");
        ESP.restart();
      }      
    }
};

void initState() {
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 0] = 0;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 1] = 0;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 2] = 0;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 3] = 0;
  
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 0] = 0;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 1] = 0;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 2] = 0;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 3] = 0;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 4] = 0;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 5] = 0;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 6] = 0;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 7] = 0;

  statePayload[NOTIFY_MSG_OFFSET_COINDOOR + 0] = 0x44 & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_FLIPTRONIC + 0] = 0x55 & 0xFF;
}


void initBluetooth() {
  // Create the BLE Device
  BLEDevice::init("WPC-EMU");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new BleConnectionCallback());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristicPowerstate = pService->createCharacteristic(
                      CHARACTERISTIC_POWERSTATE_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristicWpcState = pService->createCharacteristic(
                      CHARACTERISTIC_WPCSTATE_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  pCharacteristicWpcReset = pService->createCharacteristic(
                      CHARACTERISTIC_RESET_UUID,
                      BLECharacteristic::PROPERTY_WRITE
                    );

  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // Create a BLE Descriptor
  pCharacteristicPowerstate->addDescriptor(new BLE2902());
  pCharacteristicWpcState->addDescriptor(new BLE2902());
  pCharacteristicWpcReset->addDescriptor(new BLE2902());

  // initialise state
  initState();

  //TODO set effective powerstate
  pCharacteristicPowerstate->setValue(&statePowerstate, 1);
  pCharacteristicWpcState->setValue(statePayload, MESSAGE_SIZE);
  pCharacteristicWpcReset->setCallbacks(new BleResetCallback());
  
  // Start the service
  pService->start();

  // Start advertising
  pServer->getAdvertising()->start();
  Serial.println("Waiting a client connection to notify...");
}

void RestartBluetoothAdvertising() {
  pServer->startAdvertising(); // restart advertising
  Serial.println("start advertising");  
}

void loopBluetooth() {
  noInterrupts();
#ifdef FAKE_PINBALL_ENABLED
  uint32_t currentZerocross = fakeTimer;
#elif
  uint32_t currentZerocross = zeroconfInterruptCounter;
#endif
  interrupts();
  
  updateZerocross(currentZerocross);
#ifdef FAKE_PINBALL_ENABLED
/*  if (fakeTimer % 40 == 0) {
    Serial.println("updateSwitchInput"); 
    //updateRandomSwitchInput();
    updateCabinetInput();
  }*/
#endif

#ifdef DEBUG
  Serial.printf("BT ZC: %lu\n", currentZerocross);
#endif
  // send WPC state using BLT
  pCharacteristicWpcState->setValue(statePayload, MESSAGE_SIZE);        
  pCharacteristicWpcState->notify();
}

void updateZerocross(uint32_t stateZerocross) {
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 0] = (stateZerocross >> 24) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 1] = (stateZerocross >> 16) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 2] = (stateZerocross >> 8) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 3] = stateZerocross & 0xFF;
}

void updateCabinetInput() {
  // TODO implement
  statePayload[NOTIFY_MSG_OFFSET_COINDOOR] = 0;//esp_random() & 0xFF;
}

void updateRandomSwitchInput() {
  uint32_t randomSwitch = esp_random();
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 0] = (randomSwitch >> 24) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 1] = (randomSwitch >> 16) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 2] = (randomSwitch >> 8) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 3] = randomSwitch & 0xFF;

  randomSwitch = esp_random();
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 4] = (randomSwitch >> 24) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 5] = (randomSwitch >> 16) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 6] = (randomSwitch >> 8) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 7] = randomSwitch & 0xFF;
}
