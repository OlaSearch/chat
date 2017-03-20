'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.addMessage = addMessage;
exports.showTypingIndicator = showTypingIndicator;
exports.hideTypingIndicator = hideTypingIndicator;
exports.clearMessages = clearMessages;
exports.changeLanguage = changeLanguage;

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _utils = require('./../utils');

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHAT_DELAY = 200;
var CHAT_REPLY_DELAY = 500;

function addMessage(payload) {
  return function (dispatch, getState) {
    var state = getState();
    var query = state.QueryState;
    var _state$Conversation = state.Conversation,
        messages = _state$Conversation.messages,
        language = _state$Conversation.language;

    var context = state.Context;
    var immediate = payload ? payload.immediate : false;
    var intent = payload && payload.intent ? { intent: payload.intent } : {};
    var msgId = _olasearch.utilities.uuid();
    var in_response_to = messages.length ? messages[messages.length - 1]['id'] : null;
    var _query = query,
        searchInput = _query.searchInput;

    /* Add this to ui */

    if (query.q) {
      dispatch({
        type: _ActionTypes2.default.REQUEST_ADD_MESSAGE,
        message: {
          id: msgId,
          userId: context.userId,
          message: query.q,
          timestamp: state.Timestamp.timestamp,
          in_response_to: in_response_to
        }
      });
    }

    /* Add more params to query */
    query = _extends({}, query, {
      msgId: msgId,
      language: language,
      in_response_to: in_response_to
    }, intent);

    /* Simulate delay - Show typing indicator */
    setTimeout(function () {
      return dispatch(showTypingIndicator());
    }, immediate ? 0 : CHAT_DELAY);

    return new Promise(function (resolve, reject) {
      /* Simulate delay */
      setTimeout(function () {
        return dispatch({
          types: [_olasearch.ActionTypes.REQUEST_SEARCH, _olasearch.ActionTypes.REQUEST_SEARCH_SUCCESS, _olasearch.ActionTypes.REQUEST_SEARCH_FAILURE],
          query: query,
          context: context,
          api: 'search',
          payload: payload
        }).then(function (response) {

          /* Hide typing indicator */
          dispatch(hideTypingIndicator());

          /* Check if more messages should be requested */
          if ((0, _utils.checkIfAwaitingResponse)(response) && searchInput !== 'voice') {
            /* Remove intent */
            if (payload && 'intent' in payload) delete payload['intent'];
            /* Clear previous query */
            dispatch(_olasearch.Actions.Search.clearQueryTerm());
            /* Ask for more messages */
            dispatch(addMessage(payload));
          }

          return resolve(response);
        });
      }, immediate ? 0 : CHAT_DELAY + CHAT_REPLY_DELAY);
    });
  };
}

function showTypingIndicator() {
  return {
    type: _ActionTypes2.default.SHOW_TYPING_INDICATOR
  };
}

function hideTypingIndicator() {
  return {
    type: _ActionTypes2.default.HIDE_TYPING_INDICATOR
  };
}

function clearMessages() {
  return {
    type: _ActionTypes2.default.CLEAR_MESSAGES
  };
}

function changeLanguage(language) {
  return {
    type: _ActionTypes2.default.CHANGE_LANGUAGE,
    language: language
  };
}