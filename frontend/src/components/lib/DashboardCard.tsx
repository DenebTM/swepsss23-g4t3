import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { Spinner } from './Spinner'

interface DashboardCardProps {
  /** The card contents */
  children: React.ReactNode
  /** Whether to show a loading indicator */
  loading?: boolean
}

/**
 * Reusable component for the main elements in the Dashboard and greenhouse graphical overview screen
 */
export const DashboardCard: React.FC<DashboardCardProps> = (props) => {
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
        {props.loading ? <Spinner /> : props.children}
      </CardContent>
    </Card>
  )
}
