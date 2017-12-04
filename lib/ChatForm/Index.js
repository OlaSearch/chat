'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mitt = require('mitt');

var _mitt2 = _interopRequireDefault(_mitt);

var _google = require('./../adapters/google');

var _google2 = _interopRequireDefault(_google);

var _Voice = require('./../Voice');

var _Voice2 = _interopRequireDefault(_Voice);

var _Header = require('./../Header');

var _Header2 = _interopRequireDefault(_Header);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
var emitter = (0, _mitt2.default)();

var ChatForm = function (_React$Component) {
  _inherits(ChatForm, _React$Component);

  function ChatForm(props) {
    _classCallCheck(this, ChatForm);

    var _this = _possibleConstructorReturn(this, (ChatForm.__proto__ || Object.getPrototypeOf(ChatForm)).call(this, props));

    _this.toggleActive = function () {
      _this.setState({
        isActive: !_this.state.isActive
      }, function () {
        if (_this.state.isActive) _this.process();
      });
    };

    _this.advanceToNext = function () {
      _this.setState({
        currentIndex: _this.state.currentIndex + 1
      });

      _this.process();
    };

    _this.process = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var repeat = options.repeat;

      _schema2.default.filter(function (item, id) {
        return id === _this.state.currentIndex;
      }).forEach(function (item) {
        var dialogue = item.dialogue,
            slots = item.slots,
            dialogue_repeat = item.dialogue_repeat;

        if (repeat) {
          dialogue = dialogue_repeat;
        }
        _this.voiceAdapter.speak(dialogue, false, function () {
          if (slots) {
            _this.voiceAdapter.start();
          } else {
            _this.advanceToNext();
          }
        });
      });
    };

    _this.clearText = function () {
      return _this.setState({ text: '' });
    };

    _this.onVoiceChange = function (text) {
      _this.setState({
        text: text
      });
    };

    _this.onVoiceFinal = function (text, cb, params) {
      if (!text) return;
      var currentIndex = _this.state.currentIndex;
      var _schema$currentIndex = _schema2.default[currentIndex],
          validate = _schema$currentIndex.validate,
          slots = _schema$currentIndex.slots;

      /* Validate if required */

      if (validate) {
        if (validate(text)) {
          /* Fill up the slots */
          if (document.getElementsByName(slots[0]).length) {
            document.getElementsByName(slots[0])[0].value = text;
          }

          /* Next question */
          _this.advanceToNext();
        } else {
          /* Ask again */
          _this.process({ repeat: true });
        }
      } else {
        /* Next question */
        _this.advanceToNext();
      }

      /* Clear text */
      _this.clearText();
    };

    _this.state = {
      text: '',
      isActive: false,
      currentIndex: 0

      /* Create a voiceAdapter */
    };_this.voiceAdapter = (0, _google2.default)({
      emitter: emitter
    });

    /* Lazy load tokens */
    _this.voiceAdapter.prefetchToken();
    return _this;
  }

  _createClass(ChatForm, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        emitter: emitter
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          text = _state.text,
          currentIndex = _state.currentIndex,
          isActive = _state.isActive;

      var msgs = _schema2.default.filter(function (item, idx) {
        return idx === currentIndex;
      });
      return _react2.default.createElement(
        'div',
        { className: 'olachat-form' },
        _react2.default.createElement(
          'button',
          { onClick: this.toggleActive },
          'Fill this form using voice'
        ),
        isActive ? _react2.default.createElement(
          'div',
          { className: 'olachat-vui' },
          _react2.default.createElement(_Header2.default, { onHide: this.toggleActive, title: 'Reach us' }),
          _react2.default.createElement(_Voice2.default, {
            voiceAdapter: this.voiceAdapter,
            onResult: this.onVoiceChange,
            onFinalResult: this.onVoiceFinal
          }),
          msgs.map(function (_ref, idx) {
            var dialogue = _ref.dialogue;

            return _react2.default.createElement(
              'div',
              { key: idx, className: 'olachat-vui-reply' },
              dialogue
            );
          }),
          _react2.default.createElement(
            'span',
            { className: 'olachat-vui-message' },
            text
          )
        ) : null
      );
    }
  }]);

  return ChatForm;
}(_react2.default.Component);

ChatForm.childContextTypes = {
  emitter: _propTypes2.default.object
};
exports.default = ChatForm;