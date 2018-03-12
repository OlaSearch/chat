'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _core = require('@olasearch/core');

var _actions = require('./actions');

var _Settings = require('./Settings');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MessageFeedback = function (_React$Component) {
  _inherits(MessageFeedback, _React$Component);

  function MessageFeedback() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MessageFeedback);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MessageFeedback.__proto__ || Object.getPrototypeOf(MessageFeedback)).call.apply(_ref, [this].concat(args))), _this), _this.handlePositive = function (e) {
      /* Update the query term */
      _this.props.updateQueryTerm(_Settings.EMOJI_POSITIVE);
      /* Set the message ID for later logging */
      _this.props.setFeedbackMessage(_this.props.message.id);
      /* Set positive or negative feedback */
      _this.props.setFeedbackRating(_Settings.EMOJI_POSITIVE);
      /* Send the message */
      _this.props.onSubmit({ intent: 'OLA.FeedbackIntent' });
    }, _this.handleNegative = function () {
      /* Update the query term */
      _this.props.updateQueryTerm(_Settings.EMOJI_NEGATIVE);
      /* Set the message ID for later logging */
      _this.props.setFeedbackMessage(_this.props.message.id);
      /* Set positive or negative feedback */
      _this.props.setFeedbackRating(_Settings.EMOJI_NEGATIVE);
      /* Send the message */
      _this.props.onSubmit({ intent: 'OLA.FeedbackIntent' });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MessageFeedback, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          isActive = _props.isActive,
          isBot = _props.isBot,
          _props$message = _props.message,
          awaitingUserInput = _props$message.awaitingUserInput,
          intent = _props$message.intent,
          mc = _props$message.mc;

      /* If user is typing */

      if (!isActive || !isBot || !awaitingUserInput) return null;
      /* Check if ignored intents or MC */
      if (intent === this.props.config.initialIntent) return null;
      if (_Settings.IGNORE_FEEDBACK_INTENTS.indexOf(intent) !== -1 && !mc) return null;

      return _react2.default.createElement(
        'div',
        { className: 'olachat-feedback' },
        _react2.default.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handlePositive,
            className: 'olachat-feedback-positive'
          },
          _react2.default.createElement('span', { className: 'emoji-thumbs-up' })
        ),
        _react2.default.createElement(
          'button',
          {
            type: 'button',
            onClick: this.handleNegative,
            className: 'olachat-feedback-negative'
          },
          _react2.default.createElement('span', { className: 'emoji-thumbs-down' })
        )
      );
    }
  }]);

  return MessageFeedback;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(null, {
  setFeedbackMessage: _actions.setFeedbackMessage,
  setFeedbackRating: _actions.setFeedbackRating
})(_core.Decorators.withConfig(MessageFeedback));