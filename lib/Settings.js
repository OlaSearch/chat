'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_ARRAY = exports.IGNORE_FEEDBACK_INTENTS = exports.BUBBLE_FULL_HEIGHT = exports.BUBBLE_FULL_WIDTH_MOBILE = exports.BUBBLE_FULL_WIDTH_DESKTOP = exports.BOT_ZINDEX = exports.BOT_WIDTH_ACTIVE = exports.BUBBLE_SPACING = exports.BUBBLE_HEIGHT_MOBILE = exports.BUBBLE_WIDTH_MOBILE = exports.BUBBLE_WIDTH_DESKTOP = exports.OLACHAT_MESSAGE_ELEMENT = exports.OLACHAT_INVITE_IFRAME_ID = exports.OLACHAT_IFRAME_ID = exports.DISAMBIGUATION_INTENT_NAME = exports.NONE_INTENT = exports.WELCOME_INTENT = exports.UNFILFILLED_INTENT = exports.PROFANITY_INTENT = exports.HELP_INTENT = exports.FEEDBACK_INTENT = exports.EMOJI_NEGATIVE = exports.EMOJI_POSITIVE = exports.EMOJI_LIST = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createMessageObj = createMessageObj;
exports.createTypingMsg = createTypingMsg;

var _core = require('@olasearch/core');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var EMOJI_LIST = exports.EMOJI_LIST = {
  '\\01f44d': 'emoji-thumbs-up',
  '\\01f44e': 'emoji-thumbs-down'
};
var EMOJI_POSITIVE = exports.EMOJI_POSITIVE = '\\01f44d';
var EMOJI_NEGATIVE = exports.EMOJI_NEGATIVE = '\\01f44e';
var FEEDBACK_INTENT = exports.FEEDBACK_INTENT = 'OLA.FeedbackIntent';
var HELP_INTENT = exports.HELP_INTENT = 'OLA.HelpIntent';
var PROFANITY_INTENT = exports.PROFANITY_INTENT = 'OLA.ProfanityIntent';
var UNFILFILLED_INTENT = exports.UNFILFILLED_INTENT = 'OLA.UnfulfilledIntent';
var WELCOME_INTENT = exports.WELCOME_INTENT = 'OLA.WelcomeIntent';
var NONE_INTENT = exports.NONE_INTENT = 'OLA.NoneIntent';
var DISAMBIGUATION_INTENT_NAME = exports.DISAMBIGUATION_INTENT_NAME = 'OLA.DisambiguateIntent';
var OLACHAT_IFRAME_ID = exports.OLACHAT_IFRAME_ID = 'olachat-iframe';
var OLACHAT_INVITE_IFRAME_ID = exports.OLACHAT_INVITE_IFRAME_ID = 'olachat-iframe-invite';
var OLACHAT_MESSAGE_ELEMENT = exports.OLACHAT_MESSAGE_ELEMENT = '.olachat-message-reply';
var BUBBLE_WIDTH_DESKTOP = exports.BUBBLE_WIDTH_DESKTOP = 280;
var BUBBLE_WIDTH_MOBILE = exports.BUBBLE_WIDTH_MOBILE = 60;
var BUBBLE_HEIGHT_MOBILE = exports.BUBBLE_HEIGHT_MOBILE = 60;
var BUBBLE_SPACING = exports.BUBBLE_SPACING = 10;
var BOT_WIDTH_ACTIVE = exports.BOT_WIDTH_ACTIVE = 880;
var BOT_ZINDEX = exports.BOT_ZINDEX = 9999;
var BUBBLE_FULL_WIDTH_DESKTOP = exports.BUBBLE_FULL_WIDTH_DESKTOP = BUBBLE_WIDTH_DESKTOP + 2 * BUBBLE_SPACING; /* [10 + 60 + 10] */
var BUBBLE_FULL_WIDTH_MOBILE = exports.BUBBLE_FULL_WIDTH_MOBILE = BUBBLE_WIDTH_MOBILE + 2 * BUBBLE_SPACING; /* [10 + 60 + 10] */
var BUBBLE_FULL_HEIGHT = exports.BUBBLE_FULL_HEIGHT = BUBBLE_HEIGHT_MOBILE + 2 * BUBBLE_SPACING;

var IGNORE_FEEDBACK_INTENTS = exports.IGNORE_FEEDBACK_INTENTS = [FEEDBACK_INTENT, HELP_INTENT, PROFANITY_INTENT, UNFILFILLED_INTENT, WELCOME_INTENT, DISAMBIGUATION_INTENT_NAME];
var EMPTY_ARRAY = exports.EMPTY_ARRAY = [];

function createMessageObj(_ref) {
  var answer = _ref.answer,
      results = _ref.results,
      mc = _ref.mc,
      totalResults = _ref.totalResults,
      _ref$page = _ref.page,
      page = _ref$page === undefined ? 1 : _ref$page,
      ignoreLocation = _ref.ignoreLocation,
      rest = _objectWithoutProperties(_ref, ['answer', 'results', 'mc', 'totalResults', 'page', 'ignoreLocation']);

  if (answer.location && ignoreLocation) answer.location = false;
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