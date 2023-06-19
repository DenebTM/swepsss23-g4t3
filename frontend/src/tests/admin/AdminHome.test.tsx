import { fireEvent, render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { ADD_GREENHOUSE_DIALOG_SUBTITLE, ADD_GREENHOUSE_TEXT } from '~/common'
import { AdminHome } from '~/components/admin/home/AdminHome'

test('render AdminHome without crashing', async () => {
  render(<AdminHome />)
})

test('open Add Greenhouse dialog from AdminHome', async () => {
  render(<AdminHome />)

  // Find and click on button to add a new greenhouse
  const addGreenhousesBtn = await screen.findByText(ADD_GREENHOUSE_TEXT)
  await fireEvent.click(addGreenhousesBtn)

  // Check that the dialog is visible in the screen.
  expect(screen.getByText(ADD_GREENHOUSE_DIALOG_SUBTITLE)).toBeInTheDocument()
})
