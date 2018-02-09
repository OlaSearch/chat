'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _style = require('styled-jsx/style');

var _style2 = _interopRequireDefault(_style);

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

var _OfflineIndicator = require('./OfflineIndicator');

var _OfflineIndicator2 = _interopRequireDefault(_OfflineIndicator);

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
      var _this2 = this;

      return _react2.default.createElement(
        _core.ThemeConsumer,
        null,
        function (theme) {
          return _react2.default.createElement(
            'div',
            {
              className: 'jsx-2246208914 ' + _style2.default.dynamic([['103030253', [theme.chatLinkColor, theme.chatLinkHoverColor, theme.chatFontFamily]], ['3491598487', [theme.primaryButtonBackground]]]) + ' ' + 'olachat'
            },
            _react2.default.createElement(_Header2.default, { onHide: _this2.props.onHide, title: _this2.props.title }),
            _react2.default.createElement(_OfflineIndicator2.default, null),
            _react2.default.createElement(_Messages2.default, {
              messages: _this2.props.messages,
              flipped: _this2.props.flipped,
              ref: _this2.registerRef,
              onLoad: _this2.props.onLoad,
              avatarBot: _this2.props.avatarBot,
              avatarUser: _this2.props.avatarUser,
              addMessage: _this2.addMessage,
              botName: _this2.props.botName,
              userName: _this2.props.userName,
              log: _this2.props.log,
              setBotStatus: _this2.props.setBotStatus,
              updateQueryTerm: _this2.props.updateQueryTerm,
              location: _this2.props.location,
              newMessageId: _this2.props.newMessageId,
              theme: theme
            }),
            _react2.default.createElement(_QuickReplies2.default, {
              onSubmit: _this2.addMessage,
              updateQueryTerm: _this2.props.updateQueryTerm,
              theme: theme
            }),
            _react2.default.createElement(_Input2.default, {
              onSubmit: _this2.addMessage,
              voiceAdapter: _this2.props.voiceAdapter,
              updateQueryTerm: _this2.props.updateQueryTerm,
              addContextField: _this2.props.addContextField,
              isTyping: _this2.props.isTyping,
              searchInput: _this2.props.searchInput,
              isPhone: _this2.props.isPhone,
              onRequestClose: _this2.props.onRequestClose,
              messages: _this2.props.messages,
              voiceInput: _this2.props.voiceInput,
              location: _this2.props.location,
              theme: theme
            }),
            _react2.default.createElement(_style2.default, {
              styleId: '103030253',
              css: 'a{color:' + theme.chatLinkColor + ';}a:hover{color:' + theme.chatLinkHoverColor + ';}.olachat-bot{line-height:1.5;color:#4a4a4a;font-family:' + theme.chatFontFamily + ';}',
              dynamic: [theme.chatLinkColor, theme.chatLinkHoverColor, theme.chatFontFamily]
            }),
            _react2.default.createElement(_style2.default, {
              styleId: '3491598487',
              css: '.olachat.__jsx-style-dynamic-selector .ola-link-load-more{color:' + theme.primaryButtonBackground + ';}',
              dynamic: [theme.primaryButtonBackground]
            }),
            _react2.default.createElement(_style2.default, {
              styleId: '2246208914',
              css: '.olachat.jsx-2246208914 .ola-share-links{display:block;}'
            })
          );
        }
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
  var _this3 = this;

  this.addMessage = function (args) {
    /* Add message */
    return _this3.props.addMessage(args);
  };

  this.registerRef = function (el) {
    _this3.MessageContainer = el;
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