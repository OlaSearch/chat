'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _TransitionGroup = require('react-transition-group/TransitionGroup');

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransition = require('react-transition-group/CSSTransition');

var _CSSTransition2 = _interopRequireDefault(_CSSTransition);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TopicSuggestions = function TopicSuggestions(_ref) {
  var options = _ref.options,
      onSubmit = _ref.onSubmit,
      updateQueryTerm = _ref.updateQueryTerm,
      isActive = _ref.isActive;

  var replies = options.map(function (_ref2, idx) {
    var label = _ref2.label;

    return _react2.default.createElement(
      _CSSTransition2.default,
      {
        key: idx,
        timeout: { enter: 300, exit: 300 },
        classNames: 'slots'
      },
      _react2.default.createElement(
        'button',
        {
          className: 'olachat-slots-button',
          type: 'button',
          onClick: function onClick() {
            updateQueryTerm(label);
            onSubmit();
          },
          disabled: !isActive
        },
        label
      )
    );
  });
  return _react2.default.createElement(
    'div',
    { className: 'olachat-slots' },
    _react2.default.createElement(
      'div',
      { className: 'olachat-message-reply olachat-message-reply-suggestion' },
      'Did you mean'
    ),
    _react2.default.createElement(
      _TransitionGroup2.default,
      { appear: true, className: 'olachat-slots-list' },
      replies
    )
  );
};

exports.default = TopicSuggestions;