import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import { test, vi } from 'vitest'
import {
  GREENHOUSE_VIEW_QUERY,
  SensorStationView,
  SS_UUID_PARAM,
} from '~/common'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'

/** Mocked UUID for testing */
const sensorStationUuid = faker.datatype.number({ min: 0, max: 15 })

test('render GreenhouseGraphicalView inside GreenhouseView without search params', async () => {
  vi.mock('react-router-dom', () => ({
    useSearchParams: (): [URLSearchParams] => [
      new URLSearchParams([]), // Mock empty search params
    ],
    useParams: () => ({ [SS_UUID_PARAM]: sensorStationUuid }),
    useNavigate: () => vi.fn(),
    useLocation: () => vi.fn(),
    useRouteError: () => vi.fn(),
  }))

  render(<GreenhouseView />)
})

test('render GreenhouseGraphicalView inside GreenhouseView when the ?view search query is empty', async () => {
  /** Mock passing in the view via search params */
  vi.mock('react-router-dom', () => ({
    useSearchParams: (): [URLSearchParams] => [
      new URLSearchParams([
        [GREENHOUSE_VIEW_QUERY, SensorStationView.GRAPHICAL],
      ]),
    ],
    useParams: () => ({ [SS_UUID_PARAM]: sensorStationUuid }),
    useNavigate: () => vi.fn(),
    useLocation: () => vi.fn(),
    useRouteError: () => vi.fn(),
  }))

  render(<GreenhouseView />)
})
