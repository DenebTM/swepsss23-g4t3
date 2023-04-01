import { Reducer } from 'react'

import {
  MessageState,
  ReducerActions,
  SnackbarReducerAction,
  SnackbarState,
} from './types'

/**
 * Reducer to update the {@link SnackbarState}
 */
export const snackbarReducer: Reducer<SnackbarState, SnackbarReducerAction> = (
  snackbarState: SnackbarState,
  action: SnackbarReducerAction
) => {
  switch (action.actionType) {
    /** Add a message to the state */
    case ReducerActions.ADD_MESSAGE: {
      return {
        ...snackbarState,
        messages: [
          ...snackbarState.messages,
          { ...action.payload, id: snackbarState.nextMessageId },
        ],
        nextMessageId: snackbarState.nextMessageId + 1, // Increment nextMessageId by 1
      }
    }

    /** Remove a single message from the state */
    case ReducerActions.REMOVE_MESSAGE: {
      return {
        ...snackbarState,
        messages: snackbarState.messages.filter(
          (m: MessageState) => m.id != action.payload
        ),
      }
    }

    /** Remove all messages from the state */
    case ReducerActions.RESET_MESSAGES: {
      return {
        ...snackbarState,
        messages: [],
      }
    }

    /** Fallback case */
    default: {
      throw new Error('Unhandled snackbarReducer action type')
    }
  }
}
