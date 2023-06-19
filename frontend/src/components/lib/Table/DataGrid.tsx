import { cancelable } from 'cancelable-promise'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import { SxProps, Theme, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {
  gridClasses,
  GridColDef,
  GridRowClassNameParams,
  GridValidRowModel,
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
} from '@mui/x-data-grid'

import { Message, MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'

/**
 * Handle changes to editable cells. Note that this function does not need to update rows as this is handled inside MUI's DataGrid component
    @template R The type of each row object.
    @param newRow Row object with the new values.
    @param oldRow Row object with the old values.
    @returns The final values to update the row.
 */
export type RowUpdateFunction<R extends GridValidRowModel> = (
  newRow: R,
  oldRow: R
) => Promise<R>

/**
 * Custom styling to support changing the colour of even rows.
 * This not be handled with `styled` as we need access to the fixed value of `R`
 * in the main component to correctly type the MuiDataGrid props.
 *
 * Should also define `&.Mui-selected` if we need this in the future:
 * see https://mui.com/x/react-data-grid/style/#styling-rows
 */
const dataGridRowSx = (theme: Theme): SxProps<Theme> => {
  const hoveredRowColour =
    theme.mode === 'light'
      ? theme.ref.neutralVariant[90]
      : theme.ref.neutralVariant[20]
  const stripedRowColour =
    theme.mode === 'light'
      ? theme.ref.neutralVariant[95]
      : theme.ref.neutralVariant[30]
  const borderColour = theme.outlineVariant
  return {
    // Cell styles
    [`& .${gridClasses.cell}`]: {
      borderColor: borderColour,
    },
    [`&.${gridClasses.autoHeight} .${gridClasses['row--lastVisible']} .${gridClasses.cell}`]:
      {
        borderBottomColor: borderColour,
      },
    // Row styles for all rows
    [`& .${gridClasses.row}`]: {
      [`&:first-of-type  .${gridClasses.cell}`]: {
        borderTop: `${borderColour} 1px solid`, // Add top border to first row
      },
      '&:hover, &.Mui-hovered': {
        backgroundColor: hoveredRowColour,
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
    // Row styles for even rows in the striped table variant
    [`& .${gridClasses.row}.even`]: {
      backgroundColor: stripedRowColour,
      '&:hover, &.Mui-hovered': {
        backgroundColor: hoveredRowColour,
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
  }
}

/** Extend and limit {@link MuiDataGridProps} to provide additional type hints and safety. */
interface DataGridProps<R extends GridValidRowModel, V, F, P>
  extends Omit<MuiDataGridProps<R>, 'rows' | 'components'> {
  // DataGrid props
  /** The column definition for the table */
  columns: GridColDef<R, V, F>[]
  /**
   * Handle changes to editable cells.
   * Note that this function does *not* need to update `rows` as this is handled inside MUI's DataGrid component
   */
  processRowUpdate?: RowUpdateFunction<R>
  /** Rows to display in the table. Pagination is handled internally. If undefined, then display a loading indicator. */
  rows: readonly R[] | undefined

  // Additional props
  /**
   * Function to fetch row data. Error handling and state updates are then handled internally
   * using `props.setRows`. If `fetchRows` is undefined then only the initial value of `props.rows` will be displayed.
   */
  fetchRows?: (params?: P) => Promise<R[]>
  /** Message to show if the unfiltered data contains no elements. */
  noRowsMessage?: string
  /**
   * Function to update row data in the state of the parent component.
   * If left undefined, then the table contents can not be updated or edited.
   */
  setRows?: Dispatch<SetStateAction<R[] | undefined>>
  /** Specify the amount of row padding. Defaults to medium. */
  size?: 'medium' | 'small'
  /** If true, alter the colour of every second table row */
  zebraStripes?: boolean
  /** Optionally override styles for each row */
  getRowClassName?: (params: GridRowClassNameParams<R>) => string
  /** Filter parameters to pass to the fetchRows function if needed */
  params?: P
}

/**
 * Wrapper component for MUI's DataGrid component. Use to display filterable, editable table contents.
 *
 * Handles fetching rows from the backend, state updates in the parent component, and loading states internally
 * and displays error snackbars if fetching or updating rows fails.
 *
 *
 * @template R The data row type
 * @template V Cell values, can usually be left unspecified
 * @template F Used internally by DataGrid, it's safe to set this to V
 * @template P Type of filter parameters when fetching rows, if applicable
 */
export const DataGrid = <R extends GridValidRowModel, V, F = V, P = object>(
  props: DataGridProps<R, V, F, P>
): React.ReactElement => {
  const theme = useTheme()

  const addSnackbarMessage = useAddSnackbarMessage()
  const {
    fetchRows,
    setRows,
    rows,
    initialState,
    processRowUpdate,
    ...gridProps
  } = props

  const [snackbarMessage, setSnackbarMessage] = useState<Message | null>(null)

  /** Load rows from the API on component mount */
  useEffect(() => {
    if (typeof props.fetchRows !== 'undefined') {
      const rowsPromise = cancelable(props.fetchRows(props.params))
      handleFetchRows(rowsPromise)

      // Cancel the promise callbacks on component unmount
      return rowsPromise.cancel
    }
  }, [JSON.stringify(props.params)])

  /** Create a new snackbar if {@link snackbarMessage} has been updated */
  useEffect(() => {
    if (snackbarMessage !== null) {
      addSnackbarMessage(snackbarMessage)
    }
  }, [addSnackbarMessage, snackbarMessage])

  /** Load rows from the backend and set in the state of the parent component. */
  const handleFetchRows = (promise: Promise<R[]>) =>
    promise
      .then((data) => {
        props.setRows?.(data)
      })
      .catch((err: Error) => {
        props.setRows?.([]) // Remove loading state
        setSnackbarMessage({
          header: 'Could not load table contents',
          body: err.message,
          type: MessageType.ERROR,
        })
      })

  /**
   * Add a wrapper to `props.processRowUpdate` to display success or error snackbar when a row is updated
   * This is needed because MuiDataGrid has prop `onProcessRowUpdateError`, but no prop for success.
   */
  const wrappedProcessRowUpdate: RowUpdateFunction<R> | undefined =
    typeof props.processRowUpdate === 'undefined'
      ? undefined
      : (newRow: R, oldRow: R): Promise<R> =>
          new Promise((resolve, reject) => {
            props
              .processRowUpdate?.(newRow, oldRow)
              .then((data) => {
                addSnackbarMessage({
                  header: 'Success',
                  body: 'Row updated',
                  type: MessageType.CONFIRM,
                })
                resolve(data)
              })
              .catch((err: Error) => {
                addSnackbarMessage({
                  header: 'Could not update row',
                  body: err.message,
                  type: MessageType.ERROR,
                })
                reject(err)
              })
          })

  return (
    <Box sx={{ width: '100%' }}>
      <MuiDataGrid
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          ...initialState,
        }}
        isRowSelectable={() => false}
        pageSizeOptions={[10, 25, 100]}
        processRowUpdate={wrappedProcessRowUpdate}
        loading={typeof props.rows === 'undefined'}
        rows={
          typeof props.rows === 'undefined' || props.rows === null
            ? []
            : props.rows
        }
        rowHeight={props.size === 'small' ? 36 : 56}
        getRowClassName={
          typeof props.getRowClassName !== 'undefined'
            ? props.getRowClassName
            : props.zebraStripes
            ? (params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
            : undefined
        }
        sx={
          {
            ...dataGridRowSx(theme),
            ...(props.sx ? props.sx : {}),
          } as SxProps<Theme>
        }
        components={{
          NoRowsOverlay: () => (
            <Typography
              variant="bodyMedium"
              color="onSurface"
              sx={{
                display: 'flex',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {props.noRowsMessage ?? 'No rows'}
            </Typography>
          ),
        }}
        {...gridProps}
      />
    </Box>
  )
}
