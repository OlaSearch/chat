'use strict';

var _core = require('@olasearch/core');

var PERSIST_TIMEOUT = 500;
var KEYS_TO_STORE = ['messages', 'isBotActive'];
var debouncePersist = _core.utilities.debounce(persistState, PERSIST_TIMEOUT);
function persistState(action, getState, namespace) {
  switch (action.type) {
    case _core.ActionTypes.REQUEST_SEARCH_SUCCESS:
      return _core.storage.set(_core.Settings.BOT_STORAGE_KEY, _core.utilities.pick(KEYS_TO_STORE, getState().Conversation), namespace);
  }
}

module.exports = function (_ref) {
  var namespace = _ref.namespace;
  return (0, _core.createPersistMiddleware)({
    namespace: namespace,
    types: 'REQUEST_SEARCH_SUCCESS',
    callback: debouncePersist
  });
};