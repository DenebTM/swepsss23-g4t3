import { Measurement } from '~/models/measurement'
import { SensorStation, StationStatus } from '~/models/sensorStation'

export const testUsername = 'testUsername'

/** Mocked measurements to return from the mocked `useSensorStations` hook */
const mockedMeasurements: Measurement[] = [
  {
    id: 1,
    data: {
      airPressure: 1,
      airQuality: 1,
      humidity: 1,
      lightIntensity: 1,
      soilMoisture: 1,
      temperature: 1,
    },
    timestamp: '2023-04-29T05:03:37.921Z',
  },
  {
    id: 2,
    data: {
      airPressure: 2,
      airQuality: 2,
      humidity: 2,
      lightIntensity: 2,
      soilMoisture: 2,
      temperature: 2,
    },
    timestamp: '2023-05-29T05:03:37.921Z',
  },
]

export const mockedSensorStations: SensorStation[] = [
  {
    ssID: 1,
    apName: 'ap1',
    aggregationPeriod: 15,
    gardeners: ['susi', testUsername],
    lowerBound: mockedMeasurements[0].data,
    currentMeasurement: mockedMeasurements[1],
    measurements: mockedMeasurements,
    status: StationStatus.OFFLINE,
    upperBound: mockedMeasurements[1].data,
  },
  {
    ssID: 2,
    apName: 'ap2',
    aggregationPeriod: 20.4,
    gardeners: [],
    lowerBound: null,
    currentMeasurement: null,
    measurements: [],
    status: StationStatus.OFFLINE,
    upperBound: null,
  },
]
