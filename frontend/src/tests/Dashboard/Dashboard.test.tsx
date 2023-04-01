import { render } from '@testing-library/react'
import { test } from 'vitest'
import { Dashboard } from '~/components/dashboard/Dashboard'

test('render Dashboard without crashing', async () => {
  render(<Dashboard />)
})
