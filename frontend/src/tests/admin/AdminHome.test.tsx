import { render } from '@testing-library/react'
import { test } from 'vitest'
import { AdminHome } from '~/components/admin/home/AdminHome'

test('render AdminHome without crashing', async () => {
  render(<AdminHome />)
})
