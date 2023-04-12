import React, { Dispatch, SetStateAction, useState } from 'react'

import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Typography, { TypographyTypeMap } from '@mui/material/Typography'

/**
 * Interface for a range of values.
 * Use to store a lower and upper bound for greenhouse sensor values.
 */
export interface ValueRange {
  lower: number
  upper: number
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    borderTop: '1px solid',
    borderBottom: '1px solid',
    borderColor: theme.outlineVariant,
  },
}))

/** Padding applied to the sides of table rows in theme.spacing units */
const tableRowPadding = 4
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '>td:first-of-type': {
    paddingLeft: theme.spacing(tableRowPadding),
  },
  '>td:last-of-type': {
    paddingRight: theme.spacing(tableRowPadding),
  },
}))

export interface EditableCellProps<V extends ValueRange | number> {
  editing: boolean
  rowValue: V
  setRowValue: Dispatch<SetStateAction<V>>
  saveRow: () => Promise<void>
  typographyProps: TypographyTypeMap['props']
}

interface EditableTableRowProps<V extends ValueRange | number> {
  /** Aria label of the title Typography element */
  ariaLabel: string
  /** Show editable view if true */
  editing: boolean
  /** The component to render the editable cell of the row */
  editableCell: React.FC<EditableCellProps<V>>
  /** Save the updated row value */
  saveRow: (newValue: V) => Promise<void>
  /** Enter editing state */
  startEditing: () => void
  /** The row title */
  title: string
  /** Display props applied to all child typography components */
  typographyProps: TypographyTypeMap['props']
  /** The initial value of the editable values in the table row */
  value: V
}

/**
 * Table row that shows an editable cell to modify greenhouse settings.
 * @param V Set to {@link ValueRange} for a range of numeric values and `number` for a single of number.
 */
export const EditableTableRow = <V extends ValueRange | number>(
  props: EditableTableRowProps<V>
): JSX.Element => {
  const [rowValue, setRowValue] = useState<V>(props.value)

  return (
    <StyledTableRow>
      <StyledTableCell>
        <Typography {...props.typographyProps} aria-label={props.ariaLabel}>
          {props.title}
        </Typography>
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.editableCell({
          editing: props.editing,
          rowValue: rowValue,
          setRowValue: setRowValue,
          saveRow: () => props.saveRow(rowValue),
          typographyProps: props.typographyProps,
        })}
      </StyledTableCell>
      <StyledTableCell align="right">[edit button]</StyledTableCell>
    </StyledTableRow>
  )
}
