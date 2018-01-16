'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _messageSquare = require('@olasearch/icons/lib/message-square');

var _messageSquare2 = _interopRequireDefault(_messageSquare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Bubble(_ref) {
  var onClick = _ref.onClick,
      isActive = _ref.isActive,
      label = _ref.label,
      iconSize = _ref.iconSize;

  var klass = (0, _classnames2.default)('olachat-bubble', {
    'olachat-bubble-active': isActive
  });
  return _react2.default.createElement(
    'button',
    { className: klass, onClick: onClick },
    _react2.default.createElement(
      'span',
      null,
      label
    ),
    _react2.default.createElement(_messageSquare2.default, { size: iconSize, className: 'ola-icon' })
  );
}

Bubble.defaultProps = {
  label: 'FDW Eligibility chatbot',
  iconSize: 34
};

module.exports = Bubble;