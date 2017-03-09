'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header(_ref) {
  var onHide = _ref.onHide,
      title = _ref.title;

  if (!title && !onHide) return null;
  return _react2.default.createElement(
    'div',
    { className: 'olachat-header' },
    _react2.default.createElement(
      'p',
      { className: 'olachat-header-title' },
      title
    ),
    onHide ? _react2.default.createElement(
      'button',
      { className: 'olachat-header-hide', onClick: onHide },
      _react2.default.createElement(
        'span',
        null,
        'Hide'
      )
    ) : null
  );
};

exports.default = Header;