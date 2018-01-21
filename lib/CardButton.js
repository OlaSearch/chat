'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CardButton(_ref) {
  var title = _ref.title,
      type = _ref.type,
      url = _ref.url;

  return _react2.default.createElement(
    'a',
    { className: 'ola-card-button', target: '_blank', href: url },
    title
  );
}

module.exports = CardButton;