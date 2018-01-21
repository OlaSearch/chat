import types from './../ActionTypes'
import {
  createPersistMiddleware,
  storage,
  utilities,
  Settings
} from '@olasearch/core'

const PERSIST_TIMEOUT = 500
const KEYS_TO_STORE = ['messages', 'isBotActive']
const debouncePersist = utilities.debounce(persistState, PERSIST_TIMEOUT)
function persistState (action, getState, namespace) {
  switch (action.type) {
    case types.REQUEST_BOT_SUCCESS:
      return storage.set(
        Settings.BOT_STORAGE_KEY,
        utilities.pick(KEYS_TO_STORE, getState().Conversation),
        namespace
      )
  }
}

module.exports = ({ namespace }) =>
  createPersistMiddleware({
    namespace,
    types: types.REQUEST_BOT_SUCCESS,
    callback: debouncePersist
  })
