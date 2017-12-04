'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Avatar(_ref) {
  var isBot = _ref.isBot,
      userId = _ref.userId,
      avatarBot = _ref.avatarBot,
      avatarUser = _ref.avatarUser;

  var img = _react2.default.createElement('img', { className: 'olachat-avatar', src: avatarBot });
  var klass = (0, _classnames2.default)('olachat-message-avatar', {
    'olachat-avatar-bot': isBot
  });
  if (!isBot) {
    img = _react2.default.createElement('img', { className: 'olachat-avatar', src: avatarUser });
  }
  return _react2.default.createElement(
    'div',
    { className: klass },
    img
  );
}

exports.default = Avatar;