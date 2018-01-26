'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var OLACHAT_MESSAGE_ELEMENT = exports.OLACHAT_MESSAGE_ELEMENT = '.olachat-message-reply';

var IGNORE_FEEDBACK_INTENTS = exports.IGNORE_FEEDBACK_INTENTS = [FEEDBACK_INTENT, HELP_INTENT, PROFANITY_INTENT, UNFILFILLED_INTENT, WELCOME_INTENT, DISAMBIGUATION_INTENT_NAME];
var EMPTY_ARRAY = exports.EMPTY_ARRAY = [];