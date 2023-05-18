import { render } from '@testing-library/react'
import { test } from 'vitest'
import { AdminLogs } from '~/components/admin/adminLogs/AdminLogs'

test('render AdminLogs without crashing', async () => {
  render(<AdminLogs />)
})
