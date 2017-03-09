'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TypingIndicator = function TypingIndicator(props) {
  return _react2.default.createElement(
    'div',
    { className: 'olachat-message olachat-message-bot ola-chat-progress' },
    _react2.default.createElement(_Avatar2.default, {
      isBot: true
    }),
    _react2.default.createElement(
      'div',
      { className: 'olachat-message-body' },
      _react2.default.createElement(
        _reactAddonsCssTransitionGroup2.default,
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