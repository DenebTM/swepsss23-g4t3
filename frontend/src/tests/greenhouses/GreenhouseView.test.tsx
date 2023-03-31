import { render } from '@testing-library/react'
import { test } from 'vitest'
import { GreenhouseView } from '~/components/greenhouses/greenhouseView/GreenhouseView'

test('render GreenhouseView without crashing', async () => {
  render(<GreenhouseView />)
})
