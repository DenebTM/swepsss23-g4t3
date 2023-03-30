/** The internal state of the snackbar context */
export interface SnackbarState {
  /** The number of milliseconds to autohide the snackbar after */
  autoHideDuration: number
  /**
   * The message ID to assign to the next message: incremented by 1 for each new message.
   * If enough messages are generated in one browser window to cause integer overflow then we have other problems.
   */
  nextMessageId: number
  /** Messages inside the Context */
  messages: MessageState[]
}

/** A message to add to the snackbar context */
export interface Message {
  header: string
  body: string
  type: MessageType
}

/** State of a single snackbar message inside the context. Extends {@link Message} with an ID. */
export interface MessageState extends Message {
  /** The generated ID of the message in the context */
  id: MessageId
}

/** Type of the message ID returned when a message is added to the context. Can be used to remove the message later. */
export type MessageId = number

/** Supported message types for a snackbar message. Affects the corresponding icons and colours. */
export enum MessageType {
  CONFIRM = 'CONFIRM',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/** Interface for the internal Context of the snackbar reducer */
export interface ISnackbarContext {
  snackbarState: SnackbarState
  dispatch?: React.Dispatch<SnackbarReducerAction>
  addMessage: (message: Message) => void
  removeMessage: (messageId: MessageId) => void
  resetMessages: () => void
}

/** Base inteface to be inherited by other actions taken by the snackbar reducer */
interface BaseReducerAction {
  payload?: MessageId | Message
  actionType: ReducerActions
}

/** Action to remove a single message from the Context */
export interface RemoveMessageAction extends BaseReducerAction {
  actionType: typeof ReducerActions.REMOVE_MESSAGE
  payload: MessageId
}

/** Action to add a single message to the Context */
export interface AddMessageAction extends BaseReducerAction {
  actionType: typeof ReducerActions.ADD_MESSAGE
  payload: Message
}

/** Action to delete all messages */
export interface ResetMessageAction extends BaseReducerAction {
  actionType: typeof ReducerActions.RESET_MESSAGES
}

/** Types of possible actions which can be passed to the snackbar reducer */
export type SnackbarReducerAction =
  | AddMessageAction
  | RemoveMessageAction
  | ResetMessageAction

export enum ReducerActions {
  ADD_MESSAGE = 'ADD_MESSAGE',
  REMOVE_MESSAGE = 'REMOVE_MESSAGE',
  RESET_MESSAGES = 'RESET_MESSAGES',
}
