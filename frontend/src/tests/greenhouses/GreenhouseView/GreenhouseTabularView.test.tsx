import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { test, vi } from 'vitest'
import {
  GREENHOUSE_VIEW_QUERY,
  SensorStationView,
  SS_UUID_PARAM,
} from '~/common'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'

/** Mocked UUID for testing */
const sensorStationUuid = faker.datatype.number({ min: 0, max: 15 })

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

test('render GreenhouseTabularView inside GreenhouseView without crashing', async () => {
  render(<GreenhouseView />)
  expect(screen.getByText('Air Pressure')).toBeInTheDocument()
  // TODO qqjf Add tests for all table columns
})
