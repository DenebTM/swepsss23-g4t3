import React from 'react'

import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'

import { theme } from '~/styles/theme'

interface EditRowButtonProps {
  onClick: React.MouseEventHandler<HTMLDivElement>
}
/**
 * Clickable cell to trigger editing the current row of the greenhouses accordion.
 */
export const EditRowButton: React.FC<EditRowButtonProps> = (props) => {
  return (
    <Button
      size="small"
      variant="text"
      endIcon={<EditIcon />}
      sx={{ color: theme.onSurfaceVariant }}
    >
      Edit
    </Button>
  )
}
