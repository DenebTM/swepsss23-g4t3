import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import { Spinner } from './Spinner'

interface DashboardCardProps {
  /** The card contents */
  children: React.ReactNode
  /** If true, render `props.emptyText` rather than `props.children` */
  empty?: boolean
  /** Text to display if `props.empty` is true and `props.loading` is false */
  emptyText?: string
  /** Whether to show a loading indicator */
  loading?: boolean
}

/**
 * Reusable component for the main elements in the Dashboard and greenhouse graphical overview screen
 */
export const DashboardCard: React.FC<DashboardCardProps> = (props) => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: '200px', // TODO qqjf make this responsive
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {props.loading ? (
          <Spinner />
        ) : props.empty ? (
          <Typography
            variant="bodyMedium"
            color="onSurfaceVariant"
            align="center"
            sx={{ margin: theme.spacing(1, 4) }}
          >
            {props.emptyText}
          </Typography>
        ) : (
          props.children
        )}
      </CardContent>
    </Card>
  )
}
