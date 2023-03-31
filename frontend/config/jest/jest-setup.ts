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

/** Mock for  react-router-dom navigation function as this can not be run during tests. */
export const NAVIGATE_MOCK = vi.fn()

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
}))
