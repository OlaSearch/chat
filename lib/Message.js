'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Card = require('./Card');

var _Card2 = _interopRequireDefault(_Card);

var _utils = require('./utils');

var _olasearch = require('olasearch');

var _SlotOptions = require('./SlotOptions');

var _SlotOptions2 = _interopRequireDefault(_SlotOptions);

var _SearchResultsMessage = require('./SearchResultsMessage');

var _SearchResultsMessage2 = _interopRequireDefault(_SearchResultsMessage);

var _MessageFeedback = require('./MessageFeedback');

var _MessageFeedback2 = _interopRequireDefault(_MessageFeedback);

var _Settings = require('./Settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regex = /^\\[a-z|0-9]+\b/g;

var Message = function Message(_ref) {
  var message = _ref.message,
      avatarBot = _ref.avatarBot,
      avatarUser = _ref.avatarUser,
      addMessage = _ref.addMessage,
      botName = _ref.botName,
      userName = _ref.userName,
      minTextLength = _ref.minTextLength,
      isActive = _ref.isActive,
      isSearchActive = _ref.isSearchActive,
      isTyping = _ref.isTyping,
      messageIdx = _ref.messageIdx;
  var userId = message.userId,
      timestamp = message.timestamp,
      awaitingUserInput = message.awaitingUserInput,
      fulfilled = message.fulfilled,
      card = message.card,
      options = message.slot_options,
      results = message.results,
      intent = message.intent;

  var isBot = !userId;
  var text = isBot ? message.reply : message.message;
  var messageClass = (0, _classnames2.default)('olachat-message', {
    'olachat-message-bot': isBot,
    'olachat-message-fulfilled': fulfilled,
    'olachat-message-collapse': typeof awaitingUserInput !== 'undefined' && !awaitingUserInput,
    'olachat-message-single': text && text.length < minTextLength,
    'olachat-message-wide': !!card,
    'olachat-message-with-search': results && results.length > 0
  });
  function setMarkup(text) {
    if (!text) return null;
    var t = text.replace(regex, function (match) {
      return '<span class="' + ('' + _Settings.EMOJI_LIST[match]) + '"></span>';
    });
    return (0, _utils.createHTMLMarkup)(t);
  }
  return _react2.default.createElement(
    'div',
    { className: messageClass },
    _react2.default.createElement(_Avatar2.default, {
      isBot: isBot,
      userId: userId,
      avatarBot: avatarBot,
      avatarUser: avatarUser
    }),
    _react2.default.createElement(
      'div',
      { className: 'olachat-message-body' },
      _react2.default.createElement(
        'div',
        { className: 'olchat-message-name' },
        isBot ? botName : userName
      ),
      _react2.default.createElement(
        'div',
        { className: 'olachat-message-content' },
        _react2.default.createElement('div', { className: 'olachat-message-reply', dangerouslySetInnerHTML: setMarkup(text) }),
        _react2.default.createElement(_Card2.default, {
          card: card
        }),
        _react2.default.createElement(_SearchResultsMessage2.default, {
          results: results,
          botName: botName,
          isActive: isSearchActive,
          message: message
        })
      ),
      _react2.default.createElement(
        'div',
        { className: 'olachat-message-date' },
        _olasearch.DateParser.format(timestamp * 1000, 'DD MMM')
      ),
      _react2.default.createElement(_SlotOptions2.default, {
        onSubmit: addMessage,
        options: options,
        isActive: isActive,
        intent: intent
      }),
      _react2.default.createElement(_MessageFeedback2.default, {
        isBot: isBot,
        message: message,
        isActive: isActive,
        isTyping: isTyping,
        messageIdx: messageIdx,
        onSubmit: addMessage
      })
    )
  );
};

Message.defaultProps = {
  minTextLength: 40
};

exports.default = Message;