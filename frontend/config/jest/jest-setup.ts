import '@testing-library/jest-dom'
import { Server } from 'miragejs'
import { vi } from 'vitest'
import { mirageSetup, MOCK_API } from '~/api/mirageSetup'
import { AppRegistry } from '~/api/mirageTypes'
import { AuthUserRole } from '~/models/user'

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
export const NAVIGATE_MOCK = vi.fn()

/** Mock for react-router-dom `useParams` function as this can not be run during tests. */
export const PARAMS_MOCK = vi.fn()

/** Mock for react-router-dom `useSearchParams` function as this can not be run during tests. */
export const SEARCH_PARAMS = vi.fn()

/** Mock for react-router-dom `useRouteError` function as this can not be run during tests. */
export const USE_ROUTE_ERROR = vi.fn()

/** Mock for react-router-dom `useLocation` function as this can not be run during tests. */
export const LOCATION_MOCK = vi.fn()

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
    SEARCH_PARAMS()
    return [
      new URLSearchParams(),
      () => {
        /* Can manually define search params here */
      },
    ]
  },
  useRouteError: () => USE_ROUTE_ERROR,
  useLocation: () => LOCATION_MOCK,
}))

/**
 * Mock the user being logged as an admin for tests
 */
vi.mock('~/hooks/user', () => ({
  useUserRole: vi.fn().mockImplementation(() => AuthUserRole.ADMIN),
  useUsername: vi.fn().mockImplementation(() => 'test_username'),
}))
