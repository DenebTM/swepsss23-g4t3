import React from 'react'

import Button, { ButtonProps } from '@mui/material/Button'

import { theme } from '~/styles/theme'

interface SegmentedButtonProps extends ButtonProps {
  selected: boolean
}
/** Component for a single button within a group of segmented buttons */
export const SegmentedButton: React.FC<SegmentedButtonProps> = (props) => {
  const { selected, ...buttonProps } = props

  /** Styles for a selected button segment */
  const selectedBtnStyles = {
    '&.Mui-disabled': {
      color: theme.onSecondaryContainer,
      background: theme.secondaryContainer,
      borderColor: theme.outline,
    },
  }

  /** Styles for an unselected button segment */
  const unselectedBtnStyles = {
    text: theme.onSurfaceVariant,
    borderColor: theme.outline,
    '&:hover': {
      background: theme.inverseOnSurface,
    },
  }
  return (
    <Button
      {...buttonProps}
      disabled={props.selected}
      sx={props.selected ? selectedBtnStyles : unselectedBtnStyles}
    />
  )
}
