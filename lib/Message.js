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

var _utils = require('./utils');

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Message = function Message(_ref) {
  var message = _ref.message;
  var userId = message.userId,
      timestamp = message.timestamp;

  var isBot = !userId;
  var text = isBot ? message.reply : message.message;
  var messageClass = (0, _classnames2.default)('olachat-message', {
    'olachat-message-bot': isBot
  });
  return _react2.default.createElement(
    'div',
    { className: messageClass },
    _react2.default.createElement(_Avatar2.default, {
      isBot: isBot,
      userId: userId
    }),
    _react2.default.createElement(
      'div',
      { className: 'olachat-message-body' },
      _react2.default.createElement('div', { className: 'olachat-message-content', dangerouslySetInnerHTML: (0, _utils.createHTMLMarkup)(text) }),
      _react2.default.createElement(
        'div',
        { className: 'olachat-message-date' },
        _olasearch.DateParser.format(timestamp * 1000, 'DD MMM')
      )
    )
  );
};

exports.default = Message;