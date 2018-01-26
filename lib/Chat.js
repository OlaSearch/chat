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

var _Messages = require('./Messages');

var _Messages2 = _interopRequireDefault(_Messages);

var _reactRedux = require('react-redux');

var _actions = require('./actions');

var _core = require('@olasearch/core');

var _QuickReplies = require('./QuickReplies');

var _QuickReplies2 = _interopRequireDefault(_QuickReplies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chat = function (_React$Component) {
  _inherits(Chat, _React$Component);

  function Chat() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Chat);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Chat.__proto__ || Object.getPrototypeOf(Chat)).call.apply(_ref, [this].concat(args))), _this), _initialiseProps.call(_this), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Chat, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      /**
       * Check if the user has any messages
       */
      if (!this.props.messages.length) {
        this.props.addMessage({ intent: this.props.initialIntent, start: true });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'olachat' },
        _react2.default.createElement(_Header2.default, { onHide: this.props.onHide, title: this.props.title }),
        _react2.default.createElement(_Messages2.default, {
          messages: this.props.messages,
          flipped: this.props.flipped,
          ref: this.registerRef,
          onLoad: this.props.onLoad,
          avatarBot: this.props.avatarBot,
          avatarUser: this.props.avatarUser,
          addMessage: this.addMessage,
          botName: this.props.botName,
          userName: this.props.userName,
          log: this.props.log,
          setBotStatus: this.props.setBotStatus,
          updateQueryTerm: this.props.updateQueryTerm,
          location: this.props.location,
          newMessageId: this.props.newMessageId
        }),
        _react2.default.createElement(_QuickReplies2.default, { onSubmit: this.addMessage }),
        _react2.default.createElement(_Input2.default, {
          onSubmit: this.addMessage,
          voiceAdapter: this.props.voiceAdapter,
          updateQueryTerm: this.props.updateQueryTerm,
          addContextField: this.props.addContextField,
          isTyping: this.props.isTyping,
          searchInput: this.props.searchInput,
          isPhone: this.props.isPhone,
          onRequestClose: this.props.onRequestClose,
          messages: this.props.messages,
          voiceInput: this.props.voiceInput,
          location: this.props.location
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

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.addMessage = function (args) {
    /* Add message */
    return _this2.props.addMessage(args).then(function (reply) {
      /* Scroll to Top after bot replies */
      // this.MessageContainer.scrollToView()

      return reply;
    });
  };

  this.registerRef = function (el) {
    _this2.MessageContainer = el;
  };
};

function mapStateToProps(state) {
  return {
    messages: state.Conversation.messages,
    newMessageId: state.Conversation.newMessageId,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    location: state.Context.location,
    searchInput: state.QueryState.searchInput
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, {
  addMessage: _actions.addMessage,
  updateQueryTerm: _actions.updateBotQueryTerm
})(_core.Decorators.withLogger(Chat));