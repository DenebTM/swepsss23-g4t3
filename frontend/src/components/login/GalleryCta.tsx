import React from 'react'

import Link from '@mui/material/Link'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Box from '@mui/system/Box'

import { PAGE_URL } from '~/common'
import { theme } from '~/styles/theme'

const ctaTypographyProps: Partial<TypographyProps> = {
  variant: 'bodyMedium',
  color: 'outline',
}

/**
 * CTA to preview gallery pages
 */
export const GalleryCta: React.FC = () => {
  return (
    <Box
      component="div"
      display="flex"
      alignItems="center"
      padding={3}
      sx={{ color: theme.onSurfaceVariant }}
    >
      <Typography marginRight={0.5} {...ctaTypographyProps}>
        New here?
      </Typography>
      <Link
        variant="bodyMedium"
        underline="hover"
        color="inherit"
        href={PAGE_URL.gettingStarted.href} // Deliberately use href rather than navigate to reset cached logged in state
        sx={{ cursor: 'pointer' }}
      >
        Get started
      </Link>
      <Typography {...ctaTypographyProps}>.</Typography>
    </Box>
  )
}
