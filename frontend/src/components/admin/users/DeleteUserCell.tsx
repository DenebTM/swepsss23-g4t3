import React, { Dispatch, SetStateAction, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import { DeleteDialog } from '@component-lib/DeleteDialog'
import { Tooltip } from '@component-lib/Tooltip'
import { deleteUser } from '~/api/endpoints/user'
import { User, Username } from '~/models/user'
import { theme } from '~/styles/theme'

interface DeleteUserCellProps {
  username: Username
  setUsers: Dispatch<SetStateAction<User[] | undefined>>
}

/**
 * Table cell containing a button to delete the user in the current row.
 * A dialog is shown to confirm or cancel deletion.
 */
export const DeleteUserCell: React.FC<DeleteUserCellProps> = (props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  /** Open the delete dialog when the delete icon is clicked */
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent selecting the cell on click
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <Tooltip title={`Delete ${props.username}`} arrow>
        <IconButton onClick={handleIconClick} sx={{ color: theme.outline }}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <DeleteDialog
        afterDelete={() => {
          props.setUsers((oldUsers) => {
            if (typeof oldUsers === 'undefined') {
              return []
            } else {
              return oldUsers.filter((u) => u.username !== props.username)
            }
          })
        }}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        entityName={props.username}
        handleDelete={() => deleteUser(props.username)}
      />
    </>
  )
}
