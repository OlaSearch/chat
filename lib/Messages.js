'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _TransitionGroup = require('react-transition-group/TransitionGroup');

var _TransitionGroup2 = _interopRequireDefault(_TransitionGroup);

var _CSSTransition = require('react-transition-group/CSSTransition');

var _CSSTransition2 = _interopRequireDefault(_CSSTransition);

var _loader = require('@olasearch/icons/lib/loader');

var _loader2 = _interopRequireDefault(_loader);

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

var cache = new _reactVirtualized.CellMeasurerCache({
  fixedWidth: true
});

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

      /**
       * Final pass. Link has href and it goes to a new page
       * Hide the bot
       */
      setTimeout(function () {
        return _this.props.setBotStatus(false);
      }, 200);

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
    };

    _this.pollScroll = function () {
      if (!_this.isComponentMounted) return;
      _this.previousScrollTop = _reactDom2.default.findDOMNode(_this).scrollTop;
      _this.onScroll();
      _this.rafRequestId = window.requestAnimationFrame(_this.pollScroll);
    };

    _this.onScroll = function () {
      var domNode = _reactDom2.default.findDOMNode(_this);
      var scrollDirection = domNode.scrollTop < _this.previousScrollTop ? 'up' : 'down';

      /* Update previous scroll */
      _this.previousScrollTop = domNode.scrollTop;

      if (!_this.props.flipped && scrollDirection === 'up') return;
      if (_this.props.flipped && scrollDirection === 'down') return;

      if (domNode.scrollTop !== _this.scrollTop) {
        if (_this.shouldTriggerLoad(domNode)) {
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
      // var scrollableDomEl = ReactDOM.findDOMNode(this)
      var newScrollTop = _this.scrollableDomEl.scrollTop + (_this.props.flipped ? _this.scrollableDomEl.scrollHeight - (_this.scrollHeight || 0) : 0);
      var scrollHeightDifference = _this.scrollHeight ? _this.scrollHeight - _this.scrollableDomEl.scrollHeight : 0;

      // if something was removed from list we need to include this difference in new scroll top
      if (_this.props.flipped && scrollHeightDifference > 0) {
        newScrollTop += scrollHeightDifference;
      }
      if (newScrollTop !== _this.scrollableDomEl.scrollTop) {
        _this.scrollableDomEl.scrollTop = newScrollTop;
      }
      _this.scrollTop = _this.scrollableDomEl.scrollTop;
      _this.scrollHeight = _this.scrollableDomEl.scrollHeight;
    };

    _this.scrollToView = function () {
      _this.scrollableDomEl.scrollTop = _this.props.flipped ? _this.scrollHeight : 0;
    };

    _this.registerRef = function (el) {
      _this.messagesEl = el;
    };

    _this.rowRenderer = function (_ref) {
      var index = _ref.index,
          key = _ref.key;

      return _react2.default.createElement(
        _reactVirtualized.CellMeasurer,
        {
          key: key
        },
        message.isTyping ? _react2.default.createElement(_TypingIndicator2.default, {
          avatarBot: _this.props.avatarBot
        }) : _react2.default.createElement(_Message2.default, {
          avatarBot: _this.props.avatarBot,
          avatarUser: _this.props.avatarUser,
          message: _this.props.messages[index],
          addMessage: _this.props.addMessage,
          isActive: index === _this.props.messages.length - 1,
          botName: _this.props.botName,
          userName: _this.props.userName,
          log: _this.props.log,
          location: _this.props.location,
          isMounted: _this.isComponentMounted
        })
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
    return _this;
  }

  _createClass(Messages, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.scrollableDomEl = _reactDom2.default.findDOMNode(this);
      /**
       * Prevent force layout on render
       */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          _this2.setState({ shouldRender: true });
          // window.requestAnimationFrame(() => {
          var heightDifference = _this2.props.flipped ? _this2.scrollableDomEl.scrollHeight - _this2.scrollableDomEl.clientHeight : 0;
          _this2.scrollableDomEl.scrollTop = heightDifference;
          _this2.scrollTop = heightDifference;
          // })
        });
      });

      // // Unless passive events are supported, we must not hook onScroll event
      // // directly - that will break hardware accelerated scrolling. We poll it
      // // with requestAnimationFrame instead.
      if (supportsPassive) {
        this.scrollableDomEl.addEventListener('scroll', this.onScroll, {
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
      var _this3 = this;

      /* Only update scroll position if new messages are added */
      window.requestAnimationFrame(function () {
        /* Only after the component is rendered */
        if (prevState.shouldRender) _this3.updateScrollTop();
      });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return nextProps.messages !== this.props.messages || nextState !== this.state;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          messages = _props.messages,
          flipped = _props.flipped,
          messageComponent = _props.messageComponent;
      var isInfiniteLoading = this.state.isInfiniteLoading;

      if (!flipped) {
        messages = messages.slice().reverse();
      }
      var loadingSpinner = isInfiniteLoading ? _react2.default.createElement(
        'div',
        null,
        'Loading'
      ) : null;
      var messagesComponent = messageComponent ? messages.map(messageComponent) : messages.map(function (message, idx) {
        return _react2.default.createElement(
          'div',
          {
            key: message.id
          },
          message.isTyping ? _react2.default.createElement(_TypingIndicator2.default, {
            avatarBot: _this4.props.avatarBot
          }) : _react2.default.createElement(_Message2.default, {
            avatarBot: _this4.props.avatarBot,
            avatarUser: _this4.props.avatarUser,
            message: message,
            addMessage: _this4.props.addMessage,
            isActive: idx === messages.length - 1,
            botName: _this4.props.botName,
            userName: _this4.props.userName,
            log: _this4.props.log,
            location: _this4.props.location,
            isMounted: _this4.isComponentMounted
          })
        );
      });
      return _react2.default.createElement(
        'div',
        { className: 'olachat-messages', ref: this.registerRef },
        this.state.shouldRender ? _react2.default.createElement(
          'div',
          { className: 'olachat-messages-wrapper' },
          _react2.default.createElement(
            _reactVirtualized.AutoSizer,
            null,
            function (autoSizerParams) {
              return _react2.default.createElement(_reactVirtualized.List, {
                deferredMeasurementCache: cache,
                height: autoSizerParams.height,
                rowCount: _this4.props.messages.length,
                rowHeight: cache.rowHeight,
                rowRenderer: _this4.rowRenderer,
                width: autoSizerParams.width
              });
            }
          )
        ) : _react2.default.createElement(
          'div',
          { className: 'olachat-message-loader' },
          _react2.default.createElement(_loader2.default, null)
        )
      );
    }
  }]);

  return Messages;
}(_react2.default.Component);

Messages.defaultProps = {
  flipped: false,
  scrollLoadThreshold: 10,
  messageComponent: null
};
exports.default = Messages;