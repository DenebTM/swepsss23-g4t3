import React from 'react'
import { Link } from 'react-router-dom'

import CheckIcon from '@mui/icons-material/Check'
import Typography from '@mui/material/Typography'

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
          Plug in the Raspberry Pi and connect it to the network via Wi-Fi
        </li>
        <li>
          Run the './configure' script to set up the correct web server address.
          Make sure to check your firewall settings in order to allow external
          devices to connect to the web server running on your machine.
        </li>
        <li>
          Run 'python3 main.py'. The Access Point will automatically register
          itself with the web server and be displayed on the{' '}
          <Link to="/admin/access-points">Access Points</Link> page with a
          yellow highlight and status "unconfirmed". Press the <CheckIcon />{' '}
          button to confirm and allow it to communicate with the web server.
        </li>
      </ol>
    </PageWrapper>
  )
}
