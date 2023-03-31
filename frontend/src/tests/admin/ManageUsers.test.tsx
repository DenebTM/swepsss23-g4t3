import { render } from '@testing-library/react'
import { test } from 'vitest'
import { ManageUsers } from '~/components/admin/users/ManageUsers'

test('render ManageUsers without crashing', async () => {
  render(<ManageUsers />)
})
