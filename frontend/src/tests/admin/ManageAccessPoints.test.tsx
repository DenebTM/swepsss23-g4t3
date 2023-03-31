import { render } from '@testing-library/react'
import { test } from 'vitest'
import { ManageAccessPoints } from '~/components/admin/accessPoints/ManageAccessPoints'

test('render ManageAccessPoints without crashing', async () => {
  render(<ManageAccessPoints />)
})
