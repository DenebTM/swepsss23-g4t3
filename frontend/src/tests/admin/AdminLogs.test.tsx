import { render } from '@testing-library/react'
import { test } from 'vitest'
import { AdminLogs } from '~/components/admin/logs/AdminLogs'

test('render AdminLogs without crashing', async () => {
  render(<AdminLogs />)
})
