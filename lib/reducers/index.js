'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _Settings = require('./../Settings');

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var initialState = {
  q: '',
  messages: _Settings.EMPTY_ARRAY,
  isTyping: false,
  language: 'en',
  shouldPoll: false,
  feedbackActive: false,
  feedbackMessageId: null,
  feedbackRating: null,
  isLoading: false,
  /* Flag to indicate if bot is currently active */
  isBotActive: false,

  /* Track the latest message: Used to scroll to the new message */
  newMessageId: null,

  /* For Search */
  perPage: 3 /* Per page is managed in Conversation state: As it can conflict with QueryState (Search) */
  , page: 1,
  facet_query: _Settings.EMPTY_ARRAY
};

function createMessageObj(_ref) {
  var answer = _ref.answer,
      results = _ref.results,
      mc = _ref.mc,
      totalResults = _ref.totalResults,
      _ref$page = _ref.page,
      page = _ref$page === undefined ? 1 : _ref$page,
      rest = _objectWithoutProperties(_ref, ['answer', 'results', 'mc', 'totalResults', 'page']);

  return _extends({}, answer, {
    mc: mc,
    awaitingUserInput: answer.awaiting_user_input,
    results: results,
    showSearch: false,
    totalResults: totalResults,
    page: page
  }, rest);
}

function createTypingMsg(msgId) {
  return {
    id: _core.utilities.uuid(),
    msgId: msgId,
    isTyping: true
  };
}

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _ActionTypes2.default.REQUEST_ADD_MESSAGE:
      return _extends({}, state, {
        newMessageId: action.message.id,
        messages: [].concat(_toConsumableArray(state.messages), [action.message])
      });

    case _ActionTypes2.default.REQUEST_BOT:
      return _extends({}, state, {
        isLoading: true
      });

    case _ActionTypes2.default.REQUEST_BOT_SUCCESS:
      var _action$answer = action.answer,
          answer = _action$answer === undefined ? {} : _action$answer,
          results = action.results,
          payload = action.payload,
          mc = action.mc,
          totalResults = action.totalResults,
          page = action.page,
          suggestedTerm = action.suggestedTerm,
          spellSuggestions = action.spellSuggestions;

      /**
       * Searching inside the bot
       */

      if (payload.appendResult && payload.bot) {
        return _extends({}, state, {
          isLoading: false,
          messages: state.messages.map(function (item, idx) {
            if (item.id === answer.in_response_to) {
              return _extends({}, item, {
                results: [].concat(_toConsumableArray(item.results), _toConsumableArray(results)),
                page: payload.page
              });
            }
            /**
             * Pure search, no Intent engine
             */
            if (item.msgId && !answer.in_response_to && item.id === payload.msgId) {
              return _extends({}, item, {
                results: [].concat(_toConsumableArray(item.results), _toConsumableArray(results)),
                page: payload.page
              });
            }
            return item;
          })
        });
      }

      /* Check if the answer is empty */
      if (answer && (answer.empty || answer.error)) return state;

      var in_response_to = answer.in_response_to,
          message = answer.message;

      var msg = createMessageObj({
        answer: answer,
        results: results,
        mc: mc,
        totalResults: totalResults,
        page: page,
        suggestedTerm: suggestedTerm,
        spellSuggestions: spellSuggestions,
        originalQuery: payload.originalQuery,
        context: payload.context
      });
      return _extends({}, state, {
        q: '',
        isLoading: false,
        newMessageId: msg.id,
        messages: state.messages.map(function (item) {
          /**
           * Replace the message text after profanity check from Intent engine
           */
          if (item.id === in_response_to) {
            return _extends({}, item, {
              message: item.message === message ? item.message : message /* To prevent re-render */
              , suggestedTerm: suggestedTerm
            });
          }
          /**
           * Pure search, no Intent engine
           */
          if (item.msgId && item.isTyping && !in_response_to) {
            return _extends({}, item, msg, {
              isTyping: false
            });
          }
          /**
           * Replace typing message with new message from Intent Engne
           */
          if (item.msgId && msg.in_response_to === item.msgId) {
            return msg;
          }
          return item;
        })
      });

    case _ActionTypes2.default.REQUEST_BOT_FAILURE:
      return _extends({}, state, {
        messages: state.messages.map(function (item) {
          if (item.id === action.payload.message.id) {
            return _extends({}, action.payload.message, {
              error: true
            });
          }
          return item;
        }).filter(function (item) {
          return item.msgId !== action.payload.message.id;
        })
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
          if (item.id === action.payload.messageId) {
            return _extends({}, item, {
              mc: action.mc
            });
          }
          return item;
        })
      });

    case _ActionTypes2.default.SHOW_TYPING_INDICATOR:
      var typingMsg = createTypingMsg(action.msgId);
      return _extends({}, state, {
        newMessageId: typingMsg.id,
        messages: [].concat(_toConsumableArray(state.messages), [typingMsg]),
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

    case _core.ActionTypes.OLA_REHYDRATE:
      return _extends({}, state, {
        messages: action.botState ? action.botState.messages.map(function (item) {
          return _extends({}, item, {
            showSearch: false
          });
        }) : [],
        newMessageId: action.botState && action.botState.messages.length ? action.botState.messages[action.botState.messages.length - 1]['id'] : null
      });

    case _ActionTypes2.default.TOGGLE_SEARCH_VISIBILITY:
      return _extends({}, state, {
        messages: state.messages.map(function (msg) {
          if (msg.id === action.messageId) {
            return _extends({}, msg, {
              showSearch: !msg.showSearch
            });
          }
          return msg;
        })
      });

    default:
      return state;
  }
};