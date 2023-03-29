import { render } from '@testing-library/react'
import { test, vi } from 'vitest'
import { Dashboard } from '~/components/dashboard/Dashboard'

vi.mock('react-router-dom', () => ({
  useNavigate: () => {
    /* do nothing */
  },
}))

test('render dashboard without crashing', async () => {
  render(<Dashboard />)
})
