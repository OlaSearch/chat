'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _olasearch = require('olasearch');

var _actions = require('./actions');

var _Settings = require('./Settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const EMOJI_POSITIVE = ':+1:'

// const EMOJI_NEGATIVE = ':-1:'
var IGNORE_FEEDBACK_INTENTS = [_Settings.FEEDBACK_INTENT, _Settings.HELP_INTENT, _Settings.PROFANITY_INTENT];
var EMOJI_POSITIVE = '\\01f44d';
var EMOJI_NEGATIVE = '\\01f44e';

var FeedBack = function (_React$Component) {
  _inherits(FeedBack, _React$Component);

  function FeedBack() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, FeedBack);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FeedBack.__proto__ || Object.getPrototypeOf(FeedBack)).call.apply(_ref, [this].concat(args))), _this), _this.handlePositive = function () {
      _this.props.updateQueryTerm(EMOJI_POSITIVE);
      _this.props.setFeedbackMessage(_this.props.message.id);
      _this.props.setFeedbackRating(EMOJI_POSITIVE);
      _this.props.onSubmit({ intent: 'OLA.FeedbackIntent' });
    }, _this.handleNegative = function () {
      _this.props.updateQueryTerm(EMOJI_NEGATIVE);
      _this.props.setFeedbackMessage(_this.props.message.id);
      _this.props.setFeedbackRating(EMOJI_NEGATIVE);
      _this.props.onSubmit({ intent: 'OLA.FeedbackIntent' });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(FeedBack, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.disabledFeedback();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          isActive = _props.isActive,
          isBot = _props.isBot,
          isTyping = _props.isTyping,
          messageIdx = _props.messageIdx,
          _props$message = _props.message,
          awaitingUserInput = _props$message.awaitingUserInput,
          intent = _props$message.intent;

      if (!isActive || !isBot || isTyping || !awaitingUserInput || messageIdx < 1 || IGNORE_FEEDBACK_INTENTS.indexOf(intent) !== -1) return null;
      return _react2.default.createElement(
        'div',
        { className: 'olachat-feedback' },
        _react2.default.createElement(
          'a',
          { onClick: this.handlePositive, className: 'olachat-feedback-positive' },
          _react2.default.createElement('span', { className: 'emoji-thumbs-up' })
        ),
        _react2.default.createElement(
          'a',
          { onClick: this.handleNegative, className: 'olachat-feedback-negative' },
          _react2.default.createElement('span', { className: 'emoji-thumbs-down' })
        )
      );
    }
  }]);

  return FeedBack;
}(_react2.default.Component);

module.exports = (0, _reactRedux.connect)(null, { activateFeedback: _actions.activateFeedback, disabledFeedback: _actions.disabledFeedback, setFeedbackMessage: _actions.setFeedbackMessage, setFeedbackRating: _actions.setFeedbackRating, logFeedback: _actions.logFeedback, updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm })(FeedBack);