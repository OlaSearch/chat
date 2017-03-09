'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.addMessage = addMessage;
exports.showTypingIndicator = showTypingIndicator;
exports.hideTypingIndicator = hideTypingIndicator;

var _ActionTypes = require('./../ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHAT_DELAY = 200;

function addMessage(payload, params) {
  return function (dispatch, getState) {
    var state = getState();
    var query = state.QueryState;
    var context = state.Context;
    var singleLoop = payload ? payload.singleLoop : false;

    if (!singleLoop) {
      dispatch({
        type: _ActionTypes2.default.REQUEST_ADD_MESSAGE,
        message: {
          id: _olasearch.utilities.uuid(),
          userId: context.userId,
          message: query.q,
          timestamp: state.Timestamp.timestamp
        }
      });
    }

    if (params) {
      query = _extends({}, query, params);
    }

    /* Simulate delay - Show typing indicator */
    setTimeout(function () {
      return dispatch(showTypingIndicator());
    }, CHAT_DELAY);

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

          return resolve(response);
        });
      }, CHAT_DELAY + 100);
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