import React from 'react'

import { ISnackbarContext, Message, MessageId, SnackbarState } from './types'

export const initialSnackbarState: SnackbarState = {
  autoHideDuration: 5000,
  highestMessageId: 0,
  messages: [],
}

/** Set default values for the snackbar context */
const initialSnackbarContext: ISnackbarContext = {
  snackbarState: initialSnackbarState,
  addMessage: (message: Message) => {
    /* Do nothing before initialisation */
  },
  removeMessage: (messageId: MessageId) => {
    /* Do nothing before initialisation */
  },
  resetMessages: () => {
    /* Do nothing before initialisation */
  },
}

/**
 * Context to provide snackbar alert handling throughout App
 */
export const SnackbarContext: React.Context<ISnackbarContext> =
  React.createContext(initialSnackbarContext)
