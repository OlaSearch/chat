'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _style = require('@olasearch/styled-jsx/style');

var _style2 = _interopRequireDefault(_style);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Message = require('./Message');

var _Message2 = _interopRequireDefault(_Message);

var _TypingIndicator = require('./TypingIndicator');

var _TypingIndicator2 = _interopRequireDefault(_TypingIndicator);

var _loader = require('@olasearch/icons/lib/loader');

var _loader2 = _interopRequireDefault(_loader);

var _domScrollIntoView = require('dom-scroll-into-view');

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _reactVirtualized = require('react-virtualized');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Message interface
 * message = {
 *   id,
 *   user_id,
 *   text,
 *   timestamp
 * }
 */

var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function get() {
      supportsPassive = true;
    }
  });
  window.addEventListener('test', null, opts);
} catch (e) {
  /* pass */
}

var Messages = function (_React$Component) {
  _inherits(Messages, _React$Component);

  function Messages(props) {
    _classCallCheck(this, Messages);

    var _this = _possibleConstructorReturn(this, (Messages.__proto__ || Object.getPrototypeOf(Messages)).call(this, props));

    _this.clickListener = function (e) {
      if (!e.target || e.target.nodeName !== 'A') return;
      var href = e.target.getAttribute('href');

      /**
       * Is this link inside a message? Log it separately
       */
      var isMessageLink = e.target.closest('.olachat-message-reply');

      /**
       * If there is a href tag, consider the link as a message
       */
      if (!href) {
        _this.props.updateQueryTerm(e.target.text);
        e.preventDefault();
        return _this.props.addMessage();
      }

      /* Log */
      if (isMessageLink) {
        _this.props.log({
          eventLabel: e.target.text,
          eventCategory: 'message_link',
          eventType: 'C',
          result: { title: e.target.text },
          payload: { bot: true }
        });
      }

      /**
       * Final pass. Link has href and it goes to a new page
       * Hide the bot
       */
      setTimeout(function () {
        return _this.props.setBotStatus(false);
      }, 200);
    };

    _this.pollScroll = function () {
      if (!_this.isComponentMounted) return;
      _this.previousScrollTop = _this.messagesEl.scrollTop;
      _this.onScroll();
      _this.rafRequestId = window.requestAnimationFrame(_this.pollScroll);
    };

    _this.onScroll = function () {
      var scrollDirection = _this.messagesEl.scrollTop < _this.previousScrollTop ? 'up' : 'down';

      /* Update previous scroll */
      _this.previousScrollTop = _this.messagesEl.scrollTop;

      if (!_this.props.flipped && scrollDirection === 'up') return;
      if (_this.props.flipped && scrollDirection === 'down') return;

      if (_this.messagesEl.scrollTop !== _this.scrollTop) {
        if (_this.shouldTriggerLoad(_this.messagesEl)) {
          _this.setState({ isInfiniteLoading: true });
          var p = _this.props.onLoad();
          p.then(function () {
            return _this.setState({ isInfiniteLoading: false });
          });
        }
        // the dom is ahead of the state
        _this.updateScrollTop();
      }
    };

    _this.isPassedThreshold = function (flipped, scrollLoadThreshold, scrollTop, scrollHeight, clientHeight) {
      return flipped ? scrollTop <= scrollLoadThreshold : scrollTop >= scrollHeight - clientHeight - scrollLoadThreshold;
    };

    _this.shouldTriggerLoad = function (domNode) {
      var passedThreshold = _this.isPassedThreshold(_this.props.flipped, _this.props.scrollLoadThreshold, domNode.scrollTop, domNode.scrollHeight, domNode.clientHeight);
      return passedThreshold && !_this.state.isInfiniteLoading;
    };

    _this.updateScrollTop = function () {
      var newScrollTop = _this.messagesEl.scrollTop + (_this.props.flipped ? _this.messagesEl.scrollHeight - (_this.scrollHeight || 0) : 0);
      var scrollHeightDifference = _this.scrollHeight ? _this.scrollHeight - _this.messagesEl.scrollHeight : 0;
      // if something was removed from list we need to include this difference in new scroll top
      // if (this.props.flipped && scrollHeightDifference > 0) {
      //   newScrollTop += scrollHeightDifference
      // }
      if (newScrollTop !== _this.messagesEl.scrollTop) {
        /* Not requried */
        // this.messagesEl.scrollTop = newScrollTop
      }
      _this.scrollTop = _this.messagesEl.scrollTop;
      _this.scrollHeight = _this.messagesEl.scrollHeight;
    };

    _this.scrollIntoView = function (_ref) {
      var id = _ref.id,
          _ref$position = _ref.position,
          position = _ref$position === undefined ? 'start' : _ref$position;

      var doc = _this.context.document || document;
      var domId = id;
      var domNode = doc.getElementById(domId);
      if (!domNode) return;
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          /* Fixes a bug in Mobile devices where keyboard loses focus */
          (0, _domScrollIntoView2.default)(domNode, _this.messagesEl, {
            onlyScrollIfNeeded: true,
            alignWithTop: position === 'end' ? false : true
          });
        });
      });
    };

    _this.registerRef = function (el) {
      _this.messagesEl = el;
    };

    _this.rowRenderer = function (_ref2) {
      var index = _ref2.index,
          key = _ref2.key,
          parent = _ref2.parent,
          style = _ref2.style;

      var message = _this.props.messages[index];
      return _react2.default.createElement(
        _reactVirtualized.CellMeasurer,
        {
          cache: _this._cache,
          columnIndex: 0,
          key: key,
          message: message,
          rowIndex: index,
          parent: parent
        },
        function (_ref3) {
          var measure = _ref3.measure;

          return _react2.default.createElement(
            'div',
            {
              style: style,
              className: 'olachat-messages-item'
            },
            message.isTyping ? _react2.default.createElement(_TypingIndicator2.default, {
              avatarBot: _this.props.avatarBot,
              theme: _this.props.theme
            }) : _react2.default.createElement(_Message2.default, {
              avatarBot: _this.props.avatarBot,
              onUpdate: measure,
              avatarUser: _this.props.avatarUser,
              message: message,
              addMessage: _this.props.addMessage,
              isActive: index === _this.props.messages.length - 1,
              botName: _this.props.botName,
              userName: _this.props.userName,
              log: _this.props.log,
              location: _this.props.location,
              isMounted: _this.isComponentMounted,
              updateQueryTerm: _this.props.updateQueryTerm,
              theme: _this.props.theme
            })
          );
        }
      );
    };

    _this.scrollTop = 0;
    _this.previousScrollTop = 0;
    _this.scrollHeight = undefined;
    _this.state = {
      isInfiniteLoading: false,
      shouldRender: false
    };
    _this.isComponentMounted = false;
    _this._cache = new _reactVirtualized.CellMeasurerCache({
      fixedWidth: true,
      minHeight: 60
    });
    return _this;
  }

  _createClass(Messages, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      /**
       * Prevent force layout on render
       */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          _this2.setState({ shouldRender: true });

          var heightDifference = _this2.props.flipped ? _this2.messagesEl.scrollHeight - _this2.messagesEl.clientHeight : 0;
          _this2.messagesEl.scrollTop = heightDifference;
          _this2.scrollTop = heightDifference;
        });
      });

      // // Unless passive events are supported, we must not hook onScroll event
      // // directly - that will break hardware accelerated scrolling. We poll it
      // // with requestAnimationFrame instead.
      if (supportsPassive) {
        this.messagesEl.addEventListener('scroll', this.onScroll, {
          passive: true
        });
      } else {
        this.rafRequestId = window.requestAnimationFrame(this.pollScroll);
      }

      this.isComponentMounted = true;

      /* Add click listener */
      this.messagesEl.addEventListener('click', this.clickListener);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.isComponentMounted = false;
      if (this.messagesEl) {
        this.messagesEl.removeEventListener('click', this.clickListener);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      /**
       * A new message has been received. We need to scroll
       */
      if (this.props.newMessageId !== prevProps.newMessageId) {
        this.scrollIntoView({ id: this.props.newMessageId });
      }
      /**
       * Always scroll to bottom during initial load
       */
      if (prevState.shouldRender !== this.state.shouldRender && this.state.shouldRender) {
        this.scrollIntoView({ id: this.props.newMessageId, position: 'end' });
      }
    }
    /**
     * Scroll in to view. Pass the message ID
     */

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.messages !== this.props.messages || nextProps.newMessageId !== this.props.newMessageId || nextState !== this.state || nextProps.theme !== this.props.theme;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          messages = _props.messages,
          flipped = _props.flipped,
          messageComponent = _props.messageComponent,
          theme = _props.theme;
      var isInfiniteLoading = this.state.isInfiniteLoading;

      if (!flipped) {
        messages = messages.slice().reverse();
      }
      var loadingSpinner = isInfiniteLoading ? _react2.default.createElement(
        'div',
        null,
        'Loading'
      ) : null;
      return _react2.default.createElement(
        'div',
        { ref: this.registerRef, className: _style2.default.dynamic([['3841076902', [theme.primaryColor, theme.chatUserMessageBackground, theme.chatUserMessageColor, theme.chatBotMessageBackground, theme.chatBotMessageColor, theme.dangerColor, theme.primaryButtonBackground, theme.primaryButtonBackground, theme.primaryButtonBackground, theme.primaryButtonColor, theme.primaryButtonBackground, theme.primaryButtonColor, theme.primaryButtonBackground, theme.primaryButtonColor]]]) + ' ' + 'olachat-messages'
        },
        this.state.shouldRender ? _react2.default.createElement(
          _reactVirtualized.AutoSizer,
          null,
          function (_ref4) {
            var width = _ref4.width,
                height = _ref4.height;

            return _react2.default.createElement(_reactVirtualized.List, {
              deferredMeasurementCache: _this3._cache,
              overscanRowCount: 0,
              messages: messages,
              rowCount: messages.length,
              rowHeight: _this3._cache.rowHeight,
              rowRenderer: _this3.rowRenderer,
              height: height,
              width: width
            });
          }
        ) : _react2.default.createElement(
          'div',
          {
            className: _style2.default.dynamic([['3841076902', [theme.primaryColor, theme.chatUserMessageBackground, theme.chatUserMessageColor, theme.chatBotMessageBackground, theme.chatBotMessageColor, theme.dangerColor, theme.primaryButtonBackground, theme.primaryButtonBackground, theme.primaryButtonBackground, theme.primaryButtonColor, theme.primaryButtonBackground, theme.primaryButtonColor, theme.primaryButtonBackground, theme.primaryButtonColor]]]) + ' ' + 'olachat-message-loader'
          },
          _react2.default.createElement(_loader2.default, null)
        ),
        _react2.default.createElement(_style2.default, {
          styleId: '3841076902',
          css: '.olachat-message-loader.__jsx-style-dynamic-selector{color:' + theme.primaryColor + ';}.olachat-messages.__jsx-style-dynamic-selector .olachat-message-reply{background-color:' + theme.chatUserMessageBackground + ';color:' + theme.chatUserMessageColor + ';}.olachat-messages.__jsx-style-dynamic-selector .olachat-message-bot .olachat-message-reply{background-color:' + theme.chatBotMessageBackground + ';color:' + theme.chatBotMessageColor + ';}.olachat-messages.__jsx-style-dynamic-selector .olachat-message-error .olachat-message-reply{background:' + theme.dangerColor + ';color:\'white\';}.olachat-messages.__jsx-style-dynamic-selector .olachat-slots-button{color:' + theme.primaryButtonBackground + ';border-color:' + theme.primaryButtonBackground + ';}.olachat-messages.__jsx-style-dynamic-selector .olachat-slots-button:hover{background-color:' + theme.primaryButtonBackground + ';color:' + theme.primaryButtonColor + ';}.olachat-messages.__jsx-style-dynamic-selector .ola-link-geo{color:' + theme.primaryButtonBackground + ';background:' + theme.primaryButtonColor + ';}.olachat-messages.__jsx-style-dynamic-selector .ola-link-geo:hover{background:' + theme.primaryButtonBackground + ';color:' + theme.primaryButtonColor + ';}',
          dynamic: [theme.primaryColor, theme.chatUserMessageBackground, theme.chatUserMessageColor, theme.chatBotMessageBackground, theme.chatBotMessageColor, theme.dangerColor, theme.primaryButtonBackground, theme.primaryButtonBackground, theme.primaryButtonBackground, theme.primaryButtonColor, theme.primaryButtonBackground, theme.primaryButtonColor, theme.primaryButtonBackground, theme.primaryButtonColor]
        })
      );
    }
  }]);

  return Messages;
}(_react2.default.Component);

Messages.contextTypes = {
  document: _propTypes2.default.object
};
Messages.defaultProps = {
  flipped: true /* Messages start from bottom to top */
  , scrollLoadThreshold: 10,
  messageComponent: null
};
exports.default = Messages;