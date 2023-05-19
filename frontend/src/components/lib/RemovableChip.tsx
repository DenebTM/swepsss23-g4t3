import React, { useEffect, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { alpha, SxProps, Theme } from '@mui/material/styles'
import Box from '@mui/system/Box'

import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { theme } from '~/styles/theme'

import { Tooltip } from './Tooltip'

const chipMarginSides = 2
const chipPaddingTopBottom = '3px'

/**
 * Styles for the main body of the chip
 */
const chipBodySx = (
  chipOutline: string,
  textColour: string
): SxProps<Theme> => ({
  margin: `0 ${chipMarginSides}px`,
  padding: `${chipPaddingTopBottom} ${theme.spacing(1.5)}`,
  minWidth: theme.spacing(6),
  color: textColour,
  '&.Mui-disabled': { color: textColour },
  '&::after': {
    content: '""',
    width: '1px',
    height: '100%',
    background: chipOutline,
    right: `-${chipMarginSides}px`,
    top: 0,
    position: 'absolute',
  },
})

/** Possible variants for {@link RemovableChip}. Used to set the colour of the border and text. */
export enum ChipVariant {
  OK = 'OK',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  INFO = 'INFO',
}

const chipColour: { [key in ChipVariant]: string } = {
  [ChipVariant.OK]: theme.primary,
  [ChipVariant.WARNING]: theme.warn,
  [ChipVariant.ERROR]: theme.error,
  [ChipVariant.INFO]: theme.tertiary,
}

const chipBackground: { [key in ChipVariant]: string } = {
  [ChipVariant.OK]: theme.primaryContainer,
  [ChipVariant.WARNING]: theme.warnContainer,
  [ChipVariant.ERROR]: theme.errorContainer,
  [ChipVariant.INFO]: theme.tertiaryContainer,
}

const chipText: { [key in ChipVariant]: string } = {
  [ChipVariant.OK]: theme.onPrimaryContainer,
  [ChipVariant.WARNING]: theme.onWarnContainer,
  [ChipVariant.ERROR]: theme.onErrorContainer,
  [ChipVariant.INFO]: theme.onTertiaryContainer,
}

interface RemovableChipProps {
  /** Function to run after successful removal. */
  afterDelete?: () => void
  /** A short description of the entity shown in the chip. */
  entityName: string
  /** Function to (asynchronously) delete or remove the entity. */
  handleDelete: () => Promise<any>
  /** Chip main label */
  label: string | React.ReactNode
  /** Handle click on the main body of the chip */
  onClick?: React.MouseEventHandler
  /** Tooltip title for the main body of the chip */
  tooltipTitle?: string
  /** Variant corresponding to border and text colour. Fedaults to  `ChipVariant.OK`. */
  variant?: ChipVariant
}

/**
 * Clickable chip component to support two actions.
 * Has a main button and a delete icon at the end.
 */
export const RemovableChip: React.FC<RemovableChipProps> = (props) => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [deletePending, setDeletePending] = useState(false)
  const [variant, setVariant] = useState(props.variant ?? ChipVariant.OK)

  useEffect(() => {
    setVariant(props.variant ?? ChipVariant.OK)
  }, [props.variant])

  const handleDeleteClick: React.MouseEventHandler = (e) => {
    e.stopPropagation() // Prevent selecting table cell
    setDeletePending(true)

    props
      .handleDelete()
      .then(() => {
        props.afterDelete?.()
        addSnackbarMessage({
          header: 'Success',
          body: `Removed ${props.entityName}`,
          type: MessageType.CONFIRM,
        })
      })
      .catch((err: Error) => {
        addSnackbarMessage({
          header: `Could not remove ${props.entityName}`,
          body: err.message,
          type: MessageType.ERROR,
        })
      })
      .finally(() => setDeletePending(false))
  }

  const handleMainChipClick: React.MouseEventHandler = (e) => {
    e.stopPropagation()
    props.onClick?.(e)
  }

  const chipOutline = alpha(chipColour[variant], 0.6)

  return (
    <Box
      sx={{
        border: `1px solid ${chipOutline}`,
        borderRadius: 1,
        backgroundColor: deletePending ? theme.surfaceVariant : '',
      }}
    >
      <Tooltip title={props.tooltipTitle} arrow>
        <Button
          aria-label={props.tooltipTitle}
          variant="text"
          disabled={deletePending || typeof props.onClick === 'undefined'}
          size="small"
          sx={{
            ...chipBodySx(chipOutline, chipText[variant]),

            '&:hover':
              typeof props.onClick !== 'undefined'
                ? {
                    background: chipBackground[variant],
                    transition: theme.transitions.create('background'),
                  }
                : {},
          }}
          onClick={handleMainChipClick}
        >
          {props.label}
        </Button>
      </Tooltip>
      <Tooltip
        arrow
        title={deletePending ? 'Removing...' : `Remove ${props.entityName}`}
      >
        <IconButton
          aria-label={`Remove ${props.entityName}`}
          disabled={deletePending}
          onClick={handleDeleteClick}
          size="small"
          sx={{
            color: chipColour[variant],
            margin: `0 ${chipMarginSides}px`,
            padding: chipPaddingTopBottom,
            '&:hover': {
              background: chipBackground[variant],
              transition: theme.transitions.create('background'),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
