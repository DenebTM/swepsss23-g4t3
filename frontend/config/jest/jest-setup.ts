// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { vi } from 'vitest'

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

afterEach(() => {
  vi.clearAllMocks()
})
