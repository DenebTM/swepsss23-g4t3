import { render, screen, waitFor } from '@testing-library/react'
import { test, vi } from 'vitest'
import {
  GREENHOUSE_METRICS,
  GREENHOUSE_VIEW_QUERY,
  GreenhouseMetricRange,
  greenhouseMetricWithUnit,
  roundMetric,
  SensorStationView,
  SS_UUID_PARAM,
} from '~/common'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'
import { Measurement } from '~/models/measurement'
import { SensorStationUuid } from '~/models/sensorStation'
import { Timestamp } from '~/models/timestamp'

/** Mocked UUID for testing. */
const SENSOR_STATION_UUID = 0

/** Mocked {@link Measurement}s for testing */
const MOCKED_MEASUREMENTS: Measurement[] = [
  {
    id: 17,
    timestamp: '2023-03-30T15:16:52.317Z',
    data: {
      temperature: 55.028911,
      soilMoisture: 52.309543,
      lightIntensity: 256.282546,
      humidity: 72.350015,
      airQuality: 181.558768,
      airPressure: 826.347872,
    },
  },
  {
    id: 22,
    timestamp: '2023-04-10T14:43:27.906Z',
    data: {
      temperature: 7.911702,
      soilMoisture: 38.300971,
      lightIntensity: 842.59735,
      humidity: 38.565525,
      airQuality: 35.658449,
      airPressure: 1152.702981,
    },
  },
]

/** Mock passing in the view via search params */
vi.mock('react-router-dom', () => ({
  useSearchParams: (): [URLSearchParams] => [
    new URLSearchParams([[GREENHOUSE_VIEW_QUERY, SensorStationView.TABLE]]),
  ],
  useParams: () => ({ [SS_UUID_PARAM]: SENSOR_STATION_UUID }),
  useNavigate: () => vi.fn(),
  useLocation: () => vi.fn(),
  useRouteError: () => vi.fn(),
}))

/** Mock {@link getSensorStationMeasurements} for testing */
vi.mock('~/api/endpoints/sensorStations/measurements', () => ({
  getSensorStationMeasurements: (
    sensorStationUuid: SensorStationUuid,
    from?: Timestamp,
    to?: Timestamp
  ) => Promise.resolve(MOCKED_MEASUREMENTS),
}))

test('render GreenhouseTabularView inside GreenhouseView', async () => {
  render(<GreenhouseView />)

  // Expect a column for every metric to be visible once the measurements are fetched from the API
  GREENHOUSE_METRICS.forEach((metricRange: GreenhouseMetricRange) =>
    waitFor(
      () =>
        expect(
          screen.getByText(greenhouseMetricWithUnit(metricRange))
        ).toBeInTheDocument(),
      { timeout: 5000 }
    )
  )

  // Expect (rounded) mocked data values to be visible in table
  MOCKED_MEASUREMENTS.forEach((measurement: Measurement) =>
    Object.values(measurement.data).forEach((value: number) =>
      waitFor(
        () => expect(screen.getByText(roundMetric(value))).toBeInTheDocument(),
        { timeout: 5000 }
      )
    )
  )
})
