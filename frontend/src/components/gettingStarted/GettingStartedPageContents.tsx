import React from 'react'
import { useNavigate } from 'react-router-dom'

import CheckIcon from '@mui/icons-material/Check'
import Card from '@mui/material/Card'
import Link, { LinkProps } from '@mui/material/Link'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'

import { GreenhouseIcon } from '~/common'
import { PAGE_URL } from '~/common'
import { theme } from '~/styles/theme'

/** Reusable component for body text inside getting started page */
const GettingStartedBody = (props: {
  children: React.ReactNode
  gutterBottom?: boolean
}) => (
  <Typography
    component="p"
    variant="bodyMedium"
    color="onSurface"
    gutterBottom={props.gutterBottom}
  >
    {props.children}
  </Typography>
)

/** Reusable component for each subsection of the getting started page */
const GettingStartedSection = (props: {
  children: React.ReactNode
  subheading: string
}) => (
  <Card sx={{ padding: theme.spacing(3) }}>
    <Typography
      component="h6"
      variant="titleLarge"
      color="onSurfaceVariant"
      gutterBottom
    >
      {props.subheading}
    </Typography>
    {props.children}
  </Card>
)

/** Reusable component for ordered lists inside getting started page */
const GettingStartedOl = (props: { children: React.ReactNode }) => (
  <List
    component="ol"
    sx={{
      lineHeight: 'initial',
      '> li': {
        listStyle: 'auto inside',
        color: theme.onSurface,
      },
    }}
  >
    {props.children}
  </List>
)

/** Reusable component for list elements inside getting started page */
const GettingStartedLi = (props: { children: React.ReactNode }) => (
  <li style={{ paddingBottom: 6 }}>
    <Typography
      color="onSurface"
      variant="labelLarge"
      sx={{ listStyle: 'auto inside' }}
    >
      {props.children}
    </Typography>
  </li>
)

/** Props for links in the GettingStarted page */
const linkProps: Partial<LinkProps> = {
  underline: 'always',
  sx: { cursor: 'pointer' },
}

/**
 * Page contents for the "Getting Started" page.
 */
export const GettingStartedPageContents: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Stack spacing={2} sx={{ padding: theme.spacing(2, 0) }}>
      <GettingStartedSection subheading="Connecting an Access Point">
        <GettingStartedOl>
          <GettingStartedLi>
            Plug in the Raspberry Pi and connect it to the network via Wi-Fi.
          </GettingStartedLi>
          <GettingStartedLi>
            Run the './configure' script to set up the correct web server
            address. Make sure to check your firewall settings in order to allow
            external devices to connect to the web server running on your
            machine.
          </GettingStartedLi>
          <GettingStartedLi>
            Run 'python3 main.py'. The Access Point will automatically register
            itself with the web server and be displayed on the{' '}
            <Link
              onClick={() => navigate(PAGE_URL.manageAccessPoints.href)}
              {...linkProps}
            >
              {PAGE_URL.manageAccessPoints.pageTitle}
            </Link>{' '}
            page with a yellow highlight and status "unconfirmed". Press the{' '}
            <CheckIcon fontSize="small" /> button to confirm and allow it to
            communicate with the web server.
          </GettingStartedLi>
        </GettingStartedOl>
      </GettingStartedSection>

      <GettingStartedSection subheading="Pairing a Greenhouse">
        <GettingStartedOl>
          <GettingStartedLi>
            Set the Greenhouse's ID using the DIP switch.
          </GettingStartedLi>
          <GettingStartedLi>
            The LED will initially glow solid red.
            <br />
            Press the righmost button on the Greenhouse (the one connected to
            pin D2 of the Arduino). The LED will begin rapidly flashing blue.
          </GettingStartedLi>
          <GettingStartedLi>
            Navigate to{' '}
            <Link
              onClick={() => navigate(PAGE_URL.manageAccessPoints.href)}
              {...linkProps}
            >
              {PAGE_URL.manageAccessPoints.pageTitle}
            </Link>
          </GettingStartedLi>
          <GettingStartedLi>
            Click the <GreenhouseIcon fontSize="small" /> button on the right.
          </GettingStartedLi>
          <GettingStartedLi>
            Wait roughly 10 seconds, then open the Sensor Station dropdown menu.
            Select the ID of the Greenhouse with the ID that you want to pair.
          </GettingStartedLi>
          <GettingStartedLi>
            Press "Confirm". After a few more seconds, the LED on the Greenhouse
            should turn green, and you will be able to view measurements on the
            corresponding page under "Dashboard".
          </GettingStartedLi>
        </GettingStartedOl>
        <GettingStartedBody>
          If the Greenhouse loses connection, it will only re-pair to the
          previously connected access point. This condition is signaled by slow
          red flashing of the LED. To re-pair, simply press the rightmost button
          on the Greenhouse again.
        </GettingStartedBody>
      </GettingStartedSection>

      <GettingStartedSection subheading="Sensor Warnings">
        <GettingStartedBody gutterBottom>
          Go to{' '}
          <Link
            onClick={() => navigate(PAGE_URL.myGreenhouses.href)}
            {...linkProps}
          >
            {PAGE_URL.myGreenhouses.pageTitle}
          </Link>{' '}
          in order to configure thresholds for sensor readings. If the sensor
          values fall outside of those thresholds, the Greenhouse will emit a
          period beeping noise and display any combination of six different
          codes, one for each sensor value.
          <br />
          The different LED codes are detailed on{' '}
          <Link href="https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/wikis/Sensor%20Station%20LED%20Status%20Codes#sensor-warnings">
            this page
          </Link>{' '}
          of the project wiki.
        </GettingStartedBody>

        <GettingStartedBody gutterBottom>
          Sensor warnings are not cleared automatically, the Greenhouse will
          keep emitting an audiovisual warning until the warning state has been
          cleared.
        </GettingStartedBody>

        <GettingStartedBody>
          In order to clear active sensor warnings:
        </GettingStartedBody>

        <GettingStartedOl>
          <GettingStartedLi>
            Ensure that the sensor values are within the thresholds set on{' '}
            <Link
              onClick={() => navigate(PAGE_URL.myGreenhouses.href)}
              {...linkProps}
            >
              {PAGE_URL.myGreenhouses.pageTitle}
            </Link>
            .
          </GettingStartedLi>
          <GettingStartedLi>
            Press the middle button on the Greenhouse (connected to pin D3 of
            the Arduino).
          </GettingStartedLi>
        </GettingStartedOl>
      </GettingStartedSection>
    </Stack>
  )
}
