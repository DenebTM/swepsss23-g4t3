import React, { useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { alpha } from '@mui/material/styles'
import Box from '@mui/system/Box'

import { MessageType } from '~/contexts/SnackbarContext/types'
import { useAddSnackbarMessage } from '~/hooks/snackbar'
import { theme } from '~/styles/theme'

import { Tooltip } from './Tooltip'

interface RemovableChipProps {
  /** Function to run after successful removal. */
  afterDelete?: () => void
  /** A short description of the entity shown in the chip. */
  entityName: string
  /** Function to (asynchronously) delete or remove the entity. */
  handleDelete: () => Promise<void>
  /** Chip main label */
  label: string
  /** Handle click on the main body of the chip */
  onClick: React.MouseEventHandler
  /** Tooltip title for the main body of the chip */
  tooltipTitle?: string
}

/**
 * Clickable chip component to support two actions.
 * Has a main button and a delete icon at the end.
 */
export const RemovableChip: React.FC<RemovableChipProps> = (props) => {
  const addSnackbarMessage = useAddSnackbarMessage()
  const [deletePending, setDeletePending] = useState(false)

  /** Margin on sides of each chip component in px */
  const chipMarginSides = 2
  const chipOutline = alpha(theme.primary, 0.5)
  const chipPaddingTopBottom = '4px'

  const handleDeleteClick: React.MouseEventHandler = (e) => {
    e.stopPropagation() // Prevent selecting table cell
    setDeletePending(true)

    props
      .handleDelete()
      .then(() => {
        props.afterDelete?.()
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

  return (
    <Box
      sx={{
        border: `1px solid ${chipOutline}`,
        borderRadius: 1,
      }}
    >
      <Tooltip title={props.tooltipTitle} arrow>
        <Button
          aria-label={props.tooltipTitle}
          variant="text"
          color="primary"
          disabled={deletePending}
          size="small"
          sx={{
            margin: `0 ${chipMarginSides}px`,
            padding: `${chipPaddingTopBottom} 0`,
            '&:hover': {
              background: theme.primaryContainer,
              transition: theme.transitions.create('background'),
            },
            '&::after': {
              content: '""',
              width: '1px',
              height: '100%',
              background: chipOutline,
              right: `-${chipMarginSides}px`,
              top: 0,
              position: 'absolute',
            },
          }}
          onClick={(e) => {
            e.stopPropagation()
            props.onClick(e)
          }}
        >
          {props.label}
        </Button>
      </Tooltip>
      <Tooltip arrow title={`Remove ${props.entityName}`}>
        <IconButton
          aria-label={`Remove ${props.entityName}`}
          disabled={deletePending}
          onClick={handleDeleteClick}
          size="small"
          sx={{
            color: theme.primary,
            margin: `0 ${chipMarginSides}px`,
            padding: chipPaddingTopBottom,
            '&:hover': {
              background: theme.primaryContainer,
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
