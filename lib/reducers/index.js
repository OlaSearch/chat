'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  messages: [],
  isTyping: false
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {

    case _ActionTypes2.default.REQUEST_ADD_MESSAGE:
      return _extends({}, state, {
        messages: [].concat(_toConsumableArray(state.messages), [action.message])
      });

    case _olasearch.ActionTypes.REQUEST_SEARCH_SUCCESS:
      if (!action.answer || !action.answer.reply) return state;
      return _extends({}, state, {
        messages: [].concat(_toConsumableArray(state.messages), [{
          id: action.answer.id,
          reply: action.answer.reply,
          reply_voice: action.answer.reply_voice,
          timestamp: action.answer.timestamp,
          intent: action.answer.intent,
          message: action.answer.message
        }])
      });

    case _ActionTypes2.default.SHOW_TYPING_INDICATOR:
      return _extends({}, state, {
        isTyping: true
      });

    case _ActionTypes2.default.HIDE_TYPING_INDICATOR:
      return _extends({}, state, {
        isTyping: false
      });

    default:
      return state;
  }
};