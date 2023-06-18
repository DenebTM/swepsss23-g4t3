import React, { Dispatch, SetStateAction, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import { GridValidRowModel } from '@mui/x-data-grid'

import { DeleteDialog } from '@component-lib/DeleteDialog'
import { Tooltip } from '@component-lib/Tooltip'
import { theme } from '~/styles/theme'

/**
 * Props for generically-typed table cell to delete a given entity.
 * @param R The row type
 * @param T The type of the id of objects of type R
 */
interface DeleteCellProps<R extends GridValidRowModel, T = number> {
  /** Callback to run after successful entity deletion */
  afterDelete?: () => void
  /** Children will be displayed before the delete icon */
  children?: React.ReactNode
  /** Function to delete a table row by entityId */
  deleteEntity: (entityId: T) => Promise<any>
  /** The name of the entity shown in the table. Used to display informative messages to users. */
  entityName: string
  /** The type of the unique identifier of a given row */
  entityId: T
  /** Get the unique row identifier from a row of type R */
  getEntityId: (row: R) => T
  /** Set table rows after successful deletion */
  setRows: Dispatch<SetStateAction<R[] | undefined>>
}

/**
 * Table cell containing a button to delete the entity in the current row.
 * A dialog is shown to confirm or cancel deletion.
 */
export const DeleteCell = <R extends GridValidRowModel, T = string>(
  props: DeleteCellProps<R, T>
): JSX.Element => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  /** Open the delete dialog when the delete icon is clicked */
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent selecting the cell on click
    setDeleteDialogOpen(true)
  }

  return (
    <>
      {props.children}
      <Tooltip title={`Delete ${props.entityName}`} arrow>
        <IconButton onClick={handleIconClick} sx={{ color: theme.outline }}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <DeleteDialog
        afterDelete={() => {
          props.setRows((oldRows) => {
            if (typeof oldRows === 'undefined') {
              return []
            } else {
              return oldRows.filter(
                (row) => props.getEntityId(row) !== props.entityId
              )
            }
          })
          props.afterDelete?.()
        }}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        entityName={props.entityName}
        handleDelete={() => props.deleteEntity(props.entityId)}
      />
    </>
  )
}
