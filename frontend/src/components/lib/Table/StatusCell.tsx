import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import { GridValidRowModel } from '@mui/x-data-grid'

import { theme } from '~/styles/theme'

/** Minimum width in px (for setting column width in tables) */
export const statusCellMinWidth = 127

/** Possible variants for {@link StatusCell}. Used to set the colour of the status dot. */
export enum StatusVariant {
  OK = 'OK',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO',
}

/**
 * Props for generically-typed table cell to delete a given entity.
 * @param R The row type
 * @param T The type of the id of objects of type R
 */
interface StatusCellProps<R extends GridValidRowModel, T = number> {
  status: string
  variant: StatusVariant
}

/**
 * Table cell containing the status of an entity.
 * Shows a text descriptiuon and colour dot.
 */
export const StatusCell = <R extends GridValidRowModel, T = string>(
  props: StatusCellProps<R, T>
): JSX.Element => {
  const statusDotColours: { [key in StatusVariant]: string } = {
    [StatusVariant.OK]: theme.primary,
    [StatusVariant.WARNING]: theme.warn,
    [StatusVariant.ERROR]: theme.error,
    [StatusVariant.INFO]: theme.tertiary,
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Typography
        color={theme.onSurface}
        variant="bodyMedium"
        marginRight={1.5}
      >
        {props.status}
      </Typography>
      <Box
        sx={{
          minHeight: theme.spacing(1.5),
          minWidth: theme.spacing(1.5),
          backgroundColor: statusDotColours[props.variant],
          borderRadius: '50%',
        }}
      />
    </Box>
  )
}
