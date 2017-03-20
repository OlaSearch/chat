'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Voice = require('./Voice');

var _Voice2 = _interopRequireDefault(_Voice);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _olasearch = require('olasearch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var supportsVoice = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var Vui = function (_React$Component) {
  _inherits(Vui, _React$Component);

  function Vui(props) {
    _classCallCheck(this, Vui);

    var _this = _possibleConstructorReturn(this, (Vui.__proto__ || Object.getPrototypeOf(Vui)).call(this, props));

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

    _this.onVoiceFinal = function (text, cb, params) {
      /* Set text to empty */
      if (typeof text === 'undefined') text = '';
      /* Update query term */
      _this.props.updateQueryTerm(text, _olasearch.Settings.SEARCH_INPUTS.VOICE);
      return _this.onSubmit(cb, 300, params);
    };

    _this.onSubmit = function (callback) {
      var textClearingDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      /**
       * Flow
       * 1. Immediate add to the messages redux atore
       * 2. Sync the message to the server
       * 3. Update sync status in redux store
       */

      if (_this.props.isTyping) return;

      /* Clear the final text input after 100ms */
      /* To simulate delay */
      setTimeout(function () {
        _this.setState({
          // text: '',
          scrollDirection: null
        });
      }, textClearingDelay);

      /* Submit the message */
      return _this.props.addMessage(params).then(function (response) {
        /* Scroll to top */
        _this.scrollToView();
        /* Delete text state */
        _this.setState({
          text: ''
        });
        callback && typeof callback === 'function' && callback(response);
      });
    };

    _this.scrollToView = function () {
      window.scrollTo(0, 0);
    };

    _this.handleVoiceButtonClick = function () {
      _this.setState({
        scrollDirection: null
      });
    };

    _this.state = {
      text: '',
      scrollDirection: null
    };
    return _this;
  }

  _createClass(Vui, [{
    key: 'render',
    value: function render() {
      var messages = this.props.messages;
      var _state = this.state,
          scrollDirection = _state.scrollDirection,
          text = _state.text;

      var voiceContainerClass = scrollDirection ? 'olachat-voice-scroll-' + scrollDirection : '';
      var initialPayload = { vui: true, immediate: true, intent: this.props.initialIntent };
      var msgs = messages.filter(function (msg) {
        return !msg.userId;
      });
      return _react2.default.createElement(
        'div',
        { className: 'olachat-vui' },
        _react2.default.createElement(_Header2.default, {
          onHide: this.props.onHide,
          title: this.props.title
        }),
        supportsVoice ? _react2.default.createElement(_Voice2.default, {
          onResult: this.onVoiceChange,
          onFinalResult: this.onVoiceFinal,
          voiceAdapter: this.props.voiceAdapter,
          containerClass: voiceContainerClass,
          hasUsedVoice: this.props.hasUsedVoice,
          showListening: true,
          initialPayload: initialPayload
        }) : null,
        msgs.filter(function (msg, i) {
          return i === msgs.length - 1;
        }).map(function (_ref, idx) {
          var message = _ref.message,
              reply = _ref.reply,
              userId = _ref.userId;

          var isBot = !userId;
          var text = isBot ? reply : message;
          return _react2.default.createElement(
            'div',
            { key: idx, className: 'olachat-vui-reply' },
            text
          );
        }),
        _react2.default.createElement(
          'span',
          { className: 'olachat-vui-message' },
          text
        )
      );
    }
  }]);

  return Vui;
}(_react2.default.Component);

Vui.defaultProps = {
  title: 'Ola Bot'
};


function mapStateToProps(state) {
  return {
    messages: state.Conversation.messages,
    isTyping: state.Conversation.isTyping
  };
}
exports.default = (0, _reactRedux.connect)(mapStateToProps, {
  addMessage: _actions.addMessage,
  updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm
})(Vui);