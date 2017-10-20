'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Bot = require('./Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _reactFrameComponent = require('react-frame-component');

var _reactFrameComponent2 = _interopRequireDefault(_reactFrameComponent);

var _reactRedux = require('react-redux');

var _olasearch = require('olasearch');

var _utils = require('./utils');

var _Settings = require('./Settings');

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
      }, function () {
        document.documentElement.classList.toggle('ola-chatbot-rootActive', _this.state.isActive);
      });
    };

    _this.checkForListener = function () {
      if (_this.addedIframeClickEvent && _this.addedMessageClickEvent) return;

      _this.iFrame = document.getElementById(_Settings.OLACHAT_IFRAME_ID);
      _this.innerDoc = _this.iFrame.contentDocument || _this.iFrame.contentWindow.document;

      if (_this.innerDoc && !_this.addedIframeClickEvent) {
        _this.innerDoc.addEventListener('click', _this.iFrameDispatcher);
        _this.addedIframeClickEvent = true;
      }
    };

    _this.iFrameDispatcher = function (e) {
      if (e.defaultPrevented) return;
      if (typeof document !== 'undefined') (0, _utils.triggerMouseEvent)(document, 'mousedown');
    };

    _this.state = {
      isActive: props.debug
    };
    _this.addedIframeClickEvent = false;
    _this.addedMessageClickEvent = false;
    return _this;
  }

  _createClass(BotFrame, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.checkForListener();
      /* Add inline css */
      var style = document.createElement('style');
      style.id = 'ola-styles';
      style.type = 'text/css';
      style.innerHTML = this.props.isDesktop ? '' : '\n      .ola-chatbot-rootActive, .ola-chatbot-rootActive body{\n        -webkit-overflow-scrolling : touch !important;\n        overflow: hidden !important;\n        height: 100% !important;\n    ';
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.checkForListener();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      /* Remove event listener */
      if (this.innerDoc) this.innerDoc.removeEventListener('click', this.iFrameDispatcher);
      /* Remove style */
      var styleEl = document.getElementById('ola-styles');
      if (styleEl) styleEl.parentNode.removeChild(styleEl);
    }
  }, {
    key: 'render',
    value: function render() {
      var isActive = this.state.isActive;
      var _props = this.props,
          iframeStyle = _props.iframeStyle,
          width = _props.width,
          widthActive = _props.widthActive,
          height = _props.height,
          heightActive = _props.heightActive,
          inline = _props.inline,
          zIndex = _props.zIndex,
          isDesktop = _props.isDesktop;

      var frameStyles = _extends({}, iframeStyle, isActive ? {
        top: 0,
        bottom: 0,
        right: 0,
        position: 'fixed',
        width: isDesktop ? widthActive : '100%',
        height: heightActive,
        zIndex: zIndex
      } : _extends({}, inline ? {} : {
        bottom: isDesktop ? 5 : 0,
        top: 'auto',
        right: 0,
        left: 'auto',
        width: width,
        height: height,
        zIndex: zIndex,
        position: 'fixed'
      }));
      return _react2.default.createElement(
        _reactFrameComponent2.default,
        {
          style: frameStyles,
          head: this.props.head,
          id: _Settings.OLACHAT_IFRAME_ID
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
  width: 320,
  widthActive: 880,
  height: 85,
  heightActive: '100%',
  inline: false,
  zIndex: 99999999,
  iframeStyle: {
    border: 'none',
    maxWidth: '100%'
  }
};


function mapStateToProps(state) {
  return {
    isDesktop: state.Device.isDesktop
  };
}

module.exports = (0, _reactRedux.connect)(mapStateToProps)(_olasearch.Decorators.withLogger(BotFrame));