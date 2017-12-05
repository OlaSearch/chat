'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _core = require('@olasearch/core');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mitt = require('mitt');

var _mitt2 = _interopRequireDefault(_mitt);

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
// import webkit from './adapters/webkit'
// import houndify from './adapters/houndify'
// import watson from './adapters/watson'
// import bing from './adapters/bing'


var DEBUG = false;
var supportsVoice = DEBUG ? false : navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
var emitter = (0, _mitt2.default)();

var Bot = function (_Component) {
  _inherits(Bot, _Component);

  function Bot(props) {
    _classCallCheck(this, Bot);

    var _this = _possibleConstructorReturn(this, (Bot.__proto__ || Object.getPrototypeOf(Bot)).call(this, props));

    _this.toggleActive = function () {
      /* Pause all audio */
      _this.voiceAdapter && _this.voiceAdapter.stopSpeaking();

      /* Reset */
      _this.props.clearMessages();
      _this.props.clearQueryTerm();

      var currentActiveStatus = !_this.props.isBotActive;

      /* Stop all audio */
      _this.props.setBotStatus(currentActiveStatus);

      /* Handle active status */
      _this.props.onBubbleClick && _this.props.onBubbleClick(currentActiveStatus);
      /* Log when chatbot opens or closes */
      _this.props.log({
        eventLabel: currentActiveStatus ? 'open' : 'close',
        eventCategory: 'bot',
        eventType: 'O',
        setNewUser: false
      });
    };

    var speechRecognitionProvider = props.speechRecognitionProvider; /* speechOutputProvider */

    if (speechRecognitionProvider) {
      /* Create a voiceadapter */
      // this.voiceAdapter = require('./adapters/google').default({ emitter })
      /* Lazy load tokens */
      // this.voiceAdapter.prefetchToken()
    } else {
      _this.voiceadapter = null;
    }
    return _this;
  }

  _createClass(Bot, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        emitter: emitter,
        env: this.props.env
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      /* Send load log for new user */
      if (this.props.isNewUser) {
        this.props.log({
          eventLabel: 'load',
          eventCategory: 'bot',
          eventType: 'O',
          setNewUser: false
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      // const initialIntent = 'start'
      var passProps = _extends({
        onHide: this.toggleActive
      }, this.props.headerProps, this.props.avatarProps, this.props.botProps, {
        initialIntent: this.props.initialIntent,
        voiceAdapter: this.voiceAdapter,
        onRequestClose: this.toggleActive,
        emitter: emitter
      });
      var HAS_VOICES = this.props.isPhone ? window.speechSynthesis.getVoices().length > 1 : true;
      var _props = this.props,
          isBotActive = _props.isBotActive,
          showBubble = _props.showBubble;

      var component = isBotActive ? this.props.vui && supportsVoice && HAS_VOICES ? _react2.default.createElement(_Vui2.default, passProps) : _react2.default.createElement(_Chat2.default, passProps) : null;
      var botClass = (0, _classnames2.default)('olachat-bot', {
        'olachat-bot-active': isBotActive,
        'olachat-bot-iframe': this.props.iFrame,
        'olachat-bot-mobile': this.props.isPhone,
        'olachat-bot-tablet': this.props.isTablet,
        'olachat-bot-desktop': this.props.isDesktop,
        'olachat-bot-testing': this.props.env === 'testing'
      });
      return _react2.default.createElement(
        'div',
        { className: botClass },
        _react2.default.createElement('div', { className: 'olachat-bot-overlay' }),
        isBotActive ? null : showBubble ? _react2.default.createElement(_Bubble2.default, _extends({
          onClick: this.toggleActive,
          isActive: isBotActive
        }, this.props.bubbleProps)) : null,
        component
      );
    }
  }]);

  return Bot;
}(_react.Component);

Bot.childContextTypes = {
  emitter: _propTypes2.default.object,
  env: _propTypes2.default.string
};
Bot.defaultProps = {
  vui: false,
  showBubble: true,
  bubbleProps: {},
  onBubbleClick: null,
  botProps: {
    botName: 'Bot',
    userName: 'You'
  },
  headerProps: {
    title: 'Bot title'
  },
  avatarProps: {
    avatarBot: null,
    avatarUser: null
  }
};


function mapStateToProps(state) {
  return {
    isPhone: state.Device.isPhone,
    isTablet: state.Device.isTablet,
    isDesktop: state.Device.isDesktop,
    isNewUser: state.Context.isNewUser,
    isBotActive: state.Conversation.isBotActive
  };
}

module.exports = (0, _reactRedux.connect)(mapStateToProps, {
  clearMessages: _actions.clearMessages,
  setBotStatus: _actions.setBotStatus,
  clearQueryTerm: _core.Actions.Search.clearQueryTerm
})(_core.Decorators.withLogger(Bot));