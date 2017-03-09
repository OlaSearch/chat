'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bubble = function Bubble(_ref) {
  var onClick = _ref.onClick,
      isActive = _ref.isActive,
      label = _ref.label;

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
    )
  );
};

Bubble.defaultProps = {
  label: 'Use your voice to calculate your maternity leave dates'
};

module.exports = Bubble;