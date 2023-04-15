import React, { useState } from 'react'

import Typography from '@mui/material/Typography'

import { PAGE_URL } from '~/common'
import { PageHeader } from '~/components/page/PageHeader'
import { PageWrapper } from '~/components/page/PageWrapper'
import { useSensorStations } from '~/hooks/appContext'
import { SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseAccordion } from './GreenhouseAccordion/GreenhouseAccordion'

/**
 * Page for a gardener to see all greenhouses assigned to them
 */
export const MyGreenhouses: React.FC = () => {
  const sensorStations = useSensorStations() // qqjf TODO reload periodically?

  // Store the currently expanded uuid in the state if an accordion is expanded, otherwise `null`
  const [expanded, setExpanded] = useState<SensorStationUuid | null>(null)

  return (
    <PageWrapper permittedRoles={PAGE_URL.myGreenhouses.permittedRoles}>
      <PageHeader
        left={
          <Typography
            variant="headlineLarge"
            color="onSurfaceVariant"
            component="h1"
          >
            {PAGE_URL.myGreenhouses.pageTitle}
          </Typography>
        }
      />
      {sensorStations &&
        sensorStations.map((s) => (
          <GreenhouseAccordion
            key={s.uuid}
            expanded={expanded === s.uuid}
            sensorStation={s}
            setExpanded={setExpanded}
          />
        ))}
    </PageWrapper>
  )
}
