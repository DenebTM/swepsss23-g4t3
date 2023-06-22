import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { ManageGreenhouses } from '~/components/admin/greenhouses/ManageGreenhouses'

test('render ManageGreenhouses without crashing', async () => {
  render(<ManageGreenhouses />)

  await screen.findByText('Manage Greenhouses')
  await screen.findByText('Rows per page:')
})
