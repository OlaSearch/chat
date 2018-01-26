'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _repeat = require('@olasearch/icons/lib/repeat');

var _repeat2 = _interopRequireDefault(_repeat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FailureButtons = function FailureButtons(_ref) {
  var onSubmit = _ref.onSubmit,
      message = _ref.message,
      isActive = _ref.isActive;

  return _react2.default.createElement(
    'div',
    { className: 'olachat-slots' },
    _react2.default.createElement(
      'small',
      null,
      'Something went wrong. Your message was not delivered.'
    ),
    _react2.default.createElement(
      'div',
      { className: 'olachat-slots-list' },
      _react2.default.createElement(
        'button',
        {
          className: 'olachat-slots-button',
          type: 'button',
          onClick: function onClick() {
            return onSubmit(message.message);
          },
          disabled: !isActive
        },
        _react2.default.createElement(_repeat2.default, { size: 14 }),
        'Retry'
      )
    )
  );
};

module.exports = FailureButtons;