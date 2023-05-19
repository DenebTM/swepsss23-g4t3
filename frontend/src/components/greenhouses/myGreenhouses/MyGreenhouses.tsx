import React, { useState } from 'react'

import Typography from '@mui/material/Typography'

import { Spinner } from '@component-lib/Spinner'
import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageTitle } from '~/components/page/PageTitle'
import { PageWrapper } from '~/components/page/PageWrapper'
import { useSensorStations } from '~/hooks/appContext'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseAccordion } from './GreenhouseAccordion/GreenhouseAccordion'

/**
 * Page for a gardener to see all greenhouses assigned to them
 */
export const MyGreenhouses: React.FC = () => {
  const sensorStations = useSensorStations(true) // qqjf TODO reload periodically?

  // Store the currently expanded ssID in the state if an accordion is expanded, otherwise `null`
  const [expanded, setExpanded] = useState<SensorStationUuid | null>(null)

  return (
    <PageWrapper permittedRoles={PAGE_URL.myGreenhouses.permittedRoles}>
      <PageHeader
        left={<PageTitle>{PAGE_URL.myGreenhouses.pageTitle}</PageTitle>}
      />
      {sensorStations ? (
        sensorStations.length > 0 ? (
          sensorStations.map((s) => (
            <GreenhouseAccordion
              key={s.ssID}
              expanded={expanded === s.ssID}
              sensorStation={s}
              setExpanded={setExpanded}
            />
          ))
        ) : (
          <Typography variant="bodyLarge" color="onSurface" marginTop={2}>
            You can manage your greenhouses here once you are assigned to at
            least one greenhouse.
          </Typography>
        )
      ) : (
        <Spinner center />
      )}
    </PageWrapper>
  )
}
