#include <ble/sv_devinfo.h>

#include <station_id.h>

namespace ble {
  BLEService sv_devinfo(BLE_UUID_DEVINFO);
  BLEStringCharacteristic ch_manufacturer(BLE_UUID_MANUFACTURER_NAME,
                                          BLERead,
                                          strlen(BLE_DEVICE_MANUFACTURER));
  BLEByteCharacteristic ch_stationID(BLE_UUID_STATION_ID, BLERead | BLENotify);
  uint8_t val_stationID = station_id();

  // set up how the sensor station appears to other BLE devices
  void devinfo_setup() {
    BLE.setAppearance(BLE_DEVICE_APPEARANCE);
    BLE.setDeviceName(BLE_DEVICE_NAME);
    BLE.setLocalName(BLE_DEVICE_NAME);

    ble::ch_manufacturer.writeValue(BLE_DEVICE_MANUFACTURER);
    ble::sv_devinfo.addCharacteristic(ble::ch_manufacturer);

    ble::val_stationID = station_id();
    ble::ch_stationID.writeValue(ble::val_stationID);
    ble::sv_devinfo.addCharacteristic(ble::ch_stationID);
    
    BLE.addService(ble::sv_devinfo);

    // include current station ID in BLE advertising data
    BLE.setAdvertisedService(ble::sv_devinfo);
    BLE.setAdvertisedServiceData(strtol(BLE_UUID_DEVINFO, NULL, 16),
                                 &ble::val_stationID, 1);
  }
}
