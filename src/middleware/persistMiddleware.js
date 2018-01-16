import { createPersistMiddleware, storage, utilities, ActionTypes, Settings } from '@olasearch/core'

const PERSIST_TIMEOUT = 500
const KEYS_TO_STORE = ['messages', 'isBotActive']
const debouncePersist = utilities.debounce(persistState, PERSIST_TIMEOUT)
function persistState (action, getState, namespace) {
  switch (action.type) {
    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      return storage.set(
        Settings.BOT_STORAGE_KEY,
        utilities.pick(KEYS_TO_STORE, getState().Conversation),
        namespace
      )
  }
}

module.exports = ({ namespace }) => createPersistMiddleware({
  namespace,
  types: 'REQUEST_SEARCH_SUCCESS',
  callback: debouncePersist
})