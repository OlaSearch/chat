'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Header;

var _style = require('@olasearch/styled-jsx/style');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _x = require('@olasearch/icons/lib/x');

var _x2 = _interopRequireDefault(_x);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Header(_ref) {
  var onHide = _ref.onHide,
      title = _ref.title,
      theme = _ref.theme;

  if (!title && !onHide) return null;
  return _react2.default.createElement(
    'div',
    {
      className: _style2.default.dynamic([['1167512710', [theme.chatHeaderBackground, theme.chatHeaderColor, (0, _utils.darken)(theme.chatHeaderBackground, 10)]]]) + ' ' + 'olachat-header'
    },
    _react2.default.createElement(
      'p',
      {
        className: _style2.default.dynamic([['1167512710', [theme.chatHeaderBackground, theme.chatHeaderColor, (0, _utils.darken)(theme.chatHeaderBackground, 10)]]]) + ' ' + 'olachat-header-title'
      },
      title
    ),
    onHide ? _react2.default.createElement(
      'button',
      { onClick: onHide, className: _style2.default.dynamic([['1167512710', [theme.chatHeaderBackground, theme.chatHeaderColor, (0, _utils.darken)(theme.chatHeaderBackground, 10)]]]) + ' ' + 'olachat-header-hide'
      },
      _react2.default.createElement(_x2.default, null)
    ) : null,
    _react2.default.createElement(_style2.default, {
      styleId: '1167512710',
      css: '.olachat-header.__jsx-style-dynamic-selector{background-color:' + theme.chatHeaderBackground + ';color:' + theme.chatHeaderColor + ';}.olachat-header.__jsx-style-dynamic-selector .olachat-header-hide.__jsx-style-dynamic-selector:hover{background-color:' + (0, _utils.darken)(theme.chatHeaderBackground, 10) + ';}',
      dynamic: [theme.chatHeaderBackground, theme.chatHeaderColor, (0, _utils.darken)(theme.chatHeaderBackground, 10)]
    })
  );
}