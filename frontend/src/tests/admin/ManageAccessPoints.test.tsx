import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { ManageAccessPoints } from '~/components/admin/accessPoints/ManageAccessPoints'

test('render ManageAccessPoints without crashing', async () => {
  await render(<ManageAccessPoints />)

  // Check that table headers are present
  await screen.findByText('Name')
  await screen.findByText('Status')
  await screen.findByText('Greenhouses')
})
