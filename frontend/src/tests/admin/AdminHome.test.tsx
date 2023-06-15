import { fireEvent, render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { AdminHome } from '~/components/admin/home/AdminHome'

test('render AdminHome without crashing', async () => {
  render(<AdminHome />)
})

test('open Add Greenhouse dialog from AdminHome', async () => {
  render(<AdminHome />)

  // Find and click on button to add a new greenhouse
  const addGreenhousesBtn = await screen.findByText('Add Greenhouses')
  await fireEvent.click(addGreenhousesBtn)

  // Check that the dialog is visible in the screen. qqjf TODO update text to constant.
  expect(
    screen.getByText(
      'Pair with a new sensor station via BLE to start monitoring your plants'
    )
  ).toBeInTheDocument()
})
