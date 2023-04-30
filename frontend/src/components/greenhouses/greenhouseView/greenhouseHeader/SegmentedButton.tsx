import React from 'react'

import Button, { ButtonProps } from '@mui/material/Button'
import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system/styleFunctionSx'

import { Tooltip } from '@component-lib/Tooltip'
import { isUserLoggedIn } from '~/helpers/jwt'
import { theme } from '~/styles/theme'

interface SegmentedButtonProps extends ButtonProps {
  /** Icon to show only if the segmented button is currently selected */
  icon: React.ReactNode
  /** If true then the button is only clickable if the user is logged in */
  loggedInOnly: boolean
  /** Whether the segment is currently selected */
  selected: boolean
  /** Styles applied to selector `.MuiButtonGroup-grouped` */
  sx: SystemStyleObject<Theme>
}
/** Component for a single button within a group of segmented buttons */
export const SegmentedButton: React.FC<SegmentedButtonProps> = (props) => {
  const { icon, selected, sx, loggedInOnly, ...buttonProps } = props

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
    <Tooltip
      arrow
      title={
        !isUserLoggedIn() && loggedInOnly ? 'Log in to view this page' : ''
      }
    >
      <Button
        {...buttonProps}
        disabled={props.selected || (!isUserLoggedIn() && loggedInOnly)}
        startIcon={props.selected ? icon : null}
        sx={{
          ...(props.selected ? selectedBtnStyles : unselectedBtnStyles),
          '&.MuiButtonGroup-grouped': sx ?? {},
        }}
      />
    </Tooltip>
  )
}
