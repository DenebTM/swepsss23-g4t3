import { fireEvent, render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { MyGreenhouses } from '~/components/greenhouses/myGreenhouses/MyGreenhouses'

test('render MyGreenhouses without crashing', async () => {
  render(<MyGreenhouses />)
})

test('expands MyGreenhouses accordion', async () => {
  render(<MyGreenhouses />)

  // Get buttons to expand the settings accordion
  const expandAccordionBtns = screen.getAllByTestId('ExpandMoreIcon')
  expect(expandAccordionBtns.length).toBeGreaterThan(0)

  // Expand the greenhouse settings accordion for the first found button
  await fireEvent.click(expandAccordionBtns[0])

  // Expect edit buttons for 6 metrics and the aggregation period (6+1 = 7)
  const numEditableValues = 7
  const editButtons = screen.getAllByTestId('EditIcon')
  expect(editButtons.length).toEqual(numEditableValues)

  // Click the first found Edit button to make sure this does not crash the DOM
  await fireEvent.click(editButtons[0])
})
