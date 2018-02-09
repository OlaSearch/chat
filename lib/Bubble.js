'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Bubble;

var _style = require('styled-jsx/style');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _messageSquare = require('@olasearch/icons/lib/message-square');

var _messageSquare2 = _interopRequireDefault(_messageSquare);

var _Settings = require('./Settings');

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Bubble(_ref) {
  var onClick = _ref.onClick,
      isActive = _ref.isActive,
      label = _ref.label,
      iconSize = _ref.iconSize,
      showBubbleLabel = _ref.showBubbleLabel;

  var klass = (0, _classnames2.default)('olachat-bubble', {
    'olachat-bubble-active': isActive
  });
  var style = showBubbleLabel ? {
    width: _Settings.BUBBLE_WIDTH_DESKTOP
  } : {
    width: _Settings.BUBBLE_WIDTH_MOBILE,
    padding: 0
  };
  return _react2.default.createElement(
    _core.ThemeConsumer,
    null,
    function (theme) {
      return _react2.default.createElement(
        'button',
        { style: style, onClick: onClick, className: _style2.default.dynamic([['2433233550', [theme.chatBubbleBackground, theme.chatBubbleBackgroundHover]]]) + ' ' + (klass || '')
        },
        _react2.default.createElement(
          'span',
          {
            className: _style2.default.dynamic([['2433233550', [theme.chatBubbleBackground, theme.chatBubbleBackgroundHover]]]) + ' ' + 'olachat-bubble-inner'
          },
          showBubbleLabel ? _react2.default.createElement(
            'span',
            {
              className: _style2.default.dynamic([['2433233550', [theme.chatBubbleBackground, theme.chatBubbleBackgroundHover]]]) + ' ' + 'olachat-bubble-text'
            },
            label
          ) : null,
          _react2.default.createElement(_messageSquare2.default, { size: iconSize, className: 'ola-icon' })
        ),
        _react2.default.createElement(_style2.default, {
          styleId: '2433233550',
          css: '.olachat-bubble.__jsx-style-dynamic-selector{background:' + theme.chatBubbleBackground + ';line-height:1.2;}.olachat-bubble.__jsx-style-dynamic-selector:hover{background:' + theme.chatBubbleBackgroundHover + ';}',
          dynamic: [theme.chatBubbleBackground, theme.chatBubbleBackgroundHover]
        })
      );
    }
  );
}

Bubble.defaultProps = {
  label: 'Ask me anything',
  iconSize: 34
};