'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.updateBotQueryTerm = updateBotQueryTerm;
exports.clearBotQueryTerm = clearBotQueryTerm;
exports.addMessage = addMessage;
exports.loadMore = loadMore;
exports.showTypingIndicator = showTypingIndicator;
exports.hideTypingIndicator = hideTypingIndicator;
exports.clearMessages = clearMessages;
exports.changeLanguage = changeLanguage;
exports.pollWhenIdle = pollWhenIdle;
exports.activateFeedback = activateFeedback;
exports.disabledFeedback = disabledFeedback;
exports.setFeedbackMessage = setFeedbackMessage;
exports.setFeedbackRating = setFeedbackRating;
exports.logFeedback = logFeedback;
exports.setBotStatus = setBotStatus;
exports.toggleSearchVisibility = toggleSearchVisibility;

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _utils = require('./../utils');

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Query sanitization */
var sanitizeText = _core.utilities.sanitizeText,
    uuid = _core.utilities.uuid;

var CHAT_DELAY = 300;
var CHAT_REPLY_DELAY = 600;

function updateBotQueryTerm(term) {
  return {
    type: _ActionTypes2.default.UPDATE_BOT_QUERY_TERM,
    term: sanitizeText(term)
  };
}

function clearBotQueryTerm() {
  return {
    type: _ActionTypes2.default.CLEAR_BOT_QUERY_TERM
  };
}

function addMessage(payload, addCallback) {
  return function (dispatch, getState) {
    var state = getState();
    var _state$Conversation = state.Conversation,
        messages = _state$Conversation.messages,
        language = _state$Conversation.language,
        perPage = _state$Conversation.perPage,
        q = _state$Conversation.q,
        page = _state$Conversation.page,
        facet_query = _state$Conversation.facet_query;

    var context = state.Context;
    var intent = payload && payload.intent ? { intent: payload.intent } : {};
    var msgId = uuid();
    var in_response_to = messages.length ? messages[messages.length - 1]['id'] : null;

    /* Add more params to query */
    var query = _extends({
      q: q,
      page: page,
      per_page: perPage,
      facet_query: facet_query,
      msgId: msgId,
      language: language,
      in_response_to: in_response_to
    }, intent);

    var projectId = query.projectId,
        _query$env = query.env,
        env = _query$env === undefined ? 'staging' : _query$env,
        searchInput = query.searchInput;

    var api = 'search';
    var timestamp = new Date().getTime() / 1000;

    /* Add this to ui */
    if (query.q) {
      dispatch({
        type: _ActionTypes2.default.REQUEST_ADD_MESSAGE,
        message: {
          id: msgId,
          userId: context.userId,
          message: query.q,
          timestamp: timestamp,
          in_response_to: in_response_to,
          quick_replies: [],
          slots: []
        }
      });

      addCallback && addCallback(msgId);
    }

    /* Simulate delay - Show typing indicator */
    setTimeout(function () {
      return dispatch(showTypingIndicator({ msgId: msgId }));
    }, payload && payload.start ? 0 : CHAT_DELAY);

    return new Promise(function (resolve, reject) {
      /* Simulate delay */
      setTimeout(function () {
        return dispatch({
          types: [_ActionTypes2.default.REQUEST_BOT, _ActionTypes2.default.REQUEST_BOT_SUCCESS, _ActionTypes2.default.REQUEST_BOT_FAILURE],
          query: query,
          context: context,
          api: api,
          payload: _extends({}, payload, {
            bot: true
          })
        }).then(function (response) {
          /* Hide typing indicator */
          dispatch(hideTypingIndicator());

          /* Check if more messages should be requested */
          if ((0, _utils.checkIfAwaitingResponse)(response) && searchInput !== 'voice') {
            /* Remove intent */
            if (payload && 'intent' in payload) {
              delete payload['intent']; /* Remove intent */
              if ('start' in payload) {
                delete payload['start'];
              } /* Remove start flag */
            }
            /* Clear previous query */
            dispatch(clearBotQueryTerm());
            /* Ask for more messages */
            dispatch(addMessage(payload));
          }

          /**
           * Log views. When user views a
           * 1. Cards
           * 2. Quick reply
           * 3. Search
           **/
          // To do

          return resolve(response);
        });
      }, CHAT_REPLY_DELAY);
    });
  };
}

/**
 * Load more results
 * Only used on chat interface
 */
function loadMore(message) {
  return function (dispatch, getState) {
    /**
     * message.search is from Intent engine. If Intent engine is down, fallback to message.message
     * Hacky
     */
    var q = void 0;
    var facet_query = [];
    var searchAdapterOptions = {};
    if (message.search) {
      q = message.search.q;
      facet_query = message.search.facet_query || [];
      searchAdapterOptions = message.search.searchAdapterOptions;
    } else {
      q = message.message;
    }

    /* Current page in the message */
    var state = getState();
    var context = state.Context;
    var page = message.page;
    var perPage = state.Conversation.perPage;

    /* Update page */

    page = page + 1;

    var query = {
      q: q,
      per_page: perPage,
      page: page,
      facet_query: facet_query,
      msgId: message.id,
      searchAdapterOptions: searchAdapterOptions

      /* Execute a search with appendResult: true */
    };return dispatch({
      types: [_ActionTypes2.default.REQUEST_BOT, _ActionTypes2.default.REQUEST_BOT_SUCCESS, _ActionTypes2.default.REQUEST_BOT_FAILURE],
      query: query,
      context: context,
      api: 'search',
      payload: {
        bot: true,
        routeChange: false,
        appendResult: true,
        msgId: message.id,
        page: page
      }
    });
  };
}

function showTypingIndicator(_ref) {
  var msgId = _ref.msgId;

  return {
    type: _ActionTypes2.default.SHOW_TYPING_INDICATOR,
    msgId: msgId
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

function pollWhenIdle() {
  return function (dispatch, getState) {
    var shouldPoll = getState().Conversation.shouldPoll;

    if (!shouldRetry) return;
    dispatch(addMessage({ intent: 'idle' }));
  };
}

function activateFeedback() {
  return {
    type: _ActionTypes2.default.FEEDBACK_SET_ACTIVE
  };
}

function disabledFeedback() {
  return {
    type: _ActionTypes2.default.FEEDBACK_SET_DISABLE
  };
}

function setFeedbackMessage(messageId) {
  return {
    type: _ActionTypes2.default.SET_FEEDBACK_MESSAGE_ID,
    messageId: messageId
  };
}

function setFeedbackRating(rating) {
  return {
    type: _ActionTypes2.default.SET_FEEDBACK_RATING,
    rating: rating
  };
}

function logFeedback(feedbackMessage) {
  /* eventMessage => feed */
  return function (dispatch, getState) {
    var _getState$Conversatio = getState().Conversation,
        feedbackMessageId = _getState$Conversatio.feedbackMessageId,
        feedbackRating = _getState$Conversatio.feedbackRating;


    dispatch(_core.Actions.Logger.log({
      eventType: 'C',
      eventCategory: 'Feedback',
      eventAction: 'click',
      eventMessage: feedbackMessage,
      messageId: feedbackMessageId,
      eventLabel: feedbackRating,
      debounce: false,
      payload: {
        bot: true
      }
    }));
  };
}

function setBotStatus(status) {
  return {
    type: _ActionTypes2.default.SET_BOT_STATUS,
    status: status
  };
}

function toggleSearchVisibility(messageId) {
  return {
    type: _ActionTypes2.default.TOGGLE_SEARCH_VISIBILITY,
    messageId: messageId
  };
}