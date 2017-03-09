'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Bubble = require('./Bubble');

var _Bubble2 = _interopRequireDefault(_Bubble);

var _Chat = require('./Chat');

var _Chat2 = _interopRequireDefault(_Chat);

var _Vui = require('./Vui');

var _Vui2 = _interopRequireDefault(_Vui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bot = function (_Component) {
  _inherits(Bot, _Component);

  function Bot(props) {
    _classCallCheck(this, Bot);

    var _this = _possibleConstructorReturn(this, (Bot.__proto__ || Object.getPrototypeOf(Bot)).call(this, props));

    _this.toggleActive = function () {
      _this.setState({
        isActive: !_this.state.isActive
      });
    };

    _this.state = {
      isActive: false
    };
    return _this;
  }

  _createClass(Bot, [{
    key: 'render',
    value: function render() {
      var supportsVoice = window.SpeechRecognition || window.webkitSpeechRecognition;
      var component = this.state.isActive ? supportsVoice ? _react2.default.createElement(_Vui2.default, _extends({ onHide: this.toggleActive }, this.props.headerProps)) : _react2.default.createElement(_Chat2.default, _extends({ onHide: this.toggleActive }, this.props.headerProps)) : null;
      return _react2.default.createElement(
        'div',
        { className: 'olachat-bot' },
        _react2.default.createElement(_Bubble2.default, _extends({
          onClick: this.toggleActive,
          isActive: this.state.isActive
        }, this.props.bubbleProps)),
        component
      );
    }
  }]);

  return Bot;
}(_react.Component);

Bot.defaultProps = {
  bubbleProps: {},
  headerProps: {
    title: 'Calculate maternity leave'
  }
};


module.exports = Bot;