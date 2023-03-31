import React, { Reducer, useCallback, useMemo, useReducer } from 'react'

import { initialSnackbarState, SnackbarContext } from './SnackbarContext'
import { snackbarReducer } from './snackbarReducer'
import {
  ISnackbarContext,
  Message,
  MessageId,
  ReducerActions,
  SnackbarReducerAction,
  SnackbarState,
} from './types'

interface SnackbarProviderProps {
  children: React.ReactNode
}

/**
 * Wrapper component to allow setting snackbar errors in child components.
 */
const SnackbarProvider: React.FC<SnackbarProviderProps> = (props) => {
  const [snackbarState, dispatch] = useReducer<
    Reducer<SnackbarState, SnackbarReducerAction>,
    SnackbarState
  >(snackbarReducer, initialSnackbarState, () => initialSnackbarState)

  /** Dispatch action to add a message to the reducer */
  const addMessage = useCallback(
    (message: Message) =>
      dispatch({
        payload: message,
        actionType: ReducerActions.ADD_MESSAGE,
      }),
    [dispatch]
  )

  /** Dispatch action to remove a message from the reducer */
  const removeMessage = useCallback(
    (messageId: MessageId) =>
      dispatch({
        payload: messageId,
        actionType: ReducerActions.REMOVE_MESSAGE,
      }),
    [dispatch]
  )

  /** Dispatch action to delete all snackbar messages */
  const resetMessages = useCallback(
    () =>
      dispatch({
        actionType: ReducerActions.RESET_MESSAGES,
      }),
    [dispatch]
  )

  const providerValue: ISnackbarContext = useMemo(
    () => ({
      snackbarState,
      dispatch,
      addMessage,
      removeMessage,
      resetMessages,
    }),
    [snackbarState, dispatch]
  )

  return (
    <SnackbarContext.Provider value={providerValue}>
      {props.children}
    </SnackbarContext.Provider>
  )
}

export { SnackbarProvider }
