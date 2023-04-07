import React from 'react'

import Box from '@mui/material/Box'
import {
  GridColDef,
  GridValidRowModel,
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
} from '@mui/x-data-grid'

import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'

export type RowUpdateFunction<R extends GridValidRowModel> = (
  newRow: R,
  oldRow: R
) => Promise<R>

/** Extend and limit {@link MuiDataGridProps} to provide additional type hints and safety. */
interface DataGridProps<R extends GridValidRowModel, V, F>
  extends MuiDataGridProps<R> {
  columns: GridColDef<R, V, F>[]
  loading: boolean
  processRowUpdate: RowUpdateFunction<R>
  rows: readonly R[]
}

/**
 * Wrapper component for MUI's DataGrid component.
 * Use to display filterable, editable table contents.
 */
export const DataGrid = <R extends GridValidRowModel, V, F = V>(
  props: DataGridProps<R, V, F>
): React.ReactElement => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const { ...gridProps } = props

  const onProcessRowUpdateError = (err: Error) =>
    addSnackbarMessage({
      header: 'Could not load users',
      body: err.message,
      type: MessageType.ERROR,
    })

  return (
    <Box sx={{ width: '100%' }}>
      <MuiDataGrid
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        isRowSelectable={() => false}
        pageSizeOptions={[5, 10, 25]}
        onProcessRowUpdateError={onProcessRowUpdateError}
        {...gridProps}
      />
    </Box>
  )
}
