import React from 'react'

import Box from '@mui/system/Box'

import { theme } from '~/styles/theme'

interface PageHeaderProps {
  /** Contents to left-align */
  left?: React.ReactNode
  /** C?ontents to right-align */
  right?: React.ReactNode
}

/**
 * Reusable page header component. Should be used as the first child of {@link PageWrapper}.
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
        background: 'cyan',
        // Keep the header the same size as the sidebar header
        ...theme.mixins.toolbar,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          placeContent: 'flex-start',
        }}
      >
        {props.left}
      </Box>
      <Box
        sx={{
          display: 'flex',
          placeContent: 'flex-end',
        }}
      >
        {props.right}
      </Box>
    </Box>
  )
}
