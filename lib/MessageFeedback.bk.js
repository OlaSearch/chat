'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MessageFeedback = function (_React$Component) {
  _inherits(MessageFeedback, _React$Component);

  function MessageFeedback(props) {
    _classCallCheck(this, MessageFeedback);

    var _this = _possibleConstructorReturn(this, (MessageFeedback.__proto__ || Object.getPrototypeOf(MessageFeedback)).call(this, props));

    _this.onPositiveClick = function () {
      _this.props.activateFeedback({
        eventLabel: 'positive',
        messageId: _this.props.message.id
      });
      _this.setState({
        submitted: true
      }, _this.activateFeedback);
    };

    _this.onNegativeClick = function () {
      _this.props.activateFeedback({
        eventLabel: 'positive',
        messageId: _this.props.message.id
      });
      _this.setState({
        submitted: true
      }, _this.activateFeedback);
    };

    _this.activateFeedback = function () {
      setTimeout(function () {
        _this.setState({
          submitted: false
        });
      }, 5000);
    };

    _this.state = {
      submitted: false
    };
    return _this;
  }

  _createClass(MessageFeedback, [{
    key: 'render',
    value: function render() {
      var isBot = this.props.isBot;

      if (!isBot) return null;
      var env = this.context.env;
      var submitted = this.state.submitted;

      if (env !== 'testing') return null;
      return _react2.default.createElement(
        'div',
        { className: 'olachat-message-feedback' },
        !submitted ? _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'button',
            {
              type: 'button',
              className: 'olachat-message-feedback-positive',
              onClick: this.onPositiveClick
            },
            _react2.default.createElement(
              'span',
              null,
              'Positive'
            )
          ),
          _react2.default.createElement(
            'button',
            {
              type: 'button',
              className: 'olachat-message-feedback-negative',
              onClick: this.onNegativeClick
            },
            _react2.default.createElement(
              'span',
              null,
              'Negative'
            )
          )
        ) : _react2.default.createElement(
          'div',
          { className: 'olachat-message-done' },
          'Thank you for the feedback'
        )
      );
    }
  }]);

  return MessageFeedback;
}(_react2.default.Component);

MessageFeedback.contextTypes = {
  env: _propTypes2.default.string
};


function mapStateToProps(state) {
  return {
    messages: state.Conversation.messages
  };
}

module.exports = (0, _reactRedux.connect)(mapStateToProps, { activateFeedback: _actions.activateFeedback })(MessageFeedback);