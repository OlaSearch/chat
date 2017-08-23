'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Header = require('./Header');

var _Header2 = _interopRequireDefault(_Header);

var _Input = require('./Input');

var _Input2 = _interopRequireDefault(_Input);

var _InputFeedback = require('./InputFeedback');

var _InputFeedback2 = _interopRequireDefault(_InputFeedback);

var _Messages = require('./Messages');

var _Messages2 = _interopRequireDefault(_Messages);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _olasearch = require('olasearch');

var _SmartSuggestions = require('./SmartSuggestions');

var _SmartSuggestions2 = _interopRequireDefault(_SmartSuggestions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chat = function (_React$Component) {
  _inherits(Chat, _React$Component);

  function Chat() {
    var _ref;

    var _temp, _this, _ret;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, Chat);

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Chat.__proto__ || Object.getPrototypeOf(Chat)).call.apply(_ref, [this].concat(args))), _this), _this.addMessage = function () {
      /* Scroll to Top */
      _this.MessageContainer.scrollToView();

      /* Add message */
      return _this.props.addMessage().then(function (reply) {
        /* Scroll to Top after bot replies */
        _this.MessageContainer.scrollToView();

        return reply;
      });
    }, _this.registerRef = function (el) {
      _this.MessageContainer = el;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Chat, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.addMessage({ intent: this.props.initialIntent, start: true });
      this.props.changePerPage(3);
    }
  }, {
    key: 'render',
    value: function render() {
      var feedbackActive = this.props.feedbackActive;

      return _react2.default.createElement(
        'div',
        { className: 'olachat' },
        _react2.default.createElement(_Header2.default, {
          onHide: this.props.onHide,
          title: this.props.title
        }),
        _react2.default.createElement(_Messages2.default, {
          messages: this.props.messages,
          flipped: this.props.flipped,
          isTyping: this.props.isTyping,
          ref: this.registerRef,
          onLoad: this.props.onLoad,
          avatarBot: this.props.avatarBot,
          avatarUser: this.props.avatarUser,
          addMessage: this.addMessage,
          botName: this.props.botName,
          userName: this.props.userName,
          feedbackActive: feedbackActive,
          dismissModal: this.props.disabledFeedback
        }),
        _react2.default.createElement(_SmartSuggestions2.default, {
          onSubmit: this.addMessage
        }),
        feedbackActive ? _react2.default.createElement(_InputFeedback2.default, {
          messages: this.props.messages
        }) : _react2.default.createElement(_Input2.default, {
          onSubmit: this.addMessage,
          voiceAdapter: this.props.voiceAdapter,
          updateQueryTerm: this.props.updateQueryTerm,
          addContextField: this.props.addContextField,
          isTyping: this.props.isTyping,
          searchInput: this.props.searchInput,
          isPhone: this.props.isPhone,
          onRequestClose: this.props.onRequestClose,
          messages: this.props.messages
        })
      );
    }
  }]);

  return Chat;
}(_react2.default.Component);

Chat.defaultProps = {
  flipped: true,
  title: 'Ola Bot',
  onLoad: function onLoad() {
    return new Promise(function (resolve, reject) {
      return resolve();
    });
  }
};


function mapStateToProps(state) {
  return {
    messages: state.Conversation.messages,
    feedbackActive: state.Conversation.feedbackActive,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    searchInput: state.QueryState.searchInput
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, { addMessage: _actions.addMessage, updateQueryTerm: _olasearch.Actions.Search.updateQueryTerm, addContextField: _olasearch.Actions.Context.addContextField, disabledFeedback: _actions.disabledFeedback, changePerPage: _olasearch.Actions.Search.changePerPage })(Chat);