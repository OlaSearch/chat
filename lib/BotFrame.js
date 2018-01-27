'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Bot = require('./Bot');

var _Bot2 = _interopRequireDefault(_Bot);

var _reactFrameComponent = require('react-frame-component');

var _reactFrameComponent2 = _interopRequireDefault(_reactFrameComponent);

var _reactRedux = require('react-redux');

var _core = require('@olasearch/core');

var _utils = require('./utils');

var _Settings = require('./Settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLE_TAG_ID = _core.Settings.STYLE_TAG_ID,
    MODAL_ROOT_CLASSNAME = _core.Settings.MODAL_ROOT_CLASSNAME;

var BotFrame = function (_React$Component) {
  _inherits(BotFrame, _React$Component);

  function BotFrame(props) {
    _classCallCheck(this, BotFrame);

    var _this = _possibleConstructorReturn(this, (BotFrame.__proto__ || Object.getPrototypeOf(BotFrame)).call(this, props));

    _this.addedIframeClickEvent = false;
    _this.addedMessageClickEvent = false;
    return _this;
  }

  _createClass(BotFrame, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      /* Check if bot is active */
      if (this.props.isBotActive) {
        document.documentElement.classList.add(MODAL_ROOT_CLASSNAME);
      }
      /* Check if style tag is already added */
      if (document.getElementById(STYLE_TAG_ID) || this.props.isDesktop) return;
      /* Add inline css */
      var style = document.createElement('style');
      style.id = STYLE_TAG_ID;
      style.type = 'text/css';
      style.innerHTML = this.props.isDesktop ? '' : '\n      .' + MODAL_ROOT_CLASSNAME + ', .' + MODAL_ROOT_CLASSNAME + ' body{\n        -webkit-overflow-scrolling : touch !important;\n        overflow: hidden !important;\n        height: 100% !important;\n    ';
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (prevProps.isBotActive !== this.props.isBotActive) {
        document.documentElement.classList.toggle(MODAL_ROOT_CLASSNAME, this.props.isBotActive);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var isBotActive = this.props.isBotActive;
      var _props = this.props,
          iframeStyle = _props.iframeStyle,
          width = _props.width,
          widthMobile = _props.widthMobile,
          widthActive = _props.widthActive,
          height = _props.height,
          heightActive = _props.heightActive,
          inline = _props.inline,
          zIndex = _props.zIndex,
          isDesktop = _props.isDesktop,
          activeStyle = _props.activeStyle,
          showBubbleLabel = _props.showBubbleLabel;
      /* On mobile and tablet, hide bubble label */

      showBubbleLabel = this.props.isDesktop ? showBubbleLabel : false;

      var frameStyles = _extends({}, iframeStyle, isBotActive ? _extends({
        top: 0,
        bottom: 0,
        right: 0,
        position: 'fixed',
        width: isDesktop ? widthActive : '100%',
        height: heightActive,
        zIndex: zIndex
      }, activeStyle) : _extends({}, inline ? {
        height: 80
      } : {
        bottom: 10,
        top: 'auto',
        right: 10,
        left: 'auto',
        width: showBubbleLabel ? width : widthMobile,
        height: height,
        zIndex: zIndex,
        position: 'fixed'
      }));
      return _react2.default.createElement(
        _reactFrameComponent2.default,
        {
          style: frameStyles,
          head: _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('link', { rel: 'stylesheet', href: this.props.cssUrl }),
            _react2.default.createElement('meta', {
              name: 'viewport',
              content: 'width=device-width, initial-scale=1'
            })
          ),
          id: _Settings.OLACHAT_IFRAME_ID,
          initialContent: this.props.initialContent,
          title: 'Ola Chat'
        },
        _react2.default.createElement(_Bot2.default, _extends({}, this.props, { showBubbleLabel: showBubbleLabel, iFrame: true }))
      );
    }
  }]);

  return BotFrame;
}(_react2.default.Component);

BotFrame.defaultProps = {
  width: 300,
  widthMobile: 80,
  showBubbleLabel: true,
  widthActive: 880,
  height: 80,
  heightActive: '100%',
  /* Flag to add the chatbot as an inline element */
  inline: false,
  zIndex: 99999999,
  iframeStyle: {
    border: 'none',
    maxWidth: '100%'
  },
  cssUrl: 'https://cdn.olasearch.com/assets/css/olasearch.core.min.css',
  activeStyle: {},
  initialContent: '<!DOCTYPE html>\n      <html class=\'olachat-html\'>\n        <head>\n          <base target=\'_parent\'>\n        </head>\n        <body class=\'olachat-body\'>\n          <div class=\'frame-root\'></div>\n        </body>\n      </html>'
};
BotFrame.propTypes = {
  showBubbleLabel: _propTypes2.default.bool
};


function mapStateToProps(state) {
  return {
    isDesktop: state.Device.isDesktop,
    isBotActive: state.Conversation.isBotActive
  };
}

module.exports = (0, _reactRedux.connect)(mapStateToProps)(_core.Decorators.withLogger(BotFrame));