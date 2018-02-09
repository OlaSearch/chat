'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Loader;

var _style = require('styled-jsx/style');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TransitionGroup = require('react-transition-group/TransitionGroup');

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransition = require('react-transition-group/CSSTransition');

var _CSSTransition2 = _interopRequireDefault(_CSSTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Loader(_ref) {
  var theme = _ref.theme;

  return _react2.default.createElement(
    _TransitionGroup2.default,
    { appear: true },
    _react2.default.createElement(
      _CSSTransition2.default,
      { classNames: 'ola-fade', timeout: { enter: 500, exit: 500 } },
      _react2.default.createElement(
        'div',
        {
          className: _style2.default.dynamic([['2884553955', [theme.primaryColor]]]) + ' ' + 'typing-indicator'
        },
        _react2.default.createElement('span', {
          className: _style2.default.dynamic([['2884553955', [theme.primaryColor]]])
        }),
        _react2.default.createElement('span', {
          className: _style2.default.dynamic([['2884553955', [theme.primaryColor]]])
        }),
        _react2.default.createElement('span', {
          className: _style2.default.dynamic([['2884553955', [theme.primaryColor]]])
        })
      )
    ),
    _react2.default.createElement(_style2.default, {
      styleId: '2884553955',
      css: '.typing-indicator.__jsx-style-dynamic-selector span.__jsx-style-dynamic-selector{background-color:' + theme.primaryColor + ';}',
      dynamic: [theme.primaryColor]
    })
  );
}