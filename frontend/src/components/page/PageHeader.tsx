import React from 'react'

import Box from '@mui/system/Box'

import { theme } from '~/styles/theme'

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
        alignItems: 'center',
        // Keep the header the same size as the sidebar header
        ...theme.mixins.toolbar,
      }}
    >
      {props.left}
      {props.right}
    </Box>
  )
}
