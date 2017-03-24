'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _olasearch = require('olasearch');

var _houndify = require('./adapters/houndify');

var _houndify2 = _interopRequireDefault(_houndify);

var _google = require('./adapters/google');

var _google2 = _interopRequireDefault(_google);

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
      _this.voiceAdapter.stopSpeaking();

      _this.setState({
        isActive: !_this.state.isActive
      });

      /* Reset */
      _this.props.dispatch((0, _actions.clearMessages)());
      _this.props.dispatch(_olasearch.Actions.Search.clearQueryTerm());

      /* Stop all audio */
    };

    _this.state = {
      isActive: !!DEBUG
    };
    /* Create a voiceadapter */
    _this.voiceAdapter = (0, _google2.default)({ emitter: emitter });

    /* Lazy load tokens */
    _this.voiceAdapter.prefetchToken();
    return _this;
  }

  _createClass(Bot, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        emitter: emitter
      };
    }
  }, {
    key: 'render',
    value: function render() {
      // const initialIntent = 'start'
      var passProps = _extends({
        onHide: this.toggleActive
      }, this.props.headerProps, this.props.avatarProps, {
        initialIntent: this.props.initialIntent,
        voiceAdapter: this.voiceAdapter,
        onRequestClose: this.toggleActive,
        emitter: emitter
      });
      var HAS_VOICES = this.props.isPhone ? window.speechSynthesis.getVoices().length > 1 : true;
      var component = this.state.isActive ? this.props.vui ? _react2.default.createElement(_Vui2.default, passProps) : _react2.default.createElement(_Chat2.default, passProps) : null;
      var isActive = this.state.isActive;

      return _react2.default.createElement(
        'div',
        { className: 'olachat-bot' },
        isActive ? null : _react2.default.createElement(_Bubble2.default, _extends({
          onClick: this.toggleActive,
          isActive: this.state.isActive
        }, this.props.bubbleProps)),
        component
      );
    }
  }]);

  return Bot;
}(_react.Component);

Bot.childContextTypes = {
  emitter: _react2.default.PropTypes.object
};
Bot.defaultProps = {
  vui: false,
  bubbleProps: {},
  headerProps: {
    title: 'Calculate maternity leave'
  },
  avatarProps: {
    avatarBot: 'data:image/png;base64,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'
  }
};


function mapStateToProps(state) {
  return {
    isPhone: state.Device.isPhone
  };
}

module.exports = (0, _reactRedux.connect)(mapStateToProps)(Bot);