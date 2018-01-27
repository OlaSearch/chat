'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Bubble;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _messageSquare = require('@olasearch/icons/lib/message-square');

var _messageSquare2 = _interopRequireDefault(_messageSquare);

var _Settings = require('./Settings');

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
    'button',
    { style: style, className: klass, onClick: onClick },
    _react2.default.createElement(
      'span',
      { className: 'olachat-bubble-inner' },
      showBubbleLabel ? _react2.default.createElement(
        'span',
        { className: 'olachat-bubble-text' },
        label
      ) : null,
      _react2.default.createElement(_messageSquare2.default, { size: iconSize, className: 'ola-icon' })
    )
  );
}

Bubble.defaultProps = {
  label: 'Ask me anything',
  iconSize: 34
};