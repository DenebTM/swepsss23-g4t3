#include <ble/sv_devinfo.h>

#include <hwtimer.h>
#include <station_id.h>

namespace ble {
  BLEService sv_devinfo(BLE_UUID_DEVINFO);
  BLEStringCharacteristic ch_manufacturer(BLE_UUID_MANUFACTURER_NAME,
                                          BLERead,
                                          strlen(BLE_DEVICE_MANUFACTURER));
  BLEByteCharacteristic ch_stationID(BLE_UUID_STATION_ID, BLERead | BLENotify);
  uint8_t val_stationID = 0;

  // Flags for periodic tasks
  volatile bool shall_update_station_id = false;

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
    hwtimer::attach_flag_isr(STATION_ID_CHECK_INTERVAL,
                             &shall_update_station_id);
  }

  void devinfo_update() {
    if (shall_update_station_id) {
      shall_update_station_id = false;

      update_station_id();

      BLE.stopAdvertise();
      if (is_advertising) { BLE.advertise(); }
    }
  }

  void update_station_id() {
    uint8_t id = station_id();

    if (id != val_stationID) {
      Serial.println("Station ID changed to " + String(id));
      val_stationID = id;
    }

    // include current station ID in BLE service and advertising data
    ch_stationID.writeValue(val_stationID);
    BLE.setAdvertisedServiceData(
        strtol(BLE_UUID_DEVINFO, NULL, 16), &ble::val_stationID, 1);

    // TODO: disallow changing station ID while paired, blink warning LED
  }
} // namespace ble
