import { render } from '@testing-library/react'
import { test } from 'vitest'
import { ManageGreenhouses } from '~/components/admin/greenhouses/ManageGreenhouses'

test('render ManageGreenhouses without crashing', async () => {
  render(<ManageGreenhouses />)
})
