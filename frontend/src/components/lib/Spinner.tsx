import React from 'react'

import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress'

interface SpinnerProps extends CircularProgressProps {
  center?: boolean
}

/**
 * Circular spinner component to show (indeterminate) loading progress.
 * Centers spinner in parent component if `props.center` is true.
 */
export const Spinner: React.FC<SpinnerProps> = (props) => {
  const { center, sx, color, ...spinnerProps } = { ...props }

  const spinnerStyles = center ? { alignSelf: 'center', marginTop: 8 } : {}

  return (
    <CircularProgress
      color={color ?? 'primary'}
      sx={{ ...spinnerStyles, ...(sx ?? {}) }}
      {...spinnerProps}
    />
  )
}
