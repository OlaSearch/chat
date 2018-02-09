'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OfflineIndicator = function OfflineIndicator(_ref) {
  var connection = _ref.connection,
      translate = _ref.translate;

  if (connection === 'offline') {
    return _react2.default.createElement(
      'div',
      { className: 'olachat-notification' },
      translate('chat_offline_message')
    );
  }
  return null;
};

exports.default = _core.Decorators.withTranslate((0, _reactRedux.connect)(function (state) {
  return { connection: state.Device.connection };
})(OfflineIndicator));