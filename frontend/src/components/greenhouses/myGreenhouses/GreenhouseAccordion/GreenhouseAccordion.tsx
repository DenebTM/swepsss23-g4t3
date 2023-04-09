import React, { Dispatch, SetStateAction } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'

import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseAccordionContents } from './GreenhouseAccordionContents/GreenhouseAccordionContents'
import { GreenhouseAccordionSummary } from './GreenhouseAccordionSummary/GreenhouseAccordionSummary'

interface GreenhouseAccordionProps {
  expanded: boolean
  sensorStation: SensorStation
  setExpanded: Dispatch<SetStateAction<SensorStationUuid | false>>
}

/**
 * Accordion containing settings for each greenhouse assigned to a given user
 */
export const GreenhouseAccordion: React.FC<GreenhouseAccordionProps> = (
  props
) => {
  /** Handle click on the accordion panel */
  const handleChange =
    (uuid: SensorStationUuid) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? uuid : false)
    }

  return (
    <Accordion
      expanded={props.expanded}
      onChange={handleChange(props.sensorStation.uuid)}
    >
      <GreenhouseAccordionSummary sensorStation={props.sensorStation} />
      <AccordionDetails>
        <GreenhouseAccordionContents sensorStation={props.sensorStation} />
      </AccordionDetails>
    </Accordion>
  )
}
