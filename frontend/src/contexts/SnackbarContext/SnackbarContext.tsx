import React from 'react'

import { ISnackbarContext, Message, MessageId, SnackbarState } from './types'

export const initialSnackbarState: SnackbarState = {
  autoHideDuration: 5000, // Set timeout to 5 seconds
  nextMessageId: 0,
  messages: [], // Initially there are no messages
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
 * Context to provide snackbar alert handling throughout App.
 * Note that the context will only be available in children of {@link SnackbarProvider}.
 * For more information on Contexts see https://react.dev/learn/scaling-up-with-reducer-and-context
 */
export const SnackbarContext: React.Context<ISnackbarContext> =
  React.createContext(initialSnackbarContext)
