import { render, screen } from '@testing-library/react'
import { test, vi } from 'vitest'
import { Error } from '~/components/page/error/Error'

/** Mock error message to be caught by react-router */
const TEST_ERR = 'Test error message'

vi.mock('react-router-dom', () => ({
  useRouteError: () => ({ error: { message: TEST_ERR } }),
  useNavigate: () => vi.fn(),
  useLocation: () => vi.fn(),
}))

test('renders error page and shows a caught error message', () => {
  render(<Error />)
  expect(screen.getByText(TEST_ERR)).toBeInTheDocument()
})

test('renders error page with a custom message', () => {
  const CUSTOM_MESSAGE = 'Custom error message'
  render(<Error message={CUSTOM_MESSAGE} />)

  // Check that the custom error message is in the document
  expect(screen.getByText(CUSTOM_MESSAGE)).toBeInTheDocument()

  // Check that the caught error message is not displayed
  expect(screen.queryByText(TEST_ERR)).not.toBeInTheDocument()
})
