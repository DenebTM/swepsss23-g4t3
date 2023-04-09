import React, { useState } from 'react'

import Typography from '@mui/material/Typography'

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

  const [expanded, setExpanded] = useState<SensorStationUuid | false>(false)

  return (
    <PageWrapper>
      <PageHeader
        left={
          <Typography
            variant="headlineLarge"
            color="onSurfaceVariant"
            component="h1"
          >
            My Greenhouses
          </Typography>
        }
      />
      {sensorStations &&
        sensorStations.map((s) => (
          <GreenhouseAccordion
            expanded={expanded === s.uuid}
            sensorStation={s}
            setExpanded={setExpanded}
          />
        ))}
    </PageWrapper>
  )
}
