import React from 'react'

import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

export interface DonutValue {
  /** The display name of this value */
  displayName: string
  /** The entities for which this value holds, i.e. a list of names of sensor stations or access points */
  entities: string[]
  /** Pie segment fill colour */
  fill: string
  /** Background colour of floating legend */
  legendFill: string
  /** Text colour of floating legend  */
  legendText: string
  /** The number of entities with this value */
  value: number
}

interface DonutFloatingLegendProps {
  /** Data to display in the legend. If undefined, then the legend will not be shown. */
  data: DonutValue
  /** Client y-coordinate on hovered pie segment */
  clientX: number
  /** Client y-coordinate on hovered pie segment */
  clientY: number
}

/**
 * Floating legend component showing entities with the status shown in the hovered donut segment.
 */
export const DonutFloatingLegend: React.FC<DonutFloatingLegendProps> = (
  props
) => {
  const theme = useTheme()

  return (
    <Fade in mountOnEnter unmountOnExit>
      <Box
        component="div"
        sx={{
          position: 'fixed',
          left: props.clientX - 140, // Shift legend away from the edge of the page
          top: props.clientY + 8,
          background: props.data.legendFill,
          padding: theme.spacing(1, 2),
          borderRadius: 1,
          boxShadow: theme.shadows[1],
          zIndex: theme.zIndex.tooltip,
        }}
      >
        <Typography
          color={props.data.legendText}
          variant="titleMedium"
          gutterBottom
          align="center"
          display="block"
        >
          {props.data.displayName}
        </Typography>
        {props.data.entities.map((entityName, index) => (
          <Typography
            key={`entity=${index}`}
            color={props.data.legendText}
            variant="bodyMedium"
            align="center"
            display="block"
          >
            {entityName}
          </Typography>
        ))}
      </Box>
    </Fade>
  )
}
