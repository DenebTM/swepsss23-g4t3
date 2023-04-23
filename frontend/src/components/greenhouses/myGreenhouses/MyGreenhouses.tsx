import React, { useState } from 'react'

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
  const sensorStations = useSensorStations() // qqjf TODO reload periodically?

  // Store the currently expanded uuid in the state if an accordion is expanded, otherwise `null`
  const [expanded, setExpanded] = useState<SensorStationUuid | null>(null)

  return (
    <PageWrapper permittedRoles={PAGE_URL.myGreenhouses.permittedRoles}>
      <PageHeader
        left={<PageTitle>{PAGE_URL.myGreenhouses.pageTitle}</PageTitle>}
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
