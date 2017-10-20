'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TransitionGroup = require('react-transition-group/TransitionGroup');

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransition = require('react-transition-group/CSSTransition');

var _CSSTransition2 = _interopRequireDefault(_CSSTransition);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TypingIndicator = function TypingIndicator(_ref) {
  var avatarBot = _ref.avatarBot,
      isBot = _ref.isBot;

  return _react2.default.createElement(
    'div',
    { className: 'olachat-message olachat-message-bot ola-chat-progress' },
    _react2.default.createElement(_Avatar2.default, {
      isBot: true,
      avatarBot: avatarBot
    }),
    _react2.default.createElement(
      'div',
      { className: 'olachat-message-body' },
      _react2.default.createElement(
        _TransitionGroup2.default,
        {
          appear: true
        },
        _react2.default.createElement(
          _CSSTransition2.default,
          {
            classNames: 'ola-fade',
            timeout: { enter: 500, exit: 500 }
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
    )
  );
};

exports.default = TypingIndicator;