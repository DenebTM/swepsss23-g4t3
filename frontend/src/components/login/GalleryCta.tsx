import React from 'react'
import { useNavigate } from 'react-router-dom'

import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { PAGE_URL } from '~/common'
import { theme } from '~/styles/theme'

/**
 * GTA to preview gallery pages
 */
export const GalleryCta: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Box
      component="div"
      display="flex"
      alignItems="center"
      padding={3}
      sx={{ color: theme.onSurfaceVariant }}
    >
      <Typography
        variant="bodyMedium"
        align="center"
        color="outline"
        component="h1"
        marginRight={0.5}
      >
        New here?
      </Typography>
      <Link
        variant="bodyMedium"
        underline="hover"
        color="inherit"
        onClick={() => navigate(PAGE_URL.gettingStarted.href)}
        sx={{ cursor: 'pointer' }}
      >
        Get started.
      </Link>
    </Box>
  )
}
