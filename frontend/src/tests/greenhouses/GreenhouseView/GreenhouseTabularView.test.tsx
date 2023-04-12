import { render, screen, waitFor } from '@testing-library/react'
import { test, vi } from 'vitest'
import {
  GREENHOUSE_METRICS,
  GREENHOUSE_VIEW_QUERY,
  GreenhouseMetricRange,
  greenhouseMetricWithUnit,
  SensorStationView,
  SS_UUID_PARAM,
} from '~/common'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'

/** Mocked UUID for testing */
const sensorStationUuid = 0

/** Mock passing in the view via search params */
vi.mock('react-router-dom', () => ({
  useSearchParams: (): [URLSearchParams] => [
    new URLSearchParams([[GREENHOUSE_VIEW_QUERY, SensorStationView.TABLE]]),
  ],
  useParams: () => ({ [SS_UUID_PARAM]: sensorStationUuid }),
  useNavigate: () => vi.fn(),
  useLocation: () => vi.fn(),
  useRouteError: () => vi.fn(),
}))

test('render GreenhouseTabularView inside GreenhouseView', async () => {
  render(<GreenhouseView />)

  // Expect a column for every metric to be visible once the measurements are fetched from the API
  GREENHOUSE_METRICS.forEach((metricRange: GreenhouseMetricRange) =>
    waitFor(() =>
      expect(
        screen.getByText(greenhouseMetricWithUnit(metricRange))
      ).toBeInTheDocument()
    )
  )
})
