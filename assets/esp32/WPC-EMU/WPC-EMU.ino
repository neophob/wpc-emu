#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristicPowerstate = NULL;
BLECharacteristic* pCharacteristicWpcState = NULL;

bool deviceConnected = false;
bool oldDeviceConnected = false;
uint8_t statePowerstate = 1;
uint32_t stateZerocross = 0;

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

// Characteristics are defined attribute types that contain a single logical value. 
#define CHARACTERISTIC_WPCSTATE_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_POWERSTATE_UUID "82ee4ff0-b0e3-4088-85e3-bdaa212e4fa3"

#define NOTIFY_MSG_OFFSET_ZEROCROSS 0
#define NOTIFY_MSG_SIZE_ZEROCROSS 4
#define NOTIFY_MSG_OFFSET_INPUT_SWITCH 4
#define NOTIFY_MSG_SIZE_INPUT_SWITCH 8
#define NOTIFY_MSG_OFFSET_COINDOOR 12
#define NOTIFY_MSG_SIZE_COINDOOR 1
#define NOTIFY_MSG_OFFSET_FLIPTRONIC 13
#define NOTIFY_MSG_SIZE_FLIPTRONIC 1

#define MESSAGE_SIZE NOTIFY_MSG_SIZE_ZEROCROSS + NOTIFY_MSG_SIZE_INPUT_SWITCH + NOTIFY_MSG_SIZE_COINDOOR + NOTIFY_MSG_SIZE_FLIPTRONIC

uint8_t statePayload[MESSAGE_SIZE] = {};

/*

Firmware sends data to the emulator (serial):
- zerocross counter (32bit)
- input switch matrix state (64bit)
- coin door state (8bit)
- fliptronic state (8bit)
- power state (1bit)


GPIO06 through GPIO11 are reserved for the FLASH
 */

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("connected");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("disconnected");
    }
};


void setup() {
  Serial.begin(115200);
  uint64_t chipid=ESP.getEfuseMac();//The chip ID is essentially its MAC address(length: 6 bytes).
  Serial.printf("ESP32 Chip ID = %04X",(uint16_t)(chipid>>32));//print High 2 bytes
  Serial.printf("%08X\n",(uint32_t)chipid);//print Low 4bytes.

  // Create the BLE Device
  BLEDevice::init("WPC-EMU");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

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

  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // Create a BLE Descriptor
  pCharacteristicPowerstate->addDescriptor(new BLE2902());
  pCharacteristicWpcState->addDescriptor(new BLE2902());


  // initialise state
  initState();
  pCharacteristicPowerstate->setValue(&statePowerstate, 1);
  pCharacteristicWpcState->setValue(statePayload, MESSAGE_SIZE);
  
  // Start the service
  pService->start();

  // Start advertising
  pServer->getAdvertising()->start();
  Serial.println("Waiting a client connection to notify...");
}

void initState() {
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 0] = 0x22 & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 1] = 0x22 & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 2] = 0x22 & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 3] = 0x22 & 0xFF;

  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 4] = 0x33 & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 5] = 0x33 & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 6] = 0x33 & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_INPUT_SWITCH + 7] = 0x33 & 0xFF;

  statePayload[NOTIFY_MSG_OFFSET_COINDOOR + 0] = 0x44 & 0xFF;

  statePayload[NOTIFY_MSG_OFFSET_FLIPTRONIC + 0] = 0x55 & 0xFF;
}

void updateZerocross() {
  stateZerocross++;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 0] = (stateZerocross >> 24) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 1] = (stateZerocross >> 16) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 2] = (stateZerocross >> 8) & 0xFF;
  statePayload[NOTIFY_MSG_OFFSET_ZEROCROSS + 3] = stateZerocross & 0xFF;
}

void loop() {
    // notify changed value
    if (deviceConnected) {
        updateZerocross();
        pCharacteristicWpcState->setValue(statePayload, MESSAGE_SIZE);
        
        pCharacteristicWpcState->notify();
        delay(30/2); // bluetooth stack will go into congestion, if too many packets are sent
    }
    // disconnecting
    if (!deviceConnected && oldDeviceConnected) {
        delay(500); // give the bluetooth stack the chance to get things ready
        pServer->startAdvertising(); // restart advertising
        Serial.println("start advertising");
        oldDeviceConnected = deviceConnected;
    }
    // connecting
    if (deviceConnected && !oldDeviceConnected) {
        // do stuff here on connecting
        oldDeviceConnected = deviceConnected;
    }
}
