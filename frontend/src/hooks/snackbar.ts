import React from 'react'

import { SnackbarContext } from '~/contexts/SnackbarContext/SnackbarContext'
import {
  Message,
  MessageId,
  MessageType,
} from '~/contexts/SnackbarContext/types'

/** Returns a function to add a message to the snackbar state */
export const useAddSnackbarMessage = (): ((message: Message) => void) => {
  const { addMessage } = React.useContext(SnackbarContext)
  return addMessage
}

/** Returns a function to add an error message to the snackbar state */
export const useAddErrorSnackbar = (): ((
  err: Error,
  message: string
) => void) => {
  const { addMessage } = React.useContext(SnackbarContext)
  return (err: Error, message: string) =>
    addMessage({
      header: message,
      body: err.message,
      type: MessageType.ERROR,
    })
}

/** Returns a function to remove a message from the snackbar state by message ID */
export const useRemoveSnackbarMessage = (): ((
  messageId: MessageId
) => void) => {
  const { removeMessage } = React.useContext(SnackbarContext)
  return removeMessage
}

/** Reset all messages in the error context (currently unused) */
export const useResetSnackbarMessages = (): (() => void) => {
  const { resetMessages } = React.useContext(SnackbarContext)
  return resetMessages
}
