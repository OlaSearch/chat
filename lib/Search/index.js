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

var _mitt = require('mitt');

var _mitt2 = _interopRequireDefault(_mitt);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _google = require('./../adapters/google');

var _google2 = _interopRequireDefault(_google);

var _SearchInput = require('./SearchInput');

var _SearchInput2 = _interopRequireDefault(_SearchInput);

var _CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');

var _CSSTransitionGroup2 = _interopRequireDefault(_CSSTransitionGroup);

var _olasearch = require('olasearch');

var _TypingIndicator = require('./../TypingIndicator');

var _TypingIndicator2 = _interopRequireDefault(_TypingIndicator);

var _Avatar = require('./../Avatar');

var _Avatar2 = _interopRequireDefault(_Avatar);

var _utils = require('./../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var createMessage = function createMessage(text, isBot) {
  return {
    message: text,
    isBot: isBot,
    id: _olasearch.utilities.uuid()
  };
};

var generateReply = function generateReply() {
  var items = ['Sure, we found 10 new credit cards. Which one would you like?', 'Here you go'];
  return items[0];
  return items[Math.floor(Math.random() * items.length)];
};

var results = [{
  title: 'Card activation &overseas card usage',
  desc: 'Enhanced card security measures implemented to better safeguard your Standard Chartered ATM, debit and credit cards.',
  thumbnail: 'https://www.sc.com/sg/search/images/1580x350_mas_masthead-375x175.jpg'
}, {
  title: 'Platinum Visa/MasterCard®Credit Card',
  desc: 'Earn one Rewards Point with every $1 charged and enjoy dining, enrichment, and health and wellness deals.',
  thumbnail: 'https://www.sc.com/sg/search/images/creditcards-platinum-visa-mastercard-375x175.jpg'
}, {
  title: 'Card activation &overseas card usage',
  desc: 'Enhanced card security measures implemented to better safeguard your Standard Chartered ATM, debit and credit cards.',
  thumbnail: 'https://www.sc.com/sg/search/images/1580x350_mas_masthead-375x175.jpg'
}, {
  title: 'Card activation &overseas card usage',
  desc: 'Enhanced card security measures implemented to better safeguard your Standard Chartered ATM, debit and credit cards.',
  thumbnail: 'https://www.sc.com/sg/search/images/1580x350_mas_masthead-375x175.jpg'
}];

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
var emitter = (0, _mitt2.default)();

var Search = function (_Component) {
  _inherits(Search, _Component);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

    _this.addMessage = function (text, isBot) {
      _this.setState({
        messages: [].concat(_toConsumableArray(_this.state.messages), [createMessage(text, isBot)])
      });
    };

    _this.showTyping = function () {
      _this.setState({
        isTyping: true
      });
    };

    _this.hideTyping = function () {
      _this.setState({
        isTyping: false
      });
    };

    _this.handleSubmit = function (text, callback) {
      /* Exit early */
      if (!text) return;

      /* Add new message */
      _this.addMessage(text, false);

      setTimeout(function () {
        return _this.showTyping();
      }, 300);

      setTimeout(function () {
        _this.hideTyping();
        var reply = generateReply();
        _this.addMessage(reply, true);

        callback && callback({
          answer: {
            reply: reply
          }
        });
      }, 2000);
    };

    _this.state = {
      messages: [],
      isTyping: false

      /* Create a voiceAdapter */
    };_this.voiceAdapter = (0, _google2.default)({
      emitter: emitter
    });

    /* Lazy load tokens */
    _this.voiceAdapter.prefetchToken();
    return _this;
  }

  _createClass(Search, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        emitter: emitter
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          isTyping = _state.isTyping,
          messages = _state.messages;
      var flipped = this.props.flipped;

      var showResults = messages.length > 1;
      /* Reverse the messages */
      if (!flipped) {
        messages = messages.slice().reverse();
      }
      var msg = messages
      // .filter((item, idx) => idx < 2)
      .filter(function (item, idx) {
        return messages.length - idx <= 2;
      }).map(function (_ref) {
        var message = _ref.message,
            isBot = _ref.isBot,
            id = _ref.id;

        var klass = (0, _classnames2.default)('olachat-search-message', 'olachat-message', {
          'olachat-search-message-bot': isBot
        });
        return _react2.default.createElement(
          'div',
          { key: id, className: klass },
          _react2.default.createElement(_Avatar2.default, {
            isBot: isBot,
            avatarBot: _utils.avatarBot
          }),
          message
        );
      });
      return _react2.default.createElement(
        'div',
        { className: 'olachat-search' },
        _react2.default.createElement(
          'div',
          { className: 'olachat-search-header' },
          _react2.default.createElement(_SearchInput2.default, {
            onSubmit: this.handleSubmit,
            voiceAdapter: this.voiceAdapter
          }),
          msg.length ? _react2.default.createElement(
            'div',
            { className: 'olachat-search-container' },
            _react2.default.createElement(
              'div',
              { className: 'olachat-search-messages' },
              isTyping ? flipped ? null : _react2.default.createElement(_TypingIndicator2.default, { avatarBot: _utils.avatarBot }) : null,
              _react2.default.createElement(
                _CSSTransitionGroup2.default,
                {
                  transitionName: 'messages',
                  transitionAppear: true,
                  transitionAppearTimeout: 300,
                  transitionEnterTimeout: 500,
                  transitionLeave: false,
                  component: 'div',
                  className: 'olachat-messages-list'
                },
                msg
              ),
              isTyping ? flipped ? _react2.default.createElement(_TypingIndicator2.default, { avatarBot: _utils.avatarBot }) : null : null
            )
          ) : null
        ),
        _react2.default.createElement(
          'div',
          { className: 'olachat-search-results' },
          showResults && results.map(function (result, idx) {
            var title = result.title,
                desc = result.desc,
                thumbnail = result.thumbnail;

            return _react2.default.createElement(
              'div',
              { className: 'ola-snippet', key: idx },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement('img', { src: thumbnail })
              ),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'h3',
                  { className: 'ola-field-title' },
                  _react2.default.createElement(
                    'a',
                    null,
                    title
                  )
                ),
                _react2.default.createElement(
                  'p',
                  null,
                  desc
                )
              )
            );
          })
        )
      );
    }
  }]);

  return Search;
}(_react.Component);

Search.defaultProps = {
  flipped: true
};
Search.childContextTypes = {
  emitter: _propTypes2.default.object
};


function mapStateToProps(state) {
  return state;
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(Search);