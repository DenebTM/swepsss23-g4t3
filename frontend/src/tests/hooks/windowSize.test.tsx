import React from 'react'

import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { useWindowSize } from '~/hooks/windowSize'

const widthTestId = 'widthTestId'
const heightTestId = 'heightTestId'

/** Minimal component to test that windowSize.height and windowSize.width are set when rendering a component */
const MinimalWindowSizeTest: React.FC = () => {
  const windowSize = useWindowSize()
  return (
    <div>
      <span data-testid={heightTestId}>{windowSize.height}</span>
      <span data-testid={widthTestId}>{windowSize.width}</span>
    </div>
  )
}

test('windowSize returns numerical values', async () => {
  render(<MinimalWindowSizeTest />)

  // Get window size values from `MinimalWindowSizeTest`
  const heightEl = screen.getByTestId(heightTestId)
  const widthEl = screen.getByTestId(widthTestId)

  // Check that the returned height and width are not undefined (i.e. converted to the empty string)
  expect(heightEl.textContent).not.toEqual('')
  expect(widthEl.textContent).not.toEqual('')
})
