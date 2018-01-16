'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  q: '',
  messages: [],
  isTyping: false,
  language: 'en',
  shouldPoll: false,
  feedbackActive: false,
  feedbackMessageId: null,
  feedbackRating: null,
  /* Flag to indicate if bot is currently active */
  isBotActive: false,

  /* For Search */
  perPage: 3 /* Per page is managed in Conversation state: As it can conflict with QueryState (Search) */
  , page: 1,
  totalResults: 0
  // facet_query: [],
};

var createMessageObj = function createMessageObj(_ref) {
  var answer = _ref.answer,
      results = _ref.results,
      mc = _ref.mc;

  return _extends({}, answer, {
    mc: mc,
    awaitingUserInput: answer.awaiting_user_input,
    results: results
  });
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _ActionTypes2.default.REQUEST_ADD_MESSAGE:
      return _extends({}, state, {
        messages: [].concat(_toConsumableArray(state.messages), [action.message])
      });

    case _core.ActionTypes.REQUEST_SEARCH_SUCCESS:
      /* If its not from Bot: Do NOTHING */
      if (!action.answer || !action.payload.bot || action.answer.error) return state;
      var answer = action.answer,
          results = action.results,
          payload = action.payload,
          mc = action.mc;

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
          var msg = _extends({}, answer, { mc: mc, reply: reply[i], id: answer.id + '_' + i });
          messages.push(createMessageObj({ answer: msg }));
        }
      } else {
        messages.push(createMessageObj({ answer: answer, results: results, mc: mc }));
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
        messages: [].concat(_toConsumableArray(original_messages), messages),
        totalResults: action.totalResults
      });

    case _ActionTypes2.default.CLEAR_MESSAGES:
      return _extends({}, state, {
        messages: []
      });

    case _ActionTypes2.default.CHANGE_BOT_PER_PAGE:
      return _extends({}, state, {
        perPage: action.perPage
      });

    case _core.ActionTypes.REQUEST_MC_SUCCESS:
      return _extends({}, state, {
        messages: state.messages.map(function (item) {
          if (item.id === action.payload.id) {
            return _extends({}, item, {
              mc: action.mc
            });
          }
          return item;
        })
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

    case _ActionTypes2.default.UPDATE_BOT_QUERY_TERM:
      return _extends({}, state, {
        q: action.term,
        page: 1
      });

    case _ActionTypes2.default.CLEAR_BOT_QUERY_TERM:
      return _extends({}, state, {
        q: '',
        page: 1
      });

    case _ActionTypes2.default.CHANGE_BOT_PAGE:
      return _extends({}, state, {
        page: action.page
      });

    case _core.ActionTypes.OLA_REHYDRATE:
      return _extends({}, state, {
        messages: action.botState ? action.botState.messages : []
      });

    default:
      return state;
  }
};