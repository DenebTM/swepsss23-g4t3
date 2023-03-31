import { render } from '@testing-library/react'
import { test } from 'vitest'
import { GettingStarted } from '~/components/gettingStarted/GettingStarted'

test('render GettingStarted without crashing', async () => {
  render(<GettingStarted />)
})
