import React from 'react'
import { Link as ReactLink } from 'react-router-dom'

import CheckIcon from '@mui/icons-material/Check'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { GreenhouseIcon } from '~/common'
import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'

import { PageTitle } from '../page/PageTitle'

/**
 * Page containing basic instructions about how to get started with the app
 */
export const GettingStarted: React.FC = () => {
  return (
    <PageWrapper permittedRoles={PAGE_URL.gettingStarted.permittedRoles}>
      <PageHeader
        left={<PageTitle>{PAGE_URL.gettingStarted.pageTitle}</PageTitle>}
      />

      <p>
        <b>Note:</b> It is assumed that all devices are already set up with the
        necessary dependencies/project files/firmware/wiring/etc.
      </p>

      <Typography variant="h6" fontStyle="italic">
        Connecting an Access Point
      </Typography>
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
          <Link>
            <ReactLink to={PAGE_URL.manageAccessPoints.href}>
              {PAGE_URL.manageAccessPoints.pageTitle}
            </ReactLink>
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
          <Link>
            <ReactLink to={PAGE_URL.manageAccessPoints.href}>
              {PAGE_URL.manageAccessPoints.pageTitle}
            </ReactLink>
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
    </PageWrapper>
  )
}
