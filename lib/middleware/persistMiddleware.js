'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var namespace = _ref.namespace;

  return (0, _core.createPersistMiddleware)({
    namespace: namespace,
    types: _ActionTypes2.default.REQUEST_BOT_SUCCESS,
    callback: debouncePersist
  });
};

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var MESSAGE_STORAGE_LIMIT = 20;
var PERSIST_TIMEOUT = 500;
var KEYS_TO_STORE = ['messages', 'isBotActive'];
var debouncePersist = _core.utilities.debounce(persistState, PERSIST_TIMEOUT);
function persistState(action, getState, namespace) {
  switch (action.type) {
    case _ActionTypes2.default.REQUEST_BOT_SUCCESS:
      var _getState$Conversatio = getState().Conversation,
          messages = _getState$Conversatio.messages,
          rest = _objectWithoutProperties(_getState$Conversatio, ['messages']);
      /* Only pick last 20 messages */


      messages = messages.slice(-MESSAGE_STORAGE_LIMIT);
      return _core.storage.set(_core.Settings.BOT_STORAGE_KEY, _core.utilities.pick(KEYS_TO_STORE, _extends({}, rest, { messages: messages })), namespace);
  }
}