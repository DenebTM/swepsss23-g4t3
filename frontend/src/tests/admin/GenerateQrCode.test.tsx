import { fireEvent, render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { GenerateQrCode } from '~/components/admin/greenhouses/SensorStationsTable/GenerateQrCode/GenerateQrCode'
import { SensorStationUuid } from '~/models/sensorStation'

const MOCK_SSID: SensorStationUuid = 1

test('render QR code modal without crashing', async () => {
  render(<GenerateQrCode ssID={MOCK_SSID} />)
})

test('open QR code modal on button click', async () => {
  render(<GenerateQrCode ssID={MOCK_SSID} />)

  const qrModalButton = await screen.findByRole('button')
  await fireEvent.click(qrModalButton)

  // Check that the dialog title is visible in the screen
  expect(screen.getByText(`Greenhouse ${MOCK_SSID}`)).toBeInTheDocument()

  // Check that the print button is visible
  expect(screen.getByText('Print')).toBeInTheDocument()
})
