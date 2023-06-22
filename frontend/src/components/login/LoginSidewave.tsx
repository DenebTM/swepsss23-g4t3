import React from 'react'

import { alpha, useTheme } from '@mui/material/styles'
import Box from '@mui/system/Box'

import { PlantIcon } from '@component-lib/icons/PlantIcon'

/**
 * Sidebar wave component to display next to the login form on wider screens
 */
export const LoginSidewave: React.FC = () => {
  const theme = useTheme()

  /** Plant icon height in units of theme.spacing */
  const plantIconHeight = 36
  const plantIconSize = {
    height: theme.spacing(plantIconHeight),
    width: theme.spacing(plantIconHeight),
  }

  return (
    <>
      <Box
        component="div"
        sx={{
          position: 'absolute',
          left: theme.spacing(-2),
          bottom: theme.spacing(-3.5),
          zIndex: theme.zIndex.drawer + 1,
          ...plantIconSize,
          overflowY: 'clip',
        }}
      >
        <PlantIcon color={alpha(theme.background, 0.7)} {...plantIconSize} />
      </Box>
      <Box
        component="div"
        sx={{
          userSelect: 'none',
          height: '100vh',
          overflowY: 'hidden',
          overflowX: 'clip',
          zIndex: theme.zIndex.drawer,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100%"
          height="100%"
          viewBox="0 0 450 768"
          fill="none"
          x="0"
          y="0"
          preserveAspectRatio="none"
        >
          <g id="svgg">
            <path
              id="path0"
              d="M0 0H404.354C545.557 445.5 297 523 404.354 768H0V0Z"
              stroke="none"
              fill={theme.primary}
              fillRule="evenodd"
            ></path>
          </g>
        </svg>
      </Box>
    </>
  )
}
