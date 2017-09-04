'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Bot = require('./Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _reactFrameComponent = require('react-frame-component');

var _reactFrameComponent2 = _interopRequireDefault(_reactFrameComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BotFrame = function (_React$Component) {
  _inherits(BotFrame, _React$Component);

  function BotFrame(props) {
    _classCallCheck(this, BotFrame);

    var _this = _possibleConstructorReturn(this, (BotFrame.__proto__ || Object.getPrototypeOf(BotFrame)).call(this, props));

    _this.handleBubbleClick = function (isActive) {
      _this.setState({
        isActive: isActive
      });
    };

    _this.state = {
      isActive: false
    };
    return _this;
  }

  _createClass(BotFrame, [{
    key: 'render',
    value: function render() {
      var isActive = this.state.isActive;
      var _props = this.props,
          iframeStyle = _props.iframeStyle,
          width = _props.width,
          widthActive = _props.widthActive,
          height = _props.height,
          heightActive = _props.heightActive;

      var frameStyles = _extends({}, iframeStyle, isActive ? { height: heightActive, width: widthActive } : { height: height, width: width });
      return _react2.default.createElement(
        _reactFrameComponent2.default,
        {
          style: frameStyles,
          head: this.props.head
        },
        _react2.default.createElement(_Bot2.default, _extends({}, this.props, {
          iFrame: true,
          onBubbleClick: this.handleBubbleClick
        }))
      );
    }
  }]);

  return BotFrame;
}(_react2.default.Component);

BotFrame.defaultProps = {
  width: 300,
  widthActive: 870,
  height: 60,
  heightActive: 'calc(100% - 40px)',
  iframeStyle: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 99999,
    border: 'none'
    // padding: 3
  }
};


module.exports = BotFrame;