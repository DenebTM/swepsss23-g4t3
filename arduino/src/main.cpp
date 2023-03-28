#include <ArduinoBLE.h>

BLEService myService("fff0");
BLEIntCharacteristic myCharacteristic("fff1", BLERead | BLEBroadcast);

void setup() {
  Serial.begin(9600);
  while (!Serial);

  if (!BLE.begin()) {
    Serial.println("Error initializing BLE!");
  }

  myService.addCharacteristic(myCharacteristic);
  BLE.addService(myService);

  BLE.setDeviceName("iPhone von S. Kurz");
  BLE.setLocalName("iPhone von S. Kurz");
  BLE.setAppearance(0x40);

  Serial.print("Own address: ");
  Serial.println(BLE.address());

  myCharacteristic.writeValue(17);

  Serial.println("Beginning BLE advertising");
  if (!BLE.advertise()) {
    Serial.println("BLE advertising failed!");
  }
}

void loop() {
  int i = 0;
  if (BLEDevice central = BLE.central()) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.print(central.address());
    Serial.print(" (");
    Serial.print(central.localName());
    Serial.println(")");

    while (central.connected()) {
      Serial.print("Still connected");
      Serial.print(" (");
      Serial.print(central.localName());
      Serial.println(")");

      myCharacteristic.writeValue(i++);
      delay(1000);
    }
  }

  Serial.println("No connection...");
  delay(1000);
}
