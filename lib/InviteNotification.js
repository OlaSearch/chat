'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _style = require('@olasearch/styled-jsx/style');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _core = require('@olasearch/core');

var _reactRedux = require('react-redux');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InviteNotification = function (_React$Component) {
  _inherits(InviteNotification, _React$Component);

  function InviteNotification() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, InviteNotification);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = InviteNotification.__proto__ || Object.getPrototypeOf(InviteNotification)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function () {
      _this.props.setBotStatus(true);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(InviteNotification, [{
    key: 'render',
    value: function render() {
      var theme = this.props.theme;

      return _react2.default.createElement(
        'div',
        { style: { opacity: 0 }, className: _style2.default.dynamic([['515898785', [theme.chatFontFamily]]]) + ' ' + 'olachat-invite'
        },
        _react2.default.createElement(
          'button',
          {
            style: { opacity: 0 },
            onClick: this.props.hideInvite,
            className: _style2.default.dynamic([['515898785', [theme.chatFontFamily]]]) + ' ' + 'ola-btn ola-btn-dismiss'
          },
          'Dismiss'
        ),
        _react2.default.createElement(
          'div',
          { onClick: this.handleClick, className: _style2.default.dynamic([['515898785', [theme.chatFontFamily]]]) + ' ' + 'olachat-invite-snippet'
          },
          _react2.default.createElement(
            'div',
            {
              className: _style2.default.dynamic([['515898785', [theme.chatFontFamily]]]) + ' ' + 'olachat-invite-snippet-title'
            },
            'Hi there!'
          ),
          _react2.default.createElement(
            'div',
            {
              className: _style2.default.dynamic([['515898785', [theme.chatFontFamily]]]) + ' ' + 'olachat-invite-snippet-body'
            },
            'What brings you to our website today?'
          )
        ),
        _react2.default.createElement(_style2.default, {
          styleId: '515898785',
          css: '.olachat-invite-snippet.__jsx-style-dynamic-selector{line-height:1.5;color:#4a4a4a;font-family:' + theme.chatFontFamily + ';}',
          dynamic: [theme.chatFontFamily]
        })
      );
    }
  }]);

  return InviteNotification;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(null, { setBotStatus: _actions.setBotStatus, hideInvite: _actions.hideInvite })(_core.Decorators.withTheme(InviteNotification));