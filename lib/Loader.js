'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TransitionGroup = require('react-transition-group/TransitionGroup');

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransition = require('react-transition-group/CSSTransition');

var _CSSTransition2 = _interopRequireDefault(_CSSTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Loader() {
  return _react2.default.createElement(
    _TransitionGroup2.default,
    { appear: true },
    _react2.default.createElement(
      _CSSTransition2.default,
      { classNames: 'ola-fade', timeout: { enter: 500, exit: 500 } },
      _react2.default.createElement(
        'div',
        { className: 'typing-indicator' },
        _react2.default.createElement('span', null),
        _react2.default.createElement('span', null),
        _react2.default.createElement('span', null)
      )
    )
  );
}

module.exports = Loader;