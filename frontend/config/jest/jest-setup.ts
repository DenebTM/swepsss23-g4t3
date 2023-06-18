import '@testing-library/jest-dom'
import { Server } from 'miragejs'
import { vi } from 'vitest'
import { mirageSetup, MOCK_API } from '~/api/mirageSetup'
import { AppRegistry } from '~/api/mirageTypes'
import { AuthUserRole } from '~/models/user'
import { generateTheme } from '~/styles/theme'

import { mockedSensorStations, testUsername } from './mock-data'

let server: Server<AppRegistry> | undefined

/** Start mirage server to mock the backend before each test */
beforeEach(() => {
  server = mirageSetup(MOCK_API, false)
})

/** Teardown after each test */
afterEach(() => {
  vi.clearAllMocks()

  if (server) {
    server.shutdown()
  }
})

/** Mock for react-router-dom `useNavigate` function as this can not be run during tests. */
const NAVIGATE_MOCK = vi.fn()

/** Mock for react-router-dom `useParams` function as this can not be run during tests. */
const PARAMS_MOCK = vi.fn()

/** Mock for react-router-dom `useSearchParams` function as this can not be run during tests. */
const SEARCH_PARAMS_MOCK = vi.fn()

/** Mock for react-router-dom `useRouteError` function as this can not be run during tests. */
const USE_ROUTE_ERROR_MOCK = vi.fn()

/** Mock for react-router-dom `useLocation` function as this can not be run during tests. */
const LOCATION_MOCK = vi.fn()

/**
 * Functions like `useNavigate` and `useParams` are  incompatible with testing individual components,
 * because they expects the React routing context to be present.
 * This mock prevents these calls from throwing an error.
 *
 * It also helps with testing - for example, the following code snippet can be
 * used to to assert that navigation to '/test/path' was attempted:
 *
 * `expect(NAVIGATE_MOCK).toHaveBeenCalledWith('/test/path')`
 */
vi.mock('react-router-dom', () => ({
  useNavigate: () => NAVIGATE_MOCK,
  useParams: () => PARAMS_MOCK,
  useSearchParams: (): [URLSearchParams, (p: URLSearchParams) => void] => {
    SEARCH_PARAMS_MOCK()
    return [
      new URLSearchParams(),
      () => {
        /* Can manually define search params here */
      },
    ]
  },
  useRouteError: () => USE_ROUTE_ERROR_MOCK,
  useLocation: () => LOCATION_MOCK,
}))

vi.mock('@mui/material/styles', async () => {
  const mod = await vi.importActual<typeof import('@mui/material/styles')>(
    '@mui/material/styles'
  )

  return {
    ...mod,
    useTheme: () => generateTheme('light'),
  }
})

/**
 * Mock the user being logged as an admin for tests
 */
vi.mock('~/hooks/user', () => ({
  useUserRole: vi.fn().mockImplementation(() => AuthUserRole.ADMIN),
  useUsername: vi.fn().mockImplementation(() => testUsername),
}))

/**
 * Mock the `useSensorStations` hook so that components render correctly in tests.
 * Otherwise, components would mostly display loading states and require extra logic to wait for this.
 */
vi.mock('~/hooks/appContext', () => ({
  useSensorStations: vi
    .fn()
    .mockImplementation((hideAvailable?: boolean) => mockedSensorStations),
  useLoadSensorStations: () => vi.fn(),
}))
