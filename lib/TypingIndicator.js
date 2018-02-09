'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TypingIndicator(_ref) {
  var avatarBot = _ref.avatarBot,
      isBot = _ref.isBot,
      theme = _ref.theme;

  return _react2.default.createElement(
    'div',
    { className: 'olachat-message olachat-message-bot olachat-progress' },
    _react2.default.createElement(
      'div',
      { className: 'olachat-message-inner' },
      _react2.default.createElement(_Avatar2.default, { isBot: true, avatarBot: avatarBot }),
      _react2.default.createElement(
        'div',
        { className: 'olachat-message-body' },
        _react2.default.createElement(_Loader2.default, { theme: theme })
      )
    )
  );
}

exports.default = TypingIndicator;