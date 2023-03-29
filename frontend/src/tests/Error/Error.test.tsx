import { render, screen } from '@testing-library/react'
import { test, vi } from 'vitest'
import { Error } from '~/components/error/Error'

const TEST_ERR = 'Test error message'
vi.mock('react-router-dom', () => ({
  useRouteError: () => ({ data: TEST_ERR }),
}))

test('renders error page and shows a caught error message', () => {
  render(<Error />)
  expect(screen.getByText(TEST_ERR)).toBeInTheDocument()
})

test('renders error page with a custom message', () => {
  const CUSTOM_MESSAGE = 'Custom error message'
  render(<Error message={CUSTOM_MESSAGE} />)
  // Check that the caught error message and the custom message are in the document
  expect(screen.getByText(TEST_ERR)).toBeInTheDocument()
  expect(screen.getByText(CUSTOM_MESSAGE)).toBeInTheDocument()
})
