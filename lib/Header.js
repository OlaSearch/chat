'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Header;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _x = require('@olasearch/icons/lib/x');

var _x2 = _interopRequireDefault(_x);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Header(_ref) {
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
      _react2.default.createElement(_x2.default, null)
    ) : null
  );
}