import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { test, vi } from 'vitest'
import { GREENHOUSE_VIEW_QUERY, SensorStationView } from '~/common'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'

/** Mocked UUID for testing */
const sensorStationUuid = faker.datatype.number({ min: 0, max: 15 })

/** Mock passing in the view via search params */
vi.mock('react-router-dom', () => ({
  useSearchParams: (): [URLSearchParams] => [
    new URLSearchParams([[GREENHOUSE_VIEW_QUERY, SensorStationView.TABLE]]),
  ],
  useParams: () => ({ sensorStationId: sensorStationUuid }),
}))

test('render GreenhouseTabularView inside GreenhouseView without crashing', async () => {
  render(<GreenhouseView />)
  expect(
    screen.getByText(
      `Greenhouse tabular view for greenhouse ${sensorStationUuid}`
    )
  ).toBeInTheDocument()
})
