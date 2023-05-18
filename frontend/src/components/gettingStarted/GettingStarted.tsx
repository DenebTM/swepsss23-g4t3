import React from 'react'
import { useNavigate } from 'react-router-dom'

import CheckIcon from '@mui/icons-material/Check'
import Card from '@mui/material/Card'
import Link, { LinkProps } from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Stack from '@mui/system/Stack'

import { GreenhouseIcon } from '~/common'
import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { theme } from '~/styles/theme'

import { PageTitle } from '../page/PageTitle'

/** Reusable component for subheadings inside getting started page */
const GettingStartedSubheading = (props: { children: React.ReactNode }) => (
  <Typography component="h6" variant="titleLarge" color="onSurfaceVariant">
    {props.children}
  </Typography>
)

/** Reusable component for each subsection of the getting started page */
const GettingStartedSection = (props: { children: React.ReactNode }) => (
  <Card sx={{ padding: theme.spacing(3, 2) }}>{props.children}</Card>
)

/** Props for links in the GettingStarted page */
const linkProps: Partial<LinkProps> = {
  underline: 'always',
  sx: { cursor: 'pointer' },
}

/**
 * Page containing basic instructions about how to get started with the app
 */
export const GettingStarted: React.FC = () => {
  const navigate = useNavigate()

  return (
    <PageWrapper permittedRoles={PAGE_URL.gettingStarted.permittedRoles}>
      <PageHeader
        left={<PageTitle>{PAGE_URL.gettingStarted.pageTitle}</PageTitle>}
      />

      <Typography color="outlineVariant" variant="bodySmall" gutterBottom>
        <b>Note:</b> this guide assumes that all devices are already set up with
        the necessary dependencies/project files/firmware/wiring/etc.
      </Typography>
      <Typography color="outlineVariant" variant="bodySmall">
        For additional information, please refer to the project{' '}
        <Link href="https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/wikis/home">
          wiki
        </Link>{' '}
        and{' '}
        <Link href="https://git.uibk.ac.at/informatik/qe/swess23/group4/g4t3/-/blob/690e66b84beca72c807af26bdeec6f2d37fd7929/README.md">
          README
        </Link>
        .
      </Typography>

      <Stack spacing={2} sx={{ padding: theme.spacing(2, 0) }}>
        <GettingStartedSection>
          <GettingStartedSubheading>
            Connecting an Access Point
          </GettingStartedSubheading>
          <ol>
            <li>
              Plug in the Raspberry Pi and connect it to the network via Wi-Fi.
            </li>
            <li>
              Run the './configure' script to set up the correct web server
              address. Make sure to check your firewall settings in order to
              allow external devices to connect to the web server running on
              your machine.
            </li>
            <li>
              Run 'python3 main.py'. The Access Point will automatically
              register itself with the web server and be displayed on the{' '}
              <Link
                onClick={() => navigate(PAGE_URL.manageAccessPoints.href)}
                {...linkProps}
              >
                {PAGE_URL.manageAccessPoints.pageTitle}
              </Link>{' '}
              page with a yellow highlight and status "unconfirmed". Press the{' '}
              <CheckIcon /> button to confirm and allow it to communicate with
              the web server.
            </li>
          </ol>
        </GettingStartedSection>

        <GettingStartedSection>
          <GettingStartedSubheading>
            Pairing a Greenhouse
          </GettingStartedSubheading>
          <ol>
            <li>Set the Greenhouse's ID using the DIP switch.</li>
            <li>
              The LED will initially glow solid red.
              <br />
              Press the righmost button on the Greenhouse (the one connected to
              pin D2 of the Arduino). The LED will begin rapidly flashing blue.
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
              Wait roughly 10 seconds, then open the Sensor Station dropdown
              menu. Select the ID of the Greenhouse with the ID that you want to
              pair.
            </li>
            <li>
              Press Confirm. After a few more seconds, the LED on the Greenhouse
              should turn green, and you will be able to view measurements on
              the corresponding page under "Dashboard".
            </li>
          </ol>
          <p>
            If the Greenhouse loses connection, it will only re-pair to the
            previously connected access point. This condition is signaled by
            slow red flashing of the LED. To re-pair, simply press the rightmost
            button on the Greenhouse again.
          </p>
        </GettingStartedSection>

        <GettingStartedSection>
          <GettingStartedSubheading>Sensor warnings</GettingStartedSubheading>
          <p>
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
          </p>
          <p>
            Sensor warnings are not cleared automatically, the Greenhouse will
            keep emitting an audiovisual warning until the warning state has
            been cleared.
            <br />
            In order to clear active sensor warnings:
            <ol>
              <li>
                Ensure that the sensor values are within the thresholds set on{' '}
                <Link
                  onClick={() => navigate(PAGE_URL.myGreenhouses.href)}
                  {...linkProps}
                >
                  {PAGE_URL.myGreenhouses.pageTitle}
                </Link>
                .
              </li>
              <li>
                Press the middle button on the Greenhouse (connected to pin D3
                of the Arduino).
              </li>
            </ol>
          </p>
        </GettingStartedSection>
      </Stack>
    </PageWrapper>
  )
}
