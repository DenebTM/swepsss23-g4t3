import React from 'react'

import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'

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
  return props.editing ? (
    <Button
      onClick={props.saveRow}
      endIcon={<CheckIcon />}
      size="small"
      variant="contained"
      color="primary"
    >
      Save
    </Button>
  ) : (
    <Button
      onClick={props.startEditing}
      endIcon={<EditIcon />}
      sx={{ color: theme.onSurfaceVariant }}
      size="small"
      variant="text"
    >
      Edit
    </Button>
  )
}
