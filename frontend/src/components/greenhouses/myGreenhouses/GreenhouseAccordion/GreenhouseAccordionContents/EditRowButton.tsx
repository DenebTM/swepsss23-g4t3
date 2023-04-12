import React from 'react'

import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import Button, { ButtonProps } from '@mui/material/Button'

import { theme } from '~/styles/theme'

interface EditRowButtonProps {
  /** True if currently editing this row */
  editing: boolean
  /** Enter editing state */
  startEditing: () => void
  /** Save row values and exit editing state */
  saveRow: React.MouseEventHandler<HTMLButtonElement>
}
/**
 * Clickable cell to trigger editing the current row of the greenhouses accordion.
 */
export const EditRowButton: React.FC<EditRowButtonProps> = (props) => {
  const buttonProps: ButtonProps = {
    size: 'small',
    sx: {
      width: theme.spacing(10),
    },
  }

  return props.editing ? (
    <Button
      onClick={props.saveRow}
      endIcon={<CheckIcon />}
      variant="contained"
      color="primary"
      {...buttonProps}
    >
      Save
    </Button>
  ) : (
    <Button
      onClick={props.startEditing}
      endIcon={<EditIcon />}
      sx={{ color: theme.onSurfaceVariant }}
      variant="text"
      {...buttonProps}
    >
      Edit
    </Button>
  )
}
