'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = require('./utils');

var _reactRedux = require('react-redux');

var _core = require('@olasearch/core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global Audio */


/* All voice events */
var VOICE_EVENTS = ['onResult', 'onFinalResult', 'onStart', 'onEnd', 'onStop'];
/* Component */

var Voice = function (_React$Component) {
  _inherits(Voice, _React$Component);

  function Voice(props) {
    _classCallCheck(this, Voice);

    var _this = _possibleConstructorReturn(this, (Voice.__proto__ || Object.getPrototypeOf(Voice)).call(this, props));

    _this.onResult = function (text) {
      _this.props.onResult(text);
    };

    _this.onFinalResult = function (text, initialPayload) {
      var voiceAdapter = _this.props.voiceAdapter;
      /* Stop recording if no text in final result */

      if (typeof text !== 'undefined' && !text) return voiceAdapter.stop();

      /* Set context field */
      _this.props.addContextField('hasUsedVoice', true);

      _this.props.onFinalResult(text, function (response) {
        var answer = response.answer;
        /* Stop voice */

        voiceAdapter.stop();

        /* If no answer */
        if (!answer || !answer.reply) return;

        var reply = answer.reply_voice || answer.reply;

        /* Check if fullfilled */
        var isFulfilled = answer.fulfilled;

        /* Check if awaiting user reply */
        var isAwaitingReply = (0, _utils.checkIfAwaitingResponse)(response);

        /* Play audio */
        _this.setState({
          isSpeaking: true
        });
        voiceAdapter.speak(reply, _this.props.isPhone, function () {
          /* Then continue voice recognition after audio stop */
          if (!isFulfilled && !isAwaitingReply) {
            voiceAdapter.start();
          }

          if (isAwaitingReply) {
            /* Empty message to bot */
            _this.onFinalResult(undefined);
          }

          _this.setState({
            isSpeaking: false
          });
        });
      }, initialPayload);
    };

    _this.onStart = function () {
      _this.setState({
        isRecording: true
      });

      /* Play ping voice */
      _this.playPing();
    };

    _this.onEnd = function () {
      _this.setState({
        isRecording: false
      });

      /* Play ping voice */
      _this.playPing();
    };

    _this.onStop = function () {
      /* Die if has already stopped recording */
      if (!_this.state.isRecording && !_this.state.isSpeaking) return;

      _this.setState({
        isRecording: false,
        isSpeaking: false
      });

      /* Play ping voice */
      _this.playPing();
    };

    _this.playPing = function () {
      if (_this.props.isPhone) {
        return;
      }
      var audio = new Audio();
      audio.crossOrigin = true;
      audio.src = '/tap.mp3';
      audio.play();
    };

    _this.handleSpeechStart = function () {
      var voiceAdapter = _this.props.voiceAdapter;


      if (_this.state.isRecording) {
        voiceAdapter.stop();
      } else {
        /* Start listening */
        voiceAdapter.start();
      }
      _this.props.handleVoiceButtonClick && _this.props.handleVoiceButtonClick();
    };

    _this.state = {
      isRecording: false,
      isSpeaking: false
    };
    return _this;
  }

  _createClass(Voice, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var emitter = this.context.emitter;

      for (var i = 0; i < VOICE_EVENTS.length; i++) {
        emitter.off(VOICE_EVENTS[i], this[VOICE_EVENTS[i]]);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var emitter = this.context.emitter;

      if (!emitter) return;
      for (var i = 0; i < VOICE_EVENTS.length; i++) {
        emitter.on(VOICE_EVENTS[i], this[VOICE_EVENTS[i]]);
      }

      if (this.props.initialPayload) {
        /* Empty message to bot */
        this.onFinalResult(undefined, this.props.initialPayload);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _cx;

      var _state = this.state,
          isRecording = _state.isRecording,
          isSpeaking = _state.isSpeaking;
      var _props = this.props,
          isTyping = _props.isTyping,
          className = _props.className,
          containerClass = _props.containerClass,
          hasUsedVoice = _props.hasUsedVoice,
          searchInput = _props.searchInput,
          showListening = _props.showListening;

      var klass = (0, _classnames2.default)('olachat-mic', className, {
        'olachat-mic-isrecording': isRecording && !isTyping,
        'olachat-mic-isloading': isTyping,
        'olachat-mic-isspeaking': isSpeaking
      });
      var containerKlass = (0, _classnames2.default)('olachat-voice', (_cx = {}, _defineProperty(_cx, '' + containerClass, hasUsedVoice && !isSpeaking && !isRecording), _defineProperty(_cx, 'olachat-voice-isrecording', isRecording && !isTyping), _cx));
      var showLoadingIndicator = isTyping && searchInput === 'voice';
      return _react2.default.createElement(
        'div',
        { className: containerKlass, onClick: this.handleSpeechStart },
        _react2.default.createElement(
          'button',
          { type: 'button', className: klass },
          _react2.default.createElement(
            'span',
            { className: 'olachat-mic-text' },
            isRecording ? 'Stop' : 'Speak'
          ),
          isRecording && showListening ? _react2.default.createElement(
            'span',
            { className: 'olachat-mic-listening' },
            'Listening',
            _react2.default.createElement(
              'em',
              null,
              '...'
            )
          ) : null,
          showLoadingIndicator && _react2.default.createElement('span', { className: 'olachat-mic-loader' })
        )
      );
    }
  }]);

  return Voice;
}(_react2.default.Component);

Voice.contextTypes = {
  emitter: _propTypes2.default.object
};
Voice.defaultProps = {
  showListening: false,
  containerClass: ''
};


function mapStateToProps(state) {
  return {
    isTyping: state.Conversation.isTyping,
    searchInput: state.QueryState.searchInput,
    hasUsedVoice: state.Context.hasUsedVoice,
    isPhone: state.Device.isPhone
  };
}
exports.default = (0, _reactRedux.connect)(mapStateToProps, {
  addContextField: _core.Actions.Context.addContextField
})(Voice);