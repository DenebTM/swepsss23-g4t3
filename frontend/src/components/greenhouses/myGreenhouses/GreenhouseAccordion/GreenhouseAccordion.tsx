import React, { Dispatch, SetStateAction } from 'react'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import { useTheme } from '@mui/material/styles'

import { SensorStation, SensorStationUuid } from '~/models/sensorStation'

import { GreenhouseAccordionContents } from './GreenhouseAccordionContents/GreenhouseAccordionContents'
import { GreenhouseAccordionSummary } from './GreenhouseAccordionSummary/GreenhouseAccordionSummary'

interface GreenhouseAccordionProps {
  expanded: boolean
  sensorStation: SensorStation
  setExpanded: Dispatch<SetStateAction<SensorStationUuid | null>>
}

/**
 * Accordion containing settings for each greenhouse assigned to a given user
 */
export const GreenhouseAccordion: React.FC<GreenhouseAccordionProps> = (
  props
) => {
  const theme = useTheme()

  /** Either expand the current panel or close the panel on click. */
  const handleChange =
    (ssID: SensorStationUuid) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      props.setExpanded(isExpanded ? ssID : null)
    }

  return (
    <Accordion
      expanded={props.expanded}
      onChange={handleChange(props.sensorStation.ssID)}
      TransitionProps={{ unmountOnExit: true }}
      sx={{
        '&.Mui-expanded:last-of-type': {
          marginBottom: theme.spacing(2), // Add space after the last expanded accordion
        },
      }}
    >
      <GreenhouseAccordionSummary sensorStation={props.sensorStation} />
      <AccordionDetails
        sx={{
          background: theme.surfaceVariant,
          padding: theme.spacing(1, 0, 2),
        }}
      >
        <GreenhouseAccordionContents sensorStation={props.sensorStation} />
      </AccordionDetails>
    </Accordion>
  )
}
