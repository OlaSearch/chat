'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TypingIndicator = function TypingIndicator(_ref) {
  var avatarBot = _ref.avatarBot,
      isBot = _ref.isBot;

  return _react2.default.createElement(
    'div',
    { className: 'olachat-message olachat-message-bot ola-chat-progress' },
    avatarBot ? _react2.default.createElement(_Avatar2.default, {
      isBot: true,
      avatarBot: avatarBot
    }) : null,
    _react2.default.createElement(
      'div',
      { className: 'olachat-message-body' },
      _react2.default.createElement(
        _CSSTransitionGroup2.default,
        {
          transitionName: 'messages',
          transitionAppear: true,
          transitionAppearTimeout: 500,
          transitionEnterTimeout: 300,
          transitionLeaveTimeout: 300
        },
        _react2.default.createElement(
          'div',
          { className: 'typing-indicator' },
          _react2.default.createElement('span', null),
          _react2.default.createElement('span', null),
          _react2.default.createElement('span', null)
        )
      )
    )
  );
};

exports.default = TypingIndicator;