import React from 'react'
import { useNavigate } from 'react-router-dom'

import CheckIcon from '@mui/icons-material/Check'
import Link, { LinkProps } from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import Stack from '@mui/system/Stack'

import { GreenhouseIcon, PAGE_URL } from '~/common'
import { useUserRole } from '~/hooks/user'
import { GuestRole } from '~/models/user'

import {
  GettingStartedBody,
  GettingStartedLi,
  GettingStartedOl,
  GettingStartedSection,
} from './GettingStartedPageComponents'

/** Props for icons in the GettingStarted page */
const iconProps: Partial<SvgIconTypeMap['props']> = {
  fontSize: 'small',
  sx: { verticalAlign: 'bottom' },
}

/** Props for links in the GettingStarted page */
const linkProps: Partial<LinkProps> = {
  underline: 'always',
  sx: { cursor: 'pointer' },
}

/**
 * Page contents for the "Getting Started" page.
 */
export const GettingStartedPageContents: React.FC = () => {
  const theme = useTheme()

  const navigate = useNavigate()

  const isLoggedIn = useUserRole() !== GuestRole.GUEST
  const navigateLoggedIn = (href: string) =>
    navigate(isLoggedIn ? href : PAGE_URL.login.href)

  return (
    <Stack spacing={2} sx={{ padding: theme.spacing(2, 0) }}>
      <GettingStartedSection subheading="Connecting an Access Point">
        <GettingStartedOl>
          <GettingStartedLi>
            Plug in the Raspberry Pi and connect it to the network via Wi-Fi.
          </GettingStartedLi>
          <GettingStartedLi>
            Run the './configure' script to set up the correct web server
            address for the Access Point to connect to. Make sure to check your
            firewall settings, to ensure that other devices can connect to the
            web server running on your machine.
          </GettingStartedLi>
          <GettingStartedLi>
            Run 'python3 main.py'. The Access Point will automatically register
            itself with the web server and be displayed on the{' '}
            <Link
              onClick={() => navigateLoggedIn(PAGE_URL.manageAccessPoints.href)}
              {...linkProps}
            >
              {PAGE_URL.manageAccessPoints.pageTitle}
            </Link>{' '}
            page with a yellow highlight and status "unconfirmed". Press the{' '}
            <CheckIcon {...iconProps} /> button to confirm and allow it to
            communicate with the web server.
          </GettingStartedLi>
        </GettingStartedOl>
      </GettingStartedSection>

      <GettingStartedSection subheading="Pairing With a Greenhouse">
        <GettingStartedOl>
          <GettingStartedLi>
            Set the greenhouse's ID using the DIP switch.
          </GettingStartedLi>
          <GettingStartedLi>
            The LED will initially glow solid red.
            <br />
            Press the righmost button on the greenhouse (the one connected to
            pin D2 of the Arduino). The LED will begin rapidly flashing blue.
          </GettingStartedLi>
          <GettingStartedLi>
            Navigate to{' '}
            <Link
              onClick={() => navigateLoggedIn(PAGE_URL.manageAccessPoints.href)}
              {...linkProps}
            >
              {PAGE_URL.manageAccessPoints.pageTitle}
            </Link>
          </GettingStartedLi>
          <GettingStartedLi>
            Click the <GreenhouseIcon {...iconProps} /> button on the right.
          </GettingStartedLi>
          <GettingStartedLi>
            Wait roughly 10 seconds, then open the sensor station dropdown menu.
            Select the ID of the greenhouse with the ID that you want to pair.
          </GettingStartedLi>
          <GettingStartedLi>
            Press "Confirm". After a few more seconds, the LED on the greenhouse
            should turn green, and you will be able to view measurements on the
            corresponding page under "Dashboard".
          </GettingStartedLi>
        </GettingStartedOl>
        <GettingStartedBody>
          If the greenhouse loses connection, it will only re-pair to the
          previously connected access point. This condition is signaled by slow
          red flashing of the LED. To re-pair, simply press the rightmost button
          on the greenhouse again.
        </GettingStartedBody>
      </GettingStartedSection>

      <GettingStartedSection subheading="Sensor Warnings">
        <GettingStartedBody gutterBottom>
          Go to{' '}
          <Link
            onClick={() => navigateLoggedIn(PAGE_URL.myGreenhouses.href)}
            {...linkProps}
          >
            {PAGE_URL.myGreenhouses.pageTitle}
          </Link>{' '}
          in order to configure thresholds for sensor readings. If the sensor
          values fall outside of those thresholds, the greenhouse will emit a
          periodic beeping noise and display in sequence any combination of six
          different blink codes on the LED, one for each sensor.
          <br />
          The different LED codes are detailed on{' '}
          <Link href="https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/wikis/Sensor%20Station%20LED%20Status%20Codes#sensor-warnings">
            this page
          </Link>{' '}
          of the project wiki.
        </GettingStartedBody>

        <GettingStartedBody gutterBottom>
          Sensor warnings are not cleared automatically, the greenhouse will
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
              onClick={() => navigateLoggedIn(PAGE_URL.myGreenhouses.href)}
              {...linkProps}
            >
              {PAGE_URL.myGreenhouses.pageTitle}
            </Link>
            .
          </GettingStartedLi>
          <GettingStartedLi>
            Press the middle button on the greenhouse (connected to pin D3 of
            the Arduino).
          </GettingStartedLi>
        </GettingStartedOl>
      </GettingStartedSection>
    </Stack>
  )
}
