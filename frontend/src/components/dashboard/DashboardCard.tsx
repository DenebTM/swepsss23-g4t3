import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

interface DashboardCardProps {
  /** The card contents */
  children: React.ReactNode
}

/**
 * Reusable component for the main elements in the Dashboard screen
 */
export const DashboardCard: React.FC<DashboardCardProps> = (props) => {
  return (
    <Card sx={{ height: '100%', background: 'pink' }}>
      <CardContent>{props.children}</CardContent>
    </Card>
  )
}
