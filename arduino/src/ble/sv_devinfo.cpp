#include <ble/sv_devinfo.h>

#include <Ticker.h>

#include <station_id.h>

namespace ble {
  BLEService sv_devinfo(BLE_UUID_DEVINFO);
  BLEStringCharacteristic ch_manufacturer(BLE_UUID_MANUFACTURER_NAME,
                                          BLERead,
                                          strlen(BLE_DEVICE_MANUFACTURER));
  BLEByteCharacteristic ch_stationID(BLE_UUID_STATION_ID, BLERead | BLENotify);
  uint8_t val_stationID = 0;
  
  Ticker update_station_id_timer(update_station_id, STATION_ID_CHECK_INTERVAL_MS);

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
    BLE.setAdvertisedService(ble::sv_devinfo);

    update_station_id();
    update_station_id_timer.start();
  }

  void devinfo_update() {
    update_station_id_timer.update();
  }

  void update_station_id() {
    uint8_t id = station_id();

    if (id != val_stationID) {
      Serial.println("Station ID changed to " + String(id));
      val_stationID = id;
    }

    // include current station ID in BLE service and advertising data
    ch_stationID.writeValue(val_stationID);
    BLE.setAdvertisedServiceData(strtol(BLE_UUID_DEVINFO, NULL, 16),
                                 &ble::val_stationID, 1);

    // TODO: disallow changing station ID while paired, blink warning LED
  }
}
