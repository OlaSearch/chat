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
  isTyping: false,
  language: 'en',
  shouldPoll: false,
  feedbackActive: false,
  feedbackMessageId: null,
  feedbackRating: null,
  isBotActive: false
};

var createMessageObj = function createMessageObj(answer, results) {
  return {
    id: answer.id,
    reply: answer.reply,
    reply_voice: answer.reply_voice,
    timestamp: answer.timestamp,
    intent: answer.intent,
    message: answer.message,
    awaitingUserInput: answer.awaiting_user_input,
    in_response_to: answer.in_response_to,
    slot_options: answer.slot_options,
    quick_replies: answer.quick_replies,
    fulfilled: answer.fulfilled,
    card: answer.card,
    search: answer.search,
    results: results
  };
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
      if (!action.answer) return state;
      var answer = action.answer,
          results = action.results,
          payload = action.payload;

      /* Check if the answer is empty */

      if (answer.empty) return state;

      if (payload.appendResult) {
        return _extends({}, state, {
          messages: state.messages.map(function (item, idx) {
            if (item.id === answer.in_response_to) {
              return _extends({}, item, {
                results: [].concat(_toConsumableArray(item.results), _toConsumableArray(results))
              });
            }
            return item;
          })
        });
      }

      var reply = answer.reply,
          in_response_to = answer.in_response_to,
          message = answer.message;

      var messages = [];
      if (Array.isArray(reply)) {
        for (var i = 0; i < reply.length; i++) {
          var msg = _extends({}, answer, { reply: reply[i], id: answer.id + '_' + i });
          messages.push(createMessageObj(msg));
        }
      } else {
        messages.push(createMessageObj(answer, results));
      }

      /**
       * Update older messages
       */
      var original_messages = state.messages.map(function (item) {
        if (item.id === in_response_to) {
          item['message'] = message;
        }
        return item;
      });
      return _extends({}, state, {
        messages: [].concat(_toConsumableArray(original_messages), messages)
      });

    case _ActionTypes2.default.CLEAR_MESSAGES:
      return _extends({}, state, {
        messages: []
      });

    case _ActionTypes2.default.SHOW_TYPING_INDICATOR:
      return _extends({}, state, {
        isTyping: true
      });

    case _ActionTypes2.default.HIDE_TYPING_INDICATOR:
      return _extends({}, state, {
        isTyping: false
      });

    case _ActionTypes2.default.CHANGE_LANGUAGE:
      return _extends({}, state, {
        language: action.language
      });

    case _ActionTypes2.default.FEEDBACK_SET_ACTIVE:
      return _extends({}, state, {
        feedbackActive: true
      });

    case _ActionTypes2.default.FEEDBACK_SET_DISABLE:
      return _extends({}, state, {
        feedbackActive: false
      });

    case _ActionTypes2.default.SET_FEEDBACK_MESSAGE_ID:
      return _extends({}, state, {
        feedbackMessageId: action.messageId
      });

    case _ActionTypes2.default.SET_FEEDBACK_RATING:
      return _extends({}, state, {
        feedbackRating: action.rating
      });

    case _ActionTypes2.default.SET_BOT_STATUS:
      return _extends({}, state, {
        isBotActive: action.status
      });

    default:
      return state;
  }
};