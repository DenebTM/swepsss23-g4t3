import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { test, vi } from 'vitest'
import {
  decryptSensorStationUuid,
  encryptSensorStationUuid,
  SS_UUID_PARAM,
} from '~/common'
import { PhotoUpload } from '~/components/photoUpload/PhotoUpload'
import { SensorStationUuid } from '~/models/sensorStation'

/** Mocked UUID for testing */
const mockSsId: SensorStationUuid = faker.datatype.number({ min: 0, max: 15 })
const encryptedUuid = encryptSensorStationUuid(mockSsId)

/** Mock passing in the sensor station ID via search params */
vi.mock('react-router-dom', () => ({
  useSearchParams: (): [URLSearchParams] => [
    new URLSearchParams([[SS_UUID_PARAM, decodeURIComponent(encryptedUuid)]]),
  ],
  useParams: () => vi.fn(),
  useNavigate: () => vi.fn(),
  useLocation: () => vi.fn(),
  useRouteError: () => vi.fn(),
}))

test('renders photo upload page without crashing', () => {
  render(<PhotoUpload />)

  // Assert that the page heading is displayed
  expect(screen.getByText('Welcome to PlantHealth')).toBeInTheDocument()
})

test('decryptSensorStationUuid is the inverse of encryptSensorStationUuid', () => {
  expect(decryptSensorStationUuid(decodeURIComponent(encryptedUuid))).toEqual(
    mockSsId
  )
})
