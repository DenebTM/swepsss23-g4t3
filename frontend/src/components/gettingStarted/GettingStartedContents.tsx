import React from 'react'
import { useNavigate } from 'react-router-dom'

import CheckIcon from '@mui/icons-material/Check'
import Link, { LinkProps } from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { GreenhouseIcon } from '~/common'
import { PAGE_URL } from '~/common'

/** Props for links in the GettingStarted page */
const linkProps: Partial<LinkProps> = {
  underline: 'hover',
  sx: { cursor: 'pointer' },
}

/**
 * Page contents for `GettingStarted` help page.
 */
export const GettingStartedContents: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <ol>
        <li>
          Plug in the Raspberry Pi and connect it to the network via Wi-Fi.
        </li>
        <li>
          Run the './configure' script to set up the correct web server address.
          Make sure to check your firewall settings in order to allow external
          devices to connect to the web server running on your machine.
        </li>
        <li>
          Run 'python3 main.py'. The Access Point will automatically register
          itself with the web server and be displayed on the{' '}
          <Link
            onClick={() => navigate(PAGE_URL.manageAccessPoints.href)}
            {...linkProps}
          >
            {PAGE_URL.manageAccessPoints.pageTitle}
          </Link>{' '}
          page with a yellow highlight and status "unconfirmed". Press the{' '}
          <CheckIcon /> button to confirm and allow it to communicate with the
          web server.
        </li>
      </ol>

      <Typography variant="h6" fontStyle="italic">
        Pairing a Greenhouse
      </Typography>
      <ol>
        <li>Set the Greenhouse's ID using the DIP switch.</li>
        <li>
          Press the righmost button (the one connected to ) connected to pin D2
          of the Arduino. The LED will begin flashing blue.
        </li>
        <li>
          Navigate to{' '}
          <Link
            onClick={() => navigate(PAGE_URL.manageAccessPoints.href)}
            {...linkProps}
          >
            {PAGE_URL.manageAccessPoints.pageTitle}
          </Link>
        </li>
        <li>
          Click the <GreenhouseIcon /> button on the right.
        </li>
        <li>
          Wait roughly 10 seconds, then open the Sensor Station dropdown menu.
          Select the ID of the Greenhouse with the ID that you want to pair.
        </li>
        <li>
          Press Confirm. After a few more seconds, the LED on the Greenhouse
          should turn green, and you will be able to view measurements on the
          corresponding page under "Dashboard".
        </li>
      </ol>
    </>
  )
}
