'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Voice = require('./Voice');

var _Voice2 = _interopRequireDefault(_Voice);

var _olasearch = require('olasearch');

var _reactFlexiTextarea = require('react-flexi-textarea');

var _reactFlexiTextarea2 = _interopRequireDefault(_reactFlexiTextarea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var supportsVoice = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var Input = function (_React$Component) {
  _inherits(Input, _React$Component);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, props));

    _this.onChange = function (event) {
      _this.setState({
        text: event.target.value
      });
    };

    _this.onVoiceChange = function (text) {
      _this.setState({
        text: text
      });
    };

    _this.onVoiceFinal = function (text, cb) {
      /* Set text to empty */
      if (typeof text === 'undefined') text = '';

      /* Update text */
      _this.setState({
        text: text
      }, function () {
        return _this.onSubmit(null, cb, 300, _olasearch.Settings.SEARCH_INPUTS.VOICE);
      });
    };

    _this.onFormSubmit = function (event) {
      /* Stop submitting if text is empty */
      if (!_this.state.text) {
        return _this.Input.refs.textarea.focus();
      }

      /* Stop form submission */
      event && event.preventDefault();

      _this.onSubmit();
    };

    _this.onSubmit = function (event, callback) {
      var textClearingDelay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var searchInput = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _olasearch.Settings.SEARCH_INPUTS.KEYBOARD;

      /* Update query term */
      _this.props.updateQueryTerm(_this.state.text, searchInput);

      /**
       * Flow
       * 1. Immediate add to the messages redux atore
       * 2. Sync the message to the server
       * 3. Update sync status in redux store
       */

      // if (this.state.isTyping) return

      /* Clear the final text input after 100ms */
      /* To simulate delay */
      setTimeout(function () {
        _this.setState({
          text: ''
        });

        /* Resize height */
        _this.Input.autoGrow();

        /* Focus */
        if (!_this.props.isPhone) _this.Input.refs.textarea.focus();
      }, textClearingDelay);

      /* Submit the message */
      return _this.props.onSubmit().then(function (response) {
        /* Callbacks */
        callback && typeof callback === 'function' && callback(response);
      });
    };

    _this.onKeyDown = function (event) {
      if (event.nativeEvent.which === 13 && !event.nativeEvent.shiftKey) {
        _this.onSubmit(event);
        event.preventDefault();
      }
    };

    _this.registerRef = function (el) {
      _this.Input = el;
    };

    _this.state = {
      text: '',
      submitting: false
    };
    return _this;
  }

  _createClass(Input, [{
    key: 'render',
    value: function render() {
      var isTyping = this.props.isTyping;

      return _react2.default.createElement(
        'form',
        { className: 'olachat-footer', onSubmit: this.onFormSubmit },
        _react2.default.createElement(
          'div',
          { className: 'olachat-input' },
          supportsVoice ? _react2.default.createElement(
            'div',
            { className: 'olachat-input-voice' },
            _react2.default.createElement(_Voice2.default, {
              onResult: this.onVoiceChange,
              onFinalResult: this.onVoiceFinal,
              voiceAdapter: this.props.voiceAdapter,
              addContextField: this.props.addContextField,
              isTyping: isTyping,
              searchInput: this.props.searchInput
            })
          ) : null,
          _react2.default.createElement(_reactFlexiTextarea2.default, {
            type: 'text',
            placeholder: 'Type a message...',
            onChange: this.onChange,
            onKeyDown: this.onKeyDown,
            value: this.state.text,
            rows: 1,
            cols: 1,
            ref: this.registerRef,
            autoFocus: !this.props.isPhone
          })
        ),
        _react2.default.createElement(
          'button',
          { disabled: isTyping, className: 'olachat-submit' },
          _react2.default.createElement(
            'span',
            null,
            'Send'
          )
        )
      );
    }
  }]);

  return Input;
}(_react2.default.Component);

exports.default = Input;