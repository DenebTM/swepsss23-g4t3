import React from 'react'

import { useTheme } from '@mui/material/styles'
import Box from '@mui/system/Box'

interface PageHeaderProps {
  /** Contents to left-align */
  left?: React.ReactNode
  /** Contents to right-align */
  right?: React.ReactNode
}

/**
 * Reusable page header component. Should be used as the first child of {@link PageWrapper}.
 * Displays `props.left` and `props.right` in a full-width flexbox with space between.
 */
export const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        background: theme.background,
        paddingTop: 2,
        paddingBottom: 1,
        maxHeight: theme.spacing(8),
        // Keep the header the same size as the sidebar header
        ...theme.mixins.toolbar,
      }}
    >
      {props.left}
      {props.right}
    </Box>
  )
}
