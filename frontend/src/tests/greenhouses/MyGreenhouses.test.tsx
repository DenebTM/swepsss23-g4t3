import { render } from '@testing-library/react'
import { test } from 'vitest'
import { MyGreenhouses } from '~/components/greenhouses/myGreenhouses/MyGreenhouses'

test('render MyGreenhouses without crashing', async () => {
  render(<MyGreenhouses />)
})
