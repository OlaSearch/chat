'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mitt = require('mitt');

var _mitt2 = _interopRequireDefault(_mitt);

var _webkit = require('./adapters/webkit');

var _webkit2 = _interopRequireDefault(_webkit);

var _houndify = require('./adapters/houndify');

var _houndify2 = _interopRequireDefault(_houndify);

var _Voice = require('./Voice');

var _Voice2 = _interopRequireDefault(_Voice);

var _TypingIndicator = require('./TypingIndicator');

var _TypingIndicator2 = _interopRequireDefault(_TypingIndicator);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
var emitter = (0, _mitt2.default)();

var OneLoop = function (_React$Component) {
  _inherits(OneLoop, _React$Component);

  function OneLoop(props) {
    _classCallCheck(this, OneLoop);

    var _this = _possibleConstructorReturn(this, (OneLoop.__proto__ || Object.getPrototypeOf(OneLoop)).call(this, props));

    _this.addScrollListener = function () {
      var lastScrollTop = 0;
      window.addEventListener('scroll', function () {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
          if (_this.state.scrollDirection !== 'down') {
            _this.setState({
              scrollDirection: 'down'
            });
          }
        } else {
          if (_this.state.scrollDirection !== 'up') {
            _this.setState({
              scrollDirection: 'up'
            });
          }
        }

        lastScrollTop = st;
      });
    };

    _this.onVoiceChange = function (text) {
      _this.setState({
        text: text
      });
    };

    _this.onVoiceFinal = function (text, cb) {
      _this.props.updateQueryTerm(text, _olasearch.Settings.SEARCH_INPUTS.VOICE);
      return _this.onSubmit(null, cb, 300);
    };

    _this.onSubmit = function (event, callback) {
      var textClearingDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      /**
       * Flow
       * 1. Immediate add to the messages redux atore
       * 2. Sync the message to the server
       * 3. Update sync status in redux store
       */
      /* Stop form submission */
      event && event.preventDefault();

      if (_this.props.isTyping) return;

      /* Clear the final text input after 100ms */
      /* To simulate delay */
      setTimeout(function () {
        _this.setState({
          text: '',
          scrollDirection: null
        });
      }, textClearingDelay);

      /* Submit the message */
      return _this.props.addMessage({ singleLoop: true }).then(function (response) {
        /* Scroll to top */
        _this.scrollToView();
        callback && typeof callback === 'function' && callback(response);
      });
    };

    _this.scrollToView = function () {
      window.scrollTo(0, 0);
    };

    _this.state = {
      text: '',
      scrollDirection: null
    };

    /* Create a voiceadapter */
    var isPhone = props.isPhone;

    _this.voiceAdapter = isPhone ? (0, _houndify2.default)({ emitter: emitter }) : (0, _webkit2.default)({ emitter: emitter });

    /* Add scroll event */
    _this.addScrollListener();
    return _this;
  }

  _createClass(OneLoop, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        emitter: emitter
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var isTyping = this.props.isTyping;
      var scrollDirection = this.state.scrollDirection;

      var voiceContainerClass = scrollDirection ? 'olachat-voice-scroll-' + scrollDirection : '';
      return _react2.default.createElement(
        'div',
        { className: 'olachat-oneloop' },
        _react2.default.createElement(_Voice2.default, {
          onResult: this.onVoiceChange,
          onFinalResult: this.onVoiceFinal,
          voiceAdapter: this.voiceAdapter,
          isPhone: this.props.isPhone,
          isTyping: this.props.isTyping,
          addContextField: this.props.addContextField,
          containerClass: voiceContainerClass,
          hasUsedVoice: this.props.hasUsedVoice,
          handleClick: function handleClick() {
            _this2.setState({
              scrollDirection: null
            });
          }
        }),
        !isTyping && this.props.messages.filter(function (e, i) {
          return i === _this2.props.messages.length - 1;
        }).map(function (msg, idx) {
          return _react2.default.createElement(
            'div',
            { key: idx, className: 'olachat-oneloop-reply' },
            msg.reply
          );
        })
      );
    }
  }]);

  return OneLoop;
}(_react2.default.Component);

OneLoop.childContextTypes = {
  emitter: _react2.default.PropTypes.object
};


function mapStateToProps(state) {
  return {
    messages: state.Conversation.messages,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    hasUsedVoice: state.Context.hasUsedVoice
  };
}
exports.default = (0, _reactRedux.connect)(mapStateToProps, {
  addMessage: _actions.addMessage,
  updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm,
  addContextField: _olasearch.Actions.Context.addContextField
})(OneLoop);