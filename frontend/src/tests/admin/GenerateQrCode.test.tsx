import { faker } from '@faker-js/faker'
import { fireEvent, render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { GenerateQrCode } from '~/components/admin/greenhouses/SensorStationsTable/GenerateQrCode/GenerateQrCode'
import { SensorStationUuid } from '~/models/sensorStation'

/** Mocked sensor station UUID for testing */
const mockSsId: SensorStationUuid = faker.datatype.number({ min: 0, max: 15 })

test('render QR code modal without crashing', async () => {
  render(<GenerateQrCode ssID={mockSsId} />)
})

test('open QR code modal on button click', async () => {
  render(<GenerateQrCode ssID={mockSsId} />)

  const qrModalButton = await screen.findByRole('button')
  await fireEvent.click(qrModalButton)

  // Check that the dialog title is visible in the screen
  expect(screen.getByText(`Greenhouse ${mockSsId}`)).toBeInTheDocument()

  // Check that the print button is visible
  expect(screen.getByText('Print')).toBeInTheDocument()
})
