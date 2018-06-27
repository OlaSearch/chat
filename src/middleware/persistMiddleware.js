import types from './../ActionTypes'
import {
  createPersistMiddleware,
  storage,
  utilities,
  Settings
} from '@olasearch/core'

const MESSAGE_STORAGE_LIMIT = 20
const PERSIST_TIMEOUT = 500
const KEYS_TO_STORE = ['messages', 'isBotActive', 'inviteVisible']
const debouncePersist = utilities.debounce(persistState, PERSIST_TIMEOUT)
function persistState (action, getState, namespace) {
  let { messages, ...rest } = getState().Conversation
  /* Only pick last 20 messages */
  messages = messages.slice(-MESSAGE_STORAGE_LIMIT)
  return storage.set(
    Settings.BOT_STORAGE_KEY,
    utilities.pick(KEYS_TO_STORE, { ...rest, messages }),
    namespace
  )
}

export default function ({ namespace }) {
  return createPersistMiddleware({
    namespace,
    types: [types.REQUEST_BOT_SUCCESS, types.HIDE_INVITE, types.SHOW_INVITE],
    callback: debouncePersist
  })
}
