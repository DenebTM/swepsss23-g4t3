import '@testing-library/jest-dom'
import { Server } from 'miragejs'
import { vi } from 'vitest'
import { mirageSetup, MOCK_API } from '~/api/mirageSetup'
import { AppRegistry } from '~/api/mirageTypes'

let server: Server<AppRegistry> | undefined

/** Start mirage server to mock the backend before each test */
beforeEach(() => {
  server = mirageSetup(MOCK_API)
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
}))
