import React from 'react'

import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'

import { theme } from '~/styles/theme'

interface EditRowButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}
/**
 * Clickable cell to trigger editing the current row of the greenhouses accordion.
 */
export const EditRowButton: React.FC<EditRowButtonProps> = (props) => {
  return (
    <Button
      size="small"
      variant="text"
      onClick={props.onClick}
      endIcon={<EditIcon />}
      sx={{ color: theme.onSurfaceVariant }}
    >
      Edit
    </Button>
  )
}
