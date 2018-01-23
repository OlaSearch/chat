'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Avatar = require('./Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _Card = require('./Card');

var _Card2 = _interopRequireDefault(_Card);

var _utils = require('./utils');

var _core = require('@olasearch/core');

var _SlotOptions = require('./SlotOptions');

var _SlotOptions2 = _interopRequireDefault(_SlotOptions);

var _SearchResultsMessage = require('./SearchResultsMessage');

var _SearchResultsMessage2 = _interopRequireDefault(_SearchResultsMessage);

var _MessageFeedback = require('./MessageFeedback');

var _MessageFeedback2 = _interopRequireDefault(_MessageFeedback);

var _Loader = require('./Loader');

var _Loader2 = _interopRequireDefault(_Loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Message = function (_React$Component) {
  _inherits(Message, _React$Component);

  function Message(props) {
    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this, props));
  }

  _createClass(Message, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.props.message !== nextProps.message || this.props.isActive !== nextProps.isActive;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          message = _props.message,
          avatarBot = _props.avatarBot,
          avatarUser = _props.avatarUser,
          addMessage = _props.addMessage,
          botName = _props.botName,
          userName = _props.userName,
          isActive = _props.isActive,
          log = _props.log,
          location = _props.location;
      var userId = message.userId,
          timestamp = message.timestamp,
          awaitingUserInput = message.awaitingUserInput,
          fulfilled = message.fulfilled,
          card = message.card,
          slotOptions = message.slot_options,
          results = message.results,
          intent = message.intent,
          mc = message.mc,
          search = message.search,
          totalResults = message.totalResults,
          page = message.page;

      var isBot = !userId;
      var text = isBot ? message.reply : message.message;

      var messageClass = (0, _classnames2.default)('olachat-message', {
        'olachat-message-bot': isBot,
        'olachat-message-fulfilled': fulfilled,
        'olachat-message-collapse': typeof awaitingUserInput !== 'undefined' && !awaitingUserInput,
        'olachat-message-wide': !!card,
        'olachat-message-with-search': results && results.length > 0
      });
      /**
       * Show location prompt if 
       * intent requires `location`
       * and `context` location is empty
       */
      var needsLocation = isActive && message.location && !location;

      /**
       * Do not render SearchResultsMessage unless required. Takes a perf hit
       */
      var isSearchActive = false;
      /**
       * If search is active && has results, the reply from the bot is { answer: { search : { title } } }
       * When MC is being loaded isLoadingMC, should we hide search results ?
       * 
       * We are not checking for `search` key in `answer` because search should work without Intent Engine
       */
      if (results && results.length) {
        isSearchActive = true;
        /* Bot reply */
        text = '<p>' + (search ? search.title : 'Here are some results I found') + '</p>';
      } else {
        /* No results */
        text = text || '<p>' + (search ? search.no_result : 'Sorry, we didn\'t find any results.') + '</p>';
      }

      if (needsLocation) text = '';

      return _react2.default.createElement(
        'div',
        { className: messageClass },
        _react2.default.createElement(
          'div',
          { className: 'olachat-message-inner' },
          _react2.default.createElement(_Avatar2.default, {
            isBot: isBot,
            userId: userId,
            avatarBot: avatarBot,
            avatarUser: avatarUser
          }),
          _react2.default.createElement(
            'div',
            { className: 'olachat-message-body' },
            _react2.default.createElement(
              'div',
              { className: 'olchat-message-name' },
              isBot ? botName : userName
            ),
            _react2.default.createElement(
              'div',
              { className: 'olachat-message-content' },
              _react2.default.createElement('div', {
                className: 'olachat-message-reply',
                dangerouslySetInnerHTML: (0, _utils.createMessageMarkup)(text)
              }),
              _react2.default.createElement(_core.AnswerMC, {
                mc: mc,
                payload: { messageId: message.id, bot: true },
                loader: isActive ? _react2.default.createElement(_Loader2.default, null) : null
              }),
              _react2.default.createElement(_Card2.default, {
                card: card
              }),
              needsLocation ? null : isSearchActive ? _react2.default.createElement(_SearchResultsMessage2.default, {
                results: results,
                botName: botName,
                message: message,
                isActive: isActive,
                page: page,
                totalResults: totalResults
              }) : null
            ),
            _react2.default.createElement(
              'div',
              { className: 'olachat-message-date' },
              _core.DateParser.format(timestamp * 1000, 'DD MMM h:mm a')
            ),
            _react2.default.createElement(_SlotOptions2.default, {
              onSubmit: addMessage,
              options: slotOptions,
              isActive: isActive,
              intent: intent,
              message: message,
              log: log,
              location: location
            }),
            _react2.default.createElement(_MessageFeedback2.default, {
              isBot: isBot,
              message: message,
              isActive: isActive,
              onSubmit: addMessage
            })
          )
        )
      );
    }
  }]);

  return Message;
}(_react2.default.Component);

exports.default = Message;