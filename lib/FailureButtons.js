'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _repeat = require('@olasearch/icons/lib/repeat');

var _repeat2 = _interopRequireDefault(_repeat);

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FailureButtons(_ref) {
  var onSubmit = _ref.onSubmit,
      message = _ref.message,
      isActive = _ref.isActive,
      translate = _ref.translate;

  return _react2.default.createElement(
    'div',
    { className: 'olachat-slots' },
    _react2.default.createElement(
      'small',
      null,
      translate('chat_something_went_wrong')
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
        translate('chat_retry')
      )
    )
  );
}

exports.default = _core.Decorators.withTranslate(FailureButtons);